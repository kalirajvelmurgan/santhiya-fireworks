const SUPABASE_URL = "https://nukadldqhfmtwuuugtse.supabase.co";
const SUPABASE_KEY = "sb_publishable_ZaJOJNATcFrMyUY0E58WIQ_JrZT3KVW";

const token = localStorage.getItem("access_token");

if (!token) {
    window.location.href = "admin.html";
}


// ===============================
// SHOW ADD PRODUCT FORM
// ===============================

function showAddProductForm() {

    document.getElementById("product-form").style.display = "block";

    document.getElementById("form-title").textContent = "Add New Product";

    document.getElementById("save-product-btn").textContent = "Save Product";

    document.getElementById("save-product-btn").onclick = addProduct;

    document.getElementById("edit-product-id").value = "";

    clearProductForm();
}


// ===============================
// CLEAR FORM
// ===============================

function clearProductForm() {

    document.getElementById("product-name").value = "";
    document.getElementById("product-description").value = "";
    document.getElementById("product-price").value = "";
    document.getElementById("product-image").value = "";
    document.getElementById("product-category").value = "";
    document.getElementById("product-available").checked = true;
}


// ===============================
// LOAD PRODUCTS
// ===============================

async function loadAdminProducts() {

    const response = await fetch(
        SUPABASE_URL + "/rest/v1/products?select=*&order=id.asc",
        {
            headers: {
                "apikey": SUPABASE_KEY,
                "Authorization": "Bearer " + token
            }
        }
    );

    const products = await response.json();

    const container = document.getElementById("admin-products");

    container.innerHTML = "";

    products.forEach(product => {

        container.innerHTML += `
            <div class="admin-product-card">

                <h3>${product.name}</h3>

                <p>${product.description || ""}</p>

                <strong>₹${product.price}</strong>

                <p>
                    Category: ${product.category || "None"}
                </p>

                <p>
                    Status:
                    ${product.available ? "✅ Available" : "❌ Unavailable"}
                </p>

                <div class="admin-product-buttons">

                    <button
                        class="btn"
                        onclick="editProduct(${product.id})">
                        ✏️ Edit
                    </button>

                    <button
                        class="btn"
                        onclick="deleteProduct(${product.id})">
                        🗑️ Delete
                    </button>

                </div>

            </div>
        `;
    });
}


// ===============================
// ADD PRODUCT
// ===============================

async function addProduct() {

    const name =
        document.getElementById("product-name").value.trim();

    const description =
        document.getElementById("product-description").value.trim();

    const price =
        Number(document.getElementById("product-price").value);

    const image_url =
        document.getElementById("product-image").value.trim();

    const category =
        document.getElementById("product-category").value.trim();

    const available =
        document.getElementById("product-available").checked;


    if (!name || !price) {
        alert("Please enter product name and price.");
        return;
    }


    const response = await fetch(
        SUPABASE_URL + "/rest/v1/products",
        {
            method: "POST",

            headers: {
                "apikey": SUPABASE_KEY,
                "Authorization": "Bearer " + token,
                "Content-Type": "application/json",
                "Prefer": "return=representation"
            },

            body: JSON.stringify({
                name: name,
                description: description,
                price: price,
                image_url: image_url,
                category: category,
                available: available
            })
        }
    );


    if (!response.ok) {

        const error = await response.json();

        console.log(error);

        alert("Product could not be added.");

        return;
    }


    alert("Product added successfully! 🎆");

    document.getElementById("product-form").style.display = "none";

    clearProductForm();

    loadAdminProducts();
}


// ===============================
// EDIT PRODUCT
// ===============================

