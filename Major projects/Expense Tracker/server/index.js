const express = require("express");
const app = express();
const dotenv = require("dotenv");
dotenv.config({ path: "./config/.env" });
const cors = require("cors");

//connect to db
const dbConnection = require("./config/dbConfig");

//all models
const User = require("./models/User");
const Expense = require("./models/Expense");
const Payment = require("./models/Payment");

//association
User.hasMany(Expense);
Expense.belongsTo(User);

Payment.belongsTo(User, { foreignKey: "userId" });
User.hasMany(Payment, { foreignKey: "userId", onDelete: "CASCADE" });

//import all routes
const authRoutes = require("./routes/authRoutes");
const expenseRoutes = require("./routes/expenseRoutes");
const paymentRoutes = require("./routes/paymentRoutes");

//middlewares
app.use(express.json());
app.use(cors({ origin: "http://127.0.0.1:5500" }));

//use all routes
app.use("/user", authRoutes);
app.use("/expense", expenseRoutes);
app.use("/payment", paymentRoutes);

(async () => {
  try {
    await dbConnection.sync({ force: false });
    console.log("All models were synchronized successfully.");
    const PORT = process.env.PORT;
    app.listen(PORT, () => {
      console.log(`Listening from the server http://localhost:${PORT}`);
    });
  } catch (err) {
    console.log(err);
  }
})();
