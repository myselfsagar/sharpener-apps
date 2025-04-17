const express = require("express");
const app = express();
const cors = require("cors");

//connect to db
const dbConnection = require("./utils/db-connection");

//models
const Product = require("./models/Product");

//import all routes
const productRoutes = require("./routes/productRoutes");

//use middlewares
app.use(express.json());
app.use(cors({ origin: "http://127.0.0.1:5500" }));

//use all routes
app.use("/products", productRoutes);

(async () => {
  try {
    dbConnection.sync({ alter: true });
    //start the server
    const PORT = 4000;
    app.listen(PORT, () => {
      console.log("Server running on PORT", PORT);
    });
  } catch (err) {
    console.log("Error connecting server", err);
  }
})();