async function editProduct(id) {

    const response = await fetch(
        SUPABASE_URL +
        "/rest/v1/products?id=eq." +
        id +
        "&select=*",
        {
            headers: {
                "apikey": SUPABASE_KEY,
                "Authorization": "Bearer " + token
            }
        }
    );


    if (!response.ok) {

        alert("Could not load product.");

        return;
    }


    const products = await response.json();


    if (!products.length) {

        alert("Product not found.");

        return;
    }


    const product = products[0];


    // Show form

    document.getElementById("product-form").style.display = "block";


    // Change form title

    document.getElementById("form-title").textContent =
        "Edit Product";


    // Store product ID

    document.getElementById("edit-product-id").value =
        product.id;


    // Fill existing values

    document.getElementById("product-name").value =
        product.name || "";

    document.getElementById("product-description").value =
        product.description || "";

    document.getElementById("product-price").value =
        product.price || "";

    document.getElementById("product-image").value =
        product.image_url || "";

    document.getElementById("product-category").value =
        product.category || "";

    document.getElementById("product-available").checked =
        product.available;


    // Change button

    const saveButton =
        document.getElementById("save-product-btn");

    saveButton.textContent = "Update Product";

    saveButton.onclick = updateProduct;

    // Scroll to form

    document.getElementById("product-form")
        .scrollIntoView({
            behavior: "smooth"
        });
}


// ===============================
// UPDATE PRODUCT
// ===============================

async function updateProduct() {

    const id =
        document.getElementById("edit-product-id").value;


    const name =
        document.getElementById("product-name").value.trim();

    const description =
        document.getElementById("product-description").value.trim();

    const price =
        Number(document.getElementById("product-price").value);

    const image_url =
        document.getElementById("product-image").value.trim();

    const category =
        document.getElementById("product-category").value.trim();

    const available =
        document.getElementById("product-available").checked;


    if (!id) {

        alert("Product ID missing.");

        return;
    }


    if (!name || !price) {

        alert("Please enter product name and price.");

        return;
    }


    const response = await fetch(
        SUPABASE_URL +
        "/rest/v1/products?id=eq." +
        id,
        {
            method: "PATCH",

            headers: {
                "apikey": SUPABASE_KEY,
                "Authorization": "Bearer " + token,
                "Content-Type": "application/json",
                "Prefer": "return=representation"
            },

            body: JSON.stringify({
                name: name,
                description: description,
                price: price,
                image_url: image_url,
                category: category,
                available: available
            })
        }
    );


    if (!response.ok) {

        const error = await response.json();

        console.log("UPDATE ERROR:", error);

        alert(
            "Update failed:\n" +
            (error.message || JSON.stringify(error))
        );

        return;
    }


    alert("Product updated successfully! ✅");


    document.getElementById("product-form").style.display = "none";

    clearProductForm();


    loadAdminProducts();
}


// ===============================
// CANCEL EDIT
// ===============================

function cancelEdit() {

    document.getElementById("product-form").style.display = "none";

    clearProductForm();
}


// ===============================
// DELETE PRODUCT
// ===============================

async function deleteProduct(id) {

    const confirmDelete = confirm(
        "Are you sure you want to delete this product?"
    );


    if (!confirmDelete) {
        return;
    }


    const response = await fetch(
        SUPABASE_URL +
        "/rest/v1/products?id=eq." +
        id,
        {
            method: "DELETE",

            headers: {
                "apikey": SUPABASE_KEY,
                "Authorization": "Bearer " + token
            }
        }
    );


    if (!response.ok) {

        const error = await response.json();

        console.log(error);

        alert("Product could not be deleted.");

        return;
    }


    alert("Product deleted successfully! 🗑️");

    loadAdminProducts();
}


// ===============================
// LOGOUT
// ===============================

function adminLogout() {

    localStorage.removeItem("access_token");

    window.location.href = "admin.html";
}
// ===============================
// ORDER MANAGEMENT
// ===============================

let allOrders = [];


// ===============================
// LOAD ORDERS
// ===============================

