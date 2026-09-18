const SUPABASE_URL = "https://nukadldqhfmtwuuugtse.supabase.co";
const SUPABASE_KEY = "sb_publishable_ZaJOJNATcFrMyUY0E58WIQ_JrZT3KVW";

let cart = JSON.parse(localStorage.getItem("cart")) || [];

let discountPercent = 0;
let subtotal = 0;
let discountAmount = 0;
let finalTotal = 0;


// =========================================
// LOAD DISCOUNT
// =========================================

async function loadDiscount() {

    const response = await fetch(
        SUPABASE_URL +
        "/rest/v1/discount_settings?select=discount_percent&limit=1",
        {
            headers: {
                "apikey": SUPABASE_KEY,
                "Authorization": "Bearer " + SUPABASE_KEY,
                "Content-Type": "application/json"
            }
        }
    );

    if (!response.ok) {

        console.log(
            "DISCOUNT LOAD ERROR:",
            await response.json()
        );

        return 0;
    }

    const settings = await response.json();

    if (settings.length > 0) {
        return Number(settings[0].discount_percent || 0);
    }

    return 0;
}


// =========================================
// DISPLAY CHECKOUT
// =========================================

async function displayCheckout() {

    const checkoutItems =
        document.getElementById("checkout-items");

    checkoutItems.innerHTML = "";

    subtotal = 0;

    if (cart.length === 0) {

        checkoutItems.innerHTML =
            "<p>Your cart is empty.</p>";

    } else {

        cart.forEach(item => {

            const itemTotal =
                item.price * item.quantity;

            subtotal += itemTotal;

            checkoutItems.innerHTML += `
                <div class="checkout-item">

                    <div>
                        <h4>${item.name}</h4>

                        <p>
                            ₹${item.price} × ${item.quantity}
                        </p>
                    </div>

                    <strong>
                        ₹${itemTotal}
                    </strong>

                </div>
            `;
        });
    }


    discountPercent = await loadDiscount();


    discountAmount =
        Math.round(
            subtotal * discountPercent / 100
        );


    finalTotal =
        subtotal - discountAmount;


    document.getElementById(
        "checkout-subtotal"
    ).textContent = subtotal;


    document.getElementById(
        "checkout-discount"
    ).textContent = discountAmount;


    document.getElementById(
        "checkout-total"
    ).textContent = finalTotal;


    const discountInfo =
        document.querySelector(".discount-info");

    if (discountInfo) {

        if (discountPercent > 0) {

            discountInfo.style.display = "block";

            discountInfo.textContent =
                `🎉 ${discountPercent}% discount applied — You save ₹${discountAmount}`;

        } else {

            discountInfo.style.display = "none";
        }
    }
}


// =========================================
// CONFIRM ORDER
// =========================================

async function confirmOrder() {

    const name =
        document.getElementById("customer-name")
            .value.trim();

    const phone =
        document.getElementById("customer-phone")
            .value.trim();

    const address =
        document.getElementById("customer-address")
            .value.trim();


    if (cart.length === 0) {

        alert("Your cart is empty.");

        return;
    }


    if (
        name === "" ||
        phone === "" ||
        address === ""
    ) {

        alert(
            "Please fill all customer details."
        );

        return;
    }


    discountPercent = await loadDiscount();


    subtotal = 0;

    cart.forEach(item => {

        subtotal +=
            item.price * item.quantity;

    });


    discountAmount =
        Math.round(
            subtotal * discountPercent / 100
        );


    finalTotal =
        subtotal - discountAmount;


    const orderId =
        "SFA-" +
        Date.now().toString().slice(-6);


    // =========================================
    // SAVE ORDER
    // =========================================

    try {

        const response = await fetch(
            SUPABASE_URL + "/rest/v1/orders",
            {
                method: "POST",

                headers: {
                    "apikey": SUPABASE_KEY,
                    "Authorization":
                        "Bearer " + SUPABASE_KEY,
                    "Content-Type":
                        "application/json",
                    "Prefer": "return=minimal"
                },

                body: JSON.stringify({

                    order_id: orderId,

                    customer_name: name,

                    customer_phone: phone,

                    customer_address: address,

                    items: cart,

                    total: finalTotal,

                    status: "Pending"

                })
            }
        );


        if (!response.ok) {

            const error =
                await response.json();

            console.log(
                "ORDER ERROR:",
                error
            );

            alert(
                "Order could not be placed.\n\n" +
                (
                    error.message ||
                    JSON.stringify(error)
                )
            );

            return;
        }


        // =========================================
        // SAVE ORDER DETAILS
        // =========================================

        localStorage.setItem(
            "orderId",
            orderId
        );

        localStorage.setItem(
            "customerName",
            name
        );

        localStorage.setItem(
            "customerPhone",
            phone
        );

        localStorage.setItem(
            "customerAddress",
            address
        );

        localStorage.setItem(
            "orderTotal",
            finalTotal
        );

        localStorage.setItem(
            "orderSubtotal",
            subtotal
        );

        localStorage.setItem(
            "orderDiscountPercent",
            discountPercent
        );

        localStorage.setItem(
            "orderDiscountAmount",
            discountAmount
        );


        // =========================================
        // WHATSAPP MESSAGE
        // =========================================

        let whatsappMessage =
            "🧾 *NEW ORDER - SANTHIYA FIREWORK AGENCIES*%0A%0A";


        whatsappMessage +=
            "🆔 Order ID: " +
            orderId +
            "%0A";


        whatsappMessage +=
            "👤 Name: " +
            name +
            "%0A";


        whatsappMessage +=
            "📱 Phone: " +
            phone +
            "%0A";


        whatsappMessage +=
            "🏠 Address: " +
            address +
            "%0A%0A";


        whatsappMessage +=
            "📦 *ORDER DETAILS*%0A";


        cart.forEach(item => {

            whatsappMessage +=
                "• " +
                item.name +
                " × " +
                item.quantity +
                " = ₹" +
                (item.price * item.quantity) +
                "%0A";

        });


        whatsappMessage +=
            "%0A💰 Subtotal: ₹" +
            subtotal;


        if (discountPercent > 0) {

            whatsappMessage +=
                "%0A🏷️ Discount: " +
                discountPercent +
                "%25 (-₹" +
                discountAmount +
                ")";

        }


        whatsappMessage +=
            "%0A💰 *Final Total: ₹" +
            finalTotal +
            "*";


        localStorage.setItem(
            "whatsappMessage",
            whatsappMessage
        );


        // =========================================
        // GO TO INVOICE
        // =========================================

        window.location.href =
            "invoice.html";


    } catch (error) {

        console.error(
            "ORDER SUBMIT ERROR:",
            error
        );

        alert(
            "Something went wrong while placing the order.\n\n" +
            error.message
        );
    }
}


// =========================================
// START
// =========================================

displayCheckout();