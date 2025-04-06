const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");

//fetch all products
router.get("/", productController.fetchProducts);

//add new product
router.post("/", productController.addNewProduct);

//get product by Id
router.get("/:id", productController.getProductById);

module.exports = router;
