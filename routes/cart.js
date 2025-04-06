const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cartController");

//get cart of specific user
router.get("/:userId", cartController.getCartForUser);

//add product to cart
router.post("/:userId", cartController.addProductToCart);

module.exports = router;
