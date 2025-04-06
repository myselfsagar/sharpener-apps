const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");

//get all products
router.get("/", productController.getAllProducts);

//add new product
router.post("/", productController.addProduct);

//get product by Id
router.get("/:id", productController.getProductById);

module.exports = router;
