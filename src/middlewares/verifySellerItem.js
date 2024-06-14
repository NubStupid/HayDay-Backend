const db = require("../models")

const verifySellerItem = (type) =>{
    return  async (req,res,next) => {
        let { item_id } = req.body;
        if(!item_id)
            item_id = req.params.item_id
        if(!item_id){
            return res.status(400).json({
                ERR_CODE:"MISSING ITEM_ID",
                message:"REQUIRED: item_id",
                path:"verifySellerItem (middleware)"
            })
        }
        const validItem = await db.SellerItem.findAll({where:{item_id}})
        if(validItem.length>0){
            req.item = validItem[0]
            next()
        }else{
            return res.status(400).json({
                ERR_CODE:"INVALID ITEM_ID",
                message:"Item with ID: "+ req.body.item_id +" is either deleted or cannot be found!",
                path:"verifySellerItem (middlware)"
            })
        }
    }
}

module.exports = verifySellerItem