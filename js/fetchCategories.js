console.log("coming from the fetch categories js");

const fetchCategories = async () => {
  try {
    // All the things you want to request from the api
    const response = await fetch(
      "https://dummyjson.com/products/category-list"
    );
    if (!response.ok) {
      throw new Error(`Failed to fetch Categories. Status:${response.status}`);
    }
    // When working with fetch it returns a promise for you and for you to resolve that promise you attach the await keyword to it
    console.log(response);
    const categories = await response.json();
    console.log(categories);

    //  Select the container where the categories will be inserted or displayed
    const categoriesContainer = document.querySelector(
      ".custom-hero-categories-list"
    );
    //if there is no class of .custom-hero-categories-list
    if (!categoriesContainer) {
      console.log("Categories container not found in the HTML");
      return;
    }
    // Check if there are items returned in the categories variable from the api , then we want to display that
    if (categories && categories.length > 0) {
      categories.forEach((category) => {
        const categoryHTML = `<li><a href="categoryProducts.html?category=${category}">${category} </a></li>`;
        categoriesContainer.insertAdjacentHTML("beforeend", categoryHTML);
      });
    } else {
      categoriesContainer.innerHTML =
        "<p> No Categories Available at the moment </p>";
    }
  } catch (err) {
    // Should in case you have any errors it catch and display that in the console
    console.log(err);
  } finally {
    // Any code that you you want to run regardless of if the promise was fuillfiled or not

    const preloader = document.getElementById("preloder");
    if (preloader) preloader.style.display = "none";
    const mainContent = document.getElementById("mainContent");
    if (mainContent) mainContent.style.display = "block";
  }
};

window.addEventListener('load', fetchCategories)
