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

    res.status(200).json(newUser);
  } catch (err) {
    console.log("Error creating user", err);
    return res
      .status(500)
      .json({ Error: `Error creating user - ${err.message}` });
  }
};

module.exports = {
  signupController,
};
