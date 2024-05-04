const db = require("../models")

const verifyPostCode = async (req,res,next) => {
    const usedPostCode = await db.Barns.findAll({where:{
        post_code:(req.post_code != null? req.post_code: "")
    }})
    if(usedPostCode.length>0){
        return res.status(400).json({
            ERR_CODE:"INVALID POST CODE",
            message:"Post code already been used!",
            path:"verifyPostCode (middleware)"
        })
    }
    next()
}

module.exports = verifyPostCode