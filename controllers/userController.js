//get all users
const getAllUsers = (req, res) => {
  res.send("Fetching all products");
};

//add new user
const addUser = (req, res) => {
  res.send("Adding a new product");
};

//get user by id
const getUserById = (req, res) => {
  res.send(`Fetching product with ID: ${req.params.id}`);
};

module.exports = {
  getAllUsers,
  addUser,
  getUserById,
};
