const { Op } = require("sequelize")
const { Farms } = require("../models")
const getTimeID = require("../utils/functions/getTimeID")
const schema = require("../utils/validation")
const getTime = require("../utils/functions/getTime")

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

const updateFarm = async (req,res) => {
    try{
        const farmToUpdate = req.farm
        const {farm_name} = req.body
        await schema.createFarmSchema.validateAsync({farm_name:farm_name},{
            abortEarly:true
        })
        await Farms.update({
            farm_name:farm_name
        },{
            where:{
                farm_id:farmToUpdate.farm_id
            }
        })
        return res.status(200).json({
            STATUS_CODE: "SUCCESFULLY UPDATED A FARM",
            username:req.user.username,
            new_farm_name:farm_name
        })
    }catch(error){
        return res.status(400).json({
            ERR_CODE:"ERROR UPDATING FARM",
            message:error.toString(),
            path:"updateFarm (controller)"
        })
    }
}

const fetchFarm = async (req,res) =>{
    const user = req.user
    const {name} = req.query
    const filterName = (name==null?"":name)
    let allFarms = await Farms.findAll({where:{
        user_id: user.user_id,
        farm_name:{
            [Op.like]:`%${filterName}%`
        }
    },
    attributes:["farm_id","farm_name","barn_id","createdAt","updatedAt"]    
    })
    let allFarmsFormatted = []
    allFarms.map((f)=>{
        allFarmsFormatted.push({
            farm_id:f.farm_id,
            farm_name:f.farm_name,
            barn_id:f.barn_id,
            createdAt: getTime(f.createdAt),
            lastUpdated: getTime(f.updatedAt),
        })
    })

    if(filterName==""){
        return res.status(200).json({
            STATUS_CODE: "SUCCESSFULLY FETCH ALL "+user.username+"'s Farms",
            farms:allFarmsFormatted,
        })
    }else{
        return res.status(200).json({
            STATUS_CODE: "SUCCESSFULLY FETCH ALL "+user.username+"'s Farms",
            farms:allFarmsFormatted,
            filter:filterName
        })
    }
}

const deleteFarm = async (req,res) =>{
    try{
        const farmToDelete = req.farm
        await Farms.destroy({where:{
            farm_id:farmToDelete.farm_id
        }})
        return res.status(200).json({
            STATUS_CODE: "SUCCESFULLY DELETED A FARM",
            username:req.user.username,
            farm_deleted:farmToDelete.farm_id
        })
    }catch(error){
        return res.status(400).json({
            ERR_CODE:"ERROR DELETING FARM",
            message:error.toString(),
            path:"deleteFarm (controller)"
        })
    }
    
}

const restoreFarm = async (req,res) =>{
    try{
        const farmToRestore = req.farm
        const validRestore = await Farms.findAll({where:{farm_id:farmToRestore.farm_id}})
        if(validRestore.length>0){
            return res.status(400).json({
                ERR_CODE:"ERROR RESTORING FARM",
                message:"FARM HAS NOT BEEN DELETED YET!",
                path:"restoreFarm (controller)"
            })
        }
        await Farms.restore({where:{
            farm_id:farmToRestore.farm_id
        }})
        return res.status(200).json({
            STATUS_CODE: "SUCCESFULLY RESTORED A FARM",
            username:req.user.username,
            farm_deleted:farmToRestore.farm_id
        })
    }catch(error){
        return res.status(400).json({
            ERR_CODE:"ERROR RESTORING FARM",
            message:error.toString(),
            path:"restoreFarm (controller)"
        })
    }
}

module.exports = {
    test,
    createFarm,
    updateFarm,
    fetchFarm,
    deleteFarm,
    restoreFarm
}