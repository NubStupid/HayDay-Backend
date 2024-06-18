require("dotenv").config();
const JWT_KEY = process.env.ACCESS_TOKEN_SECRET;
const { Users } = require("../models");
const jwt = require("jsonwebtoken");

const verifyUser = async (req, res, next) => {
    // TO DO: Ganti pakai validasi menggunakan model
    const token = req.header("x-auth-token");
    let userdata;
    try {
        userdata = jwt.verify(token, JWT_KEY);
    } catch (err) {
        return res.status(400).json({
            ERR_CODE: "INVALID_USER",
            message: "Test token invalid",
            path: "verifyUser (Middleware)",
        });
    }
    let user = await Users.findOne({
        where: {
            username: userdata.username,
        },
    });
    if (user.role == "Distributor") req.roles = "Distributor";
    else if (user.role == "Farmer") req.roles = "Farmer";
    else if (user.role == "Chef") req.roles = "Chef";
    else if (user.role == "Seller") req.roles = "Seller";
    else if (user.role == "Admin") req.roles = "Admin";
    else if(user.role == null) req.roles = 'None';
    else req.roles = user.role
    req.user = {
        user_id: user.user_id,
        username: user.username,
        balance: parseInt(user.balance),
    };
    next();
};

module.exports = verifyUser;