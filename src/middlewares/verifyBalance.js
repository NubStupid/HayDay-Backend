const getUSDFormat = require("../utils/functions/getUSDFormat")

const verifyBalance = (cost) =>{
    return (req,res,next) =>{
        const multiplier = (req.query.ammount?req.query.ammount:1)
        if(req.user.balance < cost * parseInt(multiplier)){
            return res.status(400).json({
                ERR_CODE:"INSUFFICIENT BALANCE!",
                message:"User's balance cannot afford this request's cost ("+getUSDFormat(cost * parseInt(multiplier))+")",
                user_balance: getUSDFormat(req.user.balance),
                path: "verifyBalance (middleware)"
            })
        }else{
            next()
        }
    }
}
module.exports = verifyBalance