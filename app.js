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
