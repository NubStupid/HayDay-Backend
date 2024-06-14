const db = require("../models")

const verifyTile = (type)=> {
    return async (req,res,next) => {
        let paranoid = true
        if(type == "all"){
            paranoid = false
        }
        if(!req.body.farm_id){
            return res.status(400).json({
                ERR_CODE:"MISSING TILE_ID",
                message:"REQUIRED: tile_id",
                path:"validTile (middleware)"
            })
        }
        const validTile = await db.Tiles.findAll({where:{tile_id:req.body.tile_id},paranoid:paranoid})
        if(validTile.length>0){
            req.tile = validTile[0]
            next()
        }else{
            return res.status(400).json({
                ERR_CODE:"INVALID TILE_ID",
                message:"Farm with ID: "+req.body.tile_id+" is either deleted or cannot be found!",
                path:"validTile (middleware)"
            })
        }
    }
}



module.exports = verifyTile