async function loadOrders() {

    const response = await fetch(
        SUPABASE_URL +
        "/rest/v1/orders?select=*&order=created_at.desc",
        {
            headers: {
                "apikey": SUPABASE_KEY,
                "Authorization": "Bearer " + token
            }
        }
    );

    if (!response.ok) {

        console.log("ORDER LOAD ERROR:", await response.json());

        document.getElementById("admin-orders").innerHTML =
            "<p>Unable to load orders.</p>";

        return;
    }

    allOrders = await response.json();

    updateOrderStats();

    displayOrders(allOrders);
}


// ===============================
// ORDER COUNTS
// ===============================

function updateOrderStats() {

    const total = allOrders.length;

    const pending =
        allOrders.filter(order =>
            order.status === "Pending"
        ).length;

    const confirmed =
        allOrders.filter(order =>
            order.status === "Confirmed"
        ).length;

    const rejected =
        allOrders.filter(order =>
            order.status === "Rejected"
        ).length;


    document.getElementById("total-orders").textContent =
        total;

    document.getElementById("pending-orders").textContent =
        pending;

    document.getElementById("confirmed-orders").textContent =
        confirmed;

    document.getElementById("rejected-orders").textContent =
        rejected;
}


// ===============================
// DISPLAY ORDERS
// ===============================

function displayOrders(orders) {

    const container =
        document.getElementById("admin-orders");

    container.innerHTML = "";


    if (!orders.length) {

        container.innerHTML = `
            <div class="empty-orders">
                <h3>📭 No Orders Found</h3>
                <p>There are no orders in this category.</p>
            </div>
        `;

        return;
    }


    orders.forEach(order => {

        let itemsHTML = "";


        order.items.forEach(item => {

            const itemTotal =
                item.price * item.quantity;

            itemsHTML += `
                <div class="admin-order-item">

                    <div>
                        <strong>${item.name}</strong>
                        <small>
                            ₹${item.price} × ${item.quantity}
                        </small>
                    </div>

                    <strong>
                        ₹${itemTotal}
                    </strong>

                </div>
            `;
        });


        let statusClass = "pending";

        if (order.status === "Confirmed") {
            statusClass = "confirmed";
        }

        if (order.status === "Rejected") {
            statusClass = "rejected";
        }


        container.innerHTML += `

            <div class="admin-order-card">

                <div class="admin-order-header">

                    <div>
                        <span class="order-label">
                            ORDER
                        </span>

                        <h3>
                            🧾 ${order.order_id}
                        </h3>
                    </div>

                    <span class="order-status ${statusClass}">
                        ${order.status}
                    </span>

                </div>


                <div class="admin-customer-info">

                    <div>
                        <span>👤 Customer</span>
                        <strong>
                            ${order.customer_name}
                        </strong>
                    </div>

                    <div>
                        <span>📱 Phone</span>
                        <strong>
                            ${order.customer_phone}
                        </strong>
                    </div>

                    <div>
                        <span>🏠 Address</span>
                        <strong>
                            ${order.customer_address}
                        </strong>
                    </div>

                </div>


                <div class="admin-order-products">

                    <h4>📦 Order Items</h4>

                    ${itemsHTML}

                </div>


                <div class="admin-order-footer">

                    <div>
                        <span>Total Amount</span>

                        <strong>
                            ₹${order.total}
                        </strong>
                    </div>
                <div class="admin-order-actions">

    ${
        order.status === "Pending"
        ? `
            <button
                class="btn primary"
                onclick="confirmOrderAdmin(${order.id})">
                ✅ Confirm
            </button>

            <button
                class="btn"
                onclick="rejectOrderAdmin(${order.id})">
                ❌ Reject
            </button>
        `
        : ""
    }

    ${
        order.status === "Confirmed"
        ? `
            <button
                class="btn download-order-btn"
                onclick="downloadSingleOrderPDF(${order.id})">
                📄 Download PDF
            </button>
        `
        : ""
    }

</div>

                   

                </div>

            </div>

        `;
    });
}


// ===============================
// FILTER ORDERS
// ===============================

