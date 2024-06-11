const db = require("../models")

const verifyFnB = (type) =>{
    return  async (req,res,next) => {
        // let paranoid = true
        // if(type == "all"){
        //     paranoid = false
        // }
        let { fnb_id } = req.body;
        if(!fnb_id)
            fnb_id = req.params.fnb_id
        if(!fnb_id){
            return res.status(400).json({
                ERR_CODE:"MISSING FNB_ID",
                message:"REQUIRED: fnb_id",
                path:"verifyFnB (middleware)"
            })
        }
        const validFnB = await db.FnB.findAll({where:{fnb_id}})
        // console.log(validFnB);
        if(validFnB.length>0){
            req.fnb = validFnB[0]
            next()
        }else{
            return res.status(400).json({
                ERR_CODE:"INVALID FNB_ID",
                message:"FnB with ID: "+ req.body.fnb_id +" is either deleted or cannot be found!",
                path:"verifyFnB (middlware)"
            })
        }
    }
}

module.exports = verifyFnB