const db = require("../models")

const verifyCrop = (type) =>{
    return  async (req,res,next) => {
        let paranoid = true
        if(type == "all"){
            paranoid = false
        }
        if(!req.body.crop_id){
            return res.status(400).json({
                ERR_CODE:"MISSING CROP_ID",
                message:"REQUIRED: crop_id",
                path:"verifyCrop (middleware)"
            })
        }
        const validCrop = await db.Crops.findAll({where:{crop_id:req.body.crop_id},paranoid:paranoid})
        if(validCrop.length>0){
            req.crop = validCrop[0]
            next()
        }else{
            return res.status(400).json({
                ERR_CODE:"INVALID CROP_ID",
                message:"Crop with ID: "+req.body.crop_id+" is either deleted or cannot be found!",
                path:"verifyCrop (middlware)"
            })
        }
    }
}

module.exports = verifyCrop