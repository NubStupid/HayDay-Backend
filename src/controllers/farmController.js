const { Op, where } = require("sequelize")
const { Farms, Tiles, Crops, FarmCrops,Barns } = require("../models")
const getTimeID = require("../utils/functions/getTimeID")
const schema = require("../utils/validation")
const getTime = require("../utils/functions/getTime")
const getDay = require("../utils/functions/getDay")
const { message } = require("../utils/validation/createBarnSchema")

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
            farm_deleted:farmToDelete
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
            farm_restored:farmToRestore
        })
    }catch(error){
        return res.status(400).json({
            ERR_CODE:"ERROR RESTORING FARM",
            message:error.toString(),
            path:"restoreFarm (controller)"
        })
    }
}

const setBarn = async (req,res) =>{
    const barn = req.barn
    const farm = req.farm
    const validToSet = await Farms.findAll({where:{barn_id:barn.barn_id},paranoid:false})
    if(validToSet.length > 0){
        return res.status(400).json({
            ERR_CODE:"INVALID BARN ID",
            message:`This barn_id ${barn.barn_id} has already been used by another farm!`,
            path:"setBarn (controller)"
        })
    }
    if(farm.user_id != req.user.user_id && barn.user_id != farm.user_id){
        return res.status(400).json({
            message:"You can't set a barn you didn't own!"
        })
    }
    await Farms.update({
        barn_id:barn.barn_id
    },{
        where:{
            farm_id:farm.farm_id
        }
    })
    return res.status(200).json({
        STATUS_CODE:`SUCCESSFULY ADDED ${barn.barn_id} INTO ${farm.farm_name}`,
        farm_id: farm.farm_id,
        farm_name: farm.farm_name,
        user: req.user.username
    })
}

const unsetBarn =  async (req,res) =>{
    const barn = req.barn
    const farm = req.farm
    const validToSet = await Farms.findAll({where:{barn_id:barn.barn_id},paranoid:false})
    if(validToSet.length == 0){
        return res.status(400).json({
            ERR_CODE:"INVALID BARN ID",
            message:`This barn_id ${barn.barn_id} hasn't been used by another farm!`,
            path:"unsetBarn (controller)"
        })
    }
    const barnItem = await FarmCrops.findAll({
        where:{
            farm_id:farm.farm_id
        }
    })
    if(barnItem.length > 0) {
        return res.status(400).json({
            message:"You must clear all item in barn before unsetting it!"
        })
    }
    await Farms.update({
        barn_id:null
    },{
        where:{
            farm_id:farm.farm_id
        }
    })
    return res.status(200).json({
        STATUS_CODE:`SUCCESSFULY REMOVED ${barn.barn_id} FROM ${farm.farm_name}`,
        farm_id: farm.farm_id,
        farm_name: farm.farm_name,
        user: req.user.username
    })
}



const createTile = async (req,res) => {
    const permissionType = /all access|owner only/
    const testPerm = permissionType.test(req.body.permission)
    if(testPerm){
        const date = getTimeID()
        const count = await Tiles.count({
            where:{
                tile_id:{
                    [Op.like]:`%${date}%`
                }
            }
        })+1
        const newID = `TILE${date}`+(count.toString()).padStart(4,"0")
        const newTile = await Tiles.create({
            tile_id:newID,
            farm_id:req.farm.farm_id,
            user_id:req.user.user_id,
            permission:req.body.permission
        })
        return res.status(200).json({
            STATUS_CODE:"SUCCESSFULLY CREATED A TILE",
            username:req.user.username,
            farm:req.farm.farm_name,
            permission:req.body.permission,
            createdAt:newTile.createdAt
        })
    }else{
        return res.status(400).json({
            ERR_CODE:"INVALID PERMISSION",
            message:"Your permission doesn't match in between (all access|owner only)",
            path:"createTile (controller)"
        })
    }
}
const updateTile = async (req,res) => {
    const permissionType = /all access|owner only/
    const testPerm = permissionType.test(req.body.permission)
    if(testPerm){
        const updatedTile = await Tiles.update({
            permission:req.body.permission
        },{
            where:{
                tile_id:req.tile.tile_id
            }
        })
        return res.status(200).json({
            STATUS_CODE:"SUCCESSFULLY UPDATED A TILE",
            new_permission:req.body.permission,
        })
    }else{  
        return res.status(400).json({
            ERR_CODE:"INVALID PERMISSION",
            message:"Your permission doesn't match in between (all access|owner only)",
            path:"updateTile (controller)"
        })
    }
}

