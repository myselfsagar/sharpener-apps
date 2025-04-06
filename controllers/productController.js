const path = require("path");

//get all products
const getAllProducts = (req, res) => {
  // res.send("Fetching all products");
  res.sendFile(path.join(__dirname, "..", "view", "product.html"));
};

//add new product
const addProduct = (req, res) => {
  res.send("Adding a new product");
};

//get product by id
const getProductById = (req, res) => {
  res.send(`Fetching product with ID: ${req.params.id}`);
};

module.exports = {
  getAllProducts,
  addProduct,
  getProductById,
};
