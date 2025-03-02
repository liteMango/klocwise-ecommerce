const client = new Appwrite.Client()
  .setEndpoint("https://cloud.appwrite.io/v1")
  .setProject("6779f063001e55f1d5b0");

//   Initialize your account
const account = new Appwrite.Account(client);
// handle form submission
const loginForm = document.getElementById("loginForm");

loginForm.addEventListener("submit", (event) => {
  event.preventDefault();
  //   Get the email and password
  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;

  //creating a session by calling the appwrite create session for login
  account
    .createEmailPasswordSession(email, password)
    .then((response) => {
      console.log("user logged in successfully", response);
      // show a toast message
      Toastify({
        text: "Login successful! Redirecting !!!",
        backgroundColor: "green",
        duration: 3000,
      }).showToast();

      // wait a little for the toast to show before redirecting
      setTimeout(() => {
        window.location.href = "index.html";
      }, 3000);
    })
    .catch((err) => {
      console.log("Error logging in", err);
      Toastify({
        text: "Error!" + err.message,
        backgroundColor: "red",
        duration: 3000,
      }).showToast();
    });
});
