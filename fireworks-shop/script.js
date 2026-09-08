const SUPABASE_URL = "https://nukadldqhfmtwuuugtse.supabase.co";
const SUPABASE_KEY = "sb_publishable_ZaJOJNATcFrMyUY0E58WIQ_JrZT3KVW";

let cart = [];
localStorage.removeItem("cart");
let allProducts = [];
let discountPercent = 0;
let selectedCategory = "All";


// ===============================
// LOAD PRODUCTS
// ===============================

async function loadProducts() {

    const discountResponse = await fetch(
        SUPABASE_URL + "/rest/v1/discount_settings?select=discount_percent&id=eq.1",
        {
            headers: {
                "apikey": SUPABASE_KEY,
                "Authorization": "Bearer " + SUPABASE_KEY
            }
        }
    );

    if (discountResponse.ok) {
        const discountData = await discountResponse.json();

        if (discountData.length > 0) {
            discountPercent = Number(discountData[0].discount_percent);
        }
    }

    const response = await fetch(
        SUPABASE_URL + "/rest/v1/products?select=*&order=id.asc",
        {
            headers: {
                "apikey": SUPABASE_KEY,
                "Authorization": "Bearer " + SUPABASE_KEY
            }
        }
    );

    if (!response.ok) {
        console.log("PRODUCT LOAD ERROR");
        return;
    }

    allProducts = await response.json();
    loadCategories();

    displayProducts(allProducts);
}
// ===============================
// DISPLAY PRODUCTS
// ===============================

function displayProducts(products) {
    const productList = document.getElementById("product-list");
    productList.innerHTML = "";

    if (products.length === 0) {
        productList.innerHTML = `
            <div class="no-products">
                <h3>🔎 No products found</h3>
                <p>Try another product name or category.</p>
            </div>
        `;
        return;
    }

    products.forEach(product => {

        let emoji = "🎆";

        if (product.category === "Rocket") {
            emoji = "🚀";
        }

        if (product.category === "Sparklers") {
            emoji = "✨";
        }

        const quantity = selectedQuantities[product.id] || 0;
        const originalPrice = Number(product.price);
        const discountedPrice = originalPrice - (originalPrice * discountPercent / 100);
            productList.innerHTML += `
            <div class="customer-product-card">

                <div class="customer-product-image">
                    ${
                        product.image_url
                        ? `<img src="${product.image_url}" alt="${product.name}">`
                        : `<span>${emoji}</span>`
                    }
                </div>

                <div class="customer-product-info">

                    <span class="customer-product-category">
                        ${product.category || "Fireworks"}
                    </span>

                    <h3>${product.name}</h3>

                    <p>
                        ${product.description || "Premium quality fireworks."}
                    </p>
                    <div class="customer-product-price">

    <span style="text-decoration: line-through; opacity: 0.6;">
        ₹${originalPrice.toLocaleString("en-IN")}
    </span>

    <strong>
        ₹${discountedPrice.toLocaleString("en-IN")}
    </strong>

</div>

<div class="product-card-bottom">

    <div class="product-quantity">

        <button onclick='changeProductQuantity("${product.id}", -1)'>
            −
        </button>

        <span id="quantity-${product.id}">
            ${quantity}
        </span>

        <button onclick='changeProductQuantity("${product.id}", 1)'>
            +
        </button>

        <span style="margin-left: 12px; font-weight: 700;">
            ${discountPercent}% OFF
        </span>

    </div>

</div>
          
                   

                    
        `;
    });
}
let selectedQuantities = {};

function changeProductQuantity(productId, change) {

    productId = String(productId);

    if (!selectedQuantities[productId]) {
        selectedQuantities[productId] = 0;
    }

    selectedQuantities[productId] += Number(change);

    if (selectedQuantities[productId] < 0) {
        selectedQuantities[productId] = 0;
    }

    const quantityElement =
        document.getElementById("quantity-" + productId);

    if (quantityElement) {
        quantityElement.textContent =
            selectedQuantities[productId];
    }
}
// ===============================
// SEARCH PRODUCTS
// ===============================

function filterProducts() {

    const filteredProducts = getFilteredProducts();

    displayProducts(filteredProducts);
}


// ===============================
// CATEGORY FILTER
// ===============================
function toggleCategoryMenu() {

    const menu =
        document.getElementById("product-categories");

    const arrow =
        document.querySelector(".category-arrow");

    if (!menu) return;

    menu.classList.toggle("show");

    if (menu.classList.contains("show")) {
        arrow.textContent = "▲";
    } else {
        arrow.textContent = "▼";
    }
}
function filterCategory(category, button) {

    selectedCategory = category;


    document
        .querySelectorAll(".category-filter")
        .forEach(btn => {
            btn.classList.remove("active");
        });


    button.classList.add("active");
    document.getElementById("selected-category").textContent =
    category;

document.getElementById("product-categories").classList.remove("show");


    displayProducts(
        getFilteredProducts()
    );
}
// ===============================
// LOAD CATEGORIES
// ===============================

