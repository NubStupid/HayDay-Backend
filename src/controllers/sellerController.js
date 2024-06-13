const { Op } = require("sequelize")
const { SellerItem } = require("../models")
const schema = require("../utils/validation")
const getTime = require("../utils/functions/getTime")

const buy = async (req, res) => {
    return res.status(200).json({ message: "Buy Item" });
};

const update = async (req, res) => {
    return res.status(200).json({ message: "Update Item" });
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
    buy,
    update,
    deleteSellerItem,
    getItem,
    getItems,
};
