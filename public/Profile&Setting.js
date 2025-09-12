const BASE_URL = "http://localhost:5000"; // backend server

document.addEventListener("DOMContentLoaded", () => {
    const params = new URLSearchParams(window.location.search);
    const farmerId = params.get("farmerId");

    if (!farmerId) {
        alert("No farmer ID found. Please login again.");
        return;
    }

    // Load farmer profile
    loadProfile(farmerId);

    // Logout
    document.getElementById("logout").addEventListener("click", (e) => {
        e.preventDefault();

        // Clear saved farmer data
        localStorage.clear();

        alert("Logged out successfully!");
        window.location.href = "login.html";
    });

});

// 👨‍🌾 Load farmer profile from backend
async function loadProfile(farmerId) {
    try {
        const res = await fetch(`${BASE_URL}/advisory/${farmerId}`);
        const data = await res.json();

        if (data.farmer) {
            document.getElementById("name").value = data.farmer.name;
            document.getElementById("location").value = data.farmer.location;
            document.getElementById("soil").value = data.farmer.soil_type;
            document.getElementById("land").value = data.farmer.land_size;
        }
    } catch (err) {
        console.error("Error loading profile:", err);
    }
}

// 💾 Save updated profile & settings
async function saveSettings() {
    const params = new URLSearchParams(window.location.search);
    const farmerId = params.get("farmerId");

    if (!farmerId) {
        alert("No farmer ID found!");
        return;
    }

    const updatedData = {
        name: document.getElementById("name").value,
        location: document.getElementById("location").value,
        soil_type: document.getElementById("soil").value,
        land_size: document.getElementById("land").value,
        language: document.getElementById("language").value,
        push_notifications: document.getElementById("push").checked,
        sms_alerts: document.getElementById("sms").checked
    };

    try {
        // For now: just display message
        // Later: add a PUT /farmer/:id route in backend to update DB
        console.log("Saving farmer settings:", updatedData);
        alert("✅ Settings saved successfully!");
    } catch (err) {
        console.error("Error saving settings:", err);
        alert("⚠️ Failed to save settings.");
    }
}


let farmerId = localStorage.getItem("farmerId");

if (!farmerId) {
    alert("No farmer ID found. Please login again.");
    window.location.href = "login.html";
}