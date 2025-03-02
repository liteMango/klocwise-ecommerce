console.log("Coming from fetch products");

//Asynchronous (async) , is a non blocking type code in javascript which just simply means that everything wrapped inside the code block should run in the background and once we get a response , it should be displayed for us.

//try catch block :is a good practice where you wrap all the codes you want to write inside the try block and should incase an error occurs, the error should cascade down and be caught and displayed in the catch block.

//Fetch :the fetch api is used to get a resource from either an internal or external path or url and it is promised based , meaning that when ever you make use of the fetch it is always going to give a response as a promise which must be resolved using the await keyword.

// Most Modern api's have their data in a json format (JAvascript object Notation), and for us to get the items from there we make use of the .json which is going to return a promise as well and to resolve that promise we make use of our await key word once again.

const fetchCategoryProducts = async (category) => {
  const productsContainer = document.getElementById("products-container");
  const paginationContainer = document.getElementById("pagination-container");

  const itemsPerPage = 8;
  let currentPage = 1;
  try {
    // show loading message
    if (productsContainer) {
      productsContainer.innerHTML = "<p> Loading Products... </p>";
    }
    //fetching the products category
    const response = await fetch(
      `https://dummyjson.com/products/category/${category}`
    );
    if (!response.ok) {
      throw new Error(
        `Failed to Fetch products Category. status: ${response.status}`
      );
    }
    const products = await response.json();
    console.log("products", products);

    const totalProducts = products.products.length;
    if (totalProducts === 0) {
      productsContainer.innerHTML =
        "<p> No Products Found in this Category... </p>";
      return;
    }
    const renderPage = (page) => {
      const startIndex = (page - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      const productsToDisplay = products.products.slice(startIndex, endIndex);

      // Make sure the previous products has been cleared before rendering new one
      productsContainer.innerHTML = " ";
      productsToDisplay.forEach((product) => {
        const productHTML = `
            <div class="product">
              <div class="product-card">
                <div class="popular-product-img"> 
                  <img src="${product.images[0]}" alt="${
          product.title
        }" class="product-image">
                </div>
                <div class="product-info">
                  <h3 class="product-name"> 
                    <a class="shorten" href="product-details.html?id=${
                      product.id
                    }">${product.title}</a>
                  </h3>
                  <p class="product-price">$${product.price.toFixed(2)}</p>
                  <p class="product-availability">${
                    product.availabilityStatus || "In Stock"
                  }     </p>
                </div>
                <div class="category-top"> 
                  <p>${product.category}</p> 
                </div>
                <!-- Hover Controls -->
                <div class="product-controls">
                  <button class="add-to-cart">
                    <i class="ri-shopping-cart-2-line"></i> 
                  </button>
                  <button class="add-to-wishlist">
                    <i class="ri-heart-line"></i> 
                  </button>
                </div>
              </div>
            </div>
          `;
        productsContainer.insertAdjacentHTML("beforeend", productHTML);
      });
    };

    // function to render pagination buttons
    const renderPagination = () => {
      const totalPages = Math.ceil(totalProducts / itemsPerPage);

      // clear previous Pagination buttons
      paginationContainer.innerHTML = "";

      // create buttons dynamically
      for (let i = 1; i <= totalPages; i++) {
        const button = document.createElement("button");

        button.textContent = i;
        button.className = i === currentPage ? "active" : " ";

        // changing the pages when i click on the pagination buttons
        button.addEventListener("click", () => {
          renderPage(i);
          renderPagination();
        });
        paginationContainer.append(button);
      }
    };
    // Intial rendering
    renderPage(currentPage);
    renderPagination();
  } catch (err) {
    console.log(err);
  }
};
window.addEventListener("load", () => {
  const category = new URLSearchParams(window.location.search).get("category");
  if (category) {
    fetchCategoryProducts(category);
  } else {
    console.error("NO Category Found in the URL");
  }
});
