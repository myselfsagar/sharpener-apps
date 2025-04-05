const express = require("express");
const app = express();
const homeRouter = require("./routes/home");
const studentsRouter = require("./routes/students");
const coursesRouter = require("./routes/courses");

//routes
app.use("/", homeRouter);
app.use("/students", studentsRouter);
app.use("/courses", coursesRouter);

//default message for invalid routes
app.use((req, res, next) => {
  res.status(404).send("Page not found");
});

//listening from port
const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Listening on http://localhost:${PORT}/`);
});
