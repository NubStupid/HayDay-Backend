const db = require("../models")

const verifyBarn = (type) =>{
    return  async (req,res,next) => {
        let paranoid = true
        if(type == "all"){
            paranoid = false
        }
        if(!req.body.barn_id){
            return res.status(400).json({
                ERR_CODE:"MISSING BARN_ID",
                message:"REQUIRED: barn_id",
                path:"verifyBarn (middleware)"
            })
        }
        const validBarn = await db.Barns.findAll({where:{barn_id:req.body.barn_id},paranoid:paranoid})
        if(validBarn.length>0){
            req.barn = validBarn[0]
            next()
        }else{
            return res.status(400).json({
                ERR_CODE:"INVALID BARN_ID",
                message:"Barn with ID: "+req.body.barn_id+" is either deleted or cannot be found!",
                path:"verifyBarn (middlware)"
            })
        }
    }
}

module.exports = verifyBarn