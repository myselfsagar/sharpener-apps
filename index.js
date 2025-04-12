const express = require("express");
const app = express();

//connect to db
const dbConnection = require("./utils/db-connection");

//import routes
const studentRoutes = require("./routes/studentRoutes");

//middleware
app.use(express.json());

//use routes
app.use("/students", studentRoutes);

//start the server
const PORT = 4000;
app.listen(PORT, () => {
  console.log(`server is running on http://localhost:${PORT}/`);
});