function loadCategories() {

    const categoryContainer =
        document.getElementById("product-categories");

    if (!categoryContainer) {
        return;
    }

    const categories = [
        ...new Set(
            allProducts
                .map(product => product.category)
                .filter(category => category)
        )
    ];

    categoryContainer.innerHTML = `
        <button
            class="category-filter active"
            onclick="filterCategory('All', this)">
            All
        </button>
    `;

    categories.forEach(category => {

        categoryContainer.innerHTML += `
            <button
                class="category-filter"
                onclick="filterCategory('${category}', this)">
                ${category}
            </button>
        `;
    });
}
// ===============================
// GET FILTERED PRODUCTS
// ===============================

function getFilteredProducts() {

    const searchInput =
        document.getElementById("product-search");

    const search =
        searchInput
            ? searchInput.value.trim().toLowerCase()
            : "";

    return allProducts.filter(product => {

        const productName =
            (product.name || "").toLowerCase();

        const category =
            (product.category || "").toLowerCase();

        const matchesSearch =
            productName.includes(search);

        let matchesCategory = true;

        if (selectedCategory !== "All") {

            matchesCategory =
                category === selectedCategory.toLowerCase();

        }

        return matchesSearch && matchesCategory;

    });
}
// ===============================
// UPDATE CART
// ===============================

function updateCart() {

    const cartItems =
        document.getElementById("cart-items");

    const cartSubtotal =
        document.getElementById("cart-subtotal");

    const cartDiscount =
        document.getElementById("cart-discount");

    const cartDiscountPercent =
        document.getElementById("cart-discount-percent");

    const cartSavings =
        document.getElementById("cart-savings");

    const cartTotal =
        document.getElementById("cart-total");


    if (!cartItems || !cartTotal) {
        return;
    }


    cartItems.innerHTML = "";


    let subtotal = 0;


    // ===============================
    // EMPTY CART
    // ===============================

    if (cart.length === 0) {

        cartItems.innerHTML = `
            <p class="empty-cart">
                Your cart is empty 🛒
            </p>
        `;

    } else {

        cart.forEach((item, index) => {

            const itemTotal =
                Number(item.price) *
                Number(item.quantity);

            subtotal += itemTotal;


            cartItems.innerHTML += `

                <div class="cart-item">

                    <div>
                        <h3>${item.name}</h3>

                        <p>
                            ₹${Number(item.price).toLocaleString("en-IN")}
                            × ${item.quantity}
                        </p>
                    </div>


                    <div class="quantity-controls">

                        <button
                            onclick="decreaseQuantity(${index})">
                            −
                        </button>

                        <span>
                            ${item.quantity}
                        </span>

                        <button
                            onclick="increaseQuantity(${index})">
                            +
                        </button>

                    </div>


                    <strong>
                        ₹${itemTotal.toLocaleString("en-IN")}
                    </strong>


                    <button
                        class="remove-btn"
                        onclick="removeFromCart(${index})">
                        🗑️
                    </button>

                </div>
            `;
        });
    }


    // ===============================
    // DISCOUNT CALCULATION
    // ===============================

    const discountAmount =
        Math.round(
            subtotal *
            discountPercent /
            100
        );


    const finalTotal =
        subtotal -
        discountAmount;


    // ===============================
    // DISPLAY CART TOTALS
    // ===============================

    if (cartSubtotal) {

        cartSubtotal.textContent =
            subtotal.toLocaleString("en-IN");
    }


    if (cartDiscount) {

        cartDiscount.textContent =
            discountAmount.toLocaleString("en-IN");
    }


    if (cartDiscountPercent) {

        cartDiscountPercent.textContent =
            discountPercent;
    }


    if (cartSavings) {

        cartSavings.textContent =
            discountAmount.toLocaleString("en-IN");
    }


    if (cartTotal) {

        cartTotal.textContent =
            finalTotal.toLocaleString("en-IN");
    }


    // ===============================
    // SAVE CART
    // ===============================

    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );
}
// ===============================
// CART +
// ===============================

function increaseQuantity(index) {

    cart[index].quantity += 1;

    updateCart();

    displayProducts(
        getFilteredProducts()
    );
}


// ===============================
// CART -
// ===============================

function decreaseQuantity(index) {

    if (cart[index].quantity > 1) {

        cart[index].quantity -= 1;

    } else {

        cart.splice(index, 1);
    }


    updateCart();

    displayProducts(
        getFilteredProducts()
    );
}


// ===============================
// REMOVE CART ITEM
// ===============================

function removeFromCart(index) {

    cart.splice(index, 1);

    updateCart();

    displayProducts(
        getFilteredProducts()
    );
}
// ===============================
// CHECKOUT
// ===============================

function goToCheckout() {

    if (cart.length === 0) {

        alert("Please add at least one product.");

        return;
    }

    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );

    window.location.href =
        "checkout.html";
}
// ===============================
// ADD SELECTED PRODUCTS TO CART
// ===============================

