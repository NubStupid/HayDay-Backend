const { Op } = require("sequelize")
const { Barns } = require("../models")
const getTimeID = require("../utils/functions/getTimeID")
const schema = require("../utils/validation")
const getTime = require("../utils/functions/getTime")
const createBarn = async (req,res) =>{
    try{
        const {post_code}  =req.body
        await schema.createBarnSchema.validateAsync(req.body,{
            abortEarly:false
        })
        const storage = 25
        const time = getTimeID()
        let count = await Barns.count({
            where:{
                barn_id:{
                    [Op.like]:`%${time}%`
                }
            }
        })
        count++
        const newID = "BARN"+time+(count.toString()).padStart(4,"0")
        const createBarn = await Barns.create({
            barn_id:newID,
            user_id:req.user.user_id,
            post_code: post_code,
            storage_caps : storage
        })
        return res.status(201).json({
            STATUS_CODE:"SUCESSFULY CREATED A BARN",
            new_barn:{
                barn_id:newID,
                post_code:post_code,
                storage_caps:storage
            },
            user:req.user.username,
            createdAt: getTime(createBarn.createdAt)
        })
    }catch(error){
        return res.status(400).json({
            ERR_CODE:"ERROR CREATING BARN",
            message:error.toString(),
            path:"createBarn (controller)"
        })
    }
}

const updateBarn = async (req,res) =>{
    try{
        const {post_code}  =req.body
        await schema.createBarnSchema.validateAsync({
            post_code:req.body.post_code},{
            abortEarly:false
        })
        await Barns.update({
            post_code:post_code
        },{
            where:{
                barn_id:req.barn.barn_id
            }
        })
        return res.status(200).json({
            STATUS_CODE:"SUCESSFULY UPDATING A BARN",
            new_post_code:post_code,
            barn: req.barn.barn_id,
        })
    }catch(error){
        return res.status(400).json({
            ERR_CODE:"ERROR UPDATING BARN",
            message:error.toString(),
            path:"updateBarn (controller)"
        })
    }
}

const deleteBarn = async (req,res) =>{
    try{
        const barnToDelete = req.barn
        await Barns.destroy({where:{
            barn_id:barnToDelete.barn_id
        }})
        return res.status(200).json({
            STATUS_CODE: "SUCCESFULLY DELETED A BARN",
            username:req.user.username,
            barn_deleted:barnToDelete.barn_id
        })
    }catch(error){
        return res.status(400).json({
            ERR_CODE:"ERROR DELETING BARN",
            message:error.toString(),
            path:"deleteBarn (controller)"
        })
    }
    
}

const restoreBarn = async (req,res) =>{
    try{
        const barnToRestore = req.barn
        const validRestore = await Barns.findAll({where:{barn_id:barnToRestore.barn_id}})
        if(validRestore.length>0){
            return res.status(400).json({
                ERR_CODE:"ERROR RESTORING BARN",
                message:"BARN HAS NOT BEEN DELETED YET!",
                path:"restoreBarn (controller)"
            })
        }
        await Barns.restore({where:{
            barn_id:barnToRestore.barn_id
        }})
        return res.status(200).json({
            STATUS_CODE: "SUCCESFULLY RESTORED A BARN",
            username:req.user.username,
            barn_restored:barnToRestore.barn_id
        })
    }catch(error){
        return res.status(400).json({
            ERR_CODE:"ERROR RESTORING BARN",
            message:error.toString(),
            path:"restoreBarn (controller)"
        })
    }
}

const upgradeStorage = async (req,res)=>{
    const multiplier = parseInt(req.query.ammount?req.query.ammount:1)
    
    await Barns.update({
        storage_caps: req.barn.storage_caps + multiplier
    },{
        where:{
            barn_id:req.barn.barn_id
        }
    })

    // TODO : kurangi balance user

    return res.status(200).json({
        STATUS_CODE:"SUCCESSFULY ADDED "+multiplier+" MORE STORAGE CAPACITY",
        user: req.user.username,
        new_storage_caps: req.barn.storage_caps + multiplier
    })
}

module.exports = {
    createBarn,
    updateBarn,
    deleteBarn,
    restoreBarn,
    upgradeStorage,
}