const express = require('express');
const {
     test,
     createFarm,
     updateFarm,
     fetchFarm,
     deleteFarm,
     restoreFarm,
    } = require('../controllers/farmController');
const middleware = require('../middlewares');
const router = express.Router()

router.get("/test",[middleware.verifyToken,middleware.verifyUser,middleware.verifyRole("Farmer")],test)
router.get("/",[middleware.verifyToken,middleware.verifyUser,middleware.verifyRole("Farmer")],fetchFarm)
router.post("/create",[middleware.verifyToken,middleware.verifyUser,middleware.verifyRole("Farmer")],createFarm)
router.put('/update',[middleware.verifyToken,middleware.verifyUser,middleware.verifyRole("Farmer"),middleware.verifyFarm()],updateFarm)
router.delete("/delete",[middleware.verifyToken,middleware.verifyUser,middleware.verifyRole("Farmer"),middleware.verifyFarm()],deleteFarm)
router.post("/restore",[middleware.verifyToken,middleware.verifyUser,middleware.verifyRole("Farmer"),middleware.verifyFarm("all")],restoreFarm)

module.exports = router
