//get all products
const getAllProducts = (req, res) => {
  res.send("Fetching all products");
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
