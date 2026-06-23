/* ==========================================================
   COSMIC TOUCH - APP JS (PART 1)
   CART + WISHLIST CORE SYSTEM
========================================================== */

/* ===========================
   DATA STORE
=========================== */

let cart = JSON.parse(localStorage.getItem("cart")) || [];
let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

/* ===========================
   SAVE TO STORAGE
=========================== */

function saveCart(){
    localStorage.setItem("cart", JSON.stringify(cart));
}

function saveWishlist(){
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
}

/* ===========================
   ADD TO CART
=========================== */

function addToCart(name, price, image){

    let existing = cart.find(item => item.name === name);

    if(existing){
        existing.qty += 1;
    } else {
        cart.push({
            name: name,
            price: price,
            image: image,
            qty: 1
        });
    }

    saveCart();
    updateCartCount();

    console.log("Added to cart:", name);
}

/* ===========================
   REMOVE FROM CART
=========================== */

function removeFromCart(name){

    cart = cart.filter(item => item.name !== name);

    saveCart();
    updateCartCount();
}

/* ===========================
   CART COUNT UPDATE
=========================== */

function updateCartCount(){

    let count = cart.reduce((total, item) => total + item.qty, 0);

    let cartCount = document.querySelector(".cart-count");

    if(cartCount){
        cartCount.textContent = count;
    }
}

/* ===========================
   WISHLIST TOGGLE
=========================== */

function toggleWishlist(name, price, image){

    let exists = wishlist.find(item => item.name === name);

    if(exists){

        wishlist = wishlist.filter(item => item.name !== name);

    } else {

        wishlist.push({
            name: name,
            price: price,
            image: image
        });

    }

    saveWishlist();
    updateWishlistUI();
}

/* ===========================
   WISHLIST COUNT / UI
=========================== */

function updateWishlistUI(){

    let hearts = document.querySelectorAll(".fa-heart");

    hearts.forEach(icon => {
        icon.classList.add("active");
    });

}

/* ===========================
   INIT ON LOAD
=========================== */

document.addEventListener("DOMContentLoaded", function(){

    updateCartCount();
    updateWishlistUI();

});

/* ==========================================================
   COSMIC TOUCH - APP JS (PART 2)
   PRODUCT BUTTONS + CART PAGE LOGIC
========================================================== */

/* ===========================
   ATTACH ADD TO CART BUTTONS
=========================== */

document.addEventListener("click", function(e){

    /* ADD TO CART BUTTON */
    if(e.target.classList.contains("add-cart")){

        let card = e.target.closest(".product-card");

        let name = card.querySelector("h3").textContent;
        let price = parseInt(card.querySelector("h4").textContent.replace("₹",""));
        let image = card.querySelector("img").src;

        addToCart(name, price, image);

        e.target.textContent = "Added ✓";

        setTimeout(()=>{
            e.target.textContent = "Add to Cart";
        },1000);
    }

    /* REMOVE FROM CART BUTTON (if on cart page) */
    if(e.target.classList.contains("remove-btn")){

        let name = e.target.getAttribute("data-name");

        removeFromCart(name);

        renderCart();
    }

});

/* ===========================
   RENDER CART PAGE
   (Used in cart.html)
=========================== */

function renderCart(){

    let container = document.querySelector(".cart-items");

    if(!container) return;

    container.innerHTML = "";

    let total = 0;

    if(cart.length === 0){

        container.innerHTML = "<p>Your cart is empty 🛒</p>";
        return;
    }

    cart.forEach(item => {

        total += item.price * item.qty;

        container.innerHTML += `
            <div class="cart-item">

                <img src="${item.image}" alt="${item.name}">

                <div class="cart-info">

                    <h3>${item.name}</h3>

                    <p>₹${item.price} x ${item.qty}</p>

                    <button class="remove-btn" data-name="${item.name}">
                        Remove
                    </button>

                </div>

            </div>
        `;
    });

    container.innerHTML += `
        <div class="cart-total">
            <h2>Total: ₹${total}</h2>
        </div>
    `;
}

/* ===========================
   INCREASE / DECREASE QUANTITY
=========================== */

function increaseQty(name){

    let item = cart.find(i => i.name === name);

    if(item){
        item.qty++;
    }

    saveCart();
    updateCartCount();
    renderCart();
}

function decreaseQty(name){

    let item = cart.find(i => i.name === name);

    if(item){

        item.qty--;

        if(item.qty <= 0){
            cart = cart.filter(i => i.name !== name);
        }
    }

    saveCart();
    updateCartCount();
    renderCart();
}

/* ===========================
   AUTO RENDER IF CART PAGE
=========================== */

document.addEventListener("DOMContentLoaded", function(){

    renderCart();

});

/* ==========================================================
   COSMIC TOUCH - APP JS (PART 3)
   SEARCH + WISHLIST PAGE + CHECKOUT PREP
========================================================== */

/* ===========================
   LIVE SEARCH FUNCTION
=========================== */

function searchProducts(query){

    let products = document.querySelectorAll(".product-card");

    query = query.toLowerCase();

    products.forEach(card => {

        let name = card.querySelector("h3").textContent.toLowerCase();
        let desc = card.querySelector("p").textContent.toLowerCase();

        if(name.includes(query) || desc.includes(query)){
            card.style.display = "block";
        } else {
            card.style.display = "none";
        }
    });
}

