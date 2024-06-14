const express = require("express");
const { buyItem, getRequest, editRequest, updateItem, deleteSellerItem, getItem, getItems } = require("../controllers/sellerController");
const middleware = require("../middlewares");
const router = express.Router();

// nanti ada pengecekan dist id bener ga trs item yg dipesen ada ga
router.post("/item/buy", [middleware.verifyToken, middleware.verifyUser, middleware.verifyRole("Seller")], buyItem);
router.get("/item/buy", [middleware.verifyToken, middleware.verifyUser, middleware.verifyRole("Seller")], getRequest);
router.put("/item/buy", [middleware.verifyToken, middleware.verifyUser, middleware.verifyRole("Seller"), middleware.verifyRequestSeller()], editRequest);
router.put("/item", [middleware.verifyToken, middleware.verifyUser,middleware.verifyRole("Seller"), middleware.verifySellerItem()], updateItem);
router.delete("/item", [middleware.verifySellerItem()], deleteSellerItem);
// router.get("/item/:item_id", [middleware.verifySellerItem()], getItem);
// router.get("/item", getItems);

// router.delete("/item", [middleware.verifyToken, middleware.verifyUser,middleware.verifyRole("Seller"), middleware.verifySellerItem()], deleteSellerItem);
router.get("/item/:item_id", [middleware.verifyToken, middleware.verifyUser,middleware.verifyRole("Seller"), middleware.verifySellerItem()], getItem);
router.get("/item", [middleware.verifyToken, middleware.verifyUser,middleware.verifyRole("Seller")], getItems);

module.exports = router;
