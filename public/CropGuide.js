const BASE_URL = "http://localhost:5000"; // backend server

document.addEventListener("DOMContentLoaded", () => {
  // Get farmerId from URL
  const params = new URLSearchParams(window.location.search);
  const farmerId = params.get("farmerId");

  if (!farmerId) {
    alert("No farmer ID found. Please go back to Dashboard.");
    return;
  }

  loadCropGuide(farmerId);
});

// 📅 Load crop stages from backend
async function loadCropGuide(farmerId) {
  try {
    const res = await fetch(`${BASE_URL}/advisory/${farmerId}`);
    const data = await res.json();

    const guideBox = document.getElementById("guide");
    guideBox.innerHTML = "";

    if (!data.recommended_crop) {
      guideBox.innerHTML = `<p>No crop guide available.</p>`;
      return;
    }

    // Update header crop name
    document.querySelector("header").innerText = `📋 Crop Guide - ${data.recommended_crop.crop_name}`;
    document.querySelector(".card h3").innerText = `🌱 Crop: ${data.recommended_crop.crop_name}`;

    // Loop through crop calendar
    data.crop_calendar.forEach(stage => {
      const div = document.createElement("div");
      div.classList.add("timeline-item");
      div.innerHTML = `
        <h4>${stage.due_date} → ${stage.task}</h4>
        <p>${stage.task}</p>
      `;
      guideBox.appendChild(div);
    });
  } catch (err) {
    console.error("Error loading crop guide", err);
    document.getElementById("guide").innerHTML = `<p>Error loading crop guide</p>`;
  }
}

let farmerId = localStorage.getItem("farmerId");

if (!farmerId) {
  alert("No farmer ID found. Please login again.");
  window.location.href = "login.html";
}