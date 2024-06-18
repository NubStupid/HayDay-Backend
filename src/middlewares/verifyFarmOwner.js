const db = require("../models")

const verifyFarmOwner = (type)=> {
    return async (req,res,next) => {
        if(req.farm.user_id == req.user.user_id){
            next()
        }else{
            return res.status(400).json({
                ERR_CODE:"INVALID OWNER",
                message:"This farm is not yours",
                path:"verifyFarmOwner (middlware)"
            })
        }   
    }
}


module.exports = verifyFarmOwner