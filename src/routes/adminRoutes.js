const express = require('express');
const middleware = require('../middlewares');
const { createCrops, getUsers, setRole } = require('../controllers/adminController');

const app = express.Router()

app.post("/crop/create", [middleware.verifyToken, middleware.verifyAdmin], createCrops)

app.get('/users', getUsers)

app.put('/users/role', [middleware.verifyToken, middleware.verifyAdmin], setRole)

module.exports = app