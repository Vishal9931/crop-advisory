const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./database');
const bcrypt = require('bcrypt');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const axios = require('axios');
const WEATHER_API_KEY = 'e4237374d7b5ea00aa08ab9ff38c67c0'; // replace with your key

// 🟢 Route 1: Farmer Registration
app.post('/register', (req, res) => {
  const { name, phone, location, soil_type, land_size, sowing_date } = req.body;
  const sql = `INSERT INTO farmers (name, phone, location, soil_type, land_size, sowing_date)
               VALUES (?,?,?,?,?,?)`;
  db.run(sql, [name, phone, location, soil_type, land_size, sowing_date], function(err) {
    if (err) return res.status(400).json({ error: err.message });
    res.json({ success: true, farmer_id: this.lastID });
  });
});

// 🟢 Route 2: Get Advisory (updated with crop calendar)
app.get('/advisory/:farmerId', (req, res) => {
  const farmerId = req.params.farmerId;

  db.get(`SELECT * FROM farmers WHERE id = ?`, [farmerId], (err, farmer) => {
    if (err || !farmer) return res.status(400).json({ error: 'Farmer not found' });

    db.all(`SELECT * FROM crops WHERE suitable_soil = ?`, [farmer.soil_type], (err, crops) => {
      if (err) return res.status(400).json({ error: err.message });

      if (crops.length === 0) return res.json({ farmer, recommended: [] });

      const chosenCrop = crops[0];

      db.all(`SELECT * FROM crop_stages WHERE crop_id = ?`, [chosenCrop.id], (err, stages) => {
        if (err) return res.status(400).json({ error: err.message });

        const sowingDate = new Date(farmer.sowing_date);
        const calendar = stages.map(stage => {
          let date = new Date(sowingDate);
          date.setDate(date.getDate() + stage.day_offset);
          return {
            task: stage.task,
            due_date: date.toISOString().split('T')[0]
          };
        });

        res.json({
          farmer,
          recommended_crop: chosenCrop,
          crop_calendar: calendar
        });
      });
    });
  });
});

// 🟢 Route 3: Get Prices
app.get('/prices/:crop', (req, res) => {
  const crop = req.params.crop;
  db.all(`SELECT * FROM prices WHERE crop_name = ?`, [crop], (err, rows) => {
    if (err) return res.status(400).json({ error: err.message });
    res.json(rows);
  });
});

// Weather forecast for farmer
app.get('/weather/:farmerId', async (req, res) => {
  const farmerId = req.params.farmerId;
  db.get(`SELECT * FROM farmers WHERE id = ?`, [farmerId], async (err, farmer) => {
    if (err || !farmer) return res.status(400).json({ error: 'Farmer not found' });

    try {
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${farmer.location}&appid=${WEATHER_API_KEY}&units=metric`;
      const response = await axios.get(url);
      res.json({
        farmer: farmer.name,
        location: farmer.location,
        weather: response.data.weather[0].description,
        temperature: response.data.main.temp
      });
    } catch (e) {
      res.status(500).json({ error: "Weather API failed" });
    }
  });
});


// Generate alerts based on crop calendar
app.post('/generate-alerts/:farmerId', (req, res) => {
  const farmerId = req.params.farmerId;
  db.get(`SELECT * FROM farmers WHERE id = ?`, [farmerId], (err, farmer) => {
    if (err || !farmer) return res.status(400).json({ error: 'Farmer not found' });

    // Get recommended crop
    db.get(`SELECT * FROM crops WHERE suitable_soil = ?`, [farmer.soil_type], (err, crop) => {
      if (err || !crop) return res.status(400).json({ error: 'No crop found' });

      db.all(`SELECT * FROM crop_stages WHERE crop_id = ?`, [crop.id], (err, stages) => {
        if (err) return res.status(400).json({ error: err.message });

        const sowingDate = new Date(farmer.sowing_date);
        stages.forEach(stage => {
          let due = new Date(sowingDate);
          due.setDate(due.getDate() + stage.day_offset);
          const dueDate = due.toISOString().split('T')[0];

          db.run(`INSERT INTO alerts (farmer_id, message, alert_date) VALUES (?,?,?)`,
            [farmer.id, stage.task, dueDate]);
        });

        res.json({ success: true, message: "Alerts generated" });
      });
    });
  });
});

// Get alerts for a farmer
app.get('/alerts/:farmerId', (req, res) => {
  const farmerId = req.params.farmerId;
  db.all(`SELECT * FROM alerts WHERE farmer_id = ? ORDER BY alert_date`, [farmerId], (err, rows) => {
    if (err) return res.status(400).json({ error: err.message });
    res.json(rows);
  });
});

// Farmer Signup
app.post('/farmer/signup', async (req, res) => {
  const { name, phone, password, location, soil_type, land_size } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  const sql = `INSERT INTO farmer_users (name, phone, password, location, soil_type, land_size)
               VALUES (?,?,?,?,?,?)`;
  db.run(sql, [name, phone, hashedPassword, location, soil_type, land_size], function(err) {
    if (err) return res.status(400).json({ error: "Phone already exists or invalid data" });
    res.json({ success: true, farmer_id: this.lastID });
  });
});

// Farmer Login
app.post('/farmer/login', (req, res) => {
  const { phone, password } = req.body;
  db.get(`SELECT * FROM farmer_users WHERE phone = ?`, [phone], async (err, farmer) => {
    if (err || !farmer) return res.status(400).json({ error: "Farmer not found" });

    const match = await bcrypt.compare(password, farmer.password);
    if (!match) return res.status(400).json({ error: "Invalid password" });

    res.json({ success: true, farmer_id: farmer.id, name: farmer.name });
  });
});

// Admin Signup
app.post('/admin/signup', async (req, res) => {
  const { username, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  const sql = `INSERT INTO admin_users (username, password) VALUES (?,?)`;
  db.run(sql, [username, hashedPassword], function(err) {
    if (err) return res.status(400).json({ error: "Username already exists" });
    res.json({ success: true, admin_id: this.lastID });
  });
});

// Admin Login
app.post('/admin/login', (req, res) => {
  const { username, password } = req.body;
  db.get(`SELECT * FROM admin_users WHERE username = ?`, [username], async (err, admin) => {
    if (err || !admin) return res.status(400).json({ error: "Admin not found" });

    const match = await bcrypt.compare(password, admin.password);
    if (!match) return res.status(400).json({ error: "Invalid password" });

    res.json({ success: true, admin_id: admin.id, username: admin.username });
  });
});



const path = require('path');
app.use(express.static(path.join(__dirname, 'public')));


// Start server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
