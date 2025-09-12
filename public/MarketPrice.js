const BASE_URL = "http://localhost:5000"; // backend

document.addEventListener("DOMContentLoaded", () => {
  // Get farmerId (optional, if you want to auto-load recommended crop)
  const params = new URLSearchParams(window.location.search);
  const farmerId = params.get("farmerId");

  if (farmerId) {
    loadRecommendedCropPrices(farmerId);
  }
});

// 📊 Load mandi prices for a given crop
async function loadPrices(cropName) {
  try {
    const res = await fetch(`${BASE_URL}/prices/${cropName}`);
    const data = await res.json();
    const table = document.querySelector("table");

    // Clear previous rows (keep header row)
    table.innerHTML = `
      <tr>
        <th>Crop</th>
        <th>Mandi</th>
        <th>Price (₹/Quintal)</th>
        <th>Date</th>
      </tr>
    `;

    if (data.length === 0) {
      table.innerHTML += `<tr><td colspan="4">No price data available for ${cropName}</td></tr>`;
      return;
    }

    // Populate rows
    data.forEach(row => {
      table.innerHTML += `
        <tr>
          <td>${row.crop_name}</td>
          <td>${row.market_name}</td>
          <td>₹${row.price_per_quintal || row.price_per_kg * 100}</td>
          <td>${row.last_updated}</td>
        </tr>
      `;
    });
  } catch (err) {
    console.error("Error fetching prices:", err);
  }
}

// 🌱 Load recommended crop prices (auto from advisory)
async function loadRecommendedCropPrices(farmerId) {
  try {
    const res = await fetch(`${BASE_URL}/advisory/${farmerId}`);
    const data = await res.json();
    if (data.recommended_crop) {
      loadPrices(data.recommended_crop.crop_name);
    }
  } catch (err) {
    console.error("Error fetching advisory:", err);
  }
}

// 💹 Profitability Calculator
function calculateProfit() {
  const cost = parseFloat(document.getElementById("cost").value);
  const yieldVal = parseFloat(document.getElementById("yield").value);
  const price = parseFloat(document.getElementById("price").value);

  if (isNaN(cost) || isNaN(yieldVal) || isNaN(price)) {
    document.getElementById("result").innerText = "⚠️ Please enter valid numbers.";
    return;
  }

  const revenue = yieldVal * price;
  const profit = revenue - cost;

  document.getElementById("result").innerText =
    `Revenue: ₹${revenue.toLocaleString()} | Profit: ₹${profit.toLocaleString()}`;
}