const deleteTile = async (req,res) => {
    try{
        const tileToDelete = req.tile
        await Tiles.destroy({where:{
            tile_id:tileToDelete.tile_id
        }})
        return res.status(200).json({
            STATUS_CODE: "SUCCESFULLY DELETED A TILE",
            username:req.user.username,
            tile_deleted:tileToDelete
        })
    }catch(error){
        return res.status(400).json({
            ERR_CODE:"ERROR DELETING TILE",
            message:error.toString(),
            path:"deleteTile (controller)"
        })
    }
}
const restoreTile =async (req,res) => {
    try{
        const tileToRestore = req.tile
        const validRestore = await Tiles.findAll({where:{tile_id:tileToRestore.tile_id}})
        if(validRestore.length>0){
            return res.status(400).json({
                ERR_CODE:"ERROR RESTORING TILE",
                message:"TILE HAS NOT BEEN DELETED YET!",
                path:"restoreTile (controller)"
            })
        }
        await Tiles.restore({where:{
            tile_id:tileToRestore.tile_id
        }})
        return res.status(200).json({
            STATUS_CODE: "SUCCESFULLY RESTORED A TILE",
            username:req.user.username,
            tile_restored:tileToRestore
        })
    }catch(error){
        return res.status(400).json({
            ERR_CODE:"ERROR RESTORING TILE",
            message:error.toString(),
            path:"restoreTile (controller)"
        })
    }
}

