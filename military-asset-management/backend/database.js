const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'asm.sqlite');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('database connection error:', err.message);
    } else {
        console.log('Connected to sqlite database.');
        
        // Init tables
        db.serialize(() => {
            db.run(`CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT UNIQUE,
                password TEXT,
                role TEXT
            )`);
            
            db.run(`CREATE TABLE IF NOT EXISTS assets (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                assetName TEXT,
                category TEXT,
                base TEXT,
                status TEXT
            )`);
            
            db.run(`CREATE TABLE IF NOT EXISTS transfers (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                assetId INTEGER,
                fromBase TEXT,
                toBase TEXT,
                date TEXT,
                FOREIGN KEY(assetId) REFERENCES assets(id)
            )`);
            
            db.run(`CREATE TABLE IF NOT EXISTS assignments (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                assetId INTEGER,
                assignedTo TEXT,
                date TEXT,
                FOREIGN KEY(assetId) REFERENCES assets(id)
            )`);
        });
    }
});

module.exports = db;
