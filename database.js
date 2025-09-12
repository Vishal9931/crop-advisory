const sqlite3 = require('sqlite3').verbose();

// Create or open database
const db = new sqlite3.Database('./crop_advisory.db');

// Create tables
db.serialize(() => {
  // Farmers table
  db.run(`CREATE TABLE IF NOT EXISTS farmers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    phone TEXT,
    location TEXT,
    soil_type TEXT,
    land_size REAL,
    sowing_date TEXT
  )`);

  // Farmers login table
  db.run(`CREATE TABLE IF NOT EXISTS farmer_users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT,
  phone TEXT UNIQUE,
  password TEXT,
  location TEXT,
  soil_type TEXT,
  land_size REAL
)`);

  // Admins login table
  db.run(`CREATE TABLE IF NOT EXISTS admin_users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE,
  password TEXT
)`);


  // Crops table
  db.run(`CREATE TABLE IF NOT EXISTS crops (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    crop_name TEXT,
    suitable_soil TEXT,
    duration_days INTEGER,
    week1_task TEXT,
    week2_task TEXT,
    week3_task TEXT
  )`);

  // Prices table
  db.run(`CREATE TABLE IF NOT EXISTS prices (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    crop_name TEXT,
    market_name TEXT,
    price_per_kg REAL,
    last_updated TEXT
  )`);

  // Crop stages table (schedule)
  db.run(`CREATE TABLE IF NOT EXISTS crop_stages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  crop_id INTEGER,
  day_offset INTEGER,
  task TEXT,
  FOREIGN KEY(crop_id) REFERENCES crops(id)
)`);

  // Alerts table
  db.run(`CREATE TABLE IF NOT EXISTS alerts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  farmer_id INTEGER,
  message TEXT,
  alert_date TEXT,
  sent INTEGER DEFAULT 0,
  FOREIGN KEY(farmer_id) REFERENCES farmers(id)
)`);

});

module.exports = db;

