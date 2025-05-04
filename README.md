<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>BM Super Nelo | Supermercado en Línea</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@5.15.4/css/all.min.css">
    <style>
        :root {
            --azul-bm: #0756b3;
            --verde-bm: #a2ce39;
        }
        body {
            font-family: 'Arial', sans-serif;
            color: #333;
        }
        .btn-primary {
            background-color: var(--azul-bm);
            color: white;
            transition: all 0.3s ease;
        }
        .btn-primary:hover {
            background-color: #054491;
        }
        .btn-secondary {
            background-color: var(--verde-bm);
            color: white;
            transition: all 0.3s ease;
        }
        .btn-secondary:hover {
            background-color: #8ab732;
        }
        .header-bg {
            background-color: white;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .product-card {
            border: 1px solid #e2e8f0;
            border-radius: 0.5rem;
            transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .product-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
        }
        .category-header {
            background-color: var(--azul-bm);
            color: white;
            padding: 0.75rem 1.5rem;
            border-radius: 0.5rem;
            margin-bottom: 1.5rem;
            font-weight: bold;
        }
        .cart-item {
            border-bottom: 1px solid #e2e8f0;
            padding-bottom: 1rem;
            margin-bottom: 1rem;
        }
        .cart-summary {
            background-color: #f8fafc;
            border-radius: 0.5rem;
            padding: 1.5rem;
        }
        .form-section {
            background-color: #f8fafc;
            border-radius: 0.5rem;
            padding: 1.5rem;
            margin-bottom: 1.5rem;
        }
        .logo-container {
            max-width: 250px;
        }
    </style>
</head>
<body class="bg-gray-50">
    <!-- Header -->
    <header class="header-bg py-4 sticky top-0 z-50">
        <div class="container mx-auto px-4">
            <div class="flex justify-between items-center">
                <div class="logo-container">
                    <img src="https://page.genspark.site/v1/base64_upload/61afa5bf042766d283a96cc960bd4323" alt="Logo BM Super Nelo" class="h-auto w-full">
                </div>
                <div class="flex items-center">
                    <button id="cart-button" class="flex items-center bg-white px-4 py-2 rounded-full shadow hover:shadow-md transition-all">
                        <span class="mr-2"><i class="fas fa-shopping-cart text-gray-600"></i></span>
                        <span id="cart-count" class="bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">0</span>
                    </button>
                </div>
            </div>
        </div>
    </header>

    <!-- Main Content -->
    <main class="container mx-auto px-4 py-8">
        <!-- Hero Section -->
        <section class="mb-12 text-center">
            <h1 class="text-4xl font-bold mb-4" style="color: var(--azul-bm);">Compra en línea y recoge en tienda</h1>
            <p class="text-xl text-gray-600 mb-8">Los mejores productos de carnicería al mejor precio</p>
            <div class="bg-white p-6 rounded-lg shadow-lg mb-8">
                <p class="text-lg mb-4"><i class="fas fa-map-marker-alt mr-2" style="color: var(--verde-bm);"></i> Estamos ubicados en <strong>Taras, Cartago, Costa Rica</strong></p>
                <p class="text-lg"><i class="fas fa-phone mr-2" style="color: var(--verde-bm);"></i> Llámenos al: <strong>2000-0000</strong></p>
            </div>
        </section>

        <!-- Products Section -->
        <section class="mb-12">
            <h2 class="category-header">
                <i class="fas fa-drumstick-bite mr-2"></i> Nuestros productos de carnicería
            </h2>

            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <!-- Carnes de Res -->
                <div class="product-card bg-white p-6">
                    <div class="mb-4">
                        <h3 class="text-lg font-bold" style="color: var(--azul-bm);">Costilla de res</h3>
                        <p class="text-sm text-gray-500">Fresca del día</p>
                    </div>
                    <div class="flex justify-between items-center">
                        <p class="text-xl font-bold">₡4 000<span class="text-sm text-gray-500"> /kg</span></p>
                        <button class="btn-primary px-4 py-2 rounded" onclick="addToCart('Costilla de res', 4000)">
                            <i class="fas fa-plus mr-2"></i>Agregar
                        </button>
                    </div>
                </div>

                <div class="product-card bg-white p-6">
                    <div class="mb-4">
                        <h3 class="text-lg font-bold" style="color: var(--azul-bm);">Bistec de res (arreglado y normal)</h3>
                        <p class="text-sm text-gray-500">Corte premium</p>
                    </div>
                    <div class="flex justify-between items-center">
                        <p class="text-xl font-bold">₡5 990<span class="text-sm text-gray-500"> /kg</span></p>
                        <button class="btn-primary px-4 py-2 rounded" onclick="addToCart('Bistec de res', 5990)">
                            <i class="fas fa-plus mr-2"></i>Agregar
                        </button>
                    </div>
                </div>

                <div class="product-card bg-white p-6">
                    <div class="mb-4">
                        <h3 class="text-lg font-bold" style="color: var(--azul-bm);">Molida</h3>
                        <p class="text-sm text-gray-500">Carne molida de res</p>
                    </div>
                    <div class="flex justify-between items-center">
                        <p class="text-xl font-bold">₡4 500<span class="text-sm text-gray-500"> /kg</span></p>
                        <button class="btn-primary px-4 py-2 rounded" onclick="addToCart('Molida', 4500)">
                            <i class="fas fa-plus mr-2"></i>Agregar
                        </button>
                    </div>
                </div>

                <div class="product-card bg-white p-6">
                    <div class="mb-4">
                        <h3 class="text-lg font-bold" style="color: var(--azul-bm);">Cecina</h3>
                        <p class="text-sm text-gray-500">Corte especial</p>
                    </div>
                    <div class="flex justify-between items-center">
                        <p class="text-xl font-bold">₡5 990<span class="text-sm text-gray-500"> /kg</span></p>
                        <button class="btn-primary px-4 py-2 rounded" onclick="addToCart('Cecina', 5990)">
                            <i class="fas fa-plus mr-2"></i>Agregar
                        </button>
                    </div>
                </div>

                <div class="product-card bg-white p-6">
                    <div class="mb-4">
                        <h3 class="text-lg font-bold" style="color: var(--azul-bm);">Hígado</h3>
                        <p class="text-sm text-gray-500">Fresco y seleccionado</p>
                    </div>
                    <div class="flex justify-between items-center">
                        <p class="text-xl font-bold">₡2 990<span class="text-sm text-gray-500"> /kg</span></p>
                        <button class="btn-primary px-4 py-2 rounded" onclick="addToCart('Hígado', 2990)">
                            <i class="fas fa-plus mr-2"></i>Agregar
                        </button>
                    </div>
                </div>

                <!-- Carnes de Cerdo -->
                <div class="product-card bg-white p-6">
                    <div class="mb-4">
                        <h3 class="text-lg font-bold" style="color: var(--azul-bm);">Chuleta (arreglada y normal)</h3>
                        <p class="text-sm text-gray-500">Chuleta de cerdo</p>
                    </div>
                    <div class="flex justify-between items-center">
                        <p class="text-xl font-bold">₡3 500<span class="text-sm text-gray-500"> /kg</span></p>
                        <button class="btn-primary px-4 py-2 rounded" onclick="addToCart('Chuleta', 3500)">
                            <i class="fas fa-plus mr-2"></i>Agregar
                        </button>
                    </div>
                </div>

                <div class="product-card bg-white p-6">
                    <div class="mb-4">
                        <h3 class="text-lg font-bold" style="color: var(--azul-bm);">Chuleta ahumada</h3>
                        <p class="text-sm text-gray-500">Sabor especial ahumado</p>
                    </div>
                    <div class="flex justify-between items-center">
                        <p class="text-xl font-bold">₡4 500<span class="text-sm text-gray-500"> /kg</span></p>
                        <button class="btn-primary px-4 py-2 rounded" onclick="addToCart('Chuleta ahumada', 4500)">
                            <i class="fas fa-plus mr-2"></i>Agregar
                        </button>
                    </div>
                </div>

                <div class="product-card bg-white p-6">
                    <div class="mb-4">
                        <h3 class="text-lg font-bold" style="color: var(--azul-bm);">Costilla de cerdo</h3>
                        <p class="text-sm text-gray-500">Arreglada y normal</p>
                    </div>
                    <div class="flex justify-between items-center">
                        <p class="text-xl font-bold">₡3 500<span class="text-sm text-gray-500"> /kg</span></p>
                        <button class="btn-primary px-4 py-2 rounded" onclick="addToCart('Costilla de cerdo', 3500)">
                            <i class="fas fa-plus mr-2"></i>Agregar
                        </button>
                    </div>
                </div>

                <div class="product-card bg-white p-6">
                    <div class="mb-4">
                        <h3 class="text-lg font-bold" style="color: var(--azul-bm);">Pezuña de cerdo</h3>
                        <p class="text-sm text-gray-500">Ideal para sopas</p>
                    </div>
                    <div class="flex justify-between items-center">
                        <p class="text-xl font-bold">₡2 500<span class="text-sm text-gray-500"> /kg</span></p>
                        <button class="btn-primary px-4 py-2 rounded" onclick="addToCart('Pezuña de cerdo', 2500)">
                            <i class="fas fa-plus mr-2"></i>Agregar
                        </button>
                    </div>
                </div>

                <!-- Pollo -->
                <div class="product-card bg-white p-6">
                    <div class="mb-4">
                        <h3 class="text-lg font-bold" style="color: var(--azul-bm);">Pollo en trocitos</h3>
                        <p class="text-sm text-gray-500">Cortes variados</p>
                    </div>
                    <div class="flex justify-between items-center">
                        <p class="text-xl font-bold">₡4 490<span class="text-sm text-gray-500"> /kg</span></p>
                        <button class="btn-primary px-4 py-2 rounded" onclick="addToCart('Pollo en trocitos', 4490)">
                            <i class="fas fa-plus mr-2"></i>Agregar
                        </button>
                    </div>
                </div>

                <div class="product-card bg-white p-6">
                    <div class="mb-4">
                        <h3 class="text-lg font-bold" style="color: var(--azul-bm);">Filet de pollo</h3>
                        <p class="text-sm text-gray-500">Limpio y preparado</p>
                    </div>
                    <div class="flex justify-between items-center">
                        <p class="text-xl font-bold">₡4 490<span class="text-sm text-gray-500"> /kg</span></p>
                        <button class="btn-primary px-4 py-2 rounded" onclick="addToCart('Filet de pollo', 4490)">
                            <i class="fas fa-plus mr-2"></i>Agregar
                        </button>
                    </div>
                </div>

                <!-- Pescado -->
                <div class="product-card bg-white p-6">
                    <div class="mb-4">
                        <h3 class="text-lg font-bold" style="color: var(--azul-bm);">Tilapia</h3>
                        <p class="text-sm text-gray-500">Fresca del día</p>
                    </div>
                    <div class="flex justify-between items-center">
                        <p class="text-xl font-bold">₡3 500<span class="text-sm text-gray-500"> /kg</span></p>
                        <button class="btn-primary px-4 py-2 rounded" onclick="addToCart('Tilapia', 3500)">
                            <i class="fas fa-plus mr-2"></i>Agregar
                        </button>
                    </div>
                </div>
            </div>

            <div class="text-center mt-8">
                <button id="show-more-btn" class="btn-secondary px-6 py-3 rounded-full">
                    Ver todos los productos
                </button>
            </div>
        </section>

        <!-- Shopping Cart Section (Initially Hidden) -->
        <section id="shopping-cart" class="mb-12 hidden">
            <h2 class="category-header">
                <i class="fas fa-shopping-cart mr-2"></i> Su Carrito de Compras
            </h2>

            <div class="bg-white rounded-lg shadow-lg p-6">
                <div id="cart-items" class="mb-6">
                    <!-- Cart items will be inserted here by JavaScript -->
                    <div class="text-center text-gray-500 py-8" id="empty-cart-message">
                        <i class="fas fa-shopping-basket text-4xl mb-2"></i>
                        <p>Su carrito está vacío</p>
                    </div>
                </div>

                <div id="cart-summary" class="cart-summary hidden">
                    <div class="flex justify-between mb-2">
                        <span>Subtotal:</span>
                        <span id="subtotal">₡0</span>
                    </div>
                    <div class="flex justify-between mb-4">
                        <span>IVA (13%):</span>
                        <span id="tax">₡0</span>
                    </div>
                    <div class="flex justify-between font-bold text-lg">
                        <span>Total:</span>
                        <span id="total">₡0</span>
                    </div>
                </div>
            </div>
        </section>

        <!-- Order Form Section -->
        <section id="order-form" class="mb-12 hidden">
            <h2 class="category-header">
                <i class="fas fa-clipboard-list mr-2"></i> Detalles de su Pedido
            </h2>

            <div class="bg-white rounded-lg shadow-lg p-6">
                <!-- Contact Information -->
                <div class="form-section mb-6">
                    <h3 class="text-lg font-bold mb-4" style="color: var(--azul-bm);">Información de Contacto</h3>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label class="block text-gray-700 mb-2" for="name">Nombre completo</label>
                            <input type="text" id="name" class="w-full px-4 py-2 border rounded focus:outline-none focus:border-blue-500" placeholder="Nombre y apellidos">
                        </div>
                        <div>
                            <label class="block text-gray-700 mb-2" for="phone">Teléfono</label>
                            <input type="tel" id="phone" class="w-full px-4 py-2 border rounded focus:outline-none focus:border-blue-500" placeholder="8888-8888">
                        </div>
                        <div class="md:col-span-2">
                            <label class="block text-gray-700 mb-2" for="email">Correo electrónico</label>
                            <input type="email" id="email" class="w-full px-4 py-2 border rounded focus:outline-none focus:border-blue-500" placeholder="ejemplo@correo.com">
                        </div>
                    </div>
                </div>

                <!-- Pickup Details -->
                <div class="form-section mb-6">
                    <h3 class="text-lg font-bold mb-4" style="color: var(--azul-bm);">Detalles de Recogida</h3>
                    <div class="mb-4">
                        <label class="block text-gray-700 mb-2" for="pickup-date">Fecha de recogida</label>
                        <input type="date" id="pickup-date" class="w-full px-4 py-2 border rounded focus:outline-none focus:border-blue-500">
                    </div>
                    <div class="mb-4">
                        <label class="block text-gray-700 mb-2" for="pickup-time">Hora de recogida</label>
                        <select id="pickup-time" class="w-full px-4 py-2 border rounded focus:outline-none focus:border-blue-500">
                            <option value="">Seleccione una hora</option>
                            <option value="9:00">9:00 AM</option>
                            <option value="10:00">10:00 AM</option>
                            <option value="11:00">11:00 AM</option>
                            <option value="12:00">12:00 PM</option>
                            <option value="13:00">1:00 PM</option>
                            <option value="14:00">2:00 PM</option>
                            <option value="15:00">3:00 PM</option>
                            <option value="16:00">4:00 PM</option>
                            <option value="17:00">5:00 PM</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-gray-700 mb-2" for="notes">Notas adicionales</label>
                        <textarea id="notes" class="w-full px-4 py-2 border rounded focus:outline-none focus:border-blue-500" rows="3" placeholder="Instrucciones especiales para su pedido..."></textarea>
                    </div>
                </div>

                <!-- Payment Method -->
                <div class="form-section">
                    <h3 class="text-lg font-bold mb-4" style="color: var(--azul-bm);">Método de Pago</h3>
                    <div class="flex flex-wrap gap-4">
                        <div class="flex items-center">
                            <input type="radio" id="payment-store" name="payment" value="store" class="mr-2" checked>
                            <label for="payment-store" class="flex items-center">
                                <i class="fas fa-store mr-2" style="color: var(--verde-bm);"></i>
                                Pagar en tienda
                            </label>
                        </div>
                        <div class="flex items-center">
                            <input type="radio" id="payment-sinpe" name="payment" value="sinpe" class="mr-2">
                            <label for="payment-sinpe" class="flex items-center">
                                <i class="fas fa-mobile-alt mr-2" style="color: var(--verde-bm);"></i>
                                SINPE Móvil
                            </label>
                        </div>
                        <div class="flex items-center">
                            <input type="radio" id="payment-transfer" name="payment" value="transfer" class="mr-2">
                            <label for="payment-transfer" class="flex items-center">
                                <i class="fas fa-university mr-2" style="color: var(--verde-bm);"></i>
                                Transferencia bancaria
                            </label>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Checkout Button -->
        <section id="checkout-section" class="text-center mb-12 hidden">
            <button id="place-order-btn" class="btn-primary px-8 py-4 rounded-full text-xl font-bold">
                <i class="fas fa-check-circle mr-2"></i>
                Completar Pedido
            </button>
        </section>

        <!-- Order Confirmation (Initially Hidden) -->
        <section id="order-confirmation" class="hidden">
            <div class="bg-green-50 border border-green-200 rounded-lg p-8 text-center">
                <div class="mb-4 text-green-600">
                    <i class="fas fa-check-circle text-5xl"></i>
                </div>
                <h2 class="text-2xl font-bold mb-4 text-green-800">¡Pedido Recibido!</h2>
                <p class="mb-6 text-green-700">Gracias por su compra. Hemos recibido su pedido y estará listo para recoger en la fecha y hora seleccionadas.</p>
                <p class="mb-4 text-green-700" id="order-number"></p>
                <button class="bg-white text-green-600 border border-green-500 px-6 py-2 rounded hover:bg-green-50 transition-colors" onclick="window.location.reload()">
                    <i class="fas fa-arrow-left mr-2"></i>
                    Volver a la tienda
                </button>
            </div>
        </section>
    </main>

    <!-- Footer -->
    <footer class="bg-gray-800 text-white py-8">
        <div class="container mx-auto px-4">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div>
                    <h3 class="text-xl font-bold mb-4" style="color: var(--verde-bm);">BM Super Nelo</h3>
                    <p class="mb-2">Un supermercado para nuestro pueblo</p>
                    <p>Estamos en Taras, Cartago</p>
                </div>
                <div>
                    <h3 class="text-xl font-bold mb-4" style="color: var(--verde-bm);">Horario</h3>
                    <p class="mb-2">Lunes a Viernes: 8:00 AM - 7:00 PM</p>
                    <p class="mb-2">Sábados: 8:00 AM - 6:00 PM</p>
                    <p>Domingos: 8:00 AM - 1:00 PM</p>
                </div>
                <div>
                    <h3 class="text-xl font-bold mb-4" style="color: var(--verde-bm);">Contacto</h3>
                    <p class="mb-2"><i class="fas fa-phone mr-2"></i> 2000-0000</p>
                    <p class="mb-2"><i class="fas fa-envelope mr-2"></i> info@bmsupernelo.com</p>
                    <div class="flex mt-4">
                        <a href="#" class="text-white hover:text-gray-300 mr-4"><i class="fab fa-facebook-f text-xl"></i></a>
                        <a href="#" class="text-white hover:text-gray-300 mr-4"><i class="fab fa-instagram text-xl"></i></a>
                        <a href="#" class="text-white hover:text-gray-300"><i class="fab fa-whatsapp text-xl"></i></a>
                    </div>
                </div>
            </div>
            <div class="mt-8 pt-8 border-t border-gray-700 text-center">
                <p>&copy; 2025 BM Super Nelo. Todos los derechos reservados.</p>
            </div>
        </div>
    </footer>

    <script>
        // Cart functionality
        let cart = [];
        const cartButton = document.getElementById('cart-button');
        const cartCount = document.getElementById('cart-count');
        const shoppingCart = document.getElementById('shopping-cart');
        const cartItems = document.getElementById('cart-items');
        const cartSummary = document.getElementById('cart-summary');
        const emptyCartMessage = document.getElementById('empty-cart-message');
        const orderForm = document.getElementById('order-form');
        const checkoutSection = document.getElementById('checkout-section');
        const showMoreBtn = document.getElementById('show-more-btn');
        const orderConfirmation = document.getElementById('order-confirmation');
        const placeOrderBtn = document.getElementById('place-order-btn');
        const orderNumber = document.getElementById('order-number');

        // Function to add items to cart
        function addToCart(name, price) {
            // Check if the product is already in the cart
            const existingItem = cart.find(item => item.name === name);
            
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                cart.push({
                    name: name,
                    price: price,
                    quantity: 1
                });
            }
            
            updateCart();
            
            // Show cart if it's hidden
            if (shoppingCart.classList.contains('hidden')) {
                shoppingCart.classList.remove('hidden');
                orderForm.classList.remove('hidden');
                checkoutSection.classList.remove('hidden');
                
                // Scroll to cart
                shoppingCart.scrollIntoView({ behavior: 'smooth' });
            }
        }

        // Function to update cart display
        function updateCart() {
            // Update cart count
            const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
            cartCount.textContent = totalItems;
            
            // If cart is empty, show message and hide summary
            if (totalItems === 0) {
                emptyCartMessage.classList.remove('hidden');
                cartSummary.classList.add('hidden');
                orderForm.classList.add('hidden');
                checkoutSection.classList.add('hidden');
                return;
            }
            
            // Otherwise, update cart items and show summary
            emptyCartMessage.classList.add('hidden');
            cartSummary.classList.remove('hidden');
            
            // Clear existing items
            cartItems.innerHTML = '';
            
            // Add each item to the cart
            cart.forEach((item, index) => {
                const itemElement = document.createElement('div');
                itemElement.className = 'cart-item flex justify-between items-center';
                
                const totalPrice = item.price * item.quantity;
                
                itemElement.innerHTML = `
                    <div>
                        <h4 class="font-bold">${item.name}</h4>
                        <p class="text-gray-600">₡${item.price.toLocaleString()} x ${item.quantity}</p>
                    </div>
                    <div class="flex items-center">
                        <span class="font-bold mr-4">₡${totalPrice.toLocaleString()}</span>
                        <div class="flex items-center">
                            <button class="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300" onclick="decreaseQuantity(${index})">
                                <i class="fas fa-minus text-gray-600"></i>
                            </button>
                            <span class="mx-2">${item.quantity}</span>
                            <button class="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300" onclick="increaseQuantity(${index})">
                                <i class="fas fa-plus text-gray-600"></i>
                            </button>
                        </div>
                        <button class="ml-4 text-red-500 hover:text-red-700" onclick="removeItem(${index})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                `;
                
                cartItems.appendChild(itemElement);
            });
            
            // Update totals
            const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
            const tax = subtotal * 0.13;
            const total = subtotal + tax;
            
            document.getElementById('subtotal').textContent = `₡${subtotal.toLocaleString()}`;
            document.getElementById('tax').textContent = `₡${tax.toLocaleString()}`;
            document.getElementById('total').textContent = `₡${total.toLocaleString()}`;
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
            } else {
                removeItem(index);
            }
            updateCart();
        }

        // Remove an item from the cart
        function removeItem(index) {
            cart.splice(index, 1);
            updateCart();
        }

        // Toggle cart visibility on button click
        cartButton.addEventListener('click', () => {
            shoppingCart.classList.toggle('hidden');
            
            // If showing cart and it's not empty, also show order form
            if (!shoppingCart.classList.contains('hidden') && cart.length > 0) {
                orderForm.classList.remove('hidden');
                checkoutSection.classList.remove('hidden');
            }
        });

        // Show more button functionality
        showMoreBtn.addEventListener('click', () => {
            alert('Esta funcionalidad mostraría todos los productos disponibles en el catálogo completo.');
        });

        // Place order button functionality
        placeOrderBtn.addEventListener('click', () => {
            // Get form values
            const name = document.getElementById('name').value;
            const phone = document.getElementById('phone').value;
            const pickupDate = document.getElementById('pickup-date').value;
            const pickupTime = document.getElementById('pickup-time').value;
            
            // Basic validation
            if (!name || !phone || !pickupDate || !pickupTime) {
                alert('Por favor complete todos los campos requeridos.');
                return;
            }
            
            // Hide cart and form sections
            shoppingCart.classList.add('hidden');
            orderForm.classList.add('hidden');
            checkoutSection.classList.add('hidden');
            
            // Generate random order number
            const orderNum = Math.floor(100000 + Math.random() * 900000);
            orderNumber.textContent = `Número de pedido: #${orderNum}`;
            
            // Show confirmation
            orderConfirmation.classList.remove('hidden');
            
            // Scroll to confirmation
            orderConfirmation.scrollIntoView({ behavior: 'smooth' });
            
            // Reset cart
            cart = [];
            updateCart();
        });

        // Initialize cart
        updateCart();
    </script>
</body>
</html>
