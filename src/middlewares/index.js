const middleware = {}

middleware.verifyUser = require("./verifyUser")
middleware.verifyToken = require("./verifyToken")
middleware.verifyRole = require("./verifyRole")
middleware.verifyPostCode = require("./verifyPostCode")
middleware.verifyFarm = require("./verifyFarm")
middleware.verifyBarn = require("./verifyBarn")
middleware.verifyBalance = require("./verifyBalance")
middleware.verifyCrop = require("./verifyCrop")
middleware.verifyFnB = require("./verifyFnB")
middleware.verifySellerItem = require("./verifySellerItem")
middleware.verifyRequestSeller = require("./verifyRequestSeller")

module.exports = middleware