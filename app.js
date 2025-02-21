// Initialize cart from localStorage or as an empty array if not available
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// Add to Cart functionality
document.querySelectorAll(".add-to-cart").forEach(button => {
  button.addEventListener("click", function() {
    const name = this.dataset.name;
    const price = this.dataset.price;
    cart.push({ name, price });
    localStorage.setItem("cart", JSON.stringify(cart));
    alert(`${name} added to cart!`);
  });
});

// If on cart.html, load the cart items
if (document.getElementById("cart-items")) {
  const cartTable = document.getElementById("cart-items");
  cart.forEach((item, index) => {
    const row = cartTable.insertRow();
    row.innerHTML = `
      <td>${item.name}</td>
      <td>$${item.price}</td>
      <td><button class="btn btn-danger remove-item" data-index="${index}">Remove</button></td>
    `;
  });

  // Remove item from cart functionality
  document.querySelectorAll(".remove-item").forEach(button => {
    button.addEventListener("click", function() {
      const index = this.getAttribute("data-index");
      cart.splice(index, 1);
      localStorage.setItem("cart", JSON.stringify(cart));
      location.reload();
    });
  });
}

// Checkout button event listener on cart page
if (document.getElementById("checkout")) {
  document.getElementById("checkout").addEventListener("click", function() {
    window.location.href = "payment.html";
  });
}



document.getElementById("searchForm").addEventListener("submit", function(event) {
    event.preventDefault(); // Prevent form submission

    let searchQuery = document.getElementById("searchInput").value.trim().toLowerCase();
    if (searchQuery === "") return; // Ignore empty search

    // Get all product elements
    let allProducts = document.querySelectorAll(".product-item"); // Ensure all products have this class
    let foundProduct = null;

    allProducts.forEach(product => {
        let productName = product.getAttribute("data-name").toLowerCase();
        if (productName === searchQuery) {
            foundProduct = product;
        } else {
            product.style.display = "none"; // Hide non-matching products
        }
    });

    if (foundProduct) {
        foundProduct.style.display = "block"; // Show only the matched product
        foundProduct.scrollIntoView({ behavior: "smooth" });
    } else {
        // Redirect to another page if product isn't found here
        let productPages = ["products.html", "gift-hampers.html"];
        let foundOnPage = false;

        productPages.forEach(page => {
            fetch(page)
                .then(response => response.text())
                .then(html => {
                    let parser = new DOMParser();
                    let doc = parser.parseFromString(html, "text/html");
                    let products = doc.querySelectorAll(".product-item");

                    products.forEach(product => {
                        if (product.getAttribute("data-name").toLowerCase() === searchQuery) {
                            foundOnPage = true;
                            window.location.href = `${page}#${product.id}`;
                        }
                    });

                    if (!foundOnPage) {
                        alert("No exact match found!");
                    }
                });
        });
    }
});

document.getElementById("searchForm").addEventListener("submit", function (event) {
  event.preventDefault(); // Prevent form submission

  let searchQuery = document.getElementById("searchInput").value.trim().toLowerCase();
  if (searchQuery === "") return; // Ignore empty search

  // Get all product elements
  let allProducts = document.querySelectorAll(".product-item"); // Ensure all products have this class
  let found = false;

  allProducts.forEach(product => {
      let productName = product.getAttribute("data-name").toLowerCase();
      if (productName.includes(searchQuery)) {
          product.style.display = "block"; // Show matching products
          found = true;
      } else {
          product.style.display = "none"; // Hide non-matching products
      }
  });

  if (!found) {
      alert("No matching products found!");
  }
});