function filterOrders(status, button) {

    document
        .querySelectorAll(".order-filter")
        .forEach(btn => {

            btn.classList.remove("active");

        });


    button.classList.add("active");


    if (status === "All") {

        displayOrders(allOrders);

        return;
    }


    const filteredOrders =
        allOrders.filter(order =>
            order.status === status
        );


    displayOrders(filteredOrders);
}


// ===============================
// CONFIRM ORDER
// ===============================

async function confirmOrderAdmin(id) {

    const response = await fetch(
        SUPABASE_URL +
        "/rest/v1/orders?id=eq." +
        id,
        {
            method: "PATCH",

            headers: {
                "apikey": SUPABASE_KEY,
                "Authorization": "Bearer " + token,
                "Content-Type": "application/json",
                "Prefer": "return=representation"
            },

            body: JSON.stringify({
                status: "Confirmed"
            })
        }
    );


    if (!response.ok) {

        const error = await response.json();

        console.log("CONFIRM ERROR:", error);

        alert("Order confirmation failed.");

        return;
    }


    alert("Order confirmed successfully! ✅");

    loadOrders();
}


// ===============================
// REJECT ORDER
// ===============================

async function rejectOrderAdmin(id) {

    const confirmReject =
        confirm(
            "Are you sure you want to reject this order?"
        );


    if (!confirmReject) {
        return;
    }


    const response = await fetch(
        SUPABASE_URL +
        "/rest/v1/orders?id=eq." +
        id,
        {
            method: "PATCH",

            headers: {
                "apikey": SUPABASE_KEY,
                "Authorization": "Bearer " + token,
                "Content-Type": "application/json",
                "Prefer": "return=representation"
            },

            body: JSON.stringify({
                status: "Rejected"
            })
        }
    );


    if (!response.ok) {

        const error = await response.json();

        console.log("REJECT ERROR:", error);

        alert("Order rejection failed.");

        return;
    }


    alert("Order rejected. ❌");

    loadOrders();
}


// ===============================
// INITIAL LOAD
// ===============================
async function loadDiscountSettings() {

    const response = await fetch(
        SUPABASE_URL + "/rest/v1/discount_settings?select=*&limit=1",
        {
            headers: {
                "apikey": SUPABASE_KEY,
                "Authorization": "Bearer " + token
            }
        }
    );

    if (!response.ok) {
        console.log("DISCOUNT LOAD ERROR:", await response.json());
        return;
    }

    const settings = await response.json();

    if (settings.length > 0) {
        document.getElementById("discount-percent").value =
            settings[0].discount_percent || 0;
    }
}


async function saveDiscount() {

    const input =
        document.getElementById("discount-percent");

    const discount = Number(input.value);

    if (!Number.isFinite(discount) || discount < 0 || discount > 100) {
        alert("Discount must be between 0% and 100%.");
        return;
    }

    const response = await fetch(
        SUPABASE_URL + "/rest/v1/discount_settings?id=eq.1",
        {
            method: "PATCH",

            headers: {
                "apikey": SUPABASE_KEY,
                "Authorization": "Bearer " + token,
                "Content-Type": "application/json",
                "Prefer": "return=representation"
            },

            body: JSON.stringify({
                discount_percent: discount,
                updated_at: new Date().toISOString()
            })
        }
    );

    if (!response.ok) {

        const error = await response.json();

        console.log("DISCOUNT SAVE ERROR:", error);

        alert(
            "Discount could not be saved.\n\n" +
            (error.message || JSON.stringify(error))
        );

        return;
    }

    document.getElementById("discount-message").textContent =
        "✅ Discount updated successfully!";

    alert("Discount saved successfully! 🏷️");
}


loadAdminProducts();
loadOrders();
loadDiscountSettings();

loadAdminProducts();
loadOrders();
// =========================================
// DOWNLOAD CONFIRMED ORDERS AS PDF
// =========================================

