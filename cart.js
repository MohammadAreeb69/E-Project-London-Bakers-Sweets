// Initialize cart from localStorage or empty array
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Update cart count in the navbar
function updateCartCount() {
    const cartCount = document.querySelector('.cart-count');
    if (cartCount) {
        cartCount.textContent = cart.reduce((total, item) => total + item.quantity, 0);
    }
}

// Add item to cart
function addToCart(name, price) {
    // Check if item already exists in cart
    const existingItem = cart.find(item => item.name === name);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            name: name,
            price: parseFloat(price),
            quantity: 1
        });
    }
    
    // Save to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Update cart count
    updateCartCount();
    
    // Show notification
    showNotification(`${name} added to cart!`);
}

// Show notification
function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background-color: #28a745;
        color: white;
        padding: 15px 25px;
        border-radius: 5px;
        z-index: 1000;
        animation: slideIn 0.5s ease-out;
    `;
    notification.textContent = message;
    
    // Add notification to body
    document.body.appendChild(notification);
    
    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.5s ease-out';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 500);
    }, 3000);
}

// Remove item from cart
function removeFromCart(index) {
    cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    
    // If we're on the cart page, update the cart display
    if (window.location.pathname.includes('cart')) {
        displayCart();
    }
}

// Update item quantity
function updateQuantity(index, newQuantity) {
    if (newQuantity > 0) {
        cart[index].quantity = newQuantity;
    } else {
        cart.splice(index, 1);
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    
    // If we're on the cart page, update the cart display
    if (window.location.pathname.includes('cart')) {
        displayCart();
    }
}

// Calculate cart total
function calculateTotal() {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
}

// Display cart contents
function displayCart() {
    const cartContainer = document.getElementById('cart-items');
    if (!cartContainer) return;
    
    if (cart.length === 0) {
        cartContainer.innerHTML = '<div class="alert alert-info">Your cart is empty. <a href="products.html">Continue shopping</a>.</div>';
        document.getElementById('checkout-section').style.display = 'none';
        return;
    }
    
    let html = `
        <div class="table-responsive">
            <table class="table table-striped">
                <thead>
                    <tr>
                        <th>Product</th>
                        <th>Price</th>
                        <th>Quantity</th>
                        <th>Subtotal</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
    `;
    
    cart.forEach((item, index) => {
        html += `
            <tr>
                <td>${item.name}</td>
                <td>$${item.price.toFixed(2)}</td>
                <td>
                    <div class="input-group">
                        <button class="btn btn-sm btn-outline-secondary quantity-btn" onclick="updateQuantity(${index}, ${item.quantity - 1})">-</button>
                        <input type="number" min="1" value="${item.quantity}" class="form-control text-center quantity-input" onchange="updateQuantity(${index}, parseInt(this.value))">
                        <button class="btn btn-sm btn-outline-secondary quantity-btn" onclick="updateQuantity(${index}, ${item.quantity + 1})">+</button>
                    </div>
                </td>
                <td>$${(item.price * item.quantity).toFixed(2)}</td>
                <td><button class="btn btn-sm btn-danger" onclick="removeFromCart(${index})"><i class="bi bi-trash"></i> Remove</button></td>
            </tr>
        `;
    });
    
    html += `
                </tbody>
            </table>
        </div>
        <div class="text-end mt-3">
            <h4>Total: $${calculateTotal().toFixed(2)}</h4>
        </div>
    `;
    
    cartContainer.innerHTML = html;
    document.getElementById('checkout-section').style.display = 'block';
}

// Clear entire cart
function clearCart() {
    cart = [];
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    
    // If we're on the cart page, update the cart display
    if (window.location.pathname.includes('cart')) {
        displayCart();
    }
    
    showNotification('Your cart has been cleared');
}

// Process checkout
function processCheckout() {
    // Validate form
    const form = document.getElementById('checkout-form');
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }
    
    // Collect form data
    const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        address: document.getElementById('address').value,
        city: document.getElementById('city').value,
        postalCode: document.getElementById('postal-code').value,
        paymentMethod: document.querySelector('input[name="payment"]:checked').value,
    };
    
    // Process payment (in a real app, this would connect to a payment processor)
    showNotification('Processing payment...');
    
    // Simulate a payment process
    setTimeout(() => {
        // Create order object (in a real app, this would be sent to a backend)
        const order = {
            orderNumber: generateOrderNumber(),
            customer: formData,
            items: cart,
            total: calculateTotal(),
            date: new Date().toISOString()
        };
        
        // Store the order in localStorage for demo purposes
        const orders = JSON.parse(localStorage.getItem('orders')) || [];
        orders.push(order);
        localStorage.setItem('orders', JSON.stringify(orders));
        
        // Clear the cart after successful order
        clearCart();
        
        // Show success page
        showOrderConfirmation(order);
    }, 1500);
}

// Generate a random order number
function generateOrderNumber() {
    return 'ORD-' + Math.random().toString(36).substr(2, 9).toUpperCase();
}

// Show order confirmation
function showOrderConfirmation(order) {
    const cartContainer = document.getElementById('cart-container');
    if (!cartContainer) return;
    
    let itemsHtml = '';
    order.items.forEach(item => {
        itemsHtml += `
            <tr>
                <td>${item.name}</td>
                <td>${item.quantity}</td>
                <td>$${item.price.toFixed(2)}</td>
                <td>$${(item.price * item.quantity).toFixed(2)}</td>
            </tr>
        `;
    });
    
    const html = `
        <div class="order-confirmation">
            <div class="alert alert-success">
                <h4><i class="bi bi-check-circle"></i> Order Placed Successfully!</h4>
                <p>Thank you for your order. Your order number is <strong>${order.orderNumber}</strong>.</p>
            </div>
            
            <div class="card mb-4">
                <div class="card-header">
                    <h5 class="mb-0">Order Summary</h5>
                </div>
                <div class="card-body">
                    <p><strong>Order Date:</strong> ${new Date(order.date).toLocaleString()}</p>
                    <p><strong>Name:</strong> ${order.customer.name}</p>
                    <p><strong>Email:</strong> ${order.customer.email}</p>
                    <p><strong>Shipping Address:</strong> ${order.customer.address}, ${order.customer.city}, ${order.customer.postalCode}</p>
                    <p><strong>Payment Method:</strong> ${order.customer.paymentMethod}</p>
                    
                    <h6 class="mt-4 mb-3">Items Ordered:</h6>
                    <div class="table-responsive">
                        <table class="table table-sm">
                            <thead>
                                <tr>
                                    <th>Product</th>
                                    <th>Quantity</th>
                                    <th>Price</th>
                                    <th>Subtotal</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${itemsHtml}
                            </tbody>
                            <tfoot>
                                <tr>
                                    <th colspan="3" class="text-end">Total:</th>
                                    <th>$${order.total.toFixed(2)}</th>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </div>
            </div>
            
            <div class="text-center mb-4">
                <a href="index.html" class="btn btn-primary me-2">Return to Home</a>
                <a href="products.html" class="btn btn-outline-primary">Continue Shopping</a>
            </div>
        </div>
    `;
    
    cartContainer.innerHTML = html;
}

// Add event listeners to all "Add to Cart" buttons
document.addEventListener('DOMContentLoaded', function() {
    // Add click listeners to all add-to-cart buttons
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function() {
            const name = this.getAttribute('data-name');
            const price = this.getAttribute('data-price');
            addToCart(name, price);
        });
    });
    
    // Initialize cart count
    updateCartCount();
    
    // If we're on the cart page, display the cart
    if (window.location.pathname.includes('cart')) {
        displayCart();
        
        // Add event listener to checkout button
        const checkoutBtn = document.getElementById('checkout-btn');
        if (checkoutBtn) {
            checkoutBtn.addEventListener('click', processCheckout);
        }
        
        // Add event listener to clear cart button
        const clearCartBtn = document.getElementById('clear-cart-btn');
        if (clearCartBtn) {
            clearCartBtn.addEventListener('click', clearCart);
        }
    }
});

// Add CSS animation styles
const styleSheet = document.createElement('style');
styleSheet.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .quantity-input {
        width: 50px;
    }
    
    .quantity-btn {
        font-weight: bold;
    }
    
    .order-confirmation {
        animation: fadeIn 0.5s ease-out;
    }
    
    @keyframes fadeIn {
        from {
            opacity: 0;
        }
        to {
            opacity: 1;
        }
    }
`;
document.head.appendChild(styleSheet);