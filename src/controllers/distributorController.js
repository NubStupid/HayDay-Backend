const { Op, where } = require("sequelize");
const { DistributorItem, RequestFarmer, RequestSeller, City, Users, SellerItem, FarmCrops } = require("../models");
const schema = require("../utils/validation");
const getTime = require("../utils/functions/getTime");
const getTimeID = require("../utils/functions/getTimeID");
const axios = require('axios');
const Joi = require("joi");

// GET Semua Request Seller
const getAllRequestSeller = async (req, res) => {
    const { user_id } = req.user;
    const cekSeller = await RequestSeller.find({
        status: { $in: ['Pending', 'Declined'] },
        distributor_id: user_id
    });

    if (cekSeller.length === 0) {
        return res.status(200).json({
            STATUS_CODE: "SUCCESSFULLY GET NOTIFICATION",
            Message: "Tidak Ada Request yang tersedia!"
        });
    }
    return res.status(200).json({
        STATUS_CODE: "SUCCESSFULLY GET NOTIFICATION",
        Message: cekSeller
    });
};

// GET Semua Request Farmer
const getAllRequestFarmer = async (req, res) => {
    const { user_id } = req.user;
    const cekFarmer = await RequestFarmer.find({
        status: { $in: ['Pending', 'Declined'] },
        farmer_id: user_id
    });

    if (cekFarmer.length === 0) {
        return res.status(200).json({
            STATUS_CODE: "SUCCESSFULLY GET NOTIFICATION",
            Message: "Tidak Ada Request yang tersedia!"
        });
    }
    return res.status(200).json({
        STATUS_CODE: "SUCCESSFULLY GET NOTIFICATION",
        Message: cekFarmer
    });
};

// GET Semua Item yang ada di gudang
const getListItem = async (req, res) => {
    const { user_id } = req.user;
    const cekItem = await DistributorItem.findAll({
        where: { user_id },
        attributes: ['item_name', 'description', 'price', 'qty']
    });
    return res.status(200).json({
        STATUS_CODE: "SUCCESSFULLY GET ITEM",
        "Total Item di gudang": cekItem.length,
        "List Item": cekItem
    });
};

// POST Buat Request ke Farmer
const makeRequestFarmer = async (req, res) => {
    try {
        let { farmer_username, farm_crop_id, price, qty, kota_penerima, cekOngkir } = req.body;

        let find = await City.findAll({
            where: {
                city_name: kota_penerima
            }
        });

        let city;
        if (find.length !== 0) {
            city = find[0];
        } else {
            city = await City.findAll({
                where: {
                    city_name: {
                        [Op.like]: `%${kota_penerima}%`
                    }
                }
            });
            return res.status(404).json({
                ERR_CODE: "INVALID KOTA_PENERIMA",
                path: "makeRequestFarmer (distributorController)",
                rekomendasi_kota: city,
            });
        }

        let farmer = await Users.findOne({
            where: {
                username: farmer_username,
            },
        });

        if (!farmer || farmer.role !== "Farmer" || farmer.status !== "Approved")
            throw new Error('Invalid farmer');

        let farmCrop = await FarmCrops.findOne({
            where: {
                farm_crop_id: farm_crop_id,
            },
        });

        if (!farmCrop)
            throw new Error('Invalid farm crop');

        const perintah = {
            method: "POST",
            url: "https://api.rajaongkir.com/starter/cost",
            headers: {
                key: process.env.RAJAONGKIR_API_KEY
            },
            data: {
                origin: farmer.city_id,
                destination: city.city_id,
                weight: 1,
                courier: "jne"
            }
        };

        const response = await axios.request(perintah);
        let pengiriman = response.data.rajaongkir;
        let ongkir = pengiriman.results[0].costs[0].cost[0].value;

        let time = getTimeID();
        let ctid = await RequestFarmer.find({
            _id: { $regex: '.*' + time + '.*' }
        });
        let req_id = "REQ" + time + (ctid.length + 1).toString().padStart(4, "0");
        let request = {
            _id: req_id,
            farmer_id: farmer.user_id,
            distributor_id: req.user.user_id,
            item_id: farmCrop.farm_crop_id,
            item_name: farmCrop.crop_id,
            price,
            qty,
            total_price: price * qty + ongkir,
            status: "Pending",
            comment: ""
        };

        if (!cekOngkir) {
            await RequestFarmer.create({
                _id: req_id,
                farmer_id: farmer.user_id,
                distributor_id: req.user.user_id,
                item_id: farmCrop.farm_crop_id,
                item_name: farmCrop.crop_id,
                price: price,
                qty: qty,
                total_price: price * qty + ongkir,
                status: "Pending",
                comment: ""
            });
        } else {
            await RequestFarmer.create({
                _id: req_id,
                farmer_id: farmer.user_id,
                distributor_id: req.user.user_id,
                item_id: farmCrop.farm_crop_id,
                item_name: farmCrop.crop_id,
                price: price,
                qty: qty,
                total_price: price * qty + ongkir,
                status: "Pending",
                comment: ""
            });
        }

        return res.status(200).json({
            STATUS_CODE: "SUCCESSFULLY REQUESTED CROP",
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
            ERR_CODE: "ERROR REQUESTING CROP",
            message: error.toString(),
            path: "makeRequestFarmer (distributorController)",
        });
    }
};


