const BASE_URL = "http://localhost:5000"; // backend

document.addEventListener("DOMContentLoaded", () => {
  // Get farmerId from URL
  const params = new URLSearchParams(window.location.search);
  const farmerId = params.get("farmerId");

  if (!farmerId) {
    alert("No farmer ID found. Please go back to Dashboard.");
    return;
  }

  loadAlerts(farmerId);

  // 🔎 Search alerts
  document.getElementById("search").addEventListener("input", (e) => {
    filterAlerts(e.target.value.toLowerCase());
  });
});

// 📌 Load alerts from backend
async function loadAlerts(farmerId) {
  try {
    const res = await fetch(`${BASE_URL}/alerts/${farmerId}`);
    const data = await res.json();
    const grid = document.getElementById("alertsGrid");
    grid.innerHTML = "";

    if (data.length === 0) {
      grid.innerHTML = `<p>No alerts available.</p>`;
      return;
    }

    data.forEach(alert => {
      const div = document.createElement("div");
      div.classList.add("alert");
      div.classList.add(alert.message.toLowerCase().includes("pest") ? "pest" : "weather");

      div.innerHTML = `
        <span class="close-btn" onclick="removeAlert(this)">✖</span>
        <h2>${alert.message.includes("pest") ? "🐛 Pest Alert" : "🌦️ Weather Alert"}</h2>
        <p>${alert.message}</p>
        <p><strong>Issued on:</strong> ${alert.alert_date}</p>
      `;
      grid.appendChild(div);
    });
  } catch (err) {
    console.error("Error loading alerts", err);
  }
}

// 🔎 Filter alerts by keyword
function filterAlerts(keyword) {
  const alerts = document.querySelectorAll(".alert");
  alerts.forEach(alert => {
    const text = alert.innerText.toLowerCase();
    alert.style.display = text.includes(keyword) ? "block" : "none";
  });
}

// ➕ Add custom alert (temporary)
function addAlert() {
  const grid = document.getElementById("alertsGrid");
  const div = document.createElement("div");
  div.classList.add("alert", "weather");
  div.innerHTML = `
    <span class="close-btn" onclick="removeAlert(this)">✖</span>
    <h2>⚠️ Custom Alert</h2>
    <p>This is a new alert added manually. Replace with real alert entry.</p>
    <p><strong>Issued on:</strong> ${new Date().toISOString().split("T")[0]}</p>
  `;
  grid.prepend(div);
}

// ❌ Remove alert (frontend only)
function removeAlert(btn) {
  btn.parentElement.remove();
}

let farmerId = localStorage.getItem("farmerId");

if (!farmerId) {
  alert("No farmer ID found. Please login again.");
  window.location.href = "login.html";
}
