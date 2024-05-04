const schema = require("../utils/validation")

const createBarn = async (req,res) =>{
    try{
        await schema.createBarnSchema.validateAsync(req.body,{
            abortEarly:false
        })
        return res.status(200).json(req.body)
    }catch(error){
        return res.status(400).json({
            ERR_CODE:"ERROR CREATING BARN",
            message:error.toString(),
            path:"createBarn (controller)"
        })
    }
}

module.exports = {
    createBarn
}