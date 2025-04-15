const API_URL = "http://localhost:4000/expenses"; // Base API URL
const formElement = document.getElementById("input-form");
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
    try {
      await axios.delete(`${API_URL}/${expense.id}`);
      liItem.remove(); // Remove from UI without full refresh
    } catch (err) {
      console.error("Error deleting expense:", err);
    }
  };

  // Edit Expense Button
  let editBtn = document.createElement("button");
  editBtn.classList.add("editExpense");
  editBtn.textContent = "Edit";
  editBtn.onclick = () => handleEditExpense(expense, liItem);

  let buttonWrapper = document.createElement("div");
  buttonWrapper.classList.add("button-wrapper");
  buttonWrapper.appendChild(deleteBtn);
  buttonWrapper.appendChild(editBtn);

  liItem.appendChild(buttonWrapper);
  expenseLists.prepend(liItem);
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

// Function to handle editing an expense
function handleEditExpense(expense, listItem) {
  document.getElementById("expenseAmount").value = expense.amount;
  document.getElementById("expenseDescription").value = expense.description;
  document.getElementById("expenseCategory").value = expense.category;

  formElement.onsubmit = async (event) => {
    event.preventDefault();

    let updatedExpense = {
      amount: document.getElementById("expenseAmount").value,
      description: document.getElementById("expenseDescription").value,
      category: document.getElementById("expenseCategory").value,
    };

    try {
      await axios.put(`${API_URL}/${expense.id}`, updatedExpense);
      listItem.textContent = `${updatedExpense.amount} - ${updatedExpense.category} - ${updatedExpense.description}`;
    } catch (err) {
      console.error("Error updating expense:", err);
    }
  };
}

// Handle form submission (add new expense)
formElement.addEventListener("submit", async (event) => {
  event.preventDefault();

  let amount = document.getElementById("expenseAmount").value;
  let description = document.getElementById("expenseDescription").value;
  let category = document.getElementById("expenseCategory").value;

  if (!amount || !description || !category) return;

  try {
    const res = await axios.post(API_URL, { amount, description, category });

    addExpenseToUI(res.data);

    formElement.reset(); // Clear input fields efficiently
  } catch (err) {
    console.error("Error adding expense:", err);
  }
});

document.addEventListener("DOMContentLoaded", loadExpenses);
