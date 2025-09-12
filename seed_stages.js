const db = require('./database');

// Wheat example: Day 0 sow, Day 15 irrigate, Day 30 fertilizer
db.run(`INSERT INTO crop_stages (crop_id, day_offset, task)
        VALUES (1, 0, 'Sow seeds'),
               (1, 15, 'Irrigation'),
               (1, 30, 'Apply fertilizer')`);

// Groundnut example
db.run(`INSERT INTO crop_stages (crop_id, day_offset, task)
        VALUES (2, 0, 'Sow seeds'),
               (2, 20, 'Apply fertilizer'),
               (2, 40, 'Irrigation')`);

db.close();
console.log("Crop stages inserted!");
