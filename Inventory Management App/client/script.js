const API_URL = "http://localhost:4000/products";
const formElement = document.getElementById("input-form");
const productsContainer = document.getElementById("product-lists");

let editingProduct = null; // Tracks the product being edited

// Function to create and append a new product to the list
function addProductToUI(product) {
  const productElement = document.createElement("div");
  productElement.classList.add("product");
  productElement.setAttribute("data-id", product.id);

  productElement.innerHTML = `
      <p class="product-name">${product.name}</p>
      <p class="product-description">${product.description}</p>
      <p class="product-price">₹${parseFloat(product.price).toFixed(2)}</p>
      <p class="product-quantity">${product.quantity}</p>
      <div class="product-actions">
        <input type="number" min="1" max="${product.quantity}" 
               id="quantity-to-buy" placeholder="Qty">
        <button class="buy-btn">Buy</button>
        <button class="remove-btn">Remove</button>
      </div>
    `;

  // Add event listeners
  productElement
    .querySelector(".buy-btn")
    .addEventListener("click", () =>
      handleupdateQuantity(product, productElement)
    );

  productElement
    .querySelector(".remove-btn")
    .addEventListener("click", () =>
      handleRemoveProduct(product, productElement)
    );

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
    if (editingProduct) {
      // If editing, update the product
      const updatedProduct = { amount, description, category };
      await axios.put(
        `${API_URL}/update-product/${editingProduct.id}`,
        updatedProduct
      );

      addProductToUI({ id: editingProduct.id, amount, description, category });

      editingProduct = null; // Reset edit mode
    } else {
      // If not editing, create a new product
      const res = await axios.post(`${API_URL}/add-product`, {
        name,
        description,
        price,
        quantity,
      });
      addProductToUI(res.data);
    }

    formElement.reset();
  } catch (err) {
    console.error("Error processing product:", err);
  }
}

document.addEventListener("DOMContentLoaded", loadProducts);
