const { Users } = require("../models");
const resetTimes = {};

const verifyAPI = async (req, res, next) => {
    const username = req.user.username;
    let user = await Users.findOne({
        where: {
            username: username,
        },
    });

    if (!resetTimes[username] || Date.now() > resetTimes[username]) {
        await Users.update(
            { api_hit: 5 },
            { where: { username: username } }
        );
        resetTimes[username] = Date.now() + 60000; 
    }

    user = await Users.findOne({
        where: {
            username: username,
        },
    });

    if (user.role.toLowerCase() == "admin") next();
    else {
        if (user.type.toLowerCase() == "premium") next();
        else {
            if (user.api_hit > 0) {
                let decAPI = parseInt(user.api_hit) - 1;
                await Users.update(
                    { api_hit: decAPI },
                    { where: { username: username } }
                );
                next();
            } else {
                return res.status(400).json({
                    ERR_CODE: "API_HIT",
                    message: "Insufficient API Hit",
                    path: "verifyAPI (Middleware)",
                });
            }
        }
    }
};

module.exports = verifyAPI;
