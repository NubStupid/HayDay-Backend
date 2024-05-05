const db = require("../models")

const verifyFarm = (type)=> {
    return async (req,res,next) => {
        let paranoid = true
        if(type == "all"){
            paranoid = false
        }
        if(!req.body.farm_id){
            return res.status(400).json({
                ERR_CODE:"MISSING FARM_ID",
                message:"REQUIRED: farm_id",
                path:"verifyFarm (middleware)"
            })
        }
        const validFarm = await db.Farms.findAll({where:{farm_id:req.body.farm_id},paranoid:paranoid})
        if(validFarm.length>0){
            req.farm = validFarm[0]
            next()
        }else{
            return res.status(400).json({
                ERR_CODE:"INVALID FARM_ID",
                message:"Farm with ID: "+req.body.farm_id+" is either deleted or cannot be found!",
                path:"verifyFarm (middlware)"
            })
        }
    }
}


module.exports = verifyFarm