// POST Konfirmasi Request Farmer dan Bayar
const finishRequestFarmer = async (req, res) => {
    const { user_id } = req.user;
    const { order_id, comment } = req.body;

    try {
        let cekorder = await RequestFarmer.findOne({ _id: order_id, farmer_id: user_id });

        if (!cekorder) {
            return res.status(404).json({
                STATUS_CODE: "ORDER_NOT_FOUND",
                Message: "Order Tidak Ditemukan!"
            });
        }

        if (cekorder.status === "Completed") {
            return res.status(400).json({
                STATUS_CODE: "ORDER_COMPLETED",
                Message: "Order telah terselesaikan!"
            });
        }

        if (cekorder.status === "Pending") {
            if (comment) {
                cekorder.comment = comment;
                cekorder.updatedAt = new Date();
                await cekorder.save();
                return res.status(200).json({
                    STATUS_CODE: "COMMENT_UPDATED",
                    Message: "Comment telah diperbarui dan order tetap pending."
                });
            }
            const distributor = await Users.findOne({ where: { user_id: cekorder.distributor_id } });

            if (distributor.balance < cekorder.total_price) {
                return res.status(400).json({
                    STATUS_CODE: "INSUFFICIENT_BALANCE",
                    Message: "Saldo tidak mencukupi!"
                });
            }

            await distributor.update({ balance: distributor.balance - cekorder.total_price });

            const farmer = await Users.findOne({ where: { user_id: cekorder.farmer_id } });

            await farmer.update({ balance: farmer.balance + cekorder.total_price });

            let item = await DistributorItem.findOne({ where: { item_id: cekorder.item_id, user_id: distributor.user_id } });

            if (!item) {
                await DistributorItem.create({
                    item_id: cekorder.item_id,
                    user_id: distributor.user_id,
                    item_name: cekorder.item_name,
                    description: "Deskripsi Item",
                    price: cekorder.price,
                    qty: cekorder.qty,
                    createdAt: new Date(),
                    updatedAt: new Date()
                });
            } else {
                await item.update({
                    qty: item.qty + cekorder.qty,
                    updatedAt: new Date()
                });
            }

            const farmCrop = await FarmCrops.findOne({ where: { farm_crop_id: cekorder.item_id } });

            if (!farmCrop || farmCrop.qty < cekorder.qty) {
                return res.status(400).json({
                    STATUS_CODE: "INSUFFICIENT_CROP_QUANTITY",
                    Message: "Kuantitas tanaman tidak mencukupi di petani!"
                });
            }

            await farmCrop.update({
                qty: farmCrop.qty - cekorder.qty,
                updatedAt: new Date()
            });

            cekorder.status = "Completed";
            cekorder.updatedAt = new Date();
            await cekorder.save();

            return res.status(200).json({
                STATUS_CODE: "ORDER_COMPLETED",
                Message: "Order telah terselesaikan dan barang telah ditambahkan!"
            });
        }

        return res.status(400).json({
            STATUS_CODE: "ORDER_NOT_PENDING",
            Message: "Order tidak dalam status pending!"
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            STATUS_CODE: "INTERNAL_SERVER_ERROR",
            Message: "Terjadi kesalahan pada server"
        });
    }
};



