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

router.post("/menu", createMenu);
router.put("/menu", [middleware.verifyFnB()], updateMenu);
router.delete("/menu", [middleware.verifyFnB()], deleteMenu);
router.get("/menu/:fnb_id", [middleware.verifyFnB()], getMenu);
router.get("/menu", getMenus);
// router.post("/", [middleware.verifyToken,middleware.verifyUser,middleware.verifyRole("Chef")], createMenu);
// router.put("/", [middleware.verifyToken,middleware.verifyUser,middleware.verifyRole("Chef"), middleware.verifyFnB()], updateMenu);
// router.delete("/", [middleware.verifyToken,middleware.verifyUser,middleware.verifyRole("Chef"), middleware.verifyFnB()], deleteMenu);
// router.get("/", [middleware.verifyToken,middleware.verifyUser,middleware.verifyRole("Chef")], getMenu);

module.exports = router;
