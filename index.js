const express = require("express");
const app = express();
const userRouter = require("./routes/users");
const productRouter = require("./routes/products");
const cartRouter = require("./routes/cart");

app.use("/users", userRouter);
app.use("/products", productRouter);
app.use("/cart", cartRouter);

//default page for other pages
app.use((req, res, next) => {
  res.status(404).send("404 Page not found");
});

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Listening from http://localhost:${PORT}/`);
});
