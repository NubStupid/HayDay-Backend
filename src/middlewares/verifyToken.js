const verifyToken = (req,res,next) =>{
    const token = req.header('x-auth-token')
    if(!token){
        return res.status(403).json({
            ERR_CODE:"MISSING TOKEN",
            message:"Request forbidden!",
            path:"verifyToken (middleware)"
        })
    }else{
        next()  
    }
}
module.exports = verifyToken