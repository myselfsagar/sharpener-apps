const API_BASE_URL = "http://localhost:4000/users";

function handleFormSubmit(event) {
  event.preventDefault();
  const userDetails = {
    username: event.target.username.value,
    email: event.target.email.value,
    phone: event.target.phone.value,
  };
  axios
    .post(`${API_BASE_URL}/add-user`, userDetails)
    .then((response) => {
      displayUserOnScreen(response.data.newUser);
    })
    .catch((error) => console.log(error));

  // Clearing the input fields
  document.getElementById("username").value = "";
  document.getElementById("email").value = "";
  document.getElementById("phone").value = "";
}

function fetchUser() {
  axios
    .get(`${API_BASE_URL}/get-users`)
    .then((response) => {
      const userList = document.querySelector("ul");
      userList.innerHTML = ""; // Clear existing list
      response.data.allUsers.forEach((user) => {
        displayUserOnScreen(user);
      });
    })
    .catch((err) => console.log(err));
}

function displayUserOnScreen(userDetails) {
  const userItem = document.createElement("li");
  userItem.appendChild(
    document.createTextNode(
      `${userDetails.username} - ${userDetails.email} - ${userDetails.phone}`
    )
  );

  const deleteBtn = document.createElement("button");
  deleteBtn.appendChild(document.createTextNode("Delete"));
  userItem.appendChild(deleteBtn);

  const editBtn = document.createElement("button");
  editBtn.appendChild(document.createTextNode("Edit"));
  userItem.appendChild(editBtn);

  const userList = document.querySelector("ul");
  userList.appendChild(userItem);

  function deleteUser() {
    axios
      .delete(`${API_BASE_URL}/delete-user/${userDetails.id}`)
      .then(() => userList.removeChild(userItem))
      .catch((err) => console.log(err));
  }

  deleteBtn.addEventListener("click", deleteUser);

  editBtn.addEventListener("click", function () {
    document.getElementById("username").value = userDetails.username;
    document.getElementById("email").value = userDetails.email;
    document.getElementById("phone").value = userDetails.phone;
    deleteUser();
  });
}

document.addEventListener("DOMContentLoaded", fetchUser());

// Do not touch code below
// module.exports = handleFormSubmit;
