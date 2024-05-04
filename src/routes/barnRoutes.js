const express = require('express');
const middleware = require('../middlewares');
const { createBarn } = require('../controllers/barnController');
const router = express.Router()


router.post("/create",[middleware.verifyToken,middleware.verifyUser,middleware.verifyRole("Farmer"),middleware.verifyPostCode],createBarn)


module.exports = router
