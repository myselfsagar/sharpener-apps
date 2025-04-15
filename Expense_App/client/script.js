const API_URL = "http://localhost:4000/expenses"; // Base API URL
const formElement = document.querySelector("form");
const expenseLists = document.getElementById("expenseLists");

// Function to display all expenses from the backend
async function displayExpenses() {
  expenseLists.innerHTML = ""; // Clear existing list

  const res = await fetch(API_URL);
  const expenses = await res.json();

  expenses.forEach((expense) => {
    // Create list item
    let liItem = document.createElement("li");
    liItem.classList.add("expenseList");
    liItem.textContent = `${expense.amount} - ${expense.category} - ${expense.description}`;

    // Delete Expense Button
    let deleteBtn = document.createElement("button");
    deleteBtn.classList.add("deleteExpense");
    deleteBtn.textContent = "Delete";
    deleteBtn.onclick = async () => {
      await fetch(`${API_URL}/${expense.id}`, { method: "DELETE" });
      displayExpenses(); // Refresh UI
    };

    // Edit Expense Button
    let editBtn = document.createElement("button");
    editBtn.classList.add("editExpense");
    editBtn.textContent = "Edit";
    editBtn.onclick = async () => {
      handleEditExpense(expense);
    };

    // Wrapper for buttons to align in one line
    let buttonWrapper = document.createElement("div");
    buttonWrapper.classList.add("button-wrapper");
    buttonWrapper.appendChild(deleteBtn);
    buttonWrapper.appendChild(editBtn);

    liItem.appendChild(buttonWrapper);
    expenseLists.appendChild(liItem);
  });
}

// Function to handle editing an expense
async function handleEditExpense(expense) {
  // Pre-fill the form with existing details
  document.getElementById("expenseAmount").value = expense.amount;
  document.getElementById("expenseDescription").value = expense.description;
  document.getElementById("expenseCategory").value = expense.category;

  // Delete the original expense so the new one is treated as fresh input
  await fetch(`${API_URL}/${expense.id}`, { method: "DELETE" });
  displayExpenses(); // Refresh UI
}

// Handle form submission (create new expense)
formElement.addEventListener("submit", async (event) => {
  event.preventDefault();

  let amount = document.getElementById("expenseAmount").value;
  let description = document.getElementById("expenseDescription").value;
  let category = document.getElementById("expenseCategory").value;

  if (!amount || !description || !category) return;

  await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ amount, description, category }),
  });

  // Clear input fields after submission
  document.getElementById("expenseAmount").value = "";
  document.getElementById("expenseDescription").value = "";
  document.getElementById("expenseCategory").value = "fuel"; // Reset category to default

  displayExpenses(); // Refresh UI
});

// Load expenses when the page is loaded
document.addEventListener("DOMContentLoaded", displayExpenses);
