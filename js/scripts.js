// Preloader functionality
window.addEventListener('load', function() {
    const preloader = document.getElementById('preloader');
    preloader.style.opacity = '0';
    setTimeout(() => {
        preloader.style.display = 'none';
    }, 500);
});

// Reveal elements on scroll
function revealElements() {
    const elements = document.querySelectorAll('.reveal');
    const windowHeight = window.innerHeight;
    
    elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        if (elementTop < windowHeight - 100) {
            element.classList.add('visible');
        }
    });
}

window.addEventListener('scroll', revealElements);
window.addEventListener('load', revealElements);

// Featured products slider initialization
document.addEventListener('DOMContentLoaded', function() {
    if (typeof Swiper !== 'undefined') {
        new Swiper('.featured-products', {
            slidesPerView: 1,
            spaceBetween: 20,
            loop: true,
            autoplay: {
                delay: 3000,
                disableOnInteraction: false,
            },
            pagination: {
                el: '.swiper-pagination',
                clickable: true
            },
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },
            breakpoints: {
                640: {
                    slidesPerView: 2,
                },
                1024: {
                    slidesPerView: 3,
                }
            }
        });
    }
    
    // Show/hide more products functionality
    const viewAllCarnesBtn = document.getElementById('view-all-carnes');
    const hideAllCarnesBtn = document.getElementById('hide-all-carnes');
    const moreCarnesProducts = document.getElementById('more-carnes-products');
    
    if(viewAllCarnesBtn && hideAllCarnesBtn && moreCarnesProducts) {
        viewAllCarnesBtn.addEventListener('click', function() {
            moreCarnesProducts.classList.remove('hidden');
            viewAllCarnesBtn.classList.add('hidden');
            hideAllCarnesBtn.classList.remove('hidden');
        });
        
        hideAllCarnesBtn.addEventListener('click', function() {
            moreCarnesProducts.classList.add('hidden');
            hideAllCarnesBtn.classList.add('hidden');
            viewAllCarnesBtn.classList.remove('hidden');
            
            // Scroll back to the carnes section
            document.getElementById('carnes-section').scrollIntoView({ behavior: 'smooth' });
        });
    }
});

// Search toggle
document.getElementById('search-toggle').addEventListener('click', function() {
    const searchBar = document.getElementById('search-bar');
    searchBar.classList.toggle('hidden');
    if (!searchBar.classList.contains('hidden')) {
        document.getElementById('search-input').focus();
    }
});

