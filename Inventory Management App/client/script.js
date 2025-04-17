const API_URL = "http://localhost:4000/products";
const formElement = document.getElementById("input-form");
const productsContainer = document.getElementById("product-lists");

// Function to create and append a new product to the list
function addProductToUI(product) {
  const productElement = document.createElement("div");
  productElement.classList.add("product");
  productElement.setAttribute("data-id", product.id);

  const productName = document.createElement("p");
  productName.classList.add("product-name");
  productName.textContent = product.name;

  const productDescription = document.createElement("p");
  productDescription.classList.add("product-description");
  productDescription.textContent = product.description;

  const productPrice = document.createElement("p");
  productPrice.classList.add("product-price");
  productPrice.textContent = product.price;

  const productQuantity = document.createElement("p");
  productQuantity.classList.add("product-quantity");
  productQuantity.textContent = product.quantity;

  const quantityInput = document.createElement("input");
  quantityInput.setAttribute("type", "number");
  quantityInput.setAttribute("min", "1");
  quantityInput.setAttribute("id", "quantity-to-buy");

  const buyProduct = document.createElement("button");
  buyProduct.textContent = "Buy now";
  buyProduct.addEventListener("click", () =>
    handleupdateQuantity(product, productElement)
  );

  const removeProduct = document.createElement("button");
  removeProduct.textContent = "Remove Product";
  removeProduct.onclick = () => handleRemoveProduct(product, productElement);

  productElement.appendChild(productName);
  productElement.appendChild(productDescription);
  productElement.appendChild(productPrice);
  productElement.appendChild(productQuantity);
  productElement.appendChild(quantityInput);
  productElement.appendChild(buyProduct);
  productElement.appendChild(removeProduct);

  productsContainer.appendChild(productElement);
}
// Function to display products initially
async function loadProducts() {
  //   productsContainer.innerHTML = ""; // Clear list on initial load
  try {
    const res = await axios.get(`${API_URL}/get-all-products`);
    res.data.forEach(addProductToUI);
  } catch (err) {
    console.error("Error fetching products:", err);
    alert("Error fetching products. Please try again.");
  }
}
// Function to update the quantity
async function handleupdateQuantity(product, productElement) {
  try {
    // Get the quantity input element
    const quantityInput = productElement.querySelector("#quantity-to-buy");
    const quantityToBuy = parseInt(quantityInput.value);

    // Validate the input
    if (isNaN(quantityToBuy)) {
      alert("Please enter a valid quantity");
      return;
    }

    if (quantityToBuy < 1) {
      alert("Quantity must be at least 1");
      return;
    }

    // Get current quantity from the product object or UI
    const currentQuantity = product.quantity;

    // Check if there's enough quantity available
    if (quantityToBuy > currentQuantity) {
      alert(`Not enough stock available. Only ${currentQuantity} items left.`);
      return;
    }

    // Calculate new quantity
    const newQuantity = currentQuantity - quantityToBuy;

    // Update the product object
    product.quantity = newQuantity;

    // Send put request to backend
    const response = await axios.put(
      `${API_URL}/update-product/${product.id}`,
      { quantity: newQuantity }
    );

    // Update the UI with the new quantity
    const quantityElement = productElement.querySelector(".product-quantity");
    quantityElement.textContent = newQuantity;

    // Clear the input field
    quantityInput.value = "";
  } catch (error) {
    console.error("Error updating product quantity:", error);
    alert("Error updating product quantity. Please try again.");
  }
}
// Function to delete an product
async function handleRemoveProduct(product, productElement) {
  try {
    await axios.delete(`${API_URL}/remove-product/${product.id}`);
    productElement.remove(); // Remove from UI
  } catch (err) {
    console.error("Error deleting product:", err);
    alert("Error removing product. Please try again.");
  }
}
// Handle form submission (Add or Edit Product)
async function handleAddProduct(event) {
  event.preventDefault();

  let name = document.getElementById("name").value;
  let description = document.getElementById("description").value;
  let price = document.getElementById("price").value;
  let quantity = document.getElementById("quantity").value;

  if (!name || !description || !price || !quantity) return;

  try {
    const res = await axios.post(`${API_URL}/add-product`, {
      name,
      description,
      price,
      quantity,
    });
    addProductToUI(res.data);

    formElement.reset();
  } catch (err) {
    console.error("Error processing product:", err);
  }
}

document.addEventListener("DOMContentLoaded", loadProducts);
