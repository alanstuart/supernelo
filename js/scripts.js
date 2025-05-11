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
});