// Search functionality
function searchProducts() {
    const searchQuery = document.getElementById('search-input').value.toLowerCase().trim();
    if (search    const searchQuery = document.getElementById('search-input').value.toLowerCase().trim();
    if (searchQuery === '') return;
    
    const productCards = document.querySelectorAll('.product-card');
    let hasResults = false;
    
    productCards.forEach(card => {
        const productName = card.querySelector('h3').textContent.toLowerCase();
        const productDesc = card.querySelector('p').textContent.toLowerCase();
        
        if (productName.includes(searchQuery) || productDesc.includes(searchQuery)) {
            card.style.display = 'block';
            card.classList.add('search-highlight');
            setTimeout(() => {
                card.classList.remove('search-highlight');
            }, 2000);
            hasResults = true;
        } else {
            card.style.display = 'none';
        }
    });
    
    // Show message if no results
    if (!hasResults) {
        showNotification('No se encontraron productos');
    } else {
        // Activar la categoría "Todos"
        document.querySelectorAll('.category-button').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector('[data-category="all"]').classList.add('active');
    }
}

// Category filter
document.querySelectorAll('.category-button').forEach(button => {
    button.addEventListener('click', function() {
        const category = this.dataset.category;
        
        // Update active class
        document.querySelectorAll('.category-button').forEach(btn => {
            btn.classList.remove('active');
        });
        this.classList.add('active');
        
        // Filter products
        const productCards = document.querySelectorAll('.product-card');
        
        productCards.forEach(card => {
            if (category === 'all' || card.dataset.category === category) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
        
        // Close search bar
        document.getElementById('search-bar').classList.add('hidden');
        
        // Scroll to products section
        const targetSection = document.getElementById(category + '-section');
        if (targetSection) {
            targetSection.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// Scroll to top button
const scrollToTopBtn = document.getElementById('scroll-to-top');

window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
        scrollToTopBtn.classList.add('visible');
    } else {
        scrollToTopBtn.classList.remove('visible');
    }
});

scrollToTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Cart functionality - Enhanced with animations and notifications
let cart = [];
const cartButton = document.getElementById('cart-button');
const cartCount = document.getElementById('cart-count');
const shoppingCart = document.getElementById('shopping-cart');
const cartItems = document.getElementById('cart-items');
const cartSummary = document.getElementById('cart-summary');
const emptyCartMessage = document.getElementById('empty-cart-message');
const orderForm = document.getElementById('order-form');
const checkoutSection = document.getElementById('checkout-section');
const orderConfirmation = document.getElementById('order-confirmation');
const placeOrderBtn = document.getElementById('place-order-btn');
const orderNumber = document.getElementById('order-number');
const pickupConfirmation = document.getElementById('pickup-confirmation');
const notification = document.getElementById('notification');
const notificationMessage = document.getElementById('notification-message');
const proceedToCheckout = document.getElementById('proceed-to-checkout');

// Function to show notification
function showNotification(message) {
    notificationMessage.textContent = message;
    notification.classList.add('show');
    setTimeout(() => {
        notification.classList.remove('show');
    }, 2000);
}

// Function to add items to cart (enhanced with better feedback)
function addToCart(name, price) {
    // Check if the product is already in the cart
    const existingItem = cart.find(item => item.name === name);
    
    if (existingItem) {
        existingItem.quantity += 1;
        showNotification(`Añadido otro ${name} al carrito`);
    } else {
        cart.push({
            name: name,
            price: price,
            quantity: 1
        });
        showNotification(`${name} añadido al carrito`);
        // Add a subtle pulse animation to the cart button
        cartButton.classList.add('pulse');
        setTimeout(() => {
            cartButton.classList.remove('pulse');
        }, 700);
    }
    
    updateCart();
}

// Function to update cart display - Enhanced with animations
function updateCart() {
    // Update cart count with animation
    const previousCount = parseInt(cartCount.textContent);
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    
    cartCount.textContent = totalItems;
    
    if (totalItems > previousCount) {
        cartCount.classList.add('scale-pulse');
        setTimeout(() => {
            cartCount.classList.remove('scale-pulse');
        }, 300);
    }
    
    // If cart is empty, show message and hide summary
    if (totalItems === 0) {
        emptyCartMessage.classList.remove('hidden');
        cartSummary.classList.add('hidden');
        return;
    }
    
    // Otherwise, update cart items and show summary
    emptyCartMessage.classList.add('hidden');
    cartSummary.classList.remove('hidden');
    
    // Clear existing items
    cartItems.innerHTML = '';
    
    // Add each item to the cart with animation
    cart.forEach((item, index) => {
        const itemElement = document.createElement('div');
        itemElement.className = 'cart-item flex justify-between items-center animate-fade-in';
        
        const totalPrice = item.price * item.quantity;
        
        itemElement.innerHTML = `
            <div>
                <h4 class="font-bold">${item.name}</h4>
                <p class="text-gray-600">₡${item.price.toLocaleString()} x ${item.quantity}</p>
            </div>
            <div class="flex items-center">
                <span class="font-bold mr-4">₡${totalPrice.toLocaleString()}</span>
                <div class="flex items-center">
                    <button class="w-7 h-7 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300" onclick="decreaseQuantity(${index})">
                        <i class="fas fa-minus text-gray-600"></i>
                    </button>
                    <span class="mx-2">${item.quantity}</span>
                    <button class="w-7 h-7 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300" onclick="increaseQuantity(${index})">
                        <i class="fas fa-plus text-gray-600"></i>
                    </button>
                </div>
                <button class="ml-3 text-red-500 hover:text-red-700" onclick="removeItem(${index})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        
        cartItems.appendChild(itemElement);
    });
    
    // Update totals with animation
    const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    const tax = subtotal * 0.13;
    const total = subtotal + tax;
    
    document.getElementById('subtotal').textContent = `₡${subtotal.toLocaleString()}`;
    document.getElementById('tax').textContent = `₡${tax.toLocaleString()}`;
    document.getElementById('total').textContent = `₡${total.toLocaleString()}`;
    
    // Add animation to the total
    document.getElementById('total').classList.add('highlight');
    setTimeout(() => {
        document.getElementById('total').classList.remove('highlight');
    }, 500);
}

// Increase quantity of an item
function increaseQuantity(index) {
    cart[index].quantity += 1;
    updateCart();
}

// Decrease quantity of an item
function decreaseQuantity(index) {
    if (cart[index].quantity > 1) {
        cart[index].quantity -= 1;
        updateCart();
    } else {
        removeItem(index);
    }
}

// Remove an item from the cart with animation
function removeItem(index) {
    const itemName = cart[index].name;
    cart.splice(index, 1);
    updateCart();
    showNotification(`${itemName} eliminado del carrito`);
}

// Toggle cart visibility on button click with animation
cartButton.addEventListener('click', () => {
    if (shoppingCart.classList.contains('hidden')) {
        shoppingCart.classList.remove('hidden');
        shoppingCart.classList.add('animate-slide-in');
        setTimeout(() => {
            shoppingCart.classList.remove('animate-slide-in');
        }, 300);
        
        // Hide order form when showing cart
        orderForm.classList.add('hidden');
        checkoutSection.classList.add('hidden');
        
        // Scroll to cart
        shoppingCart.scrollIntoView({ behavior: 'smooth' });
    } else {
        shoppingCart.classList.add('animate-slide-out');
        setTimeout(() => {
            shoppingCart.classList.add('hidden');
            shoppingCart.classList.remove('animate-slide-out');
        }, 300);
    }
});

// Proceed to checkout button with enhanced UX
if(proceedToCheckout) {
    proceedToCheckout.addEventListener('click', () => {
        if (cart.length > 0) {
            shoppingCart.classList.add('animate-slide-out');
            
            setTimeout(() => {
                shoppingCart.classList.add('hidden');
                shoppingCart.classList.remove('animate-slide-out');
                
                // Show order form with animation
                orderForm.classList.remove('hidden');
                orderForm.classList.add('animate-slide-in');
                
                checkoutSection.classList.remove('hidden');
                checkoutSection.classList.add('animate-fade-in');
                
                setTimeout(() => {
                    orderForm.classList.remove('animate-slide-in');
                    checkoutSection.classList.remove('animate-fade-in');
                }, 300);
                
                // Set default date to today
                const today = new Date();
                const yyyy = today.getFullYear();
                let mm = today.getMonth() + 1;
                let dd = today.getDate();
                if (dd < 10) dd = '0' + dd;
                if (mm < 10) mm = '0' + mm;
                
                // Set default date to tomorrow to ensure order preparation time
                const tomorrow = new Date();
                tomorrow.setDate(tomorrow.getDate() + 1);
                const tYyyy = tomorrow.getFullYear();
                let tMm = tomorrow.getMonth() + 1;
                let tDd = tomorrow.getDate();
                if (tDd < 10) tDd = '0' + tDd;
                if (tMm < 10) tMm = '0' + tMm;
                
                document.getElementById('pickup-date').value = `${tYyyy}-${tMm}-${tDd}`;
                document.getElementById('pickup-date').min = `${yyyy}-${mm}-${dd}`; // Can't pick a date in the past
                
                // Set default pickup time
                document.getElementById('pickup-time').value = "10:00";
                
                // Scroll to order form
                orderForm.scrollIntoView({ behavior: 'smooth' });
            }, 300);
        }
    });
}

// View all products buttons functionality
const viewAllCarnesBtn = document.getElementById('view-all-carnes');
if (viewAllCarnesBtn) {
    viewAllCarnesBtn.addEventListener('click', function() {
        const moreCarnesProducts = document.getElementById('more-carnes-products');
        const hideAllCarnesBtn = document.getElementById('hide-all-carnes');
        
        if (moreCarnesProducts && hideAllCarnesBtn) {
            moreCarnesProducts.classList.remove('hidden');
            viewAllCarnesBtn.classList.add('hidden');
            hideAllCarnesBtn.classList.remove('hidden');
        }
    });
}

const hideAllCarnesBtn = document.getElementById('hide-all-carnes');
if (hideAllCarnesBtn) {
    hideAllCarnesBtn.addEventListener('click', function() {
        const moreCarnesProducts = document.getElementById('more-carnes-products');
        
        if (moreCarnesProducts && viewAllCarnesBtn) {
            moreCarnesProducts.classList.add('hidden');
            hideAllCarnesBtn.classList.add('hidden');
            viewAllCarnesBtn.classList.remove('hidden');
            
            // Scroll back to the carnes section
            document.getElementById('carnes-section').scrollIntoView({ behavior: 'smooth' });
        }
    });
}

// Place order button functionality - Enhanced with validation and feedback
if (placeOrderBtn) {
    placeOrderBtn.addEventListener('click', () => {
        // Get form values
        const name = document.getElementById('name').value;
        const phone = document.getElementById('phone').value;
        const sucursal = document.getElementById('sucursal').value;
        const pickupDate = document.getElementById('pickup-date').value;
        const pickupTime = document.getElementById('pickup-time').value;
        const cardNumber = document.getElementById('card-number').value;
        const cardExpiry = document.getElementById('expiry').value;
        const cardCvv = document.getElementById('cvv').value;
        const cardHolder = document.getElementById('card-holder').value;
        
        // Basic validation with helpful feedback
        if (!name) {
            showNotification('Por favor ingrese su nombre');
            document.getElementById('name').focus();
            return;
        }
        if (!phone) {
            showNotification('Por favor ingrese su teléfono');
            document.getElementById('phone').focus();
            return;
        }
        if (!sucursal) {
            showNotification('Por favor seleccione una sucursal');
            document.getElementById('sucursal').focus();
            return;
        }
        if (!pickupDate) {
            showNotification('Por favor seleccione fecha de recogida');
            document.getElementById('pickup-date').focus();
            return;
        }
        if (!pickupTime) {
            showNotification('Por favor seleccione hora de recogida');
            document.getElementById('pickup-time').focus();
            return;
        }
        if (!cardNumber || cardNumber.replace(/\s/g, '').length < 16) {
            showNotification('Por favor ingrese un número de tarjeta válido');
            document.getElementById('card-number').focus();
            return;
        }
        if (!cardExpiry) {
            showNotification('Por favor ingrese fecha de expiración');
            document.getElementById('expiry').focus();
            return;
        }
        if (!cardCvv) {
            showNotification('Por favor ingrese el código CVV');
            document.getElementById('cvv').focus();
            return;
        }
        if (!cardHolder) {
            showNotification('Por favor ingrese el nombre del titular');
            document.getElementById('card-holder').focus();
            return;
        }
        
        // Format date and time for display
        const formattedDate = new Date(pickupDate).toLocaleDateString('es-CR');
        const timeValue = pickupTime;
        
        // Hide order form and show loading indicator
        orderForm.classList.add('animate-fade-out');
        checkoutSection.classList.add('animate-fade-out');
        
        setTimeout(() => {
            orderForm.classList.add('hidden');
            checkoutSection.classList.add('hidden');
            
            // Show "Processing" indicator
            const processingIndicator = document.createElement('div');
            processingIndicator.className = 'text-center py-10';
            processingIndicator.innerHTML = `
                <div class="loader mx-auto mb-4"></div>
                <p class="text-gray-600">Procesando su pedido...</p>
            `;
            orderForm.parentNode.insertBefore(processingIndicator, orderForm);
            
            // Simulate processing delay
            setTimeout(() => {
                // Remove processing indicator
                processingIndicator.remove();
                
                // Generate random order number
                const orderNum = Math.floor(100000 + Math.random() * 900000);
                orderNumber.textContent = `Número de pedido: #${orderNum}`;
                
                // Show pickup time in confirmation
                pickupConfirmation.innerHTML = `<p><strong>Fecha de recogida:</strong> ${formattedDate}</p>
                                             <p><strong>Hora de recogida:</strong> ${timeValue}</p>
                                             <p><strong>Sucursal:</strong> ${document.getElementById('sucursal').options[document.getElementById('sucursal').selectedIndex].text}</p>`;
                
                // Show confirmation with animation
                orderConfirmation.classList.remove('hidden');
                orderConfirmation.classList.add('animate-fade-in');
                
                // Scroll to confirmation
                orderConfirmation.scrollIntoView({ behavior: 'smooth' });
                
                // Reset cart
                cart = [];
                updateCart();
            }, 1500);
        }, 300);
    });
}

// Initialize cart
updateCart();

// Basic card input formatting - enhanced with validation feedback
const cardNumberInput = document.getElementById('card-number');
if (cardNumberInput) {
    cardNumberInput.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 16) value = value.slice(0, 16);
        
        // Format with spaces
        let formattedValue = '';
        for (let i = 0; i < value.length; i++) {
            if (i > 0 && i % 4 === 0) {
                formattedValue += ' ';
            }
            formattedValue += value[i];
        }
        
        e.target.value = formattedValue;
        
        // Visual feedback based on card length
        if (value.length === 16) {
            e.target.classList.add('border-green-500');
        } else {
            e.target.classList.remove('border-green-500');
        }
    });
}

