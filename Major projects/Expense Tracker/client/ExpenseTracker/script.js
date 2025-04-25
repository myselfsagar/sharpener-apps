const SERVER_BASE_URL = "http://localhost:4000";
const token = localStorage.getItem("access_token");

async function handleDeleteExpense(expenseId) {
  try {
    const response = await axios.delete(
      `${SERVER_BASE_URL}/expense/delete-expense/${expenseId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    document.getElementById(`expense-${expenseId}`).remove();
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
}

function createExpenseList(expense) {
  const parentElement = document.getElementById("expenseLists");
  const expenseElemId = `expense-${expense.id}`;

  parentElement.innerHTML += `
      <li id="${expenseElemId}">
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

  if (
    !expenseDetails.amount ||
    !expenseDetails.description ||
    !expenseDetails.category
  )
    return;

  try {
    const response = await axios.post(
      `${SERVER_BASE_URL}/expense/add-expense`,
      expenseDetails,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    createExpenseList(response.data);
    event.target.reset();
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
}

async function fetchAllExpenses() {
  try {
    const response = await axios.get(
      `${SERVER_BASE_URL}/expense/get-all-expenses`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    response.data.forEach(createExpenseList);
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
}

document.addEventListener("DOMContentLoaded", fetchAllExpenses);

// Initialize Cashfree
const cashfree = Cashfree({ mode: "sandbox" });

document.getElementById("payButton").addEventListener("click", async () => {
  try {
    // Fetch payment session ID from backend
    const response = await axios.post(
      `${SERVER_BASE_URL}/payment/create-order`,
      { orderAmount: 500, customerPhone: "9876543210" },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    const { payment_session_id, order_id } = response.data; // Store order_id

    let checkoutOptions = {
      paymentSessionId: payment_session_id,
      redirectTarget: "_self",
    };

    // Start checkout process
    await cashfree.checkout(checkoutOptions);

    // Check payment status after completion
    setTimeout(async () => {
      const paymentResponse = await axios.get(
        `${SERVER_BASE_URL}/payment/payment-status?orderId=${order_id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert(`Your payment status is: ${paymentResponse.data.orderStatus}`);

      // If payment is successful, update UI for premium user
      if (paymentResponse.data.orderStatus === "SUCCESSFUL") {
        alert("Congratulations! You are now a premium user.");
        document.getElementById("payButton").textContent =
          "Premium Membership Active";
        document.getElementById("payButton").disabled = true;
      }
    }, 5000); // Wait for payment completion
  } catch (err) {
    console.error("Error initiating payment:", err.message);
    alert("Payment error. Please try again.");
  }
});
