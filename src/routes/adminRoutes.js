const express = require('express');
const middleware = require('../middlewares');
const { createCrops, updateCrops, deleteCrops, restoreCrops, fetchCrops, getUsers, setRole } = require('../controllers/adminController');
const router = express.Router()

router.post("/crop/create",[middleware.verifyToken,middleware.verifyUser,middleware.verifyRole("Admin")],createCrops)
router.put("/crop/update",[middleware.verifyToken,middleware.verifyUser,middleware.verifyRole("Admin"),middleware.verifyCrop()],updateCrops)
router.delete("/crop/delete",[middleware.verifyToken,middleware.verifyUser,middleware.verifyRole("Admin"),middleware.verifyCrop()],deleteCrops)
router.post("/crop/restore",[middleware.verifyToken,middleware.verifyUser,middleware.verifyRole("Admin"),middleware.verifyCrop("all")],restoreCrops)
router.get("/crop/",[middleware.verifyToken,middleware.verifyUser,middleware.verifyRole("Admin")],fetchCrops)

router.get('/users', getUsers)

router.put('/users/role', [middleware.verifyToken, middleware.verifyAdmin], setRole)

module.exports = router
