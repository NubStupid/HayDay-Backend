const axios = require("axios").default;
const { Op } = require("sequelize")
const { SellerItem, RequestSeller, City, Users } = require("../models")
const schema = require("../utils/validation")
const getTimeID = require("../utils/functions/getTimeID");

require("dotenv").config();

const buyItem = async (req, res) => {
    try {
        let { distributor, items, cekOngkir, kota_penerima } = req.body

        let find = await City.findAll({
            where: {
                city_name: kota_penerima
            }
        })

        let city
        if(find.length != 0)
            city = find[0]
        else {
            city = await City.findAll({
                where: {
                    city_name: {
                        [Op.like]: `%${kota_penerima}%`
                    }
                }
            });
            return res.status(404).json({
                ERR_CODE: "INVALID KOTA_PENERIMA",
                path: "buyItem (sellerController)",
                rekomendasi_kota: city,
            });
        }

        distributor = await Users.findOne({
            where: {
                username: distributor,
            },
        });

        if(!distributor || distributor.role != "Distributor" || distributor.status != "Approved")
            throw new Error('Invalid distributor');

        const perintah = {
            method: "POST",
            url: "https://api.rajaongkir.com/starter/cost",
            headers: {
                key: process.env.RAJAONGKIR_API_KEY
            },
            data: {
                origin: distributor.city_id,
                destination: city.city_id,
                weight: 1,
                courier: "jne"
            }
        };

        const response = await axios.request(perintah);
        let pengiriman = response.data.rajaongkir, ongkir = pengiriman.results[0].costs[0].cost[0].value

        let request = []
        for(let i = 0; i < items.length; i++)
        {
            item = items[i]
            
            let time = getTimeID();
            let ctid = await RequestSeller.find({
                _id: { $regex: '.*' + time + '.*' }
            });
            let req_id = "REQ" + time + (ctid.length + 1).toString().padStart(4, "0");

            if(!cekOngkir)
            {
                await RequestSeller.create({
                    _id: req_id,
                    seller: req.user.username,
                    distributor: distributor.username,
                    item_id: item.item_id,
                    price: item.price,
                    qty: item.qty,
                    ongkir,
                    total_price: item.price * item.qty + ongkir,
                    status: "Pending",
                    comment: ""
                })
                request.push({
                    _id: req_id,
                    distributor: distributor.username,
                    item_id: item.item_id,
                    price: "Rp " + Intl.NumberFormat(["ban", "id"]).format(item.price),
                    qty: item.qty,
                    ongkir: "Rp " + Intl.NumberFormat(["ban", "id"]).format(ongkir),
                    total_price: "Rp " + Intl.NumberFormat(["ban", "id"]).format(item.price * item.qty + ongkir),
                    status: "Pending"
                })
            }
            else
            {
                request.push({
                    distributor: distributor.username,
                    item_id: item.item_id,
                    price: "Rp " + Intl.NumberFormat(["ban", "id"]).format(item.price),
                    qty: item.qty,
                    ongkir: "Rp " + Intl.NumberFormat(["ban", "id"]).format(ongkir),
                    total_price: "Rp " + Intl.NumberFormat(["ban", "id"]).format(item.price * item.qty + ongkir),
                })
            }
        }

        return res.status(200).json({
            STATUS_CODE: "SUCCESFULLY REQUEST ITEM",
            username: req.user.username,
            pengiriman: {
                kota_pengirim: pengiriman.origin_details,
                kota_penerima: pengiriman.destination_details, 
                kurir: "JNE OKE",
                estimasi_pengiriman: pengiriman.results[0].costs[0].cost[0].etd + " hari",
                biaya: "Rp " + Intl.NumberFormat(["ban", "id"]).format(ongkir)
            },
            request,
        });
    } catch (error) {
        return res.status(400).json({
            ERR_CODE: "ERROR REQUESTING ITEM",
            message: error.toString(),
            path: "buyItem (sellerController)",
        });
    }
};


const getRequest = async (req, res) => {
    try {
        const { status } = req.body
        let requests
        if(status)
            requests = await RequestSeller.find({where: {status}})
        else
            requests = await RequestSeller.find()

        return res.status(200).json({
            STATUS_CODE: "SUCCESFULLY GET REQUEST ITEM",
            username: req.user.username,
            requests,
        });
    } catch (error) {
        return res.status(400).json({
            ERR_CODE: "ERROR GET REQUESTED ITEM",
            message: error.toString(),
            path: "buyItem (sellerController)",
        });
    }
};

