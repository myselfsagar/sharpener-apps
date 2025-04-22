const express = require("express");
const app = express();
const dotenv = require("dotenv");
dotenv.config({ path: "./.env" });
const cors = require("cors");

//connect to db
const dbConnection = require("./utils/db-connection");

//all models
const User = require("./models/User");

//import all routes
const authRoutes = require("./routes/authRoutes");

//middlewares
app.use(express.json());
app.use(cors({ origin: "http://127.0.0.1:5500" }));

//use all routes
app.use("/user", authRoutes);

(async () => {
  try {
    await dbConnection.sync({ alter: true });
    console.log("All models were synchronized successfully.");
    const PORT = process.env.PORT;
    app.listen(PORT, () => {
      console.log(`Listening from the server http://localhost:${PORT}`);
    });
  } catch (err) {
    console.log(err);
  }
})();
