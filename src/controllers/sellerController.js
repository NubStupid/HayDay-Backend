const { Op } = require("sequelize")
const { SellerItem, RequestSeller } = require("../models")
const schema = require("../utils/validation")
const getTime = require("../utils/functions/getTime")

const buyItem = async (req, res) => {
    try {
        let { distributor_id, items, price, qty } = req.body
        let request = []
        for(let i = 0; i < items.length; i++)
        {
            item = items[i]
            let jum = await RequestSeller.find()
            let req_id = "REQ" + (jum.length + 1).toString().padStart(3, "0");
            let req_item = await RequestSeller.create({
                _id: req_id,
                seller_id: req.user.user_id,
                distributor_id,
                item_id: item.item_id,
                price: item.price,
                qty: item.qty,
                total_price: item.price * item.qty,
                status: "Pending",
                comment: ""
            })
            request.push({
                _id: req_id,
                distributor_id,
                item_id: item.item_id,
                price: "Rp " + Intl.NumberFormat(["ban", "id"]).format(item.price),
                qty: item.qty,
                total_price: "Rp " + Intl.NumberFormat(["ban", "id"]).format(item.price * item.qty),
                status: "Pending"
            })
        }

        return res.status(200).json({
            STATUS_CODE: "SUCCESFULLY REQUEST ITEM",
            username: req.user.username,
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
            STATUS_CODE: "SUCCESFULLY REQUEST ITEM",
            username: req.user.username,
            requests,
        });
    } catch (error) {
        return res.status(400).json({
            ERR_CODE: "ERROR REQUESTING ITEM",
            message: error.toString(),
            path: "buyItem (sellerController)",
        });
    }
};

const editRequest = async (req, res) => {
    try {
        let { price, qty } = req.body
        let request = req.request
        // console.log(req_id);
        // let request = await RequestSeller.findById(req_id)
        // console.log(req.request);
        // item = items[i]
        // let jum = await RequestSeller.find()
        // let req_item = await RequestSeller.update({
        //     _id: req_id,
        //     seller_id: req.user.user_id,
        //     distributor_id,
        //     item_id: item.item_id,
        //     price: item.price,
        //     qty: item.qty,
        //     total_price: item.price * item.qty,
        //     status: "Pending",
        //     comment: ""
        // })

        return res.status(200).json({
            STATUS_CODE: "SUCCESFULLY REQUEST ITEM",
            username: req.user.username,
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
