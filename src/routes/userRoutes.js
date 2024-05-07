const express = require('express');
const middleware = require('../middlewares');
const { register, login } = require('../controllers/userController');
const app = express.Router()

app.post('/register', register)

app.post('/login', login)
module.exports = app