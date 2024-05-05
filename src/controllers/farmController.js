const { Op } = require("sequelize")
const { Farms } = require("../models")
const getTimeID = require("../utils/functions/getTimeID")
const schema = require("../utils/validation")

const test = (req,res) => {
    return res.status(200).json({
        header: req.header,
        body:req.body
    })
}

const createFarm =  async (req,res) => {
    try{
        const {farm_name} = req.body
        await schema.createFarmSchema.validateAsync(req.body,{
            abortEarly:true
        })
        const date = getTimeID()
        const count = await Farms.count({
            where:{
                farm_id:{
                    [Op.like]: `%${date}%`
                }
            }
        })+1
        const newID = "FARM"+date+(count.toString().padStart(4,"0"))
        const newFarm = await Farms.create({
            farm_id:newID,
            user_id:req.user.user_id,
            farm_name:farm_name,
            barn_id : null
        })
        return res.status(201).json({
            STATUS_CODE: "SUCCESFULLY CREATED A FARM",
            username:req.user.username,
            farm_id: newID,
            createdAt: newFarm.createdAt
        })
    }catch(error){
        return res.status(400).json({
            ERR_CODE:"ERROR CREATING FARM",
            message:error.toString(),
            path:"createFarm (controller)"
        })
    }
}

module.exports = {
    test,
    createFarm,
}