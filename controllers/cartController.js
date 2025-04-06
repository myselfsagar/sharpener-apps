//get cart of specific user
const getCartForUser = (req, res) => {
  res.send(`Fetching cart for user with ID: ${req.params.userId}`);
};

//add product to cart
const addProductToCart = (req, res) => {
  res.send(`Adding product to cart for user with ID: ${req.params.userId}`);
};

module.exports = {
  getCartForUser,
  addProductToCart,
};
