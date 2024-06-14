const JWT_KEY = "HAYDAY";
const { Users } = require("../models");
const jwt = require("jsonwebtoken");

const verifyAdmin = async (req, res, next) => {
    // TO DO: Ganti pakai validasi menggunakan model
    const token = req.header("x-auth-token");
    let userdata;
    try {
        userdata = jwt.verify(token, JWT_KEY);
    } catch (err) {
        return res.status(400).json({
            ERR_CODE: "INVALID_USER",
            message: "Test token invalid",
            path: "verifyAdmin (Middleware)",
        });
    }
    let user = await Users.findOne({
        where: {
            username: userdata.username,
        },
    });
    if (user.role == "Admin"){
        req.role = "Admin";
        req.user = {
            user_id: user.user_id,
            username: user.username,
            balance: parseInt(user.balance),
        };
        next();
    }
    else {
        return res.status(403).json({
            ERR_CODE: "FORBIDDEN",
            message: "You are not an administrator"
        })
    }
};

module.exports = verifyAdmin;
