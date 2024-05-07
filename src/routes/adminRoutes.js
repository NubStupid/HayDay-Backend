const express = require('express');
const middleware = require('../middlewares');
const { createCrops } = require('../controllers/adminController');
const router = express.Router()

router.post("/crop/create", [middleware.verifyToken, middleware.verifyUser, middleware.verifyRole("Admin")], createCrops)

module.exports = router