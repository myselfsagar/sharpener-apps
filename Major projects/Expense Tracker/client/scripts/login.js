const SERVER_BASE_URL = "http://localhost:4000";

async function handleLoginForm(event) {
  event.preventDefault();

  //get the input values
  const email = event.target.email.value;
  const password = event.target.password.value;

  try {
    const response = await axios.post(`${SERVER_BASE_URL}/auth/login`, {
      email,
      password,
    });

    localStorage.setItem("access_token", response.data.accessToken);

    window.location.href = "../pages/expense.html";
  } catch (err) {
    if (!err.status) {
      console.log("Network error:", err.message);
      return alert("Network error. Please check your connection.");
    } else {
      console.log(err);
      const errorMessages = {
        400: "All fields are mandatory",
        404: "User not found",
        401: "Incorrect password",
      };
      alert(
        errorMessages[err.response.status] || "An unexpected error occurred."
      );
    }
  }
}