const editRequest = async (req, res) => {
    try {
        let { price, qty } = req.body
        let request = req.request

        if(price)
            request = await RequestSeller.findByIdAndUpdate(request._id, {price, status: "Pending"})
        if(qty)
            request = await RequestSeller.findByIdAndUpdate(request._id, {qty, status: "Pending"})
        request = await RequestSeller.findById(request._id)
        return res.status(200).json({
            STATUS_CODE: "SUCCESFULLY EDIT REQUEST ITEM",
            username: req.user.username,
            request,
        });
    } catch (error) {
        return res.status(400).json({
            ERR_CODE: "ERROR EDIT REQUESTING ITEM",
            message: error.toString(),
            path: "buyItem (sellerController)",
        });
    }
};

const updateItem = async (req, res) => {
    try {
        let item = req.item;
        await schema.createSellerItemSchema.update.validateAsync(req.body, {
            abortEarly:false
        })
        const { item_name, description, price } = req.body
        if(item_name)
        {
            await SellerItem.update({ item_name },{
                where: {
                    item_id: item.item_id,
                },
            });
        }
        if(description)
        {
            await SellerItem.update({ description },{
                where: {
                    item_id: item.item_id,
                },
            });
        }
        if(price)
        {
            await SellerItem.update({ price },{
                where: {
                    item_id: item.item_id,
                },
            });
        }
        item = await SellerItem.findAll({where:{item_id: item.item_id}})
        return res.status(200).json({
            STATUS_CODE: "SUCCESFULLY UPDATED A ITEM",
            username: req.user.username,
            item_updated: item,
        });
    } catch (error) {
        return res.status(400).json({
            ERR_CODE: "ERROR UPDATING ITEM",
            message: error.toString(),
            path: "updateItem (sellerController)",
        });
    }
};

const deleteSellerItem = async (req, res) => {
    try {
        const item = req.item;
        await SellerItem.destroy({
            where: {
                item_id: item.item_id,
            },
        });
        return res.status(200).json({
            STATUS_CODE: "SUCCESFULLY DELETED A ITEM",
            username: req.user.username,
            item_deleted: item.item_id,
        });
    } catch (error) {
        return res.status(400).json({
            ERR_CODE: "ERROR DELETING ITEM",
            message: error.toString(),
            path: "deleteSellerItem (sellerController)",
        });
    }
};

const getItem = async (req, res) => {
    try {
        const item = req.item;
        return res.status(200).json({
            STATUS_CODE: "SUCCESFULLY FIND A ITEM",
            username: req.user.username,
            item,
        });
    } catch (error) {
        return res.status(400).json({
            ERR_CODE: "ERROR SEARCHING ITEM",
            message: error.toString(),
            path: "getItem (sellerController)",
        });
    }
};

const getItems = async (req, res) => {
    try {
        let { name, sort_by, sort_dir } = req.body;
        let item;

        if(sort_by && sort_by != "item_id" && sort_by != "item_name" && sort_by != "price" && sort_by != "qty")
            throw new Error('Invalid sort column');
        if(sort_dir && sort_by.lower() != "ASC" && sort_dir.lower() != "DESC")
            throw new Error('Invalid sort direction');

        if(!sort_by)
            sort_by = "item_id"
        if(!sort_dir)
            sort_dir = "ASC"


        item = await SellerItem.findAll({where:{
            item_name:{
                [Op.like]:`%${name}%`
            }
        }, order: [[sort_by, sort_dir]]})
        if(!name)
            item = await SellerItem.findAll()

        // ,
        // attributes:["fnb_id","fnb_name","barn_id","createdAt","updatedAt"]    
    //     }
    // );
        return res.status(200).json({
            STATUS_CODE: "SUCCESFULLY FIND ITEM",
            // username: req.user.username,
            item,
        });
    } catch (error) {
        return res.status(400).json({
            ERR_CODE: "ERROR SEARCHING ITEM",
            message: error.toString(),
            path: "getItems (sellerController)",
        });
    }
};

module.exports = {
    buyItem,
    editRequest,
    getRequest,
    updateItem,
    deleteSellerItem,
    getItem,
    getItems,
};
