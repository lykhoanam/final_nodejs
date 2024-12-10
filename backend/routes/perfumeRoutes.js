const express = require("express");
const perfumeController = require("../controllers/perfumeController");

const router = express.Router();

router.get("/", perfumeController.getPerfumes);

router.get("/:id", perfumeController.getPerfume);

router.put("/:id", perfumeController.addComment);

router.post("/add-to-cart", perfumeController.addToCart);

router.post("/cart", perfumeController.getCart);

router.put("/update-cart",perfumeController.updateCart);

router.delete("/remove-from-cart",perfumeController.removeItemFromCart)

router.post("/orders",perfumeController.order)

router.post("/getOrders",perfumeController.getOrder)

router.post("/add-product", perfumeController.addProduct)

router.delete('/delete-product', perfumeController.deleteProduct);

router.put("/update-product", perfumeController.updateProduct);



module.exports = router;
