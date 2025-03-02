console.log("message");

function showLoader() {
    document.getElementById("preloder").style.display = "block";
    document.getElementById("gen-container").style.display = "none";
}

function hideLoader() {
    document.getElementById("preloder").style.display = "none";
    document.getElementById("gen-container").style.display = "block";
}

const client = new Appwrite.Client()
    .setEndpoint("https://cloud.appwrite.io/v1")
    .setProject("6779f063001e55f1d5b0");

//   Initialize your account
const account = new Appwrite.Account(client);

// Initialize our appwrite database
const database = new Appwrite.Databases(client);

// Check for session

// async function fetchUserSession() {
//   try {
//     const session = await account.get();
//     console.log(session);
//     sessionStorage.setItem("currentUser", JSON.stringify({ id: session.$id }));
//   } catch (err) {
//     console.log(err);
//     window.location.href = "/signin.html";
//   }
// }

// Get the cart items from the database
async function fetchCartItems() {
    showLoader();
    try {
        console.log(
            "Stored session data:",
            sessionStorage.getItem("currentUser").trim()
        );

        const userId = sessionStorage.getItem("currentUser"); // directly accsessing the user Id from the session storage which is a string
        console.log("User id", userId);

        // Optional chaining to make sure that the currentuser exists , and if it doesnt it should return undefined instead of throwing an error for you

        // Initialize our appwrite database
        const database = new Appwrite.Databases(client);

        // fetch documents from the orders database , and collections

        const response = await database.listDocuments(
            "679588460020e7d60b95", //database Id
            "67958a630024e830dbf0", //collection Id
            [Appwrite.Query.equal("userId", userId)] //it filters out the database result by userid
        );
        console.log("response", response);
        const cartItems = response.documents;
        return cartItems; // we are returning cart items because we want to use the content outside of this function
    } catch (error) {
        console.log("Error Fetching Cart Items:", error);
        return []; //return an empty array when theres an error
    } finally {
        hideLoader();
    }
}

async function displayCart() {
    const cartItems = await fetchCartItems();
    console.log("cart items", cartItems);
    const cartContainer = document.getElementById("cart-items");
    cartContainer.innerHTML = "";

    if (cartItems.length === 0) {
        cartContainer.innerHTML = "<p>Your Cart is empty </p>";
        return;
    }

    let totalAmount = 0;

    cartItems.forEach((item) => {
        totalAmount += item.price * item.quantity;
        console.log(item.imageurl)

        const itemDIv = document.createElement("div");
        itemDIv.className = "cart-item";
        itemDIv.innerHTML = `
    <img src="${item.imageurl}" alt="${item.productName}"> 
    <div class="cart-item-details">
      <h4> ${item.productName}</h4>
      <p>${item.price}</p>
      <p>${item.quantity} </p>
    </div>
    <div class="cart-item-actions">
    <button data-id="${item.$id}" class="delete-item"> Delete</button>
    </div>
    `;
        cartContainer.appendChild(itemDIv);
    });
    document.getElementById("total-amount").innerHTML=`Total:$${totalAmount.toFixed(2)}`;

    document.querySelectorAll(".delete-item").forEach((button) => {
        button.addEventListener("click", handleDeleteClick);
    })
}

const handleDeleteClick = (event) =>{
    const itemId = event.target.dataset.id;
    const itemName = event.target.closest(".cart-item").querySelector("h4").innerText;

    //show model

    const model = document.getElementById("confirmation-modal");
    const itemNameElement = document.getElementById("modal-item-name");
    itemNameElement.innerText = itemName;
    //show the model
    model.style.display = "flex";

    //add event listener for confirmation and delete button
    const confirmationButton = document.getElementById("confirm-delete");
    const cancelButton = document.getElementById("cancel-delete");
    // adding the event listeners

    confirmationButton.onclick = async () => {
        await deleteCart(itemId); //pass the itemId directly to the delete button
        model.style.display = "none";
        displayCart(); // we call this to re-render the new cart items
    };


    cancelButton.onclick = () => {
        MediaSourceHandle.style.display = "none";
    };

    // function for the deleting the cart items
    async function deleteCart(itemId){
        try{
            await database.deleteDocument("679588460020e7d60b95","67958a630024e830dbf0", itemId);
        
            Toastify({
                text: "Item deleted successfully",
                backgroundColor:"green",
                duation: 3000,
            }).showToast();
            displayCart();
        }catch(err){
            console.log(err);
            
            Toastify({
                text: "Failed to delete item",
                backgroundColor:"green",
                duration: 3000,
            }).showToast();
        }
        
    }

};


displayCart();