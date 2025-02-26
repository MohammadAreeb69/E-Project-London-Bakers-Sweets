// Function to format price
function formatPrice(price) {
    return parseFloat(price).toFixed(2);
}

// Function to update cart summary
function updateCartSummary() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartSummary = document.getElementById('cart-summary');
    const cartCountCheckout = document.getElementById('cart-count-checkout');
    
    // Clear existing summary
    cartSummary.innerHTML = '';
    
    let total = 0;
    let itemCount = 0;

    // Add each item to the summary
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        itemCount += item.quantity;

        const li = document.createElement('li');
        li.className = 'list-group-item d-flex justify-content-between lh-sm';
        li.innerHTML = `
            <div>
                <h6 class="my-0">${item.name}</h6>
                <small class="text-muted">Quantity: ${item.quantity}</small>
            </div>
            <span class="text-muted">$${formatPrice(itemTotal)}</span>
        `;
        cartSummary.appendChild(li);
    });

    // Add total
    const totalLi = document.createElement('li');
    totalLi.className = 'list-group-item d-flex justify-content-between';
    totalLi.innerHTML = `
        <span>Total (USD)</span>
        <strong>$${formatPrice(total)}</strong>
    `;
    cartSummary.appendChild(totalLi);

    // Update cart count
    cartCountCheckout.textContent = itemCount;
}

// Form validation
function validateForm(event) {
    event.preventDefault();
    
    const form = event.target;
    if (!form.checkValidity()) {
        event.stopPropagation();
        form.classList.add('was-validated');
        return;
    }

    // If form is valid, process the order
    processOrder();
}

// Process the order
function processOrder() {
    // Get form data
    const formData = {
        firstName: document.getElementById('firstName').value,
        lastName: document.getElementById('lastName').value,
        email: document.getElementById('email').value,
        address: document.getElementById('address').value,
        country: document.getElementById('country').value,
        city: document.getElementById('city').value,
        postcode: document.getElementById('postcode').value
    };

    // Here you would typically send this data to your server
    // For now, we'll just show a success message and clear the cart
    alert('Order placed successfully! Thank you for shopping with us.');
    
    // Clear the cart
    localStorage.removeItem('cart');
    
    // Redirect to home page
    window.location.href = 'index.html';
}

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    // Update cart summary
    updateCartSummary();

    // Add form validation
    const form = document.getElementById('checkout-form');
    form.addEventListener('submit', validateForm);

    // Add input validation for card details
    const ccNumber = document.getElementById('cc-number');
    ccNumber.addEventListener('input', function() {
        this.value = this.value.replace(/[^\d]/g, '').substring(0, 16);
    });

    const ccExpiration = document.getElementById('cc-expiration');
    ccExpiration.addEventListener('input', function() {
        this.value = this.value.replace(/[^\d/]/g, '').substring(0, 5);
        if (this.value.length === 2 && !this.value.includes('/')) {
            this.value += '/';
        }
    });

    const ccCvv = document.getElementById('cc-cvv');
    ccCvv.addEventListener('input', function() {
        this.value = this.value.replace(/[^\d]/g, '').substring(0, 3);
    });
});