const db = require('./database');

// Add some crops
db.run(`INSERT INTO crops (crop_name, suitable_soil, duration_days, week1_task, week2_task, week3_task)
        VALUES ('Wheat','loamy',120,'Sow seeds','Irrigation','Fertilizer')`);

db.run(`INSERT INTO crops (crop_name, suitable_soil, duration_days, week1_task, week2_task, week3_task)
        VALUES ('Groundnut','sandy',100,'Sow seeds','Fertilizer','Irrigation')`);

db.close();
console.log("Seed data inserted!");
