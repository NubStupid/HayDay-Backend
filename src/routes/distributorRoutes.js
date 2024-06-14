const express = require('express');
const middleware = require('../middlewares');
const { getListItem } = require('../controllers/distributorController');
const router = express.Router();

router.get("/item",[middleware.verifyToken,middleware.verifyUser,middleware.verifyRole("Distributor")],getListItem)

module.exports = router;