// ========================================
// PRASHIKSHAN - MYSQL DATABASE
// ========================================

require("dotenv").config();

const mysql = require("mysql2");

// ========================================
// MYSQL CONNECTION POOL
// ========================================

const db = mysql.createPool({
    host: process.env.DB_HOST || "127.0.0.1",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "prashikshan_db",
    port: Number(process.env.DB_PORT) || 3306,

    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,

    // Helps keep connections alive
    enableKeepAlive: true,
    keepAliveInitialDelay: 10000
});

// ========================================
// TEST DATABASE CONNECTION
// ========================================

db.getConnection((err, connection) => {

    if (err) {

        console.error("================================");
        console.error("❌ MYSQL CONNECTION FAILED");
        console.error("================================");

        console.error("Code:", err.code);
        console.error("Message:", err.message);

        if (err.code === "ECONNREFUSED") {
            console.error(
                "👉 MySQL/XAMPP is probably not running."
            );
        }

        if (err.code === "ER_ACCESS_DENIED_ERROR") {
            console.error(
                "👉 Check DB_USER and DB_PASSWORD in .env"
            );
        }

        if (err.code === "ER_BAD_DB_ERROR") {
            console.error(
                "👉 Database does not exist. Check DB_NAME in .env"
            );
        }

        return;
    }

    console.log("================================");
    console.log("✅ MYSQL CONNECTED SUCCESSFULLY");
    console.log("================================");

    console.log("Host:", process.env.DB_HOST);
    console.log("Database:", process.env.DB_NAME);
    console.log("Port:", process.env.DB_PORT || 3306);

    connection.release();
});

// ========================================
// POOL ERROR
// ========================================

db.on("error", (err) => {

    console.error("================================");
    console.error("❌ MYSQL POOL ERROR");
    console.error("================================");

    console.error("Code:", err.code);
    console.error("Message:", err.message);
});

// ========================================
// EXPORT
// ========================================

module.exports = db;