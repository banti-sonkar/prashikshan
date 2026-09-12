require("dotenv").config();

const mysql = require("mysql2");

const db = mysql.createPool({
    host: process.env.MYSQLHOST,
    user: process.env.MYSQLUSER,
    password: process.env.MYSQLPASSWORD,
    database: process.env.MYSQLDATABASE,
    port: Number(process.env.MYSQLPORT),

    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,

    enableKeepAlive: true,
    keepAliveInitialDelay: 10000
});

db.getConnection((err, connection) => {
    if (err) {
        console.error("================================");
        console.error("❌ MYSQL CONNECTION FAILED");
        console.error("================================");
        console.error("Code:", err.code);
        console.error("Message:", err.message);
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

db.on("error", (err) => {
    console.error("MYSQL POOL ERROR:", err);
});

module.exports = db;