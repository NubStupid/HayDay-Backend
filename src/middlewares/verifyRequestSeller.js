const db = require("../models")

const verifyRequestSeller = (type) =>{
    return  async (req,res,next) => {
        let { req_id } = req.body;
        if(!req_id)
            req_id = req.params.req_id
        if(!req_id){
            return res.status(400).json({
                ERR_CODE:"MISSING REQ_ID",
                message:"REQUIRED: req_id",
                path:"verifyRequestSeller (middleware)"
            })
        }
        const validReq = await db.RequestSeller.findById(req_id)
        if(validReq){
            if(validReq.status != "Accepted")
            {
                req.request = validReq
                next()
            }
            else
            {
                return res.status(400).json({
                    ERR_CODE:"UNABLE EDIT REQUEST",
                    message:"Request with ID: "+ req.body.req_id +" is already accepted by Distributor and can't be edited!",
                    path:"verifyRequestSeller (middlware)"
                })
            }
        }else{
            return res.status(400).json({
                ERR_CODE:"INVALID REQ_ID",
                message:"Request with ID: "+ req.body.req_id +" is either deleted or cannot be found!",
                path:"verifyRequestSeller (middlware)"
            })
        }
    }
}

module.exports = verifyRequestSeller