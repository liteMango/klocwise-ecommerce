const client = new Appwrite.Client()
  .setEndpoint("https://cloud.appwrite.io/v1")
  .setProject("6779f063001e55f1d5b0");

//   Initialize your account
const account = new Appwrite.Account(client);

document.addEventListener("DOMContentLoaded", async () => {
  const headerPlaceholder = document.getElementById("header-placeholder");

  try {
    // fetch and inject the inject header.html
    const response = await fetch("header.html");
    if (!response.ok) {
      throw new Error(`HTTP error! status:${response.status}`);
    }
    const html = await response.text();
    headerPlaceholder.innerHTML = html;

    // call the init auth function
    await initAuth();
  } catch (err) {
    console.log(err);
  }
});

async function initAuth() {
  try {
    // select the dom elements after the header has been inject
    const loginLink = document.getElementById("login-link");
    const logoutBtn = document.getElementById("logout-btn");
    const userInfo = document.getElementById("user-info");

    // check if a user is logged in
    const user = await account.get();
    console.log("user", user);

    sessionStorage.setItem("currentUser", user.$id)

    // update the ui if a user is logged in
    userInfo.innerHTML = `Welcome ${user.name}`;
    loginLink.style.display = "none";
    logoutBtn.style.display = "inline-block";

    // Handle the logout logic
    logoutBtn.addEventListener("click", async () => {
      await account.deleteSession("current");
      alert("you have been logged out");

      window.location.href = "index.html";
    });
  } catch (err) {
    console.log(err);
  }
}
