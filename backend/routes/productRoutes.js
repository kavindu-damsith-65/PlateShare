const express = require("express");
const {showNearByProducts} = require("../controllers/productController");

const router = express.Router();
router.get("/:location", showNearByProducts);

module.exports = router;
