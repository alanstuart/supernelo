document.addEventListener('DOMContentLoaded', function() {
    // Variables globales
    const sucursalModal = document.getElementById('sucursalModal');
    const sucursalBtn = document.getElementById('sucursalBtn');
    const sucursalActual = document.getElementById('sucursalActual');
    const sucursalLima = document.getElementById('sucursal-lima');
    const sucursalSanRafael = document.getElementById('sucursal-san-rafael');
    const cartBtn = document.getElementById('cartBtn');
    const cartModal = document.getElementById('cartModal');
    const checkoutModal = document.getElementById('checkoutModal');
    const confirmationModal = document.getElementById('confirmationModal');
    const btnCheckout = document.getElementById('btnCheckout');
    const btnContinueShopping = document.getElementById('btnContinueShopping');
    const closeButtons = document.querySelectorAll('.close');
    const categoriasTabs = document.querySelectorAll('.categoria-tab');
    const categoriasContent = document.querySelectorAll('.categoria-content');
    
    // Inicialización
    initializePage();
    
    function initializePage() {
        checkSucursalSelection();
        initEventListeners();
        updateCartDisplay();
        setupProductInteractions();
    }
    
    function checkSucursalSelection() {
        const selectedSucursal = localStorage.getItem('selectedSucursal');
        if (selectedSucursal) {
            sucursalActual.textContent = selectedSucursal;
        } else {
            showModal(sucursalModal);
        }
    }
    
    function initEventListeners() {
        sucursalBtn.addEventListener('click', () => showModal(sucursalModal));
        sucursalLima.addEventListener('click', () => selectSucursal('Sucursal Lima'));
        sucursalSanRafael.addEventListener('click', () => selectSucursal('Sucursal San Rafael'));
        
        cartBtn.addEventListener('click', () => showModal(cartModal));
        btnCheckout.addEventListener('click', () => {
            hideModal(cartModal);
            showModal(checkoutModal);
        });
        btnContinueShopping.addEventListener('click', () => {
            hideModal(confirmationModal);
            window.location.reload();
        });
        
        closeButtons.forEach(button => {
            button.addEventListener('click', function() {
                const modal = this.closest('.modal');
                hideModal(modal);
            });
        });
        
        window.addEventListener('click', function(event) {
            if (event.target.classList.contains('modal')) {
                hideModal(event.target);
            }
        });
        
        categoriasTabs.forEach(tab => {
            tab.addEventListener('click', function() {
                const categoria = this.getAttribute('data-categoria');
                changeActiveTab(this, categoria);
            });
        });
        
        document.getElementById('checkoutForm').addEventListener('submit', processOrder);
        
        setupTipoCompraListeners();
    }
    
    function selectSucursal(sucursalName) {
        localStorage.setItem('selectedSucursal', sucursalName);
        sucursalActual.textContent = sucursalName;
        hideModal(sucursalModal);
        
        const sucursalSelect = document.getElementById('sucursalRecogida');
        if (sucursalSelect) {
            sucursalSelect.value = sucursalName.includes('Lima') ? 'Lima' : 'San Rafael';
        }
    }
    
    function showModal(modal) {
        modal.style.display = 'flex';
        setTimeout(() => modal.classList.add('show'), 10);
    }
    
    function hideModal(modal) {
        modal.classList.remove('show');
        setTimeout(() => modal.style.display = 'none', 300);
    }
    
    function changeActiveTab(selectedTab, categoriaId) {
        categoriasTabs.forEach(tab => tab.classList.remove('active'));
        categoriasContent.forEach(content => content.classList.remove('active'));
        selectedTab.classList.add('active');
        document.getElementById(categoriaId).classList.add('active');
    }
    
    function setupProductInteractions() {
        const addToCartButtons = document.querySelectorAll('.btn-add-cart');
        addToCartButtons.forEach(button => {
            button.addEventListener('click', function() {
                const productCard = this.closest('.producto-card');
                const productId = this.getAttribute('data-id');
                const productName = this.getAttribute('data-nombre');
                const productPrice = parseFloat(this.getAttribute('data-precio'));
                const productUnit = this.getAttribute('data-unidad');
                
                const tipoCompra = productCard.querySelector('.tipo-compra').value;
                let quantity, amount;
                
                if (tipoCompra === 'peso') {
                    quantity = parseFloat(productCard.querySelector('.cantidad-input').value);
                    amount = productPrice * quantity;
                } else {
                    amount = parseFloat(productCard.querySelector('.monto-input').value);
                    quantity = parseFloat((amount / productPrice).toFixed(2));
                }
                
                addToCart(productId, productName, productPrice, quantity, amount, productUnit);
            });
        });
    }
    
    function setupTipoCompraListeners() {
        const tipoCompraSelects = document.querySelectorAll('.tipo-compra');
        tipoCompraSelects.forEach(select => {
            select.addEventListener('change', function() {
                const productCard = this.closest('.producto-card');
                const cantidadInput = productCard.querySelector('.input-cantidad');
                const montoInput = productCard.querySelector('.input-monto');
                if (this.value === 'peso') {
                    cantidadInput.style.display = 'flex';
                    montoInput.style.display = 'none';
                } else {
                    cantidadInput.style.display = 'none';
                    montoInput.style.display = 'flex';
                }
            });
        });
    }
    
    function addToCart(productId, productName, productPrice, quantity, amount, productUnit) {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        const existingProductIndex = cart.findIndex(item => item.id === productId);
        if (existingProductIndex !== -1) {
            cart[existingProductIndex].quantity += quantity;
            cart[existingProductIndex].amount += amount;
        } else {
            cart.push({ id: productId, name: productName, price: productPrice, quantity, amount, unit: productUnit });
        }
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartDisplay();
        showNotification(`${productName} agregado al carrito`);
    }
    
    function updateCartDisplay() {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const cartCount = document.getElementById('cartCount');
        const cartItems = document.getElementById('cartItems');
        const cartEmpty = document.getElementById('cartEmpty');
        const cartTotal = document.getElementById('cartTotal');
        const btnCheckout = document.getElementById('btnCheckout');
        
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        cartCount.textContent = totalItems;
        
        if (cart.length === 0) {
            cartItems.style.display = 'none';
            cartEmpty.style.display = 'flex';
            btnCheckout.disabled = true;
            cartTotal.textContent = '₡0';
            return;
        }
        
        cartItems.style.display = 'block';
        cartEmpty.style.display = 'none';
        btnCheckout.disabled = false;
        
        cartItems.innerHTML = '';
        let total = 0;
        cart.forEach((item, index) => {
            total += item.amount;
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            cartItem.innerHTML = `
                <div class="item-details">
                    <h4>${item.name}</h4>
                    <p>${item.quantity} ${item.unit} x ₡${item.price.toLocaleString('es-CR')}</p>
                </div>
                <div class="item-actions">
                    <div class="item-price">₡${item.amount.toLocaleString('es-CR')}</div>
                    <button class="btn-remove" onclick="removeFromCart(${index})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;
            cartItems.appendChild(cartItem);
        });
        cartTotal.textContent = `₡${total.toLocaleString('es-CR')}`;
    }
    
    function showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        document.body.appendChild(notification);
        setTimeout(() => {
            notification.classList.add('show');
            setTimeout(() => {
                notification.classList.remove('show');
                setTimeout(() => {
                    document.body.removeChild(notification);
                }, 300);
            }, 3000);
        }, 100);
    }
    
    function processOrder(event) {
        event.preventDefault();
        if (!validateCheckoutForm()) return;
        
        const nombreCompleto = document.getElementById('nombreCompleto').value;
        const telefono = document.getElementById('telefono').value;
        const sucursal = document.getElementById('sucursalRecogida').value;
        const fechaRecogida = document.getElementById('fechaRecogida').value;
        const horaRecogida = document.getElementById('horaRecogida').value;
        const notasAdicionales = document.getElementById('notasAdicionales').value;
        const nombreTarjeta = document.getElementById('nombreTarjeta').value;
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const total = cart.reduce((sum, item) => sum + item.amount, 0);
        
        const order = {
            customer: { name: nombreCompleto, phone: telefono, branch: sucursal },
            pickup: { date: fechaRecogida, time: horaRecogida, notes: notasAdicionales },
            payment: { cardName: nombreTarjeta },
            items: cart,
            total,
            orderDate: new Date().toISOString(),
            orderId: generateOrderId()
        };
        
        saveOrder(order);
        displayOrderConfirmation(order);
        clearCart();
        hideModal(checkoutModal);
        showModal(confirmationModal);
    }
    
    function validateCheckoutForm() {
        let isValid = true;
        const validations = [
            { id: 'nombreCompleto', msg: 'Por favor ingrese su nombre completo', regex: /.+/ },
            { id: 'telefono', msg: 'Por favor ingrese un número de teléfono válido (mínimo 8 dígitos)', regex: /^\d{8,}$/ },
            { id: 'sucursalRecogida', msg: 'Por favor seleccione una sucursal', regex: /.+/ },
            { id: 'fechaRecogida', msg: 'Por favor seleccione una fecha de recogida', regex: /.+/ },
            { id: 'horaRecogida', msg: 'Por favor seleccione una hora de recogida', regex: /.+/ },
            { id: 'nombreTarjeta', msg: 'Por favor ingrese el nombre como aparece en la tarjeta', regex: /.+/ }
        ];
        
        validations.forEach(({id, msg, regex}) => {
            const el = document.getElementById(id);
            if (!el.value.trim() || !regex.test(el.value.trim())) {
                showValidationError(el, msg);
                isValid = false;
            } else {
                clearValidationError(el);
            }
        });
        
        // Additional date and time validation
        const fechaRecogida = document.getElementById('fechaRecogida');
        if (fechaRecogida.value) {
            const today = new Date();
            today.setHours(0,0,0,0);
            const selectedDate = new Date(fechaRecogida.value);
            if (selectedDate < today) {
                showValidationError(fechaRecogida, 'La fecha no puede ser anterior a hoy');
                isValid = false;
            }
        }
        
        const horaRecogida = document.getElementById('horaRecogida');
        if (horaRecogida.value) {
            const hour = parseInt(horaRecogida.value.split(':')[0]);
            if (hour < 6 || hour >= 21) {
                showValidationError(horaRecogida, 'El horario de recogida es entre 6:00 AM y 9:00 PM');
                isValid = false;
            }
        }
        
        return isValid;
    }
    
    function showValidationError(element, message) {
        element.classList.add('error');
        const parent = element.parentElement;
        const existingError = parent.querySelector('.error-message');
        if (existingError) parent.removeChild(existingError);
        const errorMessage = document.createElement('p');
        errorMessage.className = 'error-message';
        errorMessage.textContent = message;
        parent.appendChild(errorMessage);
    }
    
    function clearValidationError(element) {
        element.classList.remove('error');
        const parent = element.parentElement;
        const existingError = parent.querySelector('.error-message');
        if (existingError) parent.removeChild(existingError);
    }
    
    function generateOrderId() {
        const date = new Date();
        const random = Math.floor(Math.random() * 10000);
        return `BM-${date.getFullYear()}${(date.getMonth()+1).toString().padStart(2,'0')}${date.getDate().toString().padStart(2,'0')}-${random}`;
    }
    
    function saveOrder(order) {
        const orders = JSON.parse(localStorage.getItem('orders')) || [];
        orders.push(order);
        localStorage.setItem('orders', JSON.stringify(orders));
    }
    
    function displayOrderConfirmation(order) {
        const orderSummary = document.getElementById('orderSummary');
        const orderTotal = document.getElementById('orderTotal');
        orderSummary.innerHTML = '';
        order.items.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.className = 'order-item';
            itemElement.innerHTML = `
                <div class="item-name">${item.name}</div>
                <div class="item-quantity">${item.quantity} ${item.unit}</div>
                <div class="item-price">₡${item.amount.toLocaleString('es-CR')}</div>
            `;
            orderSummary.appendChild(itemElement);
        });
        const infoElement = document.createElement('div');
        infoElement.className = 'order-info';
        infoElement.innerHTML = `
            <p><strong>Sucursal:</strong> ${order.customer.branch}</p>
            <p><strong>Fecha de recogida:</strong> ${formatDate(order.pickup.date)}</p>
            <p><strong>Hora:</strong> ${formatTime(order.pickup.time)}</p>
            <p><strong>Número de pedido:</strong> ${order.orderId}</p>
        `;
        orderSummary.appendChild(infoElement);
        orderTotal.textContent = `₡${order.total.toLocaleString('es-CR')}`;
    }
    
    function formatDate(dateString) {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('es-CR', options);
    }
    
    function formatTime(timeString) {
        const [hours, minutes] = timeString.split(':');
        const hour = parseInt(hours);
        const period = hour >= 12 ? 'PM' : 'AM';
        const displayHour = hour > 12 ? hour - 12 : (hour === 0 ? 12 : hour);
        return `${displayHour}:${minutes} ${period}`;
    }
});

// Función global para eliminar producto del carrito
function removeFromCart(index) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    
    const cartCount = document.getElementById('cartCount');
    const cartItems = document.getElementById('cartItems');
    const cartEmpty = document.getElementById('cartEmpty');
    const cartTotal = document.getElementById('cartTotal');
    const btnCheckout = document.getElementById('btnCheckout');
    
    if (cart.length === 0) {
        cartItems.style.display = 'none';
        cartEmpty.style.display = 'flex';
        btnCheckout.disabled = true;
        cartTotal.textContent = '₡0';
        cartCount.textContent = '0';
        return;
    }
    
    cartItems.innerHTML = '';
    let total = 0;
    const totalItems = cart.reduce((count, item) => count + item.quantity, 0);
    cartCount.textContent = totalItems;
    
    cart.forEach((item, idx) => {
        total += item.amount;
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <div class="item-details">
                <h4>${item.name}</h4>
                <p>${item.quantity} ${item.unit} x ₡${item.price.toLocaleString('es-CR')}</p>
            </div>
            <div class="item-actions">
                <div class="item-price">₡${item.amount.toLocaleString('es-CR')}</div>
                <button class="btn-remove" onclick="removeFromCart(${idx})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        cartItems.appendChild(cartItem);
    });
    cartTotal.textContent = `₡${total.toLocaleString('es-CR')}`;
    
    // Notification
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = 'Producto eliminado del carrito';
    document.body.appendChild(notification);
    setTimeout(() => {
        notification.classList.add('show');
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }, 100);
}

function clearCart() {
    localStorage.removeItem('cart');
    updateCartDisplay();
}