const expiryInput = document.getElementById('expiry');
if (expiryInput) {
    expiryInput.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 4) value = value.slice(0, 4);
        
        if (value.length > 2) {
            e.target.value = value.slice(0, 2) + '/' + value.slice(2);
        } else {
            e.target.value = value;
        }
    });
}

const cvvInput = document.getElementById('cvv');
if (cvvInput) {
    cvvInput.addEventListener('input', function(e) {
        e.target.value = e.target.value.replace(/\D/g, '').slice(0, 4);
    });
}

// Set pickup date minimum to today
const pickupDateInput = document.getElementById('pickup-date');
if (pickupDateInput) {
    const today = new Date().toISOString().split('T')[0];
    pickupDateInput.setAttribute('min', today);
}

// Add CSS rule for animations
const styleEl = document.createElement('style');
document.head.appendChild(styleEl);
const styleSheet = styleEl.sheet;
styleSheet.insertRule(`
    @keyframes scale-pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.3); }
        100% { transform: scale(1); }
    }
`, 0);
styleSheet.insertRule(`.scale-pulse { animation: scale-pulse 0.3s; }`, 1);
styleSheet.insertRule(`
    @keyframes highlight {
        0% { color: inherit; }
        50% { color: var(--azul-bm); }
        100% { color: inherit; }
    }
`, 2);
styleSheet.insertRule(`.highlight { animation: highlight 0.5s; }`, 3);
styleSheet.insertRule(`
    @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.1); }
        100% { transform: scale(1); }
    }
`, 4);
styleSheet.insertRule(`.pulse { animation: pulse 0.7s; }`, 5);
styleSheet.insertRule(`
    @keyframes fade-in {
        0% { opacity: 0; }
        100% { opacity: 1; }
    }
`, 6);
styleSheet.insertRule(`.animate-fade-in { animation: fade-in 0.3s; }`, 7);
styleSheet.insertRule(`
    @keyframes fade-out {
        0% { opacity: 1; }
        100% { opacity: 0; }
    }
`, 8);
styleSheet.insertRule(`.animate-fade-out { animation: fade-out 0.3s; }`, 9);
styleSheet.insertRule(`
    @keyframes slide-in {
        0% { opacity: 0; transform: translateY(20px); }
        100% { opacity: 1; transform: translateY(0); }
    }
`, 10);
styleSheet.insertRule(`.animate-slide-in { animation: slide-in 0.3s; }`, 11);
styleSheet.insertRule(`
    @keyframes slide-out {
        0% { opacity: 1; transform: translateY(0); }
        100% { opacity: 0; transform: translateY(20px); }
    }
`, 12);
styleSheet.insertRule(`.animate-slide-out { animation: slide-out 0.3s; }`, 13);
styleSheet.insertRule(`
    .search-highlight {
        animation: highlight-search 2s;
    }
    @keyframes highlight-search {
        0% { box-shadow: 0 0 0 2px rgba(0, 118, 255, 0); }
        25% { box-shadow: 0 0 0 2px rgba(0, 118, 255, 0.6); }
        75% { box-shadow: 0 0 0 2px rgba(0, 118, 255, 0.6); }
        100% { box-shadow: 0 0 0 2px rgba(0, 118, 255, 0); }
    }
`, 14);
