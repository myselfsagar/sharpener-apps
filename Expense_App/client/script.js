const API_URL = "http://localhost:4000/expenses"; // Base API URL
const formElement = document.querySelector("form");
const expenseLists = document.getElementById("expenseLists");

// Function to create and append a new expense item to the list
function addExpenseToUI(expense) {
  let liItem = document.createElement("li");
  liItem.classList.add("expenseList");
  liItem.setAttribute("data-id", expense.id); // Store expense ID

  liItem.textContent = `${expense.amount} - ${expense.category} - ${expense.description}`;

  // Delete Expense Button
  let deleteBtn = document.createElement("button");
  deleteBtn.classList.add("deleteExpense");
  deleteBtn.textContent = "Delete";
  deleteBtn.onclick = async () => {
    await axios.delete(`/${expense.id}`);
    liItem.remove(); // **Remove from UI without full refresh**
  };

  // Edit Expense Button
  let editBtn = document.createElement("button");
  editBtn.classList.add("editExpense");
  editBtn.textContent = "Edit";
  editBtn.onclick = async () => {
    handleEditExpense(expense, liItem);
  };

  // Wrapper for buttons
  let buttonWrapper = document.createElement("div");
  buttonWrapper.classList.add("button-wrapper");
  buttonWrapper.appendChild(deleteBtn);
  buttonWrapper.appendChild(editBtn);

  liItem.appendChild(buttonWrapper);
  expenseLists.appendChild(liItem);
}

// Function to display expenses initially
async function loadExpenses() {
  expenseLists.innerHTML = ""; // Clear list on initial load
  try {
    const res = await axios.get("/");
    res.data.forEach(addExpenseToUI); // **Append expenses efficiently**
  } catch (err) {
    console.error("Error fetching expenses:", err);
  }
}

// Function to handle editing an expense
async function handleEditExpense(expense, listItem) {
  // Pre-fill the form with existing details
  document.getElementById("expenseAmount").value = expense.amount;
  document.getElementById("expenseDescription").value = expense.description;
  document.getElementById("expenseCategory").value = expense.category;

  // Remove the item from UI and delete from backend
  await axios.delete(`/${expense.id}`);
  listItem.remove();
}

// Handle form submission (add new expense)
formElement.addEventListener("submit", async (event) => {
  event.preventDefault();

  let amount = document.getElementById("expenseAmount").value;
  let description = document.getElementById("expenseDescription").value;
  let category = document.getElementById("expenseCategory").value;

  if (!amount || !description || !category) return;

  try {
    const res = await axios.post("/", { amount, description, category });

    // **Add to UI directly without full refresh**
    addExpenseToUI(res.data);

    // Clear input fields
    document.getElementById("expenseAmount").value = "";
    document.getElementById("expenseDescription").value = "";
    document.getElementById("expenseCategory").value = "fuel"; // Reset category to default
  } catch (err) {
    console.error("Error adding expense:", err);
  }
});

// Load expenses once when the page is loaded
document.addEventListener("DOMContentLoaded", loadExpenses);