/* ===========================
   SEARCH INPUT LISTENER
=========================== */

document.addEventListener("input", function(e){

    if(e.target.classList.contains("search-input")){

        searchProducts(e.target.value);

    }

});

/* ===========================
   RENDER WISHLIST PAGE
   (Used in wishlist.html)
=========================== */

function renderWishlist(){

    let container = document.querySelector(".wishlist-items");

    if(!container) return;

    container.innerHTML = "";

    if(wishlist.length === 0){
        container.innerHTML = "<p>Your wishlist is empty ❤️</p>";
        return;
    }

    wishlist.forEach(item => {

        container.innerHTML += `
            <div class="wishlist-item">

                <img src="${item.image}" alt="${item.name}">

                <div class="wishlist-info">

                    <h3>${item.name}</h3>

                    <p>₹${item.price}</p>

                    <button onclick="addToCart('${item.name}', ${item.price}, '${item.image}')">
                        Add to Cart
                    </button>

                    <button onclick="toggleWishlist('${item.name}', ${item.price}, '${item.image}')">
                        Remove ❤️
                    </button>

                </div>

            </div>
        `;
    });
}

/* ===========================
   SIMPLE CHECKOUT DATA PREP
   (FOR RAZORPAY NEXT STEP)
=========================== */

function getCartTotal(){

    return cart.reduce((sum, item) => {
        return sum + (item.price * item.qty);
    }, 0);

}

/* ===========================
   CHECKOUT INIT (placeholder)
=========================== */

function checkout(){

    let total = getCartTotal();

    if(cart.length === 0){
        alert("Cart is empty!");
        return;
    }

    alert("Redirecting to payment... Total: ₹" + total);

    // Razorpay integration will come in next step
    console.log("Checkout initiated", cart);
}

/* ===========================
   INIT WISHLIST ON LOAD
=========================== */

document.addEventListener("DOMContentLoaded", function(){

    renderWishlist();

});

/* ==========================================================
   COSMIC TOUCH - APP JS (PART 4)
   CHECKOUT + RAZORPAY + ORDER FLOW
========================================================== */

/* ===========================
   CREATE ORDER SUMMARY
=========================== */

function createOrderSummary(){

    let summary = [];

    cart.forEach(item => {

        summary.push({
            name: item.name,
            quantity: item.qty,
            price: item.price,
            total: item.price * item.qty
        });

    });

    return summary;
}

/* ===========================
   RAZORPAY PAYMENT FUNCTION
=========================== */

function startPayment(){

    let totalAmount = getCartTotal();

    if(cart.length === 0){
        alert("Your cart is empty 🛒");
        return;
    }

    let options = {
        key: "YOUR_RAZORPAY_KEY_ID", // 🔴 replace this
        amount: totalAmount * 100, // paise
        currency: "INR",
        name: "Cosmic Touch",
        description: "Healing Crystals & Reiki Session",

        handler: function (response) {

            console.log("Payment Success:", response);

            orderSuccess(response.razorpay_payment_id);

        },

        prefill: {
            name: "Customer",
            email: "customer@example.com",
            contact: "9999999999"
        },

        theme: {
            color: "#8D6BFF"
        }
    };

    let rzp = new Razorpay(options);
    rzp.open();
}

/* ===========================
   ORDER SUCCESS HANDLER
=========================== */

function orderSuccess(paymentId){

    let order = {
        id: paymentId,
        items: createOrderSummary(),
        total: getCartTotal(),
        date: new Date().toLocaleString()
    };

    localStorage.setItem("lastOrder", JSON.stringify(order));

    alert("🎉 Payment Successful!\nOrder ID: " + paymentId);

    clearCart();

    window.location.href = "success.html";
}

/* ===========================
   CLEAR CART AFTER PAYMENT
=========================== */

function clearCart(){

    cart = [];

    saveCart();

    updateCartCount();

    renderCart();
}

/* ===========================
   LOAD LAST ORDER (SUCCESS PAGE)
=========================== */

function loadOrder(){

    let order = JSON.parse(localStorage.getItem("lastOrder"));

    let container = document.querySelector(".order-details");

    if(!container || !order) return;

    container.innerHTML = `
        <h2>Order Confirmed 🎉</h2>
        <p><b>Payment ID:</b> ${order.id}</p>
        <p><b>Date:</b> ${order.date}</p>
        <p><b>Total Paid:</b> ₹${order.total}</p>
    `;

}

/* ===========================
   AUTO INIT
=========================== */

document.addEventListener("DOMContentLoaded", function(){

    loadOrder();

});
/* ==========================================================
   SCROLL REVEAL
========================================================== */

function revealOnScroll(){

    const elements = document.querySelectorAll(
        ".reveal, .reveal-left, .reveal-right, .reveal-zoom"
    );

    const trigger = window.innerHeight * 0.85;

    elements.forEach(element => {

        const top = element.getBoundingClientRect().top;

        if(top < trigger){
            element.classList.add("active");
        }

    });

}

window.addEventListener("scroll", revealOnScroll);

window.addEventListener("load", revealOnScroll);