function addSelectedProductsToCart() {

    Object.keys(selectedQuantities).forEach(productId => {

        const quantity =
            Number(selectedQuantities[productId]) || 0;

        if (quantity <= 0) {
            return;
        }

        const product =
            allProducts.find(
                item => String(item.id) === String(productId)
            );

        if (!product) {
            return;
        }

        const existingItem =
            cart.find(
                item => String(item.id) === String(productId)
            );

        // Use ORIGINAL price in cart
        const originalPrice =
            Number(product.price);

        if (existingItem) {

            existingItem.quantity += quantity;

        } else {

            cart.push({
                id: product.id,
                name: product.name,
                price: originalPrice,
                quantity: quantity
            });

        }

        // Reset selected quantity
        selectedQuantities[productId] = 0;
    });


    // Save cart
    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );


    // Refresh cart
    updateCart();


    // Refresh product quantities
    displayProducts(
        getFilteredProducts()
    );


    // Go to cart
    window.location.hash = "cart";
}
// ===============================
// INITIAL LOAD
// ===============================
loadProducts();

updateCart();

const searchInput = document.getElementById("product-search");

if (searchInput) {
    searchInput.addEventListener("input", function () {
        filterProducts();
    });
}

// =========================================
// PREMIUM FIREWORKS ANIMATION
// =========================================

const canvas = document.getElementById("fireworks-canvas");

if (canvas) {

    const ctx = canvas.getContext("2d");

    let fireworks = [];
    let particles = [];

    function resizeCanvas() {

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

    }

    resizeCanvas();

    window.addEventListener(
        "resize",
        resizeCanvas
    );


    // =====================================
    // FIREWORK
    // =====================================

    class Firework {

        constructor() {

            this.x =
                Math.random() * canvas.width;

            this.targetY =
                80 +
                Math.random() *
                (canvas.height * 0.45);

            this.y =
                canvas.height + 10;

            this.speed =
                7 + Math.random() * 4;

            this.exploded = false;

            this.color =
                `hsl(${Math.random() * 360}, 100%, 65%)`;

        }


        update() {

            this.y -= this.speed;

            if (this.y <= this.targetY) {

                this.explode();

                return true;

            }

            return false;
        }


        draw() {

            ctx.beginPath();

            ctx.arc(
                this.x,
                this.y,
                2,
                0,
                Math.PI * 2
            );

            ctx.fillStyle = this.color;

            ctx.shadowBlur = 15;
            ctx.shadowColor = this.color;

            ctx.fill();

            ctx.shadowBlur = 0;
        }


        explode() {

            const particleCount = 65;

            for (
                let i = 0;
                i < particleCount;
                i++
            ) {

                const angle =
                    (Math.PI * 2 * i) /
                    particleCount;

                const speed =
                    2 +
                    Math.random() * 5;

                particles.push(
                    new Particle(
                        this.x,
                        this.y,
                        angle,
                        speed,
                        this.color
                    )
                );
            }

        }

    }


    // =====================================
    // PARTICLES
    // =====================================

    class Particle {

        constructor(
            x,
            y,
            angle,
            speed,
            color
        ) {

            this.x = x;
            this.y = y;

            this.vx =
                Math.cos(angle) * speed;

            this.vy =
                Math.sin(angle) * speed;

            this.alpha = 1;

            this.gravity = 0.045;

            this.friction = 0.985;

            this.color = color;

            this.size =
                1 +
                Math.random() * 2;
        }


        update() {

            this.vx *= this.friction;

            this.vy *= this.friction;

            this.vy += this.gravity;

            this.x += this.vx;

            this.y += this.vy;

            this.alpha -= 0.012;

            return this.alpha <= 0;
        }


        draw() {

            ctx.beginPath();

            ctx.arc(
                this.x,
                this.y,
                this.size,
                0,
                Math.PI * 2
            );

            ctx.fillStyle =
                this.color;

            ctx.globalAlpha =
                this.alpha;

            ctx.shadowBlur = 12;

            ctx.shadowColor =
                this.color;

            ctx.fill();

            ctx.globalAlpha = 1;

            ctx.shadowBlur = 0;
        }

    }


    // =====================================
    // CREATE FIREWORK
    // =====================================

    function createFirework() {

        fireworks.push(
            new Firework()
        );

    }


    // =====================================
    // ANIMATION
    // =====================================

    function animate() {

        ctx.fillStyle =
            "rgba(5, 2, 13, 0.20)";

        ctx.fillRect(
            0,
            0,
            canvas.width,
            canvas.height
        );


        // Fireworks

        for (
            let i = fireworks.length - 1;
            i >= 0;
            i--
        ) {

            const exploded =
                fireworks[i].update();

            fireworks[i].draw();


            if (exploded) {

                fireworks.splice(i, 1);

            }

        }


        // Particles

        for (
            let i = particles.length - 1;
            i >= 0;
            i--
        ) {

            const dead =
                particles[i].update();

            particles[i].draw();


            if (dead) {

                particles.splice(i, 1);

            }

        }


        requestAnimationFrame(
            animate
        );

    }


    // Start animation

    setInterval(
        createFirework,
        900
    );

    createFirework();

    animate();

}