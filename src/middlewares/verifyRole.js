const verifyRole = (...allowedRoles) =>{
    return (req,res,next) => {
        let roles = req.roles
        let proceed = false;
        if(roles != null){
            roles = (roles.toString().includes(",")? roles.split(","):roles)
            if(Array.isArray(roles)){
                for (const role of roles) {
                    if(allowedRoles.includes(role)){
                        proceed = true
                    }
                }
            }else{
                if(allowedRoles.includes(roles)){
                    proceed = true
                }
            }
        }
        if(proceed == false){
            return res.status(400).json({
                ERR_CODE:"FORDIBBED ROLE ACCESS",
                message:"User's role cannot access this request",
                user_role:req.roles,
                path:"verifyRole (middleware)"
            })
        }else{
            next()
        }
    }
    
}

module.exports = verifyRole