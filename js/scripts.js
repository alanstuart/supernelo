/ Variables globales
let cart = [];
let selectedSucursal = "";

// DOM Elements
document.addEventListener("DOMContentLoaded", () => {
    // Mostrar modal de selección de sucursal al cargar la página
    const sucursalModal = document.getElementById("sucursalModal");
    sucursalModal.style.display = "block";

    // Event Listeners para selección de sucursal
    document.getElementById("sucursal-lima").addEventListener("click", () => {
        selectSucursal("Sucursal Lima", "61914588");
    });

    document.getElementById("sucursal-san-rafael").addEventListener("click", () => {
        selectSucursal("Sucursal San Rafael", "61437099");
    });

    // Event Listener para cambiar sucursal
    document.getElementById("sucursalBtn").addEventListener("click", () => {
        sucursalModal.style.display = "block";
    });

    // Event Listeners para categorías de productos
    const categoriaTabs = document.querySelectorAll(".categoria-tab");
    categoriaTabs.forEach(tab => {
        tab.addEventListener("click", () => {
            // Remover clase active de todos los tabs
            categoriaTabs.forEach(t => t.classList.remove("active"));
            
            // Añadir clase active al tab clickeado
            tab.classList.add("active");
            
            // Ocultar todos los contenidos
            const contenidos = document.querySelectorAll(".categoria-content");
            contenidos.forEach(contenido => contenido.classList.remove("active"));
            
            // Mostrar el contenido correspondiente
            const categoria = tab.getAttribute("data-categoria");
            document.getElementById(categoria).classList.add("active");
        });
    });

    // Event Listeners para selección de tipo de compra (peso o monto)
    const tiposCompra = document.querySelectorAll(".tipo-compra");
    tiposCompra.forEach(selector => {
        selector.addEventListener("change", function() {
            const card = this.closest(".producto-card");
            const cantidadInput = card.querySelector(".cantidad-input");
            const montoInput = card.querySelector(".monto-input");
            
            if (this.value === "peso") {
                cantidadInput.style.display = "block";
                montoInput.style.display = "none";
            } else {
                cantidadInput.style.display = "none";
                montoInput.style.display = "block";
            }
        });
    });

    // Event Listeners para agregar productos al carrito
    const btnAddCart = document.querySelectorAll(".btn-add-cart");
    btnAddCart.forEach(btn => {
        btn.addEventListener("click", function() {
            const card = this.closest(".producto-card");
            const tipoCompra = card.querySelector(".tipo-compra").value;
            const precio = parseFloat(this.getAttribute("data-precio"));
            
            let cantidad;
            let montoTotal;
            
            if (tipoCompra === "peso") {
                cantidad = parseFloat(card.querySelector(".cantidad-input").value) || 1;
                montoTotal = precio * cantidad;
            } else {
                const monto = parseFloat(card.querySelector(".monto-input").value);
                
                if (isNaN(monto)) {
                    showNotification("Por favor ingrese un monto válido");
                    return;
                }
                
                if (monto < 500 || monto > 15000) {
                    showNotification("El monto debe estar entre ₡500 y ₡15,000");
                    return;
                }
                
                cantidad = monto / precio;
                montoTotal = monto;
            }
            
            const product = {
                id: this.getAttribute("data-id"),
                nombre: this.getAttribute("data-nombre"),
                precio: precio,
                unidad: this.getAttribute("data-unidad"),
                cantidad: cantidad,
                tipoCompra: tipoCompra,
                montoTotal: montoTotal
            };
            
            addToCart(product);
            updateCartUI();
            
            showNotification(`${product.nombre} agregado al carrito`);
        });
    });

    // Event Listener para abrir el modal del carrito
    document.getElementById("cartBtn").addEventListener("click", () => {
        updateCartUI();
        document.getElementById("cartModal").style.display = "block";
    });

    // Event Listeners para cerrar modales
    const closeButtons = document.querySelectorAll(".close");
    closeButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            document.getElementById("cartModal").style.display = "none";
            document.getElementById("checkoutModal").style.display = "none";
            document.getElementById("confirmationModal").style.display = "none";
        });
    });

    // Event Listener para proceder al checkout
    document.getElementById("btnCheckout").addEventListener("click", () => {
        document.getElementById("cartModal").style.display = "none";
        document.getElementById("checkoutModal").style.display = "block";
        
        // Preseleccionar la sucursal ya seleccionada
        const sucursalSelect = document.getElementById("sucursalRecogida");
        if (selectedSucursal === "Sucursal Lima") {
            sucursalSelect.value = "Lima";
        } else if (selectedSucursal === "Sucursal San Rafael") {
            sucursalSelect.value = "San Rafael";
        }
        
        // Configurar fecha mínima (hoy)
        const fechaRecogida = document.getElementById("fechaRecogida");
        const hoy = new Date();
        const yyyy = hoy.getFullYear();
        const mm = String(hoy.getMonth() + 1).padStart(2, "0");
        const dd = String(hoy.getDate()).padStart(2, "0");
        const fechaMinima = `${yyyy}-${mm}-${dd}`;
        fechaRecogida.min = fechaMinima;
    });

    // Event Listener para enviar formulario de checkout
    document.getElementById("checkoutForm").addEventListener("submit", (e) => {
        e.preventDefault();
        
        // Preparar el resumen del pedido
        const orderSummary = document.getElementById("orderSummary");
        orderSummary.innerHTML = "";
        
        cart.forEach(item => {
            const orderItem = document.createElement("div");
            orderItem.className = "order-item";
            
            if (item.tipoCompra === "peso") {
                orderItem.innerHTML = `
                    
${item.nombre} (${item.cantidad.toFixed(2)} ${item.unidad})

                    
₡${(item.precio * item.cantidad).toLocaleString()}

                `;
            } else {
                orderItem.innerHTML = `
                    
${item.nombre} (₡${item.montoTotal.toLocaleString()})

                    
₡${item.montoTotal.toLocaleString()}

                `;
            }
            
            orderSummary.appendChild(orderItem);
        });
        
        // Actualizar total del pedido
        const total = calculateTotal();
        document.getElementById("orderTotal").textContent = `₡${total.toLocaleString()}`;
        
        // Cerrar modal de checkout y mostrar confirmación
        document.getElementById("checkoutModal").style.display = "none";
        document.getElementById("confirmationModal").style.display = "block";
        
        // Limpiar el carrito después de la compra
        cart = [];
        updateCartCount();
    });

    // Event Listener para continuar comprando después de confirmación
    document.getElementById("btnContinueShopping").addEventListener("click", () => {
        document.getElementById("confirmationModal").style.display = "none";
    });

    // Event Listener para buscar productos
    document.getElementById("searchBtn").addEventListener("click", searchProducts);
    document.getElementById("searchInput").addEventListener("keyup", function(event) {
        if (event.key === "Enter") {
            searchProducts();
        }
    });
});

