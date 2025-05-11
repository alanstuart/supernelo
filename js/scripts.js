// Espera a que todo el documento esté cargado
document.addEventListener('DOMContentLoaded', function() {
    console.log("Documento cargado - iniciando script");
    
    // Variables globales
    const sucursalModal = document.getElementById('sucursalModal');
    const sucursalLima = document.getElementById('sucursal-lima');
    const sucursalSanRafael = document.getElementById('sucursal-san-rafael');
    const sucursalActual = document.getElementById('sucursalActual');
    const sucursalBtn = document.getElementById('sucursalBtn');
    const cartBtn = document.getElementById('cartBtn');
    const cartModal = document.getElementById('cartModal');
    const checkoutModal = document.getElementById('checkoutModal');
    const confirmationModal = document.getElementById('confirmationModal');
    const btnCheckout = document.getElementById('btnCheckout');
    const btnContinueShopping = document.getElementById('btnContinueShopping');
    const closeButtons = document.querySelectorAll('.close');
    const categoriasTabs = document.querySelectorAll('.categoria-tab');
    const categoriasContent = document.querySelectorAll('.categoria-content');
    
    // Inicialización del carrito
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Inicialización
    initializePage();
    
    // Funciones de inicialización
    function initializePage() {
        checkSucursalSelection();
        initEventListeners();
        updateCartDisplay();
        setupProductInteractions();
        setupTipoCompraListeners();
    }
    
    // Verifica si ya se ha seleccionado una sucursal
    function checkSucursalSelection() {
        console.log("Verificando selección de sucursal");
        const selectedSucursal = localStorage.getItem('selectedSucursal');
        
        if (selectedSucursal && sucursalActual) {
            sucursalActual.textContent = selectedSucursal;
            hideModal(sucursalModal);
        } else {
            console.log("Mostrando modal de sucursal");
            // El modal ya debería estar visible por defecto en el HTML
        }
    }
    
    // Configurar todos los event listeners
    function initEventListeners() {
        console.log("Configurando event listeners");
        
        // Event listeners para selección de sucursal
        if (sucursalBtn) {
            sucursalBtn.addEventListener('click', () => {
                console.log("Botón de sucursal clickeado");
                showModal(sucursalModal);
            });
        }
        
        // Event listeners para modales
        if (cartBtn) {
            cartBtn.addEventListener('click', () => {
                console.log("Botón de carrito clickeado");
                showModal(cartModal);
            });
        }
        
        if (btnCheckout) {
            btnCheckout.addEventListener('click', () => {
                hideModal(cartModal);
                showModal(checkoutModal);
            });
        }
        
        if (btnContinueShopping) {
            btnContinueShopping.addEventListener('click', () => {
                hideModal(confirmationModal);
                window.location.reload();
            });
        }
        
        // Event listener para cerrar modales
        closeButtons.forEach(button => {
            button.addEventListener('click', function() {
                console.log("Botón cerrar clickeado");
                const modal = this.closest('.modal');
                hideModal(modal);
            });
        });
        
        // Event listener para cerrar modales al hacer clic fuera
        window.addEventListener('click', function(event) {
            if (event.target.classList.contains('modal')) {
                console.log("Clic fuera del modal");
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
        const checkoutForm = document.getElementById('checkoutForm');
        if (checkoutForm) {
            checkoutForm.addEventListener('submit', processOrder);
        }
        
        // Event listener para búsqueda de productos
        const searchBtn = document.getElementById('searchBtn');
        const searchInput = document.getElementById('searchInput');
        if (searchBtn && searchInput) {
            searchBtn.addEventListener('click', function() {
                searchProducts(searchInput.value);
            });
            
            searchInput.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    searchProducts(searchInput.value);
                }
            });
        }
    }
    
    // Funciones para manejo de la selección de sucursal
    function selectSucursal(sucursalName) {
        console.log(`Seleccionando sucursal: ${sucursalName}`);
        localStorage.setItem('selectedSucursal', sucursalName);
        
        if (sucursalActual) {
            sucursalActual.textContent = sucursalName;
        }
        
        // Actualizar también el campo del formulario de checkout
        const sucursalSelect = document.getElementById('sucursalRecogida');
        if (sucursalSelect) {
            if (sucursalName === 'Sucursal Lima') {
                sucursalSelect.value = 'Lima';
            } else if (sucursalName === 'Sucursal San Rafael') {
                sucursalSelect.value = 'San Rafael';
            }
        }
        
        hideModal(sucursalModal);
    }
    
    // Funciones generales para modales
    function showModal(modal) {
        if (!modal) return;
        console.log("Mostrando modal");
        modal.style.display = 'flex';
        setTimeout(() => {
            modal.classList.add('show');
        }, 10);
    }
    
    function hideModal(modal) {
        if (!modal) return;
        console.log("Ocultando modal");
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
        const content = document.getElementById(categoriaId);
        if (content) content.classList.add('active');
    }
    
    // Configuración de los productos y sus interacciones
    function setupProductInteractions() {
        const addToCartButtons = document.querySelectorAll('.btn-add-cart');
        
        addToCartButtons.forEach(button => {
            button.addEventListener('click', function() {
                const productCard = this.closest('.producto-card');
                const productId = this.getAttribute('data-id') || Date.now().toString();
                const productName = this.getAttribute('data-nombre') || productCard.querySelector('h3').textContent;
                const productPrice = parseFloat(this.getAttribute('data-precio')) || 
                                     parseFloat(productCard.querySelector('.precio').textContent.replace(/[^\d]/g, ''));
                const productUnit = this.getAttribute('data-unidad') || 'kg';
                const productImage = productCard.querySelector('.producto-img')?.src || '';
                
                // Determinar tipo de compra y cantidad
                let quantity, amount;
                
                const tipoCompraSelect = productCard.querySelector('.tipo-compra');
                if (tipoCompraSelect) {
                    const tipoCompra = tipoCompraSelect.value;
                    
                    if (tipoCompra === 'peso') {
                        const cantidadInput = productCard.querySelector('.cantidad-input');
                        quantity = cantidadInput ? parseFloat(cantidadInput.value) : 1;
                        amount = productPrice * quantity;
                    } else { // Por monto
                        const montoInput = productCard.querySelector('.monto-input');
                        amount = montoInput ? parseFloat(montoInput.value) : productPrice;
                        quantity = parseFloat((amount / productPrice).toFixed(2));
                    }
                } else {
                    quantity = 1;
                    amount = productPrice;
                }
                
                // Agregar al carrito
                addToCart({
                    id: productId,
                    name: productName,
                    price: productPrice,
                    quantity: quantity,
                    amount: amount,
                    unit: productUnit,
                    image: productImage
                });
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
                
                if (cantidadInput && montoInput) {
                    if (this.value === 'peso') {
                        cantidadInput.style.display = 'flex';
                        montoInput.style.display = 'none';
                    } else { // Por monto
                        cantidadInput.style.display = 'none';
                        montoInput.style.display = 'flex';
                    }
                }
            });
        });
    }
    
    // Función de búsqueda de productos
    function searchProducts(query) {
        if (!query) return;
        
        query = query.toLowerCase();
        const productos = document.querySelectorAll('.producto-card');
        let found = false;
        
        productos.forEach(producto => {
            const nombre = producto.querySelector('h3').textContent.toLowerCase();
            const descripcion = producto.querySelector('p')?.textContent.toLowerCase() || '';
            
            if (nombre.includes(query) || descripcion.includes(query)) {
                producto.style.display = 'block';
                found = true;
                
                // Hacer scroll hasta el primer producto encontrado
                if (found) {
                    producto.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    found = false; // Solo mostrar el primero
                }
            } else {
                producto.style.display = 'none';
            }
        });
        
        // Mostrar notificación si no se encontró nada
        if (!found) {
            showNotification(`No se encontraron productos con "${query}"`);
        }
    }

    // FUNCIONES DEL CARRITO DE COMPRAS MEJORADO
    
    // Añadir producto al carrito
    function addToCart(product) {
        // Comprobar si el producto ya está en el carrito
        const existingProductIndex = cart.findIndex(item => item.id === product.id);
        
        if (existingProductIndex !== -1) {
            // Actualizar cantidad si ya existe
            cart[existingProductIndex].quantity += product.quantity;
            cart[existingProductIndex].amount += product.amount;
        } else {
            // Añadir nuevo producto
            cart.push(product);
        }
        
        // Guardar en localStorage y actualizar UI
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartDisplay();
        showNotification(`${product.name} agregado al carrito`);
    }
    
    // Actualizar cantidad de un producto en el carrito
    function updateCartItemQuantity(index, newQuantity) {
        if (index >= 0 && index < cart.length) {
            if (newQuantity <= 0) {
                // Si la cantidad es 0 o negativa, eliminar el producto
                removeFromCart(index);
            } else {
                // Actualizar la cantidad
                const item = cart[index];
                const oldQuantity = item.quantity;
                item.quantity = newQuantity;
                
                // Recalcular el monto en base a la nueva cantidad
                item.amount = (item.amount / oldQuantity) * newQuantity;
                
                localStorage.setItem('cart', JSON.stringify(cart));
                updateCartDisplay();
            }
        }
    }
    
    // Eliminar producto del carrito
    function removeFromCart(index) {
        if (index >= 0 && index < cart.length) {
            const productName = cart[index].name;
            cart.splice(index, 1);
            localStorage.setItem('cart', JSON.stringify(cart));
            updateCartDisplay();
            showNotification(`${productName} eliminado del carrito`);
        }
    }
    
    // Vaciar el carrito
    function clearCart() {
        cart = [];
        localStorage.removeItem('cart');
        updateCartDisplay();
        showNotification('Carrito vaciado');
    }
    
    // Actualizar la visualización del carrito
    function updateCartDisplay() {
        // Actualizar contador del carrito
        const cartCount = document.getElementById('cartCount');
        if (cartCount) {
            const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
            cartCount.textContent = totalItems;
        }
        
        // Actualizar contenido del carrito
        const cartItems = document.getElementById('cartItems');
        const cartEmpty = document.getElementById('cartEmpty');
        const cartTotal = document.getElementById('cartTotal');
        const btnCheckout = document.getElementById('btnCheckout');
        
        if (!cartItems || !cartEmpty || !cartTotal || !btnCheckout) return;
        
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
        
        // Limpiar contenido actual
        cartItems.innerHTML = '';
        
        // Agregar productos al carrito visual
        let total = 0;
        
        cart.forEach((item, index) => {
            total += item.amount;
            
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            cartItem.innerHTML = `
                <div class="item-details">
                    <h4>${item.name}</h4>
                    <p>₡${item.price.toLocaleString('es-CR')} / ${item.unit}</p>
                </div>
                <div class="item-actions">
                    <div class="quantity-control">
                        <button class="quantity-btn" onclick="updateCartItemQuantity(${index}, ${item.quantity - 0.1})">-</button>
                        <input type="number" class="quantity-input" value="${item.quantity}" min="0.1" step="0.1" max="100"
                               onchange="updateCartItemQuantity(${index}, parseFloat(this.value) || 0.1)">
                        <button class="quantity-btn" onclick="updateCartItemQuantity(${index}, ${item.quantity + 0.1})">+</button>
                    </div>
                    <div class="item-price">₡${Math.round(item.amount).toLocaleString('es-CR')}</div>
                    <button class="btn-remove" onclick="removeFromCart(${index})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;
            
            cartItems.appendChild(cartItem);
        });
        
        // Añadir botón para vaciar carrito
        const clearCartBtn = document.createElement('div');
        clearCartBtn.className = 'clear-cart';
        clearCartBtn.innerHTML = `
            <button class="btn-clear" onclick="clearCart()">
                Vaciar carrito <i class="fas fa-trash-alt"></i>
            </button>
        `;
        cartItems.appendChild(clearCartBtn);
        
        // Actualizar el total
        cartTotal.textContent = `₡${Math.round(total).toLocaleString('es-CR')}`;
    }
    
    // FUNCIONES PARA EL CHECKOUT
    
    // Procesar orden
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
    
    // Validar formulario de checkout
    function validateCheckoutForm() {
        let isValid = true;
        
        // Validar nombre
        const nombreCompleto = document.getElementById('nombreCompleto');
        if (!nombreCompleto || !nombreCompleto.value.trim()) {
            showValidationError(nombreCompleto, 'Por favor ingrese su nombre completo');
            isValid = false;
        } else {
            clearValidationError(nombreCompleto);
        }
        
        // Validar teléfono
        const telefono = document.getElementById('telefono');
        if (!telefono || !telefono.value.trim() || !/^\d{8,}$/.test(telefono.value.trim())) {
            showValidationError(telefono, 'Por favor ingrese un número de teléfono válido (mínimo 8 dígitos)');
            isValid = false;
        } else {
            clearValidationError(telefono);
        }
        
        // Validar sucursal
        const sucursalRecogida = document.getElementById('sucursalRecogida');
        if (!sucursalRecogida || !sucursalRecogida.value) {
            showValidationError(sucursalRecogida, 'Por favor seleccione una sucursal');
            isValid = false;
        } else {
            clearValidationError(sucursalRecogida);
        }
        
        // Validar fecha
        const fechaRecogida = document.getElementById('fechaRecogida');
        if (!fechaRecogida || !fechaRecogida.value) {
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
        if (!horaRecogida || !horaRecogida.value) {
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
        if (!nombreTarjeta || !nombreTarjeta.value.trim()) {
            showValidationError(nombreTarjeta, 'Por favor ingrese el nombre como aparece en la tarjeta');
            isValid = false;
        } else {
            clearValidationError(nombreTarjeta);
        }
        
        return isValid;
    }
    
    // Mostrar error de validación
    function showValidationError(element, message) {
        if (!element) return;
        
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
    
    // Limpiar error de validación
    function clearValidationError(element) {
        if (!element) return;
        
        element.classList.remove('error');
        
        // Remover mensaje de error si existe
        const parent = element.parentElement;
        const existingError = parent.querySelector('.error-message');
        if (existingError) {
            parent.removeChild(existingError);
        }
    }
    
    // Generar ID de orden
    function generateOrderId() {
        // Generar un ID único combinando fecha y número aleatorio
        const date = new Date();
        const random = Math.floor(Math.random() * 10000);
        return `BM-${date.getFullYear()}${(date.getMonth() + 1).toString().padStart(2, '0')}${date.getDate().toString().padStart(2, '0')}-${random}`;
    }
    
    // Guardar orden en localStorage
    function saveOrder(order) {
        // Obtener órdenes existentes o crear array vacío
        const orders = JSON.parse(localStorage.getItem('orders')) || [];
        orders.push(order);
        localStorage.setItem('orders', JSON.stringify(orders));
    }
    
    // Mostrar confirmación de orden
    function displayOrderConfirmation(order) {
        const orderSummary = document.getElementById('orderSummary');
        const orderTotal = document.getElementById('orderTotal');
        
        if (!orderSummary || !orderTotal) return;
        
        // Limpiar contenedor
        orderSummary.innerHTML = '';
        
        // Crear elementos para cada producto
        order.items.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.className = 'order-item';
            itemElement.innerHTML = `
                <div class="item-name">${item.name}</div>
                <div class="item-quantity">${item.quantity} ${item.unit}</div>
                <div class="item-price">₡${Math.round(item.amount).toLocaleString('es-CR')}</div>
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
        orderTotal.textContent = `₡${Math.round(order.total).toLocaleString('es-CR')}`;
    }
    
    // Mostrar notificación
    function showNotification(message) {
        // Eliminar notificaciones anteriores
        const existingNotifications = document.querySelectorAll('.notification');
        existingNotifications.forEach(notification => {
            document.body.removeChild(notification);
        });
        
        // Crear nueva notificación
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        document.body.appendChild(notification);
        
        // Mostrar con animación
        setTimeout(() => {
            notification.classList.add('show');
            
            // Ocultar después de 3 segundos
            setTimeout(() => {
                notification.classList.remove('show');
                
                // Eliminar del DOM después de la animación
                setTimeout(() => {
                    if (document.body.contains(notification)) {
                        document.body.removeChild(notification);
                    }
                }, 300);
            }, 3000);
        }, 10);
    }
    
    // Funciones de formato
    function formatDate(dateString) {
        if (!dateString) return '';
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('es-CR', options);
    }
    
    function formatTime(timeString) {
        if (!timeString) return '';
        const [hours, minutes] = timeString.split(':');
        const hour = parseInt(hours);
        const period = hour >= 12 ? 'PM' : 'AM';
        const displayHour = hour > 12 ? hour - 12 : (hour === 0 ? 12 : hour);
        return `${displayHour}:${minutes} ${period}`;
    }
    
    // Exponer funciones globalmente para usar en onclick
    window.selectSucursal = selectSucursal;
    window.updateCartItemQuantity = updateCartItemQuantity;
    window.removeFromCart = removeFromCart;
    window.clearCart = clearCart;
    window.showNotification = showNotification;
});
