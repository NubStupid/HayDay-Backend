const express = require('express');
const middleware = require('../middlewares');
const { getListItem,finishRequestFarmer, finishRequestSeller, getAllRequestFarmer, getAllRequestSeller, deleteItem, updateItem, makeRequestFarmer } = require('../controllers/distributorController');
const router = express.Router();

router.get("/items",[middleware.verifyToken,middleware.verifyUser,middleware.verifyRole("Distributor")],getListItem)
router.get("/requestseller",[middleware.verifyToken,middleware.verifyUser,middleware.verifyRole("Distributor")],getAllRequestSeller)
router.post("/makerequest",[middleware.verifyToken,middleware.verifyUser,middleware.verifyRole("Distributor")],makeRequestFarmer)
router.post("/finishseller",[middleware.verifyToken,middleware.verifyUser,middleware.verifyRole("Distributor")],finishRequestSeller)
router.put("/items",[middleware.verifyToken,middleware.verifyUser,middleware.verifyRole("Distributor")],updateItem)
router.delete("/items",[middleware.verifyToken,middleware.verifyUser,middleware.verifyRole("Distributor")],deleteItem)

module.exports = router;