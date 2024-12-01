const express = require("express");
const perfumeController = require("../controllers/perfumeController");

const router = express.Router();

router.get("/", perfumeController.getPerfumes);

router.get("/:id", perfumeController.getPerfume);

router.post("/add-to-cart", perfumeController.addToCart);

router.post("/cart", perfumeController.getCart);

router.put("/update-cart",perfumeController.updateCart);

router.delete("/remove-from-cart",perfumeController.removeItemFromCart)

module.exports = router;
