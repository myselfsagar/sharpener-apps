const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");

//connect to db
const dbConnection = require("./utils/db-connection");

//models
const Expense = require("./models/Expense");

//import all routes
const expenseRoutes = require("./routes/expenseRoutes");

//use middlewares
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

//use all routes
app.use("/expenses", expenseRoutes);

dbConnection
  .sync({ alter: true })
  .then(() => {
    //start the server
    const PORT = 4000;
    app.listen(PORT, () => {
      console.log("Server running on PORT", PORT);
    });
  })
  .catch((err) => {
    console.log(err);
  });