// Función para seleccionar sucursal
function selectSucursal(name, phone) {
    selectedSucursal = name;
    document.getElementById("sucursalActual").textContent = name;
    document.getElementById("sucursalModal").style.display = "none";
    
    // Mostrar notificación de sucursal seleccionada
    showNotification(`Sucursal seleccionada: ${name}`);
}

// Función para agregar producto al carrito
function addToCart(product) {
    // Verificar si el producto ya está en el carrito
    const existingProductIndex = cart.findIndex(item => 
        item.id === product.id && item.tipoCompra === product.tipoCompra
    );
    
    if (existingProductIndex !== -1) {
        // Si el producto ya está en el carrito, aumentar cantidad
        cart[existingProductIndex].cantidad += product.cantidad;
        cart[existingProductIndex].montoTotal += product.montoTotal;
    } else {
        // Si no existe, agregarlo al carrito
        cart.push(product);
    }
    
    updateCartCount();
}

// Función para actualizar el contador del carrito
function updateCartCount() {
    const cartCount = document.getElementById("cartCount");
    const totalItems = cart.length;
    cartCount.textContent = totalItems;
}

// Función para calcular el total del carrito
function calculateTotal() {
    return cart.reduce((total, item) => total + item.montoTotal, 0);
}

// Función para actualizar la interfaz del carrito
function updateCartUI() {
    const cartItems = document.getElementById("cartItems");
    const cartEmpty = document.getElementById("cartEmpty");
    const btnCheckout = document.getElementById("btnCheckout");
    
    // Limpiar el contenido actual
    cartItems.innerHTML = "";
    
    if (cart.length === 0) {
        // Mostrar mensaje de carrito vacío
        cartEmpty.style.display = "block";
        btnCheckout.disabled = true;
    } else {
        // Ocultar mensaje de carrito vacío
        cartEmpty.style.display = "none";
        btnCheckout.disabled = false;
        
        // Crear elementos para cada producto en el carrito
        cart.forEach((item, index) => {
            const cartItem = document.createElement("div");
            cartItem.className = "cart-item";
            
            if (item.tipoCompra === "peso") {
                cartItem.innerHTML = `
                    

                        
${item.nombre}

                        
₡${item.precio.toLocaleString()} / ${item.unidad}

                    

                    

                        -
                        ${item.cantidad.toFixed(2)}
                        +
                    

                    
₡${(item.precio * item.cantidad).toLocaleString()}

                    

                `;
            } else {
                cartItem.innerHTML = `
                    

                        
${item.nombre}

                        
Monto: ₡${item.montoTotal.toLocaleString()}

                    

                    

                        ${(item.montoTotal / item.precio).toFixed(2)} ${item.unidad}
                    

                    
₡${item.montoTotal.toLocaleString()}

                    

                `;
            }
            
            cartItems.appendChild(cartItem);
        });
    }
    
    // Actualizar el total
    const total = calculateTotal();
    document.getElementById("cartTotal").textContent = `₡${total.toLocaleString()}`;
}

