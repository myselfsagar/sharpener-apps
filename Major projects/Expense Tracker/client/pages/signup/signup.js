const SERVER_BASE_URL = "http://localhost:4000/api";

async function handleSignupForm(event) {
  event.preventDefault();

  //get the inputs
  const name = event.target.name.value;
  const email = event.target.email.value;
  const password = event.target.password.value;

  try {
    const user = await axios.post(`${SERVER_BASE_URL}/user/signup`, {
      name,
      email,
      password,
    });
    console.log(user);
    alert("User created successfully. Please login.");
  } catch (err) {
    console.log("Error creating account", err.message);
    alert("Facing error while creating account. Please try after sometime");
  }
}
