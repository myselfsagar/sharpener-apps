const User = require("../models/User");

const signupController = async (req, res) => {
  const { name, email, password } = req.body;

  //check if all fields are entered
  if (!name || !email || !password) {
    return res.status(400).json({ Error: "All fields are mandatory" });
  }

  try {
    //check if the user already signedup
    const user = await User.findOne({ where: { email } });
    if (user) {
      return res.status(409).json({ Error: "User already exists" });
    }

    //create the new user and send it
    const newUser = await User.create({ name, email, password });

    res.status(200).json({ Message: "Signup successful" });
  } catch (err) {
    console.log("Error creating user", err);
    return res.status(500).json({ Error: `Internal error - ${err.message}` });
  }
};

const loginController = async (req, res) => {
  const { email, password } = req.body;

  //check if sending all fields
  if (!email || !password) {
    return res.status(400).json({ Error: "All fields are mandatory" });
  }

  try {
    //check if the user exist if not through 404 error
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ Error: "User not found" });
    }

    //check entered password with the actual password
    if (password !== user.password) {
      return res.status(401).json({ Error: "Incorrect password" });
    }

    res.status(200).json({ Message: "User login successful" });
  } catch (err) {
    console.log("Error while login", err);
    return res.status(500).json({ Error: `Internal error - ${err.message}` });
  }
};

module.exports = {
  signupController,
  loginController,
};
