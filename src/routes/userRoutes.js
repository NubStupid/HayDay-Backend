const express = require('express');
const middleware = require('../middlewares');
const { register, login, topup, role } = require('../controllers/userController');
const app = express.Router()

app.post('/register', register)
app.post('/login', login)
app.put('/topup', [middleware.verifyToken, middleware.verifyUser], topup)
app.put('/role', [middleware.verifyToken, middleware.verifyUser], role)


module.exports = app