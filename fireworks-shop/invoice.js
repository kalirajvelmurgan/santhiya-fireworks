const orderId =
    localStorage.getItem("orderId") || "-";

const customerName =
    localStorage.getItem("customerName") || "-";

const customerPhone =
    localStorage.getItem("customerPhone") || "-";

const customerAddress =
    localStorage.getItem("customerAddress") || "-";


const subtotal =
    Number(localStorage.getItem("orderSubtotal")) || 0;

const discountPercent =
    Number(localStorage.getItem("orderDiscountPercent")) || 0;

const discountAmount =
    Number(localStorage.getItem("orderDiscountAmount")) || 0;

const total =
    Number(localStorage.getItem("orderTotal")) || 0;


const cart =
    JSON.parse(localStorage.getItem("cart")) || [];


// =========================================
// FORMAT PRICE
// =========================================

function formatPrice(amount) {

    return Number(amount || 0)
        .toLocaleString("en-IN");

}


// =========================================
// CUSTOMER DETAILS
// =========================================

const orderIdElement =
    document.getElementById("invoice-order-id");

const nameElement =
    document.getElementById("invoice-customer-name");

const phoneElement =
    document.getElementById("invoice-customer-phone");

const addressElement =
    document.getElementById("invoice-customer-address");


if (orderIdElement) {

    orderIdElement.textContent =
        orderId;

}


if (nameElement) {

    nameElement.textContent =
        customerName;

}


if (phoneElement) {

    phoneElement.textContent =
        customerPhone;

}


if (addressElement) {

    addressElement.textContent =
        customerAddress;

}


// =========================================
// ORDER DATE
// =========================================

const dateElement =
    document.getElementById("invoice-date");


if (dateElement) {

    dateElement.textContent =
        new Date().toLocaleDateString(
            "en-IN",
            {
                day: "2-digit",
                month: "short",
                year: "numeric"
            }
        );

}


// =========================================
// ORDER ITEMS
// =========================================

const invoiceItems =
    document.getElementById("invoice-items");


if (invoiceItems) {

    invoiceItems.innerHTML = "";


    if (cart.length === 0) {

        invoiceItems.innerHTML = `
            <div class="invoice-empty">
                🛒 No order items found.
            </div>
        `;

    } else {

        cart.forEach(function (item, index) {

            const price =
                Number(item.price) || 0;

            const quantity =
                Number(item.quantity) || 0;

            const itemTotal =
                price * quantity;


            invoiceItems.innerHTML += `
                <div class="invoice-item">

                    <div class="invoice-item-number">
                        ${index + 1}
                    </div>

                    <div class="invoice-item-name">

                        <strong>
                            ${item.name}
                        </strong>

                        <small>
                            Premium Fireworks
                        </small>

                    </div>

                    <div class="invoice-item-price">

                        ₹${formatPrice(price)}
                        × ${quantity}

                    </div>

                    <div class="invoice-item-total">

                        ₹${formatPrice(itemTotal)}

                    </div>

                </div>
            `;

        });

    }

}


// =========================================
// PRICE SUMMARY
// =========================================

const subtotalElement =
    document.getElementById("invoice-subtotal");

const discountElement =
    document.getElementById("invoice-discount");

const totalElement =
    document.getElementById("invoice-total");


if (subtotalElement) {

    subtotalElement.textContent =
        "₹" + formatPrice(subtotal);

}


if (discountElement) {

    if (discountPercent > 0) {

        discountElement.textContent =
            discountPercent +
            "% (-₹" +
            formatPrice(discountAmount) +
            ")";

    } else {

        discountElement.textContent =
            "No Discount";

    }

}


if (totalElement) {

    totalElement.textContent =
        "₹" + formatPrice(total);

}


// =========================================
// WHATSAPP
// =========================================

function sendWhatsApp() {

    const shopNumber =
        "918695978744";


    const message =
        localStorage.getItem("whatsappMessage");


    if (!message) {

        alert(
            "WhatsApp order details not found."
        );

        return;

    }


    const whatsappURL =
        "https://wa.me/" +
        shopNumber +
        "?text=" +
        encodeURIComponent(message);


    window.open(
        whatsappURL,
        "_blank"
    );

}


// =========================================
// PRINT / SAVE PDF
// =========================================

function printInvoice() {

    window.print();

}