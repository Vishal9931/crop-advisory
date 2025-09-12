const BASE_URL = "http://localhost:5000"; // backend server

// Register farmer
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("registerForm");
  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const data = {
        name: document.getElementById("name").value,
        phone: document.getElementById("phone").value,
        location: document.getElementById("location").value,
        soil_type: document.getElementById("soil_type").value,
        land_size: document.getElementById("land_size").value,
        sowing_date: document.getElementById("sowing_date").value,
      };

      const res = await fetch(`${BASE_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (result.success) {
        // Redirect to dashboard with farmerId
        window.location.href = `dashboard.html?farmerId=${result.farmer_id}`;
      } else {
        document.getElementById("result").innerText = "Error registering farmer";
      }
    });
  }
});

// Fetch advisory
async function getAdvisory(farmerId) {
  const res = await fetch(`${BASE_URL}/advisory/${farmerId}`);
  const data = await res.json();
  document.getElementById("advisory").innerText =
    `Crop: ${data.recommended_crop.crop_name}, Duration: ${data.recommended_crop.duration_days} days`;
}

// Fetch weather
async function getWeather(farmerId) {
  const res = await fetch(`${BASE_URL}/weather/${farmerId}`);
  const data = await res.json();
  document.getElementById("weather").innerText =
    `${data.weather}, Temp: ${data.temperature}°C`;
}

// Fetch alerts
async function getAlerts(farmerId) {
  const res = await fetch(`${BASE_URL}/alerts/${farmerId}`);
  const data = await res.json();
  const list = document.getElementById("alerts");
  list.innerHTML = "";
  data.forEach(alert => {
    let li = document.createElement("li");
    li.innerText = `${alert.alert_date}: ${alert.message}`;
    list.appendChild(li);
  });
}

// Fetch prices
async function getPrices() {
  const crop = document.getElementById("cropName").value;
  const res = await fetch(`${BASE_URL}/prices/${crop}`);
  const data = await res.json();
  const table = document.getElementById("priceTable");
  table.innerHTML = "";
  data.forEach(row => {
    table.innerHTML += `<tr>
      <td>${row.crop_name}</td>
      <td>${row.market_name}</td>
      <td>${row.price_per_kg}</td>
      <td>${row.last_updated}</td>
    </tr>`;
  });
}

// Farmer Signup
document.addEventListener("DOMContentLoaded", () => {
  const farmerSignupForm = document.getElementById("farmerForm");
  if (farmerSignupForm) {
    farmerSignupForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const data = {
        name: document.getElementById("farmerName").value,
        phone: document.getElementById("farmerPhone").value,
        password: document.getElementById("farmerPassword").value,
        location: document.getElementById("farmerLocation").value,
        land_size: document.getElementById("farmerLand").value,
      };
      const res = await fetch(`${BASE_URL}/farmer/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      document.getElementById("signupResult").innerText = result.success
        ? "Farmer signup successful!"
        : result.error;
    });
  }

  // Farmer Login
  const farmerLoginForm = document.getElementById("farmerLoginForm");
  if (farmerLoginForm) {
    farmerLoginForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const data = {
        phone: document.getElementById("farmerPhone").value,
        password: document.getElementById("farmerPassword").value,
      };
      const res = await fetch(`${BASE_URL}/farmer/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      document.getElementById("loginResult").innerText = result.success
        ? `Welcome Farmer ${result.name}!`
        : result.error;
      if (result.success) {

        // Save farmer info in browser
        localStorage.setItem("farmerId", result.farmer_id);
        localStorage.setItem("farmerName", result.name);
        window.location.href = `dashboard.html?farmerId=${result.farmer_id}`;
      }
    });
  }

  // Admin Signup
  const adminSignupForm = document.getElementById("signupForm");
  if (adminSignupForm) {
    adminSignupForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const data = {
        username: document.getElementById("adminUsername").value,
        password: document.getElementById("adminPassword").value,
      };
      const res = await fetch(`${BASE_URL}/admin/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      document.getElementById("signupResult").innerText = result.success
        ? "Admin signup successful!"
        : result.error;
    });
  }

  // Admin Login
  const adminLoginForm = document.getElementById("adminLoginForm");
  if (adminLoginForm) {
    adminLoginForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const data = {
        username: document.getElementById("adminUsername").value,
        password: document.getElementById("adminPassword").value,
      };
      const res = await fetch(`${BASE_URL}/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      document.getElementById("loginResult").innerText = result.success
        ? `Welcome Admin ${result.username}!`
        : result.error;
      if (result.success) {
        window.location.href = "admin-dashboard.html"; // you can create this page
      }
    });
  }
});

