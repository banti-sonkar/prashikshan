require("dotenv").config();

const mysql = require("mysql2");

const db = mysql.createPool({
    host: process.env.MYSQLHOST || "127.0.0.1",
    user: process.env.MYSQLUSER || "root",
    password: process.env.MYSQLPASSWORD || "",
    database: process.env.MYSQLDATABASE || "prashikshan_db",
    port: Number(process.env.MYSQLPORT) || 3307,

    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,

    enableKeepAlive: true,
    keepAliveInitialDelay: 10000
});

// Test MySQL connection
db.getConnection((err, connection) => {
    if (err) {
        console.error("================================");
        console.error("❌ MYSQL CONNECTION FAILED");
        console.error("================================");

        console.error("Code:", err.code);
        console.error("Message:", err.message);

        if (err.code === "ECONNREFUSED") {
            console.error("👉 MySQL server is not reachable.");
        }

        if (err.code === "ER_ACCESS_DENIED_ERROR") {
            console.error("👉 Check MYSQLUSER and MYSQLPASSWORD.");
        }

        if (err.code === "ER_BAD_DB_ERROR") {
            console.error("👉 Check MYSQLDATABASE.");
        }

        return;
    }

    console.log("================================");
    console.log("✅ MYSQL CONNECTED SUCCESSFULLY");
    console.log("================================");

    console.log("Host:", process.env.MYSQLHOST);
    console.log("Database:", process.env.MYSQLDATABASE);
    console.log("Port:", process.env.MYSQLPORT);

    connection.release();
});

// Handle pool errors
db.on("error", (err) => {
    console.error("================================");
    console.error("❌ MYSQL POOL ERROR");
    console.error("================================");

    console.error("Code:", err.code);
    console.error("Message:", err.message);
});

module.exports = db;