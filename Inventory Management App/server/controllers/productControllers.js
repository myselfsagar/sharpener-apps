const Product = require("../models/Product");

const addProduct = async (req, res) => {
  try {
    const { name, description, price, quantity } = req.body;
    if (!name || !description || !price || !quantity) {
      return res.status(400).json({ Error: "All fields are required" });
    }

    const product = await Product.create({
      name,
      description,
      price,
      quantity,
    });
    res.status(201).json(product);
  } catch (err) {
    console.log("Error adding product", err);
    res.status(500).json({ Error: `Error adding product: ${err.message}` });
  }
};

const getAllProducts = async (req, res) => {
  try {
    const products = await Product.findAll();

    if (products.length === 0) {
      res.status(404).json({ Error: "No product found!" });
    }

    res.json(products);
  } catch (err) {
    console.log("Error fetching products", err);
    res.status(500).json({ Error: `Error fetching products: ${err.message}` });
  }
};

const removeProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const product = await Product.destroy({ where: { id: productId } });

    if (!product) {
      res.status(404).json({ Error: "Product not found!" });
    }

    res.json(product);
  } catch (err) {
    console.log("Error removing product", err);
    res.status(500).json({ Error: `Error removing product: ${err.message}` });
  }
};

const updateProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const { name, description, price, quantity } = req.body;

    const product = await Product.findByPk(productId);

    if (!product) {
      res.status(404).json({ Error: "Product not found!" });
    }

    if (name) product.name = name;
    if (description) product.description = description;
    if (price) product.price = price;
    if (quantity) product.quantity = quantity;

    await product.save();

    res.json(product);
  } catch (err) {
    console.log("Error updating product", err);
    res.status(500).json({ Error: `Error updating product: ${err.message}` });
  }
};

module.exports = { addProduct, getAllProducts, removeProduct, updateProduct };
