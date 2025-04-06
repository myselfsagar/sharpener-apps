const express = require("express");
const app = express();

//import routes
const userRouter = require("./routes/users");
const productRouter = require("./routes/products");
const cartRouter = require("./routes/cart");

//use the routes
app.use("/api/users", userRouter);
app.use("/api/products", productRouter);
app.use("/api/cart", cartRouter);

//default page for other pages
app.use((req, res, next) => {
  res.status(404).send("404 Page not found");
});

//start the server
const PORT = 4000;
app.listen(PORT, () => {
  console.log(`server is running on http://localhost:${PORT}/`);
});
