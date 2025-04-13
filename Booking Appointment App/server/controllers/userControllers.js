const User = require("../models/User");

const addUser = async (req, res) => {
  try {
    const { username, email, phone } = req.body;
    if (!username || !email || !phone) {
      return res
        .status(400)
        .json({ Error: "Username, email and phone are mandatory" });
    }
    const user = await User.create({
      username: username,
      email: email,
      phone: phone,
    });
    res.status(201).json({ newUser: user });
  } catch (err) {
    console.log("Error creating user", err);
    return res
      .status(500)
      .json({ Error: `Error creating user ${err.message}` });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const allUsers = await User.findAll();
    res.json({ allUsers: allUsers });
  } catch (err) {
    console.log("Error fetching users", err);
    return res
      .status(500)
      .json({ Error: `Error fetching users ${err.message}` });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.destroy({
      where: {
        id: id,
      },
    });

    if (user === 0) {
      return res.status(404).json({ Error: "User not found!" });
    }

    res.json(user);
  } catch (err) {
    console.log("Error while deleting", err);
    return res
      .status(500)
      .json({ Error: `Error while deleting user: ${err.message}` });
  }
};

module.exports = {
  addUser,
  getAllUsers,
  deleteUser,
};
