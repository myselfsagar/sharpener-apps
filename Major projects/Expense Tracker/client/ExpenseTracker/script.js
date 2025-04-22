const SERVER_BASE_URL = "http://localhost:4000/expense";

async function handleDeleteExpense(expense, liItem) {
  try {
    const response = await axios.delete(
      `${SERVER_BASE_URL}/delete-expense/${expense.id}`
    );
    liItem.remove();
  } catch (err) {
    console.log(err);
    alert(err.message);
  }
}

function createExpenseList(expense) {
  let liItem = document.createElement("li");
  liItem.classList.add("expenseList");
  liItem.setAttribute("data-id", expense.id);

  liItem.innerHTML = `
        ${expense.amount} - ${expense.category} - ${expense.description}
        <button class="deleteExpense">Delete Expense</button>
    `;

  // Add event listeners for delete buttons
  liItem
    .querySelector(".deleteExpense")
    .addEventListener("click", () => handleDeleteExpense(expense, liItem));

  // Append to the list
  expenseLists.appendChild(liItem);
}

async function handleExpenseForm(event) {
  event.preventDefault();

  let amount = document.getElementById("amount").value;
  let description = document.getElementById("description").value;
  let category = document.getElementById("category").value;

  if (!amount || !description || !category) return;

  try {
    const response = await axios.post(`${SERVER_BASE_URL}/add-expense`, {
      amount,
      description,
      category,
    });
    createExpenseList(response.data);
    event.target.reset();
  } catch (err) {
    console.log(err);
    alert(err.message);
  }
}

async function fetchAllExpenses() {
  try {
    const response = await axios.get(`${SERVER_BASE_URL}/get-all-expenses`);
    response.data.forEach(createExpenseList);
  } catch (err) {
    console.log(err);
    alert(err.message);
  }
}

document.addEventListener("DOMContentLoaded", fetchAllExpenses);
