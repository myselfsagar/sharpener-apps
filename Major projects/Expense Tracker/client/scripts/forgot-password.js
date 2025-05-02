async function forgotPassword(event) {
  event.preventDefault();
  const email = event.target.email.value;
  const form = event.target;

  try {
    await axios.post("http://localhost:4000/password/forgotPassword", {
      email,
    });

    const successMessage = document.createElement("div");
    successMessage.style.color = "green";
    successMessage.textContent = "Mail successfully sent!";
    form.appendChild(successMessage);
  } catch (err) {
    alert(err.response.data.Error);
    console.log(err);
  }
}
