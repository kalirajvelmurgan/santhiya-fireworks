const SUPABASE_URL = "https://nukadldqhfmtwuuugtse.supabase.co";
const SUPABASE_KEY = "sb_publishable_ZaJOJNATcFrMyUY0E58WIQ_JrZT3KVW";

async function adminLogin() {

    const email = document.getElementById("admin-email").value.trim();
    const password = document.getElementById("admin-password").value;

    const message = document.getElementById("login-message");

    if (email === "" || password === "") {
        message.textContent = "Please enter email and password.";
        return;
    }

    const response = await fetch(
        SUPABASE_URL + "/auth/v1/token?grant_type=password",
        {
            method: "POST",

            headers: {
                "apikey": SUPABASE_KEY,
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                email: email,
                password: password
            })
        }
    );

    const data = await response.json();

    if (!response.ok) {
        message.textContent =
            data.error_description || "Login failed.";
        return;
    }

    localStorage.setItem(
        "access_token",
        data.access_token
    );

    window.location.href = "admin-dashboard.html";
}