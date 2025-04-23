const SERVER_BASE_URL = "http://localhost:4000/expense";

async function handleDeleteExpense(expenseId) {
  try {
    const token = localStorage.getItem("access_token");
    const response = await axios.delete(
      `${SERVER_BASE_URL}/delete-expense/${expenseId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    document.getElementById(`expense-${expenseId}`).remove();
  } catch (err) {
    console.log(err);
    alert(err.message);
  }
}

function createExpenseList(expense) {
  const parentElement = document.getElementById("expenseLists");
  const expenseElemId = `expense-${expense.id}`;

  parentElement.innerHTML += `
      <li id=${expenseElemId}>
        ${expense.amount} - ${expense.category} - ${expense.description}
        <button class="deleteExpense" onclick="handleDeleteExpense(${expense.id})">
          Delete Expense
        </button>
      </li>
  `;
}

async function handleExpenseForm(event) {
  event.preventDefault();

  const expenseDetails = {
    amount: event.target.amount.value,
    description: event.target.description.value,
    category: event.target.category.value,
  };

  if (!amount || !description || !category) return;

  try {
    const token = localStorage.getItem("access_token");
    const response = await axios.post(
      `${SERVER_BASE_URL}/add-expense`,
      expenseDetails,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    createExpenseList(response.data);
    event.target.reset();
  } catch (err) {
    console.log(err);
    alert(err.message);
  }
}

async function fetchAllExpenses() {
  try {
    const token = localStorage.getItem("access_token");
    const response = await axios.get(`${SERVER_BASE_URL}/get-all-expenses`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    response.data.forEach(createExpenseList);
  } catch (err) {
    console.log(err);
    alert(err.message);
  }
}

document.addEventListener("DOMContentLoaded", fetchAllExpenses);
