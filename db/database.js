const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("./showbuzz.db");

db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS shows(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            rating REAL
        )
    `);
});

module.exports = db;