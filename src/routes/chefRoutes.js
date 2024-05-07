const express = require("express");
const {
    create,
    update,
    deleteFnB,
    get,
} = require("../controllers/chefController");
const router = express.Router();

router.post("/", create);
router.put("/", update);
router.delete("/", deleteFnB);
router.get("/", get);

module.exports = router;
