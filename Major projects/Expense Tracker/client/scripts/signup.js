const SERVER_BASE_URL = "http://localhost:4000";

async function handleSignupForm(event) {
  event.preventDefault();

  //get the inputs
  const name = event.target.name.value;
  const email = event.target.email.value;
  const password = event.target.password.value;

  try {
    const response = await axios.post(`${SERVER_BASE_URL}/auth/signup`, {
      name,
      email,
      password,
    });
    console.log(response);

    //Redirecting to login after some delay.
    alert("User created successfully. Redirecting to login..");
    setTimeout(() => {
      window.location.href = "../pages/login.html";
    }, 2000);
  } catch (err) {
    if (!err.response) {
      console.log("Network error:", err.message);
      return alert("Network error. Please check your connection.");
    } else {
      const errorMessages = {
        409: "User already exists. Please login with the credentials or signup with a different email.",
        400: "All fields are mandatory. Please fill in all details.",
        500: "Server error. Please try again later.",
      };

      // Display corresponding error message
      alert(
        errorMessages[err.response.status] || "An unexpected error occurred."
      );
    }
    event.target.reset();
  }
}
