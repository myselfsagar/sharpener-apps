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
      `${SERVER_BASE_URL}/payment/pay`,
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    const { paymentSessionId, orderId } = response.data;

    // Initialize checkout options
    let checkoutOptions = {
      paymentSessionId,
      // redirectTarget: "_self",
      //? Modal payment options
      redirectTarget: "_modal",
      //? Inline payment options
      // redirectTarget: document.getElementById("cf_checkout"),
      // appearance: {
      //   width: "425px",
      //   height: "700px",
      // },
    };

    // Start the checkout process
    const result = await cashfree.checkout(checkoutOptions);

    if (result.error) {
      // This will be true whenever user clicks on close icon inside the modal or any error happens during the payment
      console.log(
        "User has closed the popup or there is some payment error, Check for Payment Status"
      );
      console.log(result.error);
    }
    if (result.redirect) {
      // This will be true when the payment redirection page couldn't be opened in the same window
      // This is an exceptional case only when the page is opened inside an inAppBrowser
      // In this case the customer will be redirected to return url once payment is completed
      console.log("Payment will be redirected");
    }
    if (result.paymentDetails) {
      // This will be called whenever the payment is completed irrespective of transaction status
      console.log("Payment has been completed, Check for Payment Status");
      console.log(result.paymentDetails.paymentMessage);

      const response = await axios.get(
        `${SERVER_BASE_URL}/payment/payment-status/${orderId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.orderStatus === "Success") {
        localStorage.setItem("user_role", "premium");
        document.getElementById("payButton").disabled = true;
        window.location.reload();
      }
      alert("Your payment is " + response.data.orderStatus);
    }
  } catch (err) {
    console.error("Error initiating payment:", err.message);
    alert("Payment error. Please try again.");
  }
});

document.addEventListener("DOMContentLoaded", async () => {
  try {
    const userResponse = await axios.get(
      `${SERVER_BASE_URL}/user/get-user-profile`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    if (userResponse.data.role === "premium") {
      document.getElementById("downloadExpense").disabled = false;
    }
    const dailyData = [
      {
        date: "01-03-2021",
        description: "Milk",
        category: "Milk",
        income: 0,
        expense: 60,
      },
      {
        date: "04-03-2021",
        description: "Salary",
        category: "Salary",
        income: 40000,
        expense: 0,
      },
      {
        date: "04-03-2021",
        description: "Fruits",
        category: "Fruits",
        income: 0,
        expense: 500,
      },
      {
        date: "05-03-2021",
        description: "Party",
        category: "Birthday Treat",
        income: 0,
        expense: 500,
      },
    ];

    const yearlyData = [
      { month: "March", income: 60000, expense: 5670, savings: 54330 },
    ];
    const notesData = [
      { date: "11-02-2021", notes: "Gave advance to construction." },
    ];

    populateTable("dailyReport", dailyData);
    populateTable("yearlyReport", yearlyData);
    populateTable("notesReport", notesData);
  } catch (err) {
    console.error("Error loading expense data:", err.message);
  }
});

function populateTable(tableId, data) {
  const tableBody = document.getElementById(tableId).querySelector("tbody");
  data.forEach((row) => {
    const tr = document.createElement("tr");
    Object.values(row).forEach((cellData) => {
      const td = document.createElement("td");
      td.textContent = cellData;
      tr.appendChild(td);
    });
    tableBody.appendChild(tr);
  });
}

async function download() {
  try {
    await axios.get(`${SERVER_BASE_URL}/user/download`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    //the bcakend is essentially sending a download link, which if we open in browser, the file would download
    var a = document.createElement("a");
    a.href = response.data.fileUrl;
    a.download = "myexpense.csv";
    a.click();
  } catch (err) {
    console.log("Error downloading expense", err);
  }
}
