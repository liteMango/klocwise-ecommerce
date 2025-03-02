// initialize your Appwrite client
console.log("message");

const client = new Appwrite.Client()
  .setEndpoint("https://cloud.appwrite.io/v1")
  .setProject("6779f063001e55f1d5b0");

//   Initialize your account
const account = new Appwrite.Account(client);

// Handle form submission
const signupForm = document.getElementById("signupForm");
console.log(signupForm);

signupForm.addEventListener("submit", async (e) => {
  // preventing the default behaviour of refreshing the page when the form is submitted
  e.preventDefault();

  // Perform some form validations
  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  console.log(email, name, password);

  // form validation logic
  if (!name || !email || !password) {
    Toastify({
      text: "Please Fill in all fields",
      backgroundColor: "red",
      duration: 3000,
    }).showToast();
    return;
  }
  if (password.length < 8) {
    Toastify({
      text: "Password must be at least 6 characters long",
      backgroundColor: "red",
      duration: 3000,
    }).showToast();
    return;
  }

  // Step 1 create a user
  const userResponse = await account.create(
    Appwrite.ID.unique(),
    email,
    password
  );
  console.log("User created sucessfully");

  // step 2 Log the user in to get an authenticated session
  await account.createEmailPasswordSession(email, password);

  // Step 3 update the user's name
  await account.updateName(name);
  console.log("Name updated succesfully");
  // Show a success message using toastify
  Toastify({
    text: "Account created successfully! Redirecting...",
    backgroundColor: "green",
    duration: 3000,
  }).showToast();
  // redirect the user to the login page
  setTimeout(() => {
    window.location.href = "index.html";
  }, 3000);
});