// Función para aumentar la cantidad de un producto en el carrito
function increaseQuantity(index) {
    if (cart[index].tipoCompra === "peso") {
        cart[index].cantidad += 0.1;
        cart[index].montoTotal = cart[index].precio * cart[index].cantidad;
    } else {
        const incremento = cart[index].precio;
        if (cart[index].montoTotal + incremento <= 15000) {
            cart[index].montoTotal += incremento;
            cart[index].cantidad = cart[index].montoTotal / cart[index].precio;
        } else {
            showNotification("El monto máximo es ₡15,000");
        }
    }
    
    updateCartUI();
}

// Función para disminuir la cantidad de un producto en el carrito
function decreaseQuantity(index) {
    if (cart[index].tipoCompra === "peso") {
        if (cart[index].cantidad > 0.1) {
            cart[index].cantidad -= 0.1;
            cart[index].montoTotal = cart[index].precio * cart[index].cantidad;
            updateCartUI();
        } else {
            removeFromCart(index);
        }
    } else {
        const decremento = cart[index].precio;
        if (cart[index].montoTotal - decremento >= 500) {
            cart[index].montoTotal -= decremento;
            cart[index].cantidad = cart[index].montoTotal / cart[index].precio;
            updateCartUI();
        } else {
            removeFromCart(index);
        }
    }
}

// Función para eliminar un producto del carrito
function removeFromCart(index) {
    cart.splice(index, 1);
    updateCartUI();
    updateCartCount();
}

// Función para mostrar notificaciones
function showNotification(message) {
    // Crear elemento de notificación
    const notification = document.createElement("div");
    notification.className = "notification";
    notification.textContent = message;
    
    // Estilos para la notificación
    notification.style.position = "fixed";
    notification.style.bottom = "20px";
    notification.style.right = "20px";
    notification.style.backgroundColor = "var(--secondary-color)";
    notification.style.color = "white";
    notification.style.padding = "10px 20px";
    notification.style.borderRadius = "4px";
    notification.style.boxShadow = "0 2px 10px rgba(0, 0, 0, 0.1)";
    notification.style.zIndex = "9999";
    
    // Agregar al DOM
    document.body.appendChild(notification);
    
    // Remover después de 3 segundos
    setTimeout(() => {
        notification.style.opacity = "0";
        notification.style.transition = "opacity 0.5s ease";
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 500);
    }, 3000);
}

// Función para buscar productos
function searchProducts() {
    const searchInput = document.getElementById("searchInput");
    const query = searchInput.value.toLowerCase().trim();
    
    if (query === "") return;
    
    // Obtener todos los productos
    const productos = document.querySelectorAll(".producto-card");
    
    // Variable para contar coincidencias
    let matchesFound = 0;
    
    // Recorrer cada producto y comprobar si coincide con la búsqueda
    productos.forEach(producto => {
        const nombre = producto.querySelector("h3").textContent.toLowerCase();
        const descripcion = producto.querySelector("p").textContent.toLowerCase();
        
        if (nombre.includes(query) || descripcion.includes(query)) {
            // Mostrar producto y destacarlo
            producto.style.display = "block";
            producto.style.transform = "scale(1.03)";
            producto.style.boxShadow = "0 5px 15px rgba(0, 0, 0, 0.2)";
            producto.style.transition = "all 0.3s ease";
            
            // Ir a la categoría correspondiente
            const categoriaContent = producto.closest(".categoria-content");
            const categoriaId = categoriaContent.id;
            
            // Activar la pestaña correspondiente
            document.querySelectorAll(".categoria-tab").forEach(tab => {
                if (tab.getAttribute("data-categoria") === categoriaId) {
                    tab.click();
                }
            });
            
            // Scroll al primer producto encontrado
            if (matchesFound === 0) {
                producto.scrollIntoView({ behavior: "smooth", block: "center" });
            }
            
            matchesFound++;
            
            // Restaurar estilo después de unos segundos
            setTimeout(() => {
                producto.style.transform = "";
                producto.style.boxShadow = "";
            }, 3000);
        } else {
            // No ocultar productos que no coinciden, para mantener la estructura de la página
            producto.style.opacity = "0.5";
            producto.style.transition = "all 0.3s ease";
            
            // Restaurar opacidad después de unos segundos
            setTimeout(() => {
                producto.style.opacity = "1";
            }, 3000);
        }
    });
    
    // Mostrar notificación con resultados
    if (matchesFound > 0) {
        showNotification(`Se encontraron ${matchesFound} productos`);
    } else {
        showNotification("No se encontraron productos que coincidan con la búsqueda");
    }
    
    // Limpiar el campo de búsqueda
    searchInput.value = "";
}
                
