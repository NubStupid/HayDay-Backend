const { Op } = require("sequelize")
const { Crops, Users } = require("../models")
const getTimeID = require("../utils/functions/getTimeID")
const schema = require("../utils/validation")
const getTime = require("../utils/functions/getTime")

const createCrops = async (req,res) =>{
    try{
        const {crop_name,crop_species,harvest_result,harvest_time} = req.body
        await schema.createCropSchema.validateAsync(req.body,{abortEarly:false})
        const time = getTimeID()
        const count = await Crops.count({where:{
            crop_id:{
                [Op.like]:`%${time}%`
            }
        }})+1
        const newID = "CROP"+time+(count.toString()).padStart(4,"0")
        const newCrop = await Crops.create({
            crop_id:newID,
            crop_name:crop_name,
            crop_species:crop_species,
            harvest_result:harvest_result,
            harvest_time:harvest_time
        })
        return res.status(201).json({
            STATUS_CODE:"SUCCESSFULY CREATED A CROP",
            new_crop:{
                crop_id: newCrop.crop_id,
                crop_name: newCrop.crop_name,
                crop_species:newCrop.crop_species,
                harvest_result:newCrop.harvest_result,
                harvest_time:newCrop.harvest_time
            },
            createdAt:getTime(newCrop.createdAt),
            user: req.user.username
        })
    }catch(error){
        return res.status(400).json({
            ERR_CODE:"ERROR CREATING CROP",
            message:error.toString(),
            path:"createCrops (controller)"
        })
    }
}

const updateCrops = async (req,res) =>{
    try{
        let {crop_id,crop_name,crop_species,harvest_result,harvest_time} = req.body
        crop_name = (crop_name?crop_name:req.crop.crop_name)
        crop_species = (crop_species?crop_species:req.crop.crop_species)
        harvest_result = (harvest_result?harvest_result:req.crop.harvest_result)
        harvest_time = (harvest_time? harvest_time:req.crop.harvest_time)

        await schema.createCropSchema.validateAsync({
            crop_name:crop_name,
            crop_species:crop_species,
            harvest_result:harvest_result,
            harvest_time:harvest_time
        },{abortEarly:false})
        await Crops.update({
            crop_name:crop_name,
            crop_species:crop_species,
            harvest_result:harvest_result,
            harvest_time:harvest_time
        },{
            where:{
                crop_id: crop_id
            }    
        })
        return res.status(200).json({
            STATUS_CODE:"SUCCESSFULY UPDATED A CROP",
            crop_id:req.crop.crop_id,
            user: req.user.username,
        })
    }catch(error){
        return res.status(400).json({
            ERR_CODE:"ERROR UPDATING CROP",
            message:error.toString(),
            path:"updateCrops (controller)"
        })
    }
}

const deleteCrops = async (req,res) => {
    const cropToDelete = req.crop
    await Crops.destroy({
        where:{
            crop_id:cropToDelete.crop_id
        }
    })
    return res.status(200).json({
        STATUS_CODE:"SUCCESSFULY DELETED A CROP",
        user:req.user.username,
        deleted_crop:cropToDelete
    })
}

const restoreCrops = async (req,res) =>{
    const cropToRestore = req.crop
    if(cropToRestore.deletedAt == null){
        return res.status(400).json({
            ERR_CODE:"ERROR RESTORING CROP",
            message:"CROP HAS NOT BEEN DELETED YET!",
            path:"restoreCrops (controller)"
        })
    }

    await Crops.restore({
        where:{
            crop_id:cropToRestore.crop_id
        }
    })
    return res.status(200).json({
        STATUS_CODE:"SUCCESSFULY RESTORED A CROP",
        user:req.user.username,
        restored_crop:cropToRestore
    })
}

const fetchCrops = async (req,res) =>{
    const {name,type,includeDeleted} = req.query
    const filterName = (name==null?"":name)
    const filterType = (type=="exact"?"exact":type=="likes"?"likes":"")
    const paranoid = (includeDeleted == "true" || includeDeleted == true ? false:true)
    let allCrops;
    if(filterType == "exact"){
        allCrops= await Crops.findAll({where:{
           crop_name:filterName
       },
       attributes:["crop_id","crop_name","crop_species","harvest_result","harvest_time","createdAt","updatedAt"]    
       ,paranoid:paranoid})
    }else{
        allCrops= await Crops.findAll({where:{
            crop_name:{
                [Op.like]:`%${filterName}%`
            }
        },
        attributes:["crop_id","crop_name","crop_species","harvest_result","harvest_time","createdAt","updatedAt"]    
        ,paranoid:paranoid})
    }
    let allCropsFormatted = []
    allCrops.map((c)=>{
        allCropsFormatted.push({
            crop_id:c.crop_id,
            crop_name:c.crop_name,
            crop_species:c.crop_species,
            harvest_result:c.harvest_result+"x Times",
            harvest_time:c.harvest_time+" Day(s)",
            createdAt: getTime(c.createdAt),
            lastUpdated: getTime(c.updatedAt),
        })
    })

    if(filterName=="" && filterType==""){
        return res.status(200).json({
            STATUS_CODE: "SUCCESSFULLY FETCH ALL CROPS",
            crops:allCropsFormatted,
        })
    }else{
        return res.status(200).json({
            STATUS_CODE: "SUCCESSFULLY FETCH ALL CROPS",
            crops:allCropsFormatted,
            filter:{
                name:filterName,
                type:(filterType == "exact"? "exact":"likes"),
                includeDeleted:!paranoid
            }
        })
    }
}

const getUsers = async (req, res) => {
    let users = await Users.findAll({
        attributes: ['user_id', 'username', 'display_name', 'email', 'phone_number', 'balance', 'role', 'status']
    })
    res.status(200).send(users)
}

const setRole = async (req, res) => {
    const {username, set} = req.body

    let user = await Users.findOne({
        where : {
            username : username
        }
    })
    if(!set || !username) return res.status(400).send({message: 'Semua field harus diisi!'})
    if(user.status != 'Pending') return res.status(400).send({message: 'Status '+ user.display_name +' bukan pending'})
    
    if(set.toLowerCase() == 'acc'){
        await Users.update(
            {status: 'Approved'},
            {where: {
                username : username
            }}
        )
        return res.status(200).send({message: 'Permintaan role ' + user.display_name + ' telah disetujui'})
    }
    if(set.toLowerCase() == 'dec'){
        await Users.update(
            {status: 'Declined'},
            {where: {
                username : username
            }}
        )
        return res.status(200).send({message: 'Permintaan role ' + user.display_name + ' ditolak'})
    }
    else{
        res.status(400).send({message: 'Set hanya bisa diisi dengan Acc (Approve)/Dec (Decline)'})
    }
}

module.exports = {
    createCrops,
    updateCrops,
    deleteCrops,
    restoreCrops,
    fetchCrops,
    getUsers,
    setRole
}
