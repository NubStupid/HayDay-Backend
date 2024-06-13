const JWT_KEY = "HAYDAY";
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
    if (user.role == "Distributor") req.role = "Distributor";
    else if (user.role == "Farmer") req.role = "Farmer";
    else if (user.role == "Chef") req.role = "Chef";
    else if (user.role == "Seller") req.role = "Seller";
    else req.roles = null;
    req.user = {
        user_id: user.user_id,
        username: user.username,
        balance: parseInt(user.balance),
    };
    next();
};

module.exports = verifyUser;
