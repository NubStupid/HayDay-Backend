const verifyUser = (req,res,next) => {
    // TO DO: Ganti pakai validasi menggunakan model
    const token  = req.header('x-auth-token')
    if(token == "TESTFARMERUSER000001"){
        req.roles = "Farmer"
        req.user = {
            user_id: "USER202404051800001",
            username: "TESTFARM",
            balance: 1500
        }
        next()
    }else if(token == "TESTADMIN"){
        req.roles = "Admin"
        req.user = {
            user_id: "USER202404051800002",
            username: "ADMINTEST",
            balance: 1500
        }
        next()
    }
    else{
        return res.status(400).json({
            ERR_CODE:"INVALID_USER",
            message:"Test token invalid",
            path:"verifyUser (Middleware)"
        })
    }
}

module.exports = verifyUser