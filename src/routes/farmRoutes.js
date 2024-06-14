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
    } = require('../controllers/farmController');
const middleware = require('../middlewares');
const router = express.Router()

router.get("/test",[middleware.verifyToken,middleware.verifyUser,middleware.verifyRole("Farmer")],test)
router.get("/",[middleware.verifyToken,middleware.verifyUser,middleware.verifyRole("Farmer")],fetchFarm)
router.post("/create",[middleware.verifyToken,middleware.verifyUser,middleware.verifyRole("Farmer")],createFarm)
router.put('/update',[middleware.verifyToken,middleware.verifyUser,middleware.verifyRole("Farmer"),middleware.verifyFarm()],updateFarm)
router.delete("/delete",[middleware.verifyToken,middleware.verifyUser,middleware.verifyRole("Farmer"),middleware.verifyFarm()],deleteFarm)
router.post("/restore",[middleware.verifyToken,middleware.verifyUser,middleware.verifyRole("Farmer"),middleware.verifyFarm("all")],restoreFarm)
router.patch("/set",[middleware.verifyToken,middleware.verifyUser,middleware.verifyRole("Farmer"),middleware.verifyFarm("all"),middleware.verifyBarn("all")],setBarn)
router.patch("/unset",[middleware.verifyToken,middleware.verifyUser,middleware.verifyRole("Farmer"),middleware.verifyFarm("all"),middleware.verifyBarn("all")],unsetBarn)

router.post('/tile/create',[middleware.verifyToken,middleware.verifyUser,middleware.verifyRole("Farmer"),middleware.verifyFarm(),middleware.verifyCrop()],createTile)
router.get('/tile',[middleware.verifyToken,middleware.verifyUser,middleware.verifyRole("Farmer"),middleware.verifyFarm(),middleware.verifyCrop(),middleware.verifyTile("")],fetchTile)
router.put('/tile/update',[middleware.verifyToken,middleware.verifyUser,middleware.verifyRole("Farmer"),middleware.verifyFarm(),middleware.verifyCrop(),middleware.verifyTile("")],updateTile)
router.delete('/tile/delete',[middleware.verifyToken,middleware.verifyUser,middleware.verifyRole("Farmer"),middleware.verifyFarm(),middleware.verifyCrop(),middleware.verifyTile("")],deleteTile)
router.post('/tile/restore',[middleware.verifyToken,middleware.verifyUser,middleware.verifyRole("Farmer"),middleware.verifyFarm(),middleware.verifyCrop(),middleware.verifyTile("all")],restoreTile)


module.exports = router
