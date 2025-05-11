// Espera a que todo el documento esté cargado
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
    
    // Funciones de inicialización
    function initializePage() {
        checkSucursalSelection();
        initEventListeners();
        updateCartDisplay();
        setupProductInteractions();
    }
    
    // Verifica si ya se ha seleccionado una sucursal
    function checkSucursalSelection() {
        const selectedSucursal = localStorage.getItem('selectedSucursal');
        
        if (selectedSucursal) {
            sucursalActual.textContent = selectedSucursal;
        } else {
            // Mostrar modal de selección de sucursal al cargar la página
            showModal(sucursalModal);
        }
    }
    
    // Configurar todos los event listeners
    function initEventListeners() {
        // Event listeners para selección de sucursal
        sucursalBtn.addEventListener('click', () => showModal(sucursalModal));
        sucursalLima.addEventListener('click', () => selectSucursal('Sucursal Lima'));
        sucursalSanRafael.addEventListener('click', () => selectSucursal('Sucursal San Rafael'));
        
        // Event listeners para modales
        cartBtn.addEventListener('click', () => showModal(cartModal));
        btnCheckout.addEventListener('click', () => {
            hideModal(cartModal);
            showModal(checkoutModal);
        });
        btnContinueShopping.addEventListener('click', () => {
            hideModal(confirmationModal);
            window.location.reload();
        });
        
        // Event listener para cerrar modales
        closeButtons.forEach(button => {
            button.addEventListener('click', function() {
                const modal = this.closest('.modal');
                hideModal(modal);
            });
        });
        
        // Event listener para cerrar modales al hacer clic fuera
        window.addEventListener('click', function(event) {
            if (event.target.classList.contains('modal')) {
                hideModal(event.target);
            }
        });
        
        // Event listeners para pestañas de categorías
        categoriasTabs.forEach(tab => {
            tab.addEventListener('click', function() {
                const categoria = this.getAttribute('data-categoria');
                changeActiveTab(this, categoria);
            });
        });
        
        // Event listener para el formulario de checkout
        document.getElementById('checkoutForm').addEventListener('submit', processOrder);
        
        // Event listener para opciones de compra (peso vs monto)
        setupTipoCompraListeners();
    }
    
    // Funciones para manejo de la selección de sucursal
    function selectSucursal(sucursalName) {
        localStorage.setItem('selectedSucursal', sucursalName);
        sucursalActual.textContent = sucursalName;
        hideModal(sucursalModal);
        
        // Actualizar también el campo del formulario de checkout
        const sucursalSelect = document.getElementById('sucursalRecogida');
        if (sucursalSelect) {
            if (sucursalName === 'Sucursal Lima') {
                sucursalSelect.value = 'Lima';
            } else if (sucursalName === 'Sucursal San Rafael') {
                sucursalSelect.value = 'San Rafael';
            }
        }
    }
    
    // Funciones generales para modales
    function showModal(modal) {
        modal.style.display = 'flex';
        setTimeout(() => {
            modal.classList.add('show');
        }, 10);
    }
    
    function hideModal(modal) {
        modal.classList.remove('show');
        setTimeout(() => {
            modal.style.display = 'none';
        }, 300);
    }
    
    // Función para cambiar entre pestañas de categorías
    function changeActiveTab(selectedTab, categoriaId) {
        // Quitar clase active de todas las pestañas y contenido
        categoriasTabs.forEach(tab => tab.classList.remove('active'));
        categoriasContent.forEach(content => content.classList.remove('active'));
        
        // Añadir clase active a la pestaña seleccionada y su contenido
        selectedTab.classList.add('active');
        document.getElementById(categoriaId).classList.add('active');
    }
    
    // Configuración de los productos y sus interacciones
    function setupProductInteractions() {
        const addToCartButtons = document.querySelectorAll('.btn-add-cart');
        
        addToCartButtons.forEach(button => {
            button.addEventListener('click', function() {
                const productCard = this.closest('.producto-card');
                const productId = this.getAttribute('data-id');
                const productName = this.getAttribute('data-nombre');
                const productPrice = parseFloat(this.getAttribute('data-precio'));
                const productUnit = this.getAttribute('data-unidad');
                
                // Determinar tipo de compra y cantidad
                const tipoCompra = productCard.querySelector('.tipo-compra').value;
                let quantity, amount;
                
                if (tipoCompra === 'peso') {
                    quantity = parseFloat(productCard.querySelector('.cantidad-input').value);
                    amount = productPrice * quantity;
                } else { // Por monto
                    amount = parseFloat(productCard.querySelector('.monto-input').value);
                    quantity = parseFloat((amount / productPrice).toFixed(2));
                }
                
                // Agregar al carrito
                addToCart(productId, productName, productPrice, quantity, amount, productUnit);
            });
        });
    }
    
    // Configurar listeners para cambio entre peso y monto
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
                } else { // Por monto
                    cantidadInput.style.display = 'none';
                    montoInput.style.display = 'flex';
                }
            });
        });
    }
    
    // Funciones para manejo del carrito
    function addToCart(productId, productName, productPrice, quantity, amount, productUnit) {
        // Obtener el carrito actual del localStorage o crear uno nuevo
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        
        // Buscar si el producto ya existe en el carrito
        const existingProductIndex = cart.findIndex(item => item.id === productId);
        
        if (existingProductIndex !== -1) {
            // Actualizar la cantidad si ya existe
            cart[existingProductIndex].quantity += quantity;
            cart[existingProductIndex].amount += amount;
        } else {
            // Agregar nuevo producto al carrito
            cart.push({
                id: productId,
                name: productName,
                price: productPrice,
                quantity: quantity,
                amount: amount,
                unit: productUnit
            });
        }
        
        // Guardar carrito actualizado en localStorage
        localStorage.setItem('cart', JSON.stringify(cart));
        
        // Actualizar la interfaz
        updateCartDisplay();
        
        // Mostrar notificación
        showNotification(`${productName} agregado al carrito`);
    }
    function updateCartDisplay() {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const cartCount = document.getElementById('cartCount');
        const cartItems = document.getElementById('cartItems');
        const cartEmpty = document.getElementById('cartEmpty');
        const cartTotal = document.getElementById('cartTotal');
        const btnCheckout = document.getElementById('btnCheckout');
        
        // Actualizar contador del carrito
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        cartCount.textContent = totalItems;
        
        // Si el carrito está vacío
        if (cart.length === 0) {
            cartItems.style.display = 'none';
            cartEmpty.style.display = 'flex';
            btnCheckout.disabled = true;
            cartTotal.textContent = '₡0';
            return;
        }
        
        // Si hay productos en el carrito
        cartItems.style.display = 'block';
        cartEmpty.style.display = 'none';
        btnCheckout.disabled = false;
        
        // Limpiar contenedor de items
        cartItems.innerHTML = '';
        
        // Calcular total
        let total = 0;
        
        // Agregar cada producto al carrito
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
        
        // Actualizar el total
        cartTotal.textContent = `₡${total.toLocaleString('es-CR')}`;
    }
    
    function removeFromCart(index) {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        
        // Eliminar el producto en el índice seleccionado
        cart.splice(index, 1);
        
        // Guardar carrito actualizado
        localStorage.setItem('cart', JSON.stringify(cart));
        
        // Actualizar la interfaz
        updateCartDisplay();
        
        // Mostrar notificación
        showNotification('Producto eliminado del carrito');
    }
    
    function clearCart() {
        localStorage.removeItem('cart');
        updateCartDisplay();
    }
    
    function showNotification(message) {
        // Crear elemento de notificación
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        
        // Agregar al DOM
        document.body.appendChild(notification);
        
        // Mostrar con animación
        setTimeout(() => {
            notification.classList.add('show');
            
            // Ocultar después de 3 segundos
            setTimeout(() => {
                notification.classList.remove('show');
                
                // Eliminar del DOM después de la animación
                setTimeout(() => {
                    document.body.removeChild(notification);
                }, 300);
            }, 3000);
        }, 100);
    }
    
    // Funciones para el proceso de checkout y validación
    function processOrder(event) {
        event.preventDefault();
        
        // Validar formulario
        if (!validateCheckoutForm()) {
            return;
        }
        
        // Obtener datos del formulario
        const nombreCompleto = document.getElementById('nombreCompleto').value;
        const telefono = document.getElementById('telefono').value;
        const sucursal = document.getElementById('sucursalRecogida').value;
        const fechaRecogida = document.getElementById('fechaRecogida').value;
        const horaRecogida = document.getElementById('horaRecogida').value;
        const notasAdicionales = document.getElementById('notasAdicionales').value;
        const nombreTarjeta = document.getElementById('nombreTarjeta').value;
        
        // Obtener carrito
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        
        // Calcular total
        const total = cart.reduce((sum, item) => sum + item.amount, 0);
        
        // Crear objeto de orden
        const order = {
            customer: {
                name: nombreCompleto,
                phone: telefono,
                branch: sucursal
            },
            pickup: {
                date: fechaRecogida,
                time: horaRecogida,
                notes: notasAdicionales
            },
            payment: {
                cardName: nombreTarjeta
            },
            items: cart,
            total: total,
            orderDate: new Date().toISOString(),
            orderId: generateOrderId()
        };
        
        // Guardar orden en localStorage
        saveOrder(order);
        
        // Mostrar confirmación
        displayOrderConfirmation(order);
        
        // Limpiar carrito
        clearCart();
        
        // Cerrar modal de checkout y mostrar confirmación
        hideModal(document.getElementById('checkoutModal'));
        showModal(document.getElementById('confirmationModal'));
    }
    
    function validateCheckoutForm() {
        let isValid = true;
        
        // Validar nombre
        const nombreCompleto = document.getElementById('nombreCompleto');
        if (!nombreCompleto.value.trim()) {
            showValidationError(nombreCompleto, 'Por favor ingrese su nombre completo');
            isValid = false;
        } else {
            clearValidationError(nombreCompleto);
        }
        
        // Validar teléfono
        const telefono = document.getElementById('telefono');
        if (!telefono.value.trim() || !/^\d{8,}$/.test(telefono.value.trim())) {
            showValidationError(telefono, 'Por favor ingrese un número de teléfono válido (mínimo 8 dígitos)');
            isValid = false;
        } else {
            clearValidationError(telefono);
        }
        
        // Validar sucursal
        const sucursalRecogida = document.getElementById('sucursalRecogida');
        if (!sucursalRecogida.value) {
            showValidationError(sucursalRecogida, 'Por favor seleccione una sucursal');
            isValid = false;
        } else {
            clearValidationError(sucursalRecogida);
        }
        
        // Validar fecha
        const fechaRecogida = document.getElementById('fechaRecogida');
        if (!fechaRecogida.value) {
            showValidationError(fechaRecogida, 'Por favor seleccione una fecha de recogida');
            isValid = false;
        } else {
            // Validar que la fecha no sea anterior a hoy
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const selectedDate = new Date(fechaRecogida.value);
            
            if (selectedDate < today) {
                showValidationError(fechaRecogida, 'La fecha no puede ser anterior a hoy');
                isValid = false;
            } else {
                clearValidationError(fechaRecogida);
            }
        }
        
        // Validar hora
        const horaRecogida = document.getElementById('horaRecogida');
        if (!horaRecogida.value) {
            showValidationError(horaRecogida, 'Por favor seleccione una hora de recogida');
            isValid = false;
        } else {
            const hour = parseInt(horaRecogida.value.split(':')[0]);
            if (hour < 6 || hour >= 21) {
                showValidationError(horaRecogida, 'El horario de recogida es entre 6:00 AM y 9:00 PM');
                isValid = false;
            } else {
                clearValidationError(horaRecogida);
            }
        }
        
        // Validar nombre de tarjeta
        const nombreTarjeta = document.getElementById('nombreTarjeta');
        if (!nombreTarjeta.value.trim()) {
            showValidationError(nombreTarjeta, 'Por favor ingrese el nombre como aparece en la tarjeta');
            isValid = false;
        } else {
            clearValidationError(nombreTarjeta);
        }
        
        return isValid;
    }
    
    function showValidationError(element, message) {
        element.classList.add('error');
        
        // Remover mensaje de error previo si existe
        const parent = element.parentElement;
        const existingError = parent.querySelector('.error-message');
        if (existingError) {
            parent.removeChild(existingError);
        }
        
        // Crear y agregar nuevo mensaje de error
        const errorMessage = document.createElement('p');
        errorMessage.className = 'error-message';
        errorMessage.textContent = message;
        parent.appendChild(errorMessage);
    }
    
    function clearValidationError(element) {
        element.classList.remove('error');
        
        // Remover mensaje de error si existe
        const parent = element.parentElement;
        const existingError = parent.querySelector('.error-message');
        if (existingError) {
            parent.removeChild(existingError);
        }
    }
    
    function generateOrderId() {
        // Generar un ID único combinando fecha y número aleatorio
        const date = new Date();
        const random = Math.floor(Math.random() * 10000);
        return `BM-${date.getFullYear()}${(date.getMonth() + 1).toString().padStart(2, '0')}${date.getDate().toString().padStart(2, '0')}-${random}`;
    }
    
    function saveOrder(order) {
        // Obtener órdenes existentes o crear array vacío
        const orders = JSON.parse(localStorage.getItem('orders')) || [];
        orders.push(order);
        localStorage.setItem('orders', JSON.stringify(orders));
    }
    
    function displayOrderConfirmation(order) {
        const orderSummary = document.getElementById('orderSummary');
        const orderTotal = document.getElementById('orderTotal');
        
        // Limpiar contenedor
        orderSummary.innerHTML = '';
        
        // Crear elementos para cada producto
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
        
        // Mostrar información adicional
        const infoElement = document.createElement('div');
        infoElement.className = 'order-info';
        infoElement.innerHTML = `
            <p><strong>Sucursal:</strong> ${order.customer.branch}</p>
            <p><strong>Fecha de recogida:</strong> ${formatDate(order.pickup.date)}</p>
            <p><strong>Hora:</strong> ${formatTime(order.pickup.time)}</p>
            <p><strong>Número de pedido:</strong> ${order.orderId}</p>
        `;
        
        orderSummary.appendChild(infoElement);
        
        // Actualizar total
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

// Asegurarse de que las funciones estén disponibles globalmente
function removeFromCart(index) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Actualizar la interfaz
    const cartCount = document.getElementById('cartCount');
    const cartItems = document.getElementById('cartItems');
    const cartEmpty = document.getElementById('cartEmpty');
    const cartTotal = document.getElementById('cartTotal');
    const btnCheckout = document.getElementById('btnCheckout');
    
    // Si el carrito está vacío después de eliminar
    if (cart.length === 0) {
        cartItems.style.display = 'none';
        cartEmpty.style.display = 'flex';
        btnCheckout.disabled = true;
        cartTotal.textContent = '₡0';
        cartCount.textContent = '0';
        return;
    }
    
    // Reconstruir lista de productos
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
    
    // Actualizar total
    cartTotal.textContent = `₡${total.toLocaleString('es-CR')}`;
    
    // Mostrar notificación
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
