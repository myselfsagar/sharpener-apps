const API_URL = "http://localhost:4000/expenses"; // Base API URL
const formElement = document.querySelector("form");
const expenseLists = document.getElementById("expenseLists");

// Load Axios
axios.defaults.baseURL = API_URL;

// Function to display all expenses from the backend
async function displayExpenses() {
  expenseLists.innerHTML = ""; // Clear existing list

  try {
    const res = await axios.get("/");
    const expenses = res.data;

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
        await axios.delete(`/${expense.id}`);
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
  } catch (err) {
    console.error("Error fetching expenses:", err);
  }
}

// Function to handle editing an expense
async function handleEditExpense(expense) {
  // Pre-fill the form with existing details
  document.getElementById("expenseAmount").value = expense.amount;
  document.getElementById("expenseDescription").value = expense.description;
  document.getElementById("expenseCategory").value = expense.category;

  // Delete the original expense so the new one is treated as fresh input
  await axios.delete(`/${expense.id}`);
  displayExpenses(); // Refresh UI
}

// Handle form submission (create new expense)
formElement.addEventListener("submit", async (event) => {
  event.preventDefault();

  let amount = document.getElementById("expenseAmount").value;
  let description = document.getElementById("expenseDescription").value;
  let category = document.getElementById("expenseCategory").value;

  if (!amount || !description || !category) return;

  try {
    await axios.post("/", { amount, description, category });

    // Clear input fields after submission
    document.getElementById("expenseAmount").value = "";
    document.getElementById("expenseDescription").value = "";
    document.getElementById("expenseCategory").value = "fuel"; // Reset category to default

    displayExpenses(); // Refresh UI
  } catch (err) {
    console.error("Error adding expense:", err);
  }
});

// Load expenses when the page is loaded
document.addEventListener("DOMContentLoaded", displayExpenses);
