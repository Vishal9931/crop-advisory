const BASE_URL = "http://localhost:5000"; // backend server
// 🔗 Navigation
function goTo(page) {
  window.location.href = page;
}



// ✅ Load dashboard data
document.addEventListener("DOMContentLoaded", () => {
  // Get farmerId from localStorage (persists after refresh)
  const farmerId = localStorage.getItem("farmerId");

  if (!farmerId) {
    alert("No farmer ID found. Please login again.");
    window.location.href = "login.html"; // redirect back to login
    return;
  }

  // Load everything
  loadFarmer(farmerId);
  loadAdvisory(farmerId);
  loadWeather(farmerId);
  loadTasks(farmerId);
});


// 👤 Farmer details (name)
async function loadFarmer(farmerId) {
  try {
    const res = await fetch(`${BASE_URL}/advisory/${farmerId}`);
    const data = await res.json();
    if (data.farmer) {
      document.querySelector(".card h3").innerText = `👋 Welcome, ${data.farmer.name}`;
    }
  } catch (err) {
    console.error("Error loading farmer", err);
  }
}

// 🌱 Recommended crops
async function loadAdvisory(farmerId) {
  try {
    const res = await fetch(`${BASE_URL}/advisory/${farmerId}`);
    const data = await res.json();
    const cropsBox = document.querySelector(".recommended-crops");
    cropsBox.innerHTML = "";

    if (data.recommended_crop) {
      cropsBox.innerHTML = `<span>${data.recommended_crop.crop_name}</span>`;
    } else {
      cropsBox.innerHTML = `<span>No crops available</span>`;
    }
  } catch (err) {
    console.error("Error loading advisory", err);
  }
}

// ☀️ Weather
async function loadWeather(farmerId) {
  try {
    const res = await fetch(`${BASE_URL}/weather/${farmerId}`);
    const data = await res.json();
    const weatherBox = document.querySelector(".weather-box");

    weatherBox.innerHTML = `
      <div>
        <h4>${data.temperature}°C</h4>
        <p>Temperature</p>
      </div>
      <div>
        <h4>${data.humidity ? data.humidity + "%" : "N/A"}</h4>
        <p>Humidity</p>
      </div>
      <div>
        <h4>${data.weather}</h4>
        <p>Advisory</p>
      </div>
    `;
  } catch (err) {
    console.error("Error loading weather", err);
  }
}

// 📌 Upcoming tasks (alerts)
async function loadTasks(farmerId) {
  try {
    const res = await fetch(`${BASE_URL}/alerts/${farmerId}`);
    const data = await res.json();
    const tasksList = document.querySelector(".tasks");
    tasksList.innerHTML = "";

    if (data.length === 0) {
      tasksList.innerHTML = `<li>No tasks available</li>`;
      return;
    }

    data.forEach(alert => {
      const li = document.createElement("li");
      li.innerText = `${alert.alert_date} → ${alert.message}`;
      tasksList.appendChild(li);
    });
  } catch (err) {
    console.error("Error loading tasks", err);
  }
}

let farmerId = localStorage.getItem("farmerId");

if (!farmerId) {
  alert("No farmer ID found. Please login again.");
  window.location.href = "login.html";
}