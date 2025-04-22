const SERVER_BASE_URL = "http://localhost:4000";

async function handleLoginForm(event) {
  event.preventDefault();

  //get the input values
  const email = event.target.email.value;
  const password = event.target.password.value;

  try {
    const response = await axios.post(`${SERVER_BASE_URL}/user/login`, {
      email,
      password,
    });
    console.log(response);
  } catch (err) {
    console.log(err);
  }
}