// POST Konfirmasi Request Seller dan Bayar
const finishRequestSeller = async (req, res) => {
    const { user_id } = req.user;
    const { order_id, comment } = req.body;

    try {
        const cekorder = await RequestSeller.findOne({
            _id: order_id,
            distributor_id: user_id
        });

        if (!cekorder) {
            return res.status(404).json({
                STATUS_CODE: "ORDER_NOT_FOUND",
                Message: "Order Tidak Ditemukan!"
            });
        } else if (cekorder.status === "Completed") {
            return res.status(400).json({
                STATUS_CODE: "ORDER_COMPLETED",
                Message: "Order telah terselesaikan!"
            });
        } else if (cekorder.status === "Pending") {
            if (comment) {
                cekorder.comment = comment;
                await cekorder.save();
                return res.status(200).json({
                    STATUS_CODE: "COMMENT_UPDATED",
                    Message: "Comment telah diperbarui dan order tetap pending."
                });
            }

            const distributor = await Users.findOne({ 
                where: { 
                    user_id: user_id 
                } 
            });

            if (distributor.balance < cekorder.total_price) {
                return res.status(400).json({
                    STATUS_CODE: "INSUFFICIENT_BALANCE",
                    Message: "Saldo tidak mencukupi!"
                });
            }

            await distributor.update({ balance: distributor.balance - cekorder.total_price });

            let cekbarang = await SellerItem.findOne({
                where: { item_id: cekorder.item_id }
            });

            if (!cekbarang) {
                cekbarang = await SellerItem.create({
                    item_id: cekorder.item_id,
                    item_name: cekorder.item_name,
                    description: cekbarang.description,
                    price: cekorder.price,
                    qty: cekorder.total_price / cekorder.price,
                    createdAt: new Date(),
                    updatedAt: new Date()
                });
            } else {
                await cekbarang.update({
                    qty: cekbarang.qty + (cekorder.total_price / cekorder.price),
                    updatedAt: new Date()
                });
            }

            cekorder.status = "Completed";
            await cekorder.save();

            return res.status(200).json({
                STATUS_CODE: "ORDER_COMPLETED",
                Message: "Order telah terselesaikan dan barang telah ditambahkan ke seller!"
            });
        } else {
            return res.status(400).json({
                STATUS_CODE: "ORDER_NOT_PENDING",
                Message: "Order tidak dalam status pending!"
            });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            STATUS_CODE: "INTERNAL_SERVER_ERROR",
            Message: "Terjadi kesalahan pada server"
        });
    }
};


const updateItemSchema = Joi.object({
    item_id: Joi.string().required(),
    item_name: Joi.string().required(),
    description: Joi.string().required(),
    price: Joi.number().required(),
    qty: Joi.number().required()
});

// PUT Update Item
const updateItem = async (req, res) => {
    const { user_id } = req.user;
    const { item_id, item_name, description, price, qty } = req.body;

    const { error } = updateItemSchema.validate({ item_id, item_name, description, price, qty });
    if (error) {
        return res.status(400).json({
            STATUS_CODE: "VALIDATION ERROR",
            Message: error.details[0].message
        });
    }

    try {
        const item = await DistributorItem.findOne({
            item_id,
            user_id
        });
        if (!item) {
            return res.status(404).json({
                STATUS_CODE: "ITEM NOT FOUND",
                Message: "Item tidak ditemukan"
            });
        }

        item.item_name = item_name;
        item.description = description;
        item.price = price;
        item.qty = qty;
        item.updatedAt = new Date();

        await item.save();

        return res.status(200).json({
            STATUS_CODE: "ITEM UPDATED",
            Message: "Item berhasil diupdate.",
            item
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            STATUS_CODE: "INTERNAL SERVER ERROR",
            Message: "Terjadi kesalahan pada server"
        });
    }
};

// DELETE Item
const deleteItem = async (req, res) => {
    const { user_id } = req.user;
    const { item_id } = req.body;

    try {
        const item = await DistributorItem.findOne({
            where: {
                item_id,
                user_id
            }
        });

        if (!item) {
            return res.status(404).json({
                STATUS_CODE: "ITEM NOT FOUND",
                Message: "Item tidak ditemukan"
            });
        }

        await item.destroy();

        return res.status(200).json({
            STATUS_CODE: "ITEM DELETED",
            Message: "Item berhasil dihapus."
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            STATUS_CODE: "INTERNAL SERVER ERROR",
            Message: "Terjadi kesalahan pada server"
        });
    }
};
module.exports = {
    getListItem,
    getAllRequestSeller,
    updateItem,
    finishRequestFarmer,
    finishRequestSeller,
    getAllRequestFarmer,
    getAllRequestSeller,
    deleteItem,
    updateItem,
    makeRequestFarmer
}