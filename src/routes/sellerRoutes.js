const express = require("express");
const { buy, update, del, get } = require("../controllers/sellerController");
const router = express.Router();

router.post("/", buy);
router.put("/", update);
router.delete("/", del);
router.get("/", get);

module.exports = router;
