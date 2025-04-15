const API_URL = "http://localhost:4000/expenses"; // Base API URL
const formElement = document.getElementById("input-form");
const expenseLists = document.getElementById("expenseLists");

let editingExpense = null; // Tracks the expense being edited

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
  deleteBtn.addEventListener("click", () =>
    handleDeleteExpense(expense, liItem)
  );

  // Edit Expense Button
  let editBtn = document.createElement("button");
  editBtn.classList.add("editExpense");
  editBtn.textContent = "Edit";
  editBtn.addEventListener("click", () => handleEditExpense(expense, liItem));

  let buttonWrapper = document.createElement("div");
  buttonWrapper.classList.add("button-wrapper");
  buttonWrapper.appendChild(deleteBtn);
  buttonWrapper.appendChild(editBtn);

  liItem.appendChild(buttonWrapper);
  expenseLists.prepend(liItem); // Adds the expense to the top
}

// Function to display expenses initially
async function loadExpenses() {
  expenseLists.innerHTML = ""; // Clear list on initial load
  try {
    const res = await axios.get(API_URL);
    res.data.forEach(addExpenseToUI);
  } catch (err) {
    console.error("Error fetching expenses:", err);
  }
}

// Function to delete an expense
async function handleDeleteExpense(expense, listItem) {
  try {
    await axios.delete(`${API_URL}/${expense.id}`);
    listItem.remove(); // Remove from UI
  } catch (err) {
    console.error("Error deleting expense:", err);
  }
}

// Function to handle editing an expense
function handleEditExpense(expense, listItem) {
  // Pre-fill the form with the existing expense details
  document.getElementById("expenseAmount").value = expense.amount;
  document.getElementById("expenseDescription").value = expense.description;
  document.getElementById("expenseCategory").value = expense.category;

  editingExpense = expense; // Store editing expense reference
  listItem.remove(); // Remove from UI
}

// Handle form submission (Add or Edit Expense)
async function handleFormSubmit(event) {
  event.preventDefault();

  let amount = document.getElementById("expenseAmount").value;
  let description = document.getElementById("expenseDescription").value;
  let category = document.getElementById("expenseCategory").value;

  if (!amount || !description || !category) return;

  try {
    if (editingExpense) {
      // If editing, update the expense
      const updatedExpense = { amount, description, category };
      await axios.put(`${API_URL}/${editingExpense.id}`, updatedExpense);

      addExpenseToUI({ id: editingExpense.id, amount, description, category });

      editingExpense = null; // Reset edit mode
    } else {
      // If not editing, create a new expense
      const res = await axios.post(API_URL, { amount, description, category });
      addExpenseToUI(res.data);
    }

    formElement.reset();
  } catch (err) {
    console.error("Error processing expense:", err);
  }
}

// Attach form submission listener
formElement.addEventListener("submit", handleFormSubmit);
document.addEventListener("DOMContentLoaded", loadExpenses);
