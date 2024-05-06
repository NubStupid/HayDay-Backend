const express = require("express");
const { create, update, del, get } = require("../controllers/chefController");
const router = express.Router();

router.post("/", create);
router.put("/", update);
router.delete("/", del);
router.get("/", get);

module.exports = router;
