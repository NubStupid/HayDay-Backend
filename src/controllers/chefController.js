const { Op } = require("sequelize")
const { FnB } = require("../models")
const schema = require("../utils/validation")
const getTime = require("../utils/functions/getTime")

const createMenu = async (req, res) => {
    try{
        const { fnb_name, description, type, price } = req.body
        await schema.createChefSchema.validateAsync(req.body, {
            abortEarly:false
        })
        let fnb_id = await FnB.count({paranoid: false})
        fnb_id = "FNB" + (fnb_id + 1).toString().padStart(3, "0")
        const createFnB = await FnB.create({
            fnb_id,
            fnb_name,
            description,
            type,
            price,
            rating: 0,
            sold: 0
        })
        return res.status(201).json({
            STATUS_CODE:"SUCESSFULY CREATED A MENU",
            new_menu:{
                createFnB
            },
            // user:req.user.username,
            createdAt: getTime(createFnB.createdAt)
        })
    }catch(error){
        return res.status(400).json({
            ERR_CODE:"ERROR CREATING MENU",
            message:error.toString(),
            path:"createMenu (chefController)"
        })
    };
};

const updateMenu = async (req, res) => {
    try {
        let fnb = req.fnb;
        await schema.createChefSchema.update.validateAsync(req.body, {
            abortEarly:false
        })
        const { fnb_name, description, price } = req.body
        if(fnb_name)
        {
            await FnB.update({ fnb_name },{
                where: {
                    fnb_id: fnb.fnb_id,
                },
            });
        }
        if(description)
        {
            await FnB.update({ description },{
                where: {
                    fnb_id: fnb.fnb_id,
                },
            });
        }
        if(price)
        {
            await FnB.update({ price },{
                where: {
                    fnb_id: fnb.fnb_id,
                },
            });
        }
        fnb = await FnB.findAll({where:{fnb_id: fnb.fnb_id}})
        return res.status(200).json({
            STATUS_CODE: "SUCCESFULLY UPDATED A MENU",
            // username: req.user.username,
            fnb_updated: fnb,
        });
    } catch (error) {
        return res.status(400).json({
            ERR_CODE: "ERROR UPDATING MENU",
            message: error.toString(),
            path: "updateMenu (chefController)",
        });
    }
};

const deleteMenu = async (req, res) => {
    try {
        const fnb = req.fnb;
        await FnB.destroy({
            where: {
                fnb_id: fnb.fnb_id,
            },
        });
        return res.status(200).json({
            STATUS_CODE: "SUCCESFULLY DELETED A MENU",
            // username: req.user.username,
            fnb_deleted: fnb.fnb_id,
        });
    } catch (error) {
        return res.status(400).json({
            ERR_CODE: "ERROR DELETING MENU",
            message: error.toString(),
            path: "deleteMenu (chefController)",
        });
    }
};

const getMenu = async (req, res) => {
    try {
        const fnb = req.fnb;
        return res.status(200).json({
            STATUS_CODE: "SUCCESFULLY FIND A MENU",
            username: req.user.username,
            menu: fnb,
        });
    } catch (error) {
        return res.status(400).json({
            ERR_CODE: "ERROR SEARCHING MENU",
            message: error.toString(),
            path: "getMenu (chefController)",
        });
    }
};

const getMenus = async (req, res) => {
    try {
        let { name, sort_by, sort_dir } = req.body;
        let fnb;

        if(sort_by && sort_by != "fnb_id" && sort_by != "fnb_name" && sort_by != "price" && sort_by != "sold")
            throw new Error('Invalid sort column');
        if(sort_dir && sort_by.lower() != "ASC" && sort_dir.lower() != "DESC")
            throw new Error('Invalid sort direction');

        if(!sort_by)
            sort_by = "fnb_id"
        if(!sort_dir)
            sort_dir = "ASC"


        fnb = await FnB.findAll({where:{
            fnb_name:{
                [Op.like]:`%${name}%`
            }
        }, order: [[sort_by, sort_dir]]})
        if(!name)
            fnb = await FnB.findAll()

        // ,
        // attributes:["fnb_id","fnb_name","barn_id","createdAt","updatedAt"]    
    //     }
    // );
        return res.status(200).json({
            STATUS_CODE: "SUCCESFULLY FIND MENU",
            // username: req.user.username,
            menu: fnb,
        });
    } catch (error) {
        return res.status(400).json({
            ERR_CODE: "ERROR SEARCHING MENU",
            message: error.toString(),
            path: "getMenus (chefController)",
        });
    }
};

module.exports = {
    createMenu,
    updateMenu,
    deleteMenu,
    getMenu,
    getMenus,
};
