const express = require("express");
const { buy, update, deleteSellerItem, getItem, getItems } = require("../controllers/sellerController");
const middleware = require("../middlewares");
const router = express.Router();

router.post("/item", [middleware.verifyToken, middleware.verifyUser,middleware.verifyRole("Seller")], buy);
router.put("/item", [middleware.verifyToken, middleware.verifyUser,middleware.verifyRole("Seller"), middleware.verifySellerItem()], update);
router.delete("/item", [middleware.verifySellerItem()], deleteSellerItem);
// router.get("/item/:item_id", [middleware.verifySellerItem()], getItem);
// router.get("/item", getItems);

// router.delete("/item", [middleware.verifyToken, middleware.verifyUser,middleware.verifyRole("Seller"), middleware.verifySellerItem()], deleteSellerItem);
router.get("/item/:item_id", [middleware.verifyToken, middleware.verifyUser,middleware.verifyRole("Seller"), middleware.verifySellerItem()], getItem);
router.get("/item", [middleware.verifyToken, middleware.verifyUser,middleware.verifyRole("Seller")], getItems);

module.exports = router;
