const express = require("express");
const app = express();
const fs = require("fs");
const path = require("path");
const dotenv = require("dotenv");
dotenv.config({ path: "./config/.env" });
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
const morgan = require("morgan");

//connect to db
const dbConnection = require("./config/dbConfig");

//models
require("./models");

//import all routes
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const resetPasswordRoutes = require("./routes/resetPasswordRoutes");
const expenseRoutes = require("./routes/expenseRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const premiumRoutes = require("./routes/premiumRoutes");

//write the log into file
const accessLogStream = fs.createWriteStream(
  path.join(__dirname, "access.log"),
  { flags: "a" }
);

//middlewares
app.use(express.json());
// app.use(helmet());
app.use(compression());
app.use(morgan("combined", { stream: accessLogStream }));
// app.use(cors({ origin: "http://127.0.0.1:5500" }));
let origin = "http://127.0.0.1:5500";
if (process.env.NODE_ENV === "production") {
  origin = process.env.CORS_ORIGIN;
}
app.use(
  cors({
    credentials: true,
    origin,
  })
);

//use all routes
app.use("/auth", authRoutes);
app.use("/user", userRoutes);
app.use("/password", resetPasswordRoutes);
app.use("/expense", expenseRoutes);
app.use("/payment", paymentRoutes);
app.use("/premium", premiumRoutes);

(async () => {
  try {
    await dbConnection.sync({ force: false });
    console.log("All models were synchronized successfully.");
    const PORT = process.env.PORT || 4000;
    app.listen(PORT, () => {
      console.log(`Listening from the server http://localhost:${PORT}`);
    });
  } catch (err) {
    console.log(err);
  }
})();