async function downloadConfirmedOrdersPDF() {

    // Check jsPDF
    if (!window.jspdf) {

        alert(
            "PDF library is not loaded. Please check your internet connection."
        );

        return;
    }


    // Get only confirmed orders
    const confirmedOrders =
        allOrders.filter(order =>
            order.status === "Confirmed"
        );


    // No confirmed orders
    if (confirmedOrders.length === 0) {

        alert(
            "There are no confirmed orders to download."
        );

        return;
    }


    // Create PDF
    const {
        jsPDF
    } = window.jspdf;

    const pdf =
        new jsPDF("p", "mm", "a4");


    const pageWidth =
        pdf.internal.pageSize.getWidth();

    const pageHeight =
        pdf.internal.pageSize.getHeight();


    let y = 20;


    // =========================================
    // HEADER
    // =========================================

    pdf.setFont("helvetica", "bold");

    pdf.setFontSize(20);

    pdf.text(
        "SANTHIYA FIREWORK AGENCIES",
        pageWidth / 2,
        y,
        {
            align: "center"
        }
    );


    y += 8;


    pdf.setFontSize(11);

    pdf.setFont("helvetica", "normal");

    pdf.text(
        "Confirmed Orders Report",
        pageWidth / 2,
        y,
        {
            align: "center"
        }
    );


    y += 6;


    pdf.setFontSize(9);

    pdf.text(
        "Generated on: " +
        new Date().toLocaleDateString("en-IN"),
        pageWidth / 2,
        y,
        {
            align: "center"
        }
    );


    y += 10;


    // =========================================
    // SUMMARY
    // =========================================

    pdf.setFont("helvetica", "bold");

    pdf.setFontSize(11);

    pdf.text(
        "Total Confirmed Orders: " +
        confirmedOrders.length,
        15,
        y
    );


    y += 8;


    // =========================================
    // ORDERS
    // =========================================

    confirmedOrders.forEach(function (order, orderIndex) {

        // Check page space
        if (y > pageHeight - 45) {

            pdf.addPage();

            y = 20;
        }


        // =====================================
        // ORDER HEADER
        // =====================================

        pdf.setFont("helvetica", "bold");

        pdf.setFontSize(13);

        pdf.text(
            "Order #" +
            order.order_id,
            15,
            y
        );


        y += 6;


        pdf.setFont("helvetica", "normal");

        pdf.setFontSize(9);


        // Customer
        pdf.text(
            "Customer: " +
            (order.customer_name || "-"),
            15,
            y
        );


        y += 5;


        // Phone
        pdf.text(
            "Phone: " +
            (order.customer_phone || "-"),
            15,
            y
        );


        y += 5;


        // Address
        const address =
            order.customer_address || "-";


        const addressLines =
            pdf.splitTextToSize(
                "Address: " + address,
                180
            );


        pdf.text(
            addressLines,
            15,
            y
        );


        y +=
            (addressLines.length * 4) +
            4;


        // =====================================
        // PRODUCT HEADER
        // =====================================

        pdf.setFont("helvetica", "bold");

        pdf.setFontSize(9);


        pdf.text(
            "Product",
            15,
            y
        );


        pdf.text(
            "Qty",
            125,
            y
        );


        pdf.text(
            "Price",
            145,
            y
        );


        pdf.text(
            "Total",
            175,
            y
        );


        y += 2;


        pdf.line(
            15,
            y,
            195,
            y
        );


        y += 5;


        // =====================================
        // PRODUCTS
        // =====================================

        pdf.setFont("helvetica", "normal");


        const items =
            Array.isArray(order.items)
                ? order.items
                : [];


        items.forEach(function (item) {

            // Page check
            if (y > pageHeight - 30) {

                pdf.addPage();

                y = 20;
            }


            const productName =
                item.name || "Product";


            const quantity =
                Number(item.quantity) || 0;


            const price =
                Number(item.price) || 0;


            const itemTotal =
                price * quantity;


            const productLines =
                pdf.splitTextToSize(
                    productName,
                    100
                );


            pdf.text(
                productLines,
                15,
                y
            );


            pdf.text(
                String(quantity),
                127,
                y
            );


            pdf.text(
                "Rs. " +
                price.toLocaleString("en-IN"),
                145,
                y
            );


            pdf.text(
                "Rs. " +
                itemTotal.toLocaleString("en-IN"),
                175,
                y
            );


            y +=
                Math.max(
                    productLines.length * 4,
                    5
                );
        });


        y += 2;


        // =====================================
        // ORDER TOTAL
        // =====================================

        pdf.line(
            15,
            y,
            195,
            y
        );


        y += 6;


        pdf.setFont("helvetica", "bold");

        pdf.setFontSize(11);


        const orderTotal =
            Number(order.total) || 0;


        pdf.text(
            "Order Total:",
            140,
            y
        );


        pdf.text(
            "Rs. " +
            orderTotal.toLocaleString("en-IN"),
            175,
            y
        );


        y += 7;


        pdf.setFont("helvetica", "normal");

        pdf.setFontSize(9);


        pdf.text(
            "Status: CONFIRMED",
            15,
            y
        );


        y += 5;


        // Separator
        pdf.line(
            15,
            y,
            195,
            y
        );


        y += 10;
    });


    // =========================================
    // FOOTER ON EACH PAGE
    // =========================================

    const totalPages =
        pdf.internal.getNumberOfPages();


    for (
        let page = 1;
        page <= totalPages;
        page++
    ) {

        pdf.setPage(page);


        pdf.setFont("helvetica", "normal");

        pdf.setFontSize(8);


        pdf.text(
            "Santhiya Firework Agencies",
            15,
            pageHeight - 10
        );


        pdf.text(
            "Page " +
            page +
            " of " +
            totalPages,
            pageWidth - 15,
            pageHeight - 10,
            {
                align: "right"
            }
        );
    }


    // =========================================
    // DOWNLOAD
    // =========================================

    const today =
        new Date()
            .toISOString()
            .split("T")[0];


    pdf.save(
        "Confirmed-Orders-" +
        today +
        ".pdf"
    );


    alert(
        "Confirmed orders PDF downloaded successfully! 📄✅"
    );
}
// =========================================
// DOWNLOAD SINGLE CONFIRMED ORDER PDF
// =========================================

