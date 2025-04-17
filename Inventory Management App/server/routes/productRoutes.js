const router = require("express").Router();
const productControllers = require("../controllers/productControllers");

router.post("/add-product", productControllers.addProduct);
router.get("/get-all-products", productControllers.getAllProducts);
router.delete("/remove-product/:id", productControllers.removeProduct);
router.put("/update-product/:id", productControllers.updateProduct);

module.exports = router;
