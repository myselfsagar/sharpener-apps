const express = require("express");
const app = express();

//connect to db
const dbConnection = require("./utils/db-connection");

//Models
require("./models");
// const studentModel = require("./models/Student");

//import routes
const studentRoutes = require("./routes/studentRoutes");
const courseRoutes = require("./routes/courseRoutes");
const associationRoutes = require("./routes/associationRoutes");

//middleware
app.use(express.json());

//use routes
app.use("/students", studentRoutes);
app.use("/courses", courseRoutes);
app.use("/", associationRoutes);

dbConnection
  .sync({ alter: true })
  .then(() => {
    //start the server
    const PORT = 4000;
    app.listen(PORT, () => {
      console.log(`server is running on http://localhost:${PORT}/`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
