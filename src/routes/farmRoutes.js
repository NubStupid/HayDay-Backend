const express = require('express');
const {
     test,
     createFarm,
    } = require('../controllers/farmController');
const middleware = require('../middlewares');
const router = express.Router()

router.get("/test",[middleware.verifyToken,middleware.verifyUser,middleware.verifyRole("Farmer")],test)
router.post("/create",[middleware.verifyToken,middleware.verifyUser,middleware.verifyRole("Farmer")],createFarm)
module.exports = router
