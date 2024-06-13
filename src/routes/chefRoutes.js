const express = require("express");
const middleware = require('../middlewares');
const {
    createMenu,
    updateMenu,
    deleteMenu,
    getMenu,
    getMenus,
} = require("../controllers/chefController");
const router = express.Router();

router.post("/menu", [middleware.verifyToken, middleware.verifyUser,middleware.verifyRole("Chef")], createMenu);
router.put("/menu", [middleware.verifyToken, middleware.verifyUser,middleware.verifyRole("Chef"), middleware.verifyFnB()], updateMenu);
router.delete("/menu", [middleware.verifyToken, middleware.verifyUser,middleware.verifyRole("Chef"), middleware.verifyFnB()], deleteMenu);
router.get("/menu/:fnb_id", [middleware.verifyToken, middleware.verifyUser,middleware.verifyRole("Chef"), middleware.verifyFnB()], getMenu);
router.get("/menu", getMenus);

module.exports = router;
