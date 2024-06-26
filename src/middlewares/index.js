const middleware = {}

middleware.verifyUser = require("./verifyUser")
middleware.verifyToken = require("./verifyToken")
middleware.verifyRole = require("./verifyRole")
middleware.verifyPostCode = require("./verifyPostCode")
middleware.verifyFarm = require("./verifyFarm")
middleware.verifyBarn = require("./verifyBarn")
middleware.verifyBalance = require("./verifyBalance")
middleware.verifyAdmin = require("./verifyAdmin")
middleware.verifyCity = require("./verifyCity")
middleware.verifyCrop = require("./verifyCrop")
middleware.verifyFnB = require("./verifyFnB")
middleware.verifySellerItem = require("./verifySellerItem")
middleware.verifyRequestSeller = require("./verifyRequestSeller")
middleware.verifyTile = require('./verifyTile')
middleware.verifyAPI = require("./verifyAPI")

module.exports = middleware