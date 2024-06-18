const express = require('express');
const {
     test,
     createFarm,
     updateFarm,
     fetchFarm,
     deleteFarm,
     restoreFarm,
     setBarn,
     unsetBarn,
     createTile,
     updateTile,
     restoreTile,
     deleteTile,
     fetchTile,
     plantCrops,
     farmAllTiles,
     farmTile,
     removeFarmCrops,
    } = require('../controllers/farmController');
const { finishRequestFarmer, getAllRequestFarmer } = require('../controllers/distributorController');
const middleware = require('../middlewares');
const verifyFarmOwner = require('../middlewares/verifyFarmOwner');
const router = express.Router()

router.get("/test",[middleware.verifyToken,middleware.verifyUser,middleware.verifyAPI,middleware.verifyRole("Farmer")],test)
router.get("/",[middleware.verifyToken,middleware.verifyUser, middleware.verifyAPI,middleware.verifyRole("Farmer")],fetchFarm)
router.post("/create",[middleware.verifyToken,middleware.verifyUser,middleware.verifyAPI,middleware.verifyRole("Farmer")],createFarm)
router.put('/update',[middleware.verifyToken,middleware.verifyUser, middleware.verifyAPI,middleware.verifyRole("Farmer"),middleware.verifyFarm()],updateFarm)
router.delete("/delete",[middleware.verifyToken,middleware.verifyUser, middleware.verifyAPI,middleware.verifyRole("Farmer"),middleware.verifyFarm()],deleteFarm)
router.post("/restore",[middleware.verifyToken,middleware.verifyUser, middleware.verifyAPI,middleware.verifyRole("Farmer"),middleware.verifyFarm("all")],restoreFarm)
router.patch("/set",[middleware.verifyToken,middleware.verifyUser, middleware.verifyAPI,middleware.verifyRole("Farmer"),middleware.verifyFarm("all"),middleware.verifyBarn("all")],setBarn)
router.patch("/unset",[middleware.verifyToken,middleware.verifyUser, middleware.verifyAPI,middleware.verifyRole("Farmer"),middleware.verifyFarm("all"),middleware.verifyBarn("all")],unsetBarn)

router.post('/tile/create',[middleware.verifyToken,middleware.verifyUser, middleware.verifyAPI,middleware.verifyRole("Farmer"),middleware.verifyFarm()],createTile)
router.patch('/tile/plant',[middleware.verifyToken,middleware.verifyUser,middleware.verifyRole("Farmer"),middleware.verifyFarm(),middleware.verifyTile(),middleware.verifyCrop()],plantCrops)

router.patch('/tile/harvest',[middleware.verifyToken,middleware.verifyUser,middleware.verifyRole("Farmer"),middleware.verifyFarm()],farmTile)
router.patch('/tile/harvest/all',[middleware.verifyToken,middleware.verifyUser,middleware.verifyRole("Farmer"),middleware.verifyFarm()],farmAllTiles)
router.get('/tile',[middleware.verifyToken,middleware.verifyUser,middleware.verifyRole("Farmer"),middleware.verifyFarm(),middleware.verifyTile("")],fetchTile)
router.put('/tile/update',[middleware.verifyToken,middleware.verifyUser,middleware.verifyRole("Farmer"),middleware.verifyFarm(),middleware.verifyTile("")],updateTile)
router.delete('/tile/delete',[middleware.verifyToken,middleware.verifyUser,middleware.verifyRole("Farmer"),middleware.verifyFarm(),middleware.verifyTile("")],deleteTile)
router.post('/tile/restore',[middleware.verifyToken,middleware.verifyUser,middleware.verifyRole("Farmer"),middleware.verifyFarm(),middleware.verifyTile("all")],restoreTile)

router.post("/finishfarmer",[middleware.verifyToken,middleware.verifyUser,middleware.verifyRole("Farmer")],finishRequestFarmer)
router.get("/requestfarmer",[middleware.verifyToken,middleware.verifyUser,middleware.verifyRole("Farmer")],getAllRequestFarmer)

module.exports = router
