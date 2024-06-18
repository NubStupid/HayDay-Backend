const express = require('express');
const middleware = require('../middlewares');
const { createBarn, updateBarn, deleteBarn, restoreBarn, upgradeStorage } = require('../controllers/barnController');
const router = express.Router()


router.post("/create",[middleware.verifyToken,middleware.verifyUser, middleware.verifyAPI,middleware.verifyRole("Farmer"),middleware.verifyPostCode],createBarn)
router.put("/update",[middleware.verifyToken,middleware.verifyUser, middleware.verifyAPI,middleware.verifyRole("Farmer"),middleware.verifyBarn(),middleware.verifyPostCode],updateBarn)
router.delete("/delete",[middleware.verifyToken,middleware.verifyUser, middleware.verifyAPI,middleware.verifyRole("Farmer"),middleware.verifyBarn()],deleteBarn)
router.post("/restore",[middleware.verifyToken,middleware.verifyUser, middleware.verifyAPI,middleware.verifyRole("Farmer"),middleware.verifyBarn("all")],restoreBarn)
router.post("/upgrade",[middleware.verifyToken,middleware.verifyUser, middleware.verifyAPI,middleware.verifyRole("Farmer"),middleware.verifyBarn(),middleware.verifyBalance(5)],upgradeStorage)

module.exports = router