const express = require("express");
const adminController = require("../controllers/adminController");

const router = express.Router();


router.get("/get-all-orders", adminController.getAllOrders);

router.post("/update-status", adminController.updateOrderStatus);

module.exports = router;
