//fetch all products
const fetchProducts = (req, res) => {
  res.send("Fetching all products");
};

//add new product
const addNewProduct = (req, res) => {
  res.send("Adding a new product");
};

//get product by id
const getProductById = (req, res) => {
  res.send(`Fetching product with ID: ${req.params.id}`);
};

module.exports = {
  fetchProducts,
  addNewProduct,
  getProductById,
};
