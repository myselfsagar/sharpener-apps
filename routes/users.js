const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

//get all users
router.get("/", userController.getAllUsers);

//add new user
router.post("/", userController.addUser);

//get user by id
router.get("/:id", userController.getUserById);

module.exports = router;