const fetchTile = async(req,res) =>{
    const user = req.user
    allTiles = req.tile
    let allTilesFormatted = []
    if(Array.isArray(allTiles))
    allTiles.map((f)=>{
        allTilesFormatted.push({
            tile_id:f.tile_id,
            planted: f.crop_id?"Planted":"Empty",
            createdAt: getTime(f.createdAt),
            lastUpdated: getTime(f.updatedAt),
        })
    })
    else{
        allTilesFormatted = {
            tile_id:req.tile.tile_id,
            planted: req.tile.crop_id?"Planted":"Empty",
            createdAt: getTime(req.tile.createdAt),
            lastUpdated: getTime(req.tile.updatedAt),
        }
    }
    let queryFilter = "TILE "+req.body.tile_id
    if(req.body.tile_id == "all"){
        queryFilter = "ALL TILES"
    }
    return res.status(200).json({
        STATUS_CODE: "SUCCESSFULLY FETCH "+queryFilter,
        tile:allTilesFormatted,
    })
}
const plantCrops = async (req,res) => {
    if(req.tile.crop_id != null){
        return res.status(400).json({
            message:"Tile has already been planted!"
        })
    }
    const today = new Date()
    const toPrint = today.setDate(today.getDate()+req.crop.harvest_time)
    const updatedTile = await Tiles.update({
        crop_id: req.crop.crop_id,
        due_date:toPrint
    },{
        where:{
            tile_id:req.tile.tile_id}
    })
    return res.json({
        message:"Sucessfully planted "+req.crop.crop_name+" in tile "+req.tile.tile_id,
        due_date : getDay(toPrint)
    })
}

 const farmTile = async (req,res) => {
    if(req.tile.crop_id == null) {
        return res.status(400).json({
            message:"This tile is still empty!"
        })
    }
    const today = new Date()
    today.setHours(0,0,0,0)
    if(req.tile.due_date > today){
        return res.status(400).json({
            message:"The crop is not ready yet!"
        })
    }
    const userBarn = await Barns.findByPk(req.farm.barn_id)
    const barnItem = await FarmCrops.findAll({
        where:{
            farm_id:req.farm.farm_id
        }
    })
    const cropsHarvested = await Crops.findByPk(req.tile.crop_id)
    req.crop = cropsHarvested
    if(barnItem.length + cropsHarvested.harvest_result > userBarn.storage_caps){
        return res.status(400).json({
            message:"Barn is already full!"
        })
    }
    const existingCrop = await FarmCrops.findOne({
        where:{
            farm_id:req.farm.farm_id,
            crop_id:req.crop.crop_id,
        }
    })
    if(existingCrop){
        await FarmCrops.update({
            qty: existingCrop.qty + parseInt(cropsHarvested.harvest_result)
        },{
            where:{
                farm_crop_id:existingCrop.farm_crop_id
            }
        })
        await Tiles.update({
            crop_id:null,
            due_date:null
        },{
            where:{
                tile_id:req.tile.tile_id
            }
        })
        return res.status(200).json({
            message:"Successfully harvested a tile!"
        })
    }else{
        const count = await FarmCrops.count()+1
        const date = getTimeID()
        const newID = "FACR"+date+(count.toString()).padStart(4,"0")
        const newCropItem = await FarmCrops.create({
            farm_crop_id:newID,
            farm_id:req.farm.farm_id,
            crop_id:req.crop.crop_id,
            qty:cropsHarvested.harvest_result,
        })
        await Tiles.update({
            crop_id:null,
            due_date:null
        },{
            where:{
                tile_id:req.tile.tile_id
            }
        })
        return res.status(201).json({
            message:"Successfully harvested a tile",
            new_item: newCropItem
        })
    }
}
const farmAllTiles = async (req,res) =>{
    const allTile = await Tiles.findAll({where:{
        farm_id:req.farm.farm_id,
        user_id:req.user.user_id,
    }})
    const userBarn = await Barns.findByPk(req.farm.barn_id)
    if(!userBarn){
        return res.status(400).json({
            message:"there aren't any barn attached to the farm!"
        })
    }
    const today = new Date()
    // today.setHours(0,0,0,0)
    if(allTile.length >0){
        let harvestableTiles = []
        let toPrint = []
        allTile.map((t) => {
            if(t.crop_id != null){
                console.log(new Date(today));
                if(new Date(t.due_date) <= today){
                    harvestableTiles.push(t)
                    
                }
            }
        })
        if(harvestableTiles.length == 0){
            return res.status(400).json({
                message:"There aren't any harvestable tiles in this farm!"
            })    
        }
        const barnItem = await FarmCrops.findAll({
            where:{
                farm_id:req.farm.farm_id
            } 
        })
        let obstructed = false
        for (const t of harvestableTiles) {
            const crops = await Crops.findByPk(t.crop_id)
            if(barnItem.length+crops.harvest_result <= userBarn.storage_caps){
                const existingCrop = await FarmCrops.findOne({
                    where:{
                        farm_id:req.farm.farm_id,
                        crop_id:crops.crop_id,
                    }
                })
                if(existingCrop){
                    await FarmCrops.update({
                        qty: existingCrop.qty + parseInt(crops.harvest_result)
                    },{
                        where:{
                            farm_crop_id:existingCrop.farm_crop_id
                        }
                    })
                    await Tiles.update({
                        crop_id:null,
                        due_date:null
                    },{
                        where:{
                            tile_id:t.tile_id
                        }
                    })
                    toPrint.push({
                        tile:t.tile_id,
                        crop:crops.crop_id
                    })
                }else{
                    const date = getTimeID()
                    const count = await FarmCrops.count({
                        where:{
                            farm_crop_id:{
                                [Op.like]: `%${date}%`
                            }
                        }
                    })+1
                    const newID = "FACR"+date+(count.toString()).padStart(4,"0")
                    const newCropItem = await FarmCrops.create({
                        farm_crop_id:newID,
                        farm_id:req.farm.farm_id,
                        crop_id:crops.crop_id,
                        qty:crops.harvest_result,
                    })
                    await Tiles.update({
                        crop_id:null,
                        due_date:null
                    },{
                        where:{
                            tile_id:t.tile_id
                        }
                    })
                    toPrint.push({
                        tile:t.tile_id,
                        crop:crops.crop_id
                    })
                }
            }else{
                obstructed = true
                break
            }
        }
        let message = (!obstructed?"Sucessfully harvested all harvestable tiles":"Successfully harvested tiles but barn is currently full")
        return res.status(200).json({
            message:message,
            crops_harvested: toPrint
        })

    }else{
        return res.status(400).json({
            message:"There aren't any tiles in this farm!"
        })
    }
}
const removeFarmCrops = async (req,res) => {
    const {farm_crop_id,qty} = req.body
    const currentQTY = await FarmCrops.findByPk(farm_crop_id)
    if(!currentQTY){
        return res.status(400).json({
            message:"There aren't any item with that ID"
        })
    }
    if(currentQTY.qty < qty){
        return res.status(400).json({
            message:"There aren't enough item in your barn"
        })
    }else{
        await FarmCrops.update({qty:currentQTY.qty-parseInt(qty)},{
            where:{
                farm_crop_id:farm_crop_id
            }
        })
        return res.status(400).json({
            message:"Successfully removed "+qty+" items from your barn"
        })
    }

}


module.exports = {
    test,
    createFarm,
    updateFarm,
    fetchFarm,
    deleteFarm,
    restoreFarm,
    setBarn,
    unsetBarn,
    createTile,
    updateTile,
    deleteTile,
    restoreTile,
    fetchTile,
    farmAllTiles,
    plantCrops,
    farmTile,
    removeFarmCrops,
}