const middleware = {}

middleware.verifyUser = require("./verifyUser")
middleware.verifyToken = require("./verifyToken")
middleware.verifyRole = require("./verifyRole")
middleware.verifyPostCode = require("./verifyPostCode")
middleware.verifyFarm = require("./verifyFarm")

module.exports = middleware