function downloadSingleOrderPDF(orderId) {

    if (!window.jspdf) {

        alert(
            "PDF library is not loaded. Please check your internet connection."
        );

        return;
    }


    // Find selected order
    const order =
        allOrders.find(item =>
            Number(item.id) === Number(orderId)
        );


    if (!order) {

        alert("Order not found.");

        return;
    }


    // Only confirmed orders
    if (order.status !== "Confirmed") {

        alert(
            "Only confirmed orders can be downloaded."
        );

        return;
    }


    const {
        jsPDF
    } = window.jspdf;


    const pdf =
        new jsPDF("p", "mm", "a4");


    const pageWidth =
        pdf.internal.pageSize.getWidth();

    let y = 20;


    // =========================================
    // HEADER
    // =========================================

    pdf.setFont("helvetica", "bold");

    pdf.setFontSize(20);

    pdf.text(
        "SANTHIYA FIREWORK AGENCIES",
        pageWidth / 2,
        y,
        {
            align: "center"
        }
    );


    y += 8;


    pdf.setFont("helvetica", "normal");

    pdf.setFontSize(11);

    pdf.text(
        "CONFIRMED ORDER",
        pageWidth / 2,
        y,
        {
            align: "center"
        }
    );


    y += 12;


    // =========================================
    // ORDER DETAILS
    // =========================================

    pdf.setFont("helvetica", "bold");

    pdf.setFontSize(13);

    pdf.text(
        "Order ID: " +
        order.order_id,
        15,
        y
    );


    y += 7;


    pdf.setFont("helvetica", "normal");

    pdf.setFontSize(10);


    pdf.text(
        "Status: CONFIRMED",
        15,
        y
    );


    y += 6;


    pdf.text(
        "Date: " +
        new Date(
            order.created_at
        ).toLocaleDateString("en-IN"),
        15,
        y
    );


    y += 12;


    // =========================================
    // CUSTOMER DETAILS
    // =========================================

    pdf.setFont("helvetica", "bold");

    pdf.setFontSize(12);

    pdf.text(
        "Customer Details",
        15,
        y
    );


    y += 7;


    pdf.setFont("helvetica", "normal");

    pdf.setFontSize(10);


    pdf.text(
        "Name: " +
        (order.customer_name || "-"),
        15,
        y
    );


    y += 6;


    pdf.text(
        "Phone: " +
        (order.customer_phone || "-"),
        15,
        y
    );


    y += 6;


    const address =
        order.customer_address || "-";


    const addressLines =
        pdf.splitTextToSize(
            "Address: " + address,
            180
        );


    pdf.text(
        addressLines,
        15,
        y
    );


    y +=
        (addressLines.length * 5) +
        10;


    // =========================================
    // ORDER ITEMS
    // =========================================

    pdf.setFont("helvetica", "bold");

    pdf.setFontSize(12);

    pdf.text(
        "Order Items",
        15,
        y
    );


    y += 8;


    // Table headings

    pdf.setFontSize(9);

    pdf.text(
        "Product",
        15,
        y
    );

    pdf.text(
        "Qty",
        125,
        y
    );

    pdf.text(
        "Price",
        145,
        y
    );

    pdf.text(
        "Total",
        175,
        y
    );


    y += 3;


    pdf.line(
        15,
        y,
        195,
        y
    );


    y += 6;


    // =========================================
    // PRODUCTS
    // =========================================

    const items =
        Array.isArray(order.items)
            ? order.items
            : [];


    pdf.setFont("helvetica", "normal");


    items.forEach(function (item) {

        const name =
            item.name || "Product";

        const quantity =
            Number(item.quantity) || 0;

        const price =
            Number(item.price) || 0;

        const itemTotal =
            price * quantity;


        const productLines =
            pdf.splitTextToSize(
                name,
                100
            );


        pdf.text(
            productLines,
            15,
            y
        );


        pdf.text(
            String(quantity),
            127,
            y
        );


        pdf.text(
            "Rs. " +
            price.toLocaleString("en-IN"),
            145,
            y
        );


        pdf.text(
            "Rs. " +
            itemTotal.toLocaleString("en-IN"),
            175,
            y
        );


        y += Math.max(
            productLines.length * 5,
            7
        );
    });


    y += 5;


    // =========================================
    // TOTAL
    // =========================================

    pdf.line(
        15,
        y,
        195,
        y
    );


    y += 9;


    pdf.setFont("helvetica", "bold");

    pdf.setFontSize(13);


    const total =
        Number(order.total) || 0;


    pdf.text(
        "TOTAL AMOUNT",
        125,
        y
    );


    pdf.text(
        "Rs. " +
        total.toLocaleString("en-IN"),
        175,
        y
    );


    // =========================================
    // FOOTER
    // =========================================

    y += 20;


    pdf.setFont("helvetica", "normal");

    pdf.setFontSize(9);


    pdf.text(
        "Thank you for choosing Santhiya Firework Agencies!",
        pageWidth / 2,
        y,
        {
            align: "center"
        }
    );


    y += 6;


    pdf.text(
        "Confirmed Order",
        pageWidth / 2,
        y,
        {
            align: "center"
        }
    );


    // =========================================
    // DOWNLOAD
    // =========================================

    const safeOrderId =
        String(order.order_id)
            .replace(
                /[^a-zA-Z0-9-_]/g,
                "-"
            );


    pdf.save(
        "Order-" +
        safeOrderId +
        ".pdf"
    );
}