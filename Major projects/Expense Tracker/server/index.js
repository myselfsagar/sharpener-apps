const express = require("express");
const app = express();
const dotenv = require("dotenv");
dotenv.config({ path: "./.env" });
const cors = require("cors");

//connect to db
const dbConnection = require("./utils/db-connection");

//all models
const User = require("./models/User");
const Expense = require("./models/Expense");

//association
User.hasMany(Expense);
Expense.belongsTo(User);

//import all routes
const authRoutes = require("./routes/authRoutes");
const expenseRoutes = require("./routes/expenseRoutes");

//middlewares
app.use(express.json());
app.use(cors({ origin: "http://127.0.0.1:5500" }));

//use all routes
app.use("/user", authRoutes);
app.use("/expense", expenseRoutes);

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
