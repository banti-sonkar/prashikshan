// ========================================
// PRASHIKSHAN BACKEND SERVER
// Node.js + Express + MySQL
// Railway + Local MySQL/XAMPP
// ========================================

require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");

const db = require("./db");

const app = express();


// ========================================
// MIDDLEWARE
// ========================================

app.use(cors({
    origin: true,
    credentials: true
}));

app.use(express.json());

app.use(express.urlencoded({
    extended: true
}));


// ========================================
// SERVE FRONTEND
// ========================================

app.use(express.static(__dirname));


// ========================================
// PORT
// ========================================

const PORT = process.env.PORT || 5000;


// ========================================
// HOME PAGE
// ========================================

app.get("/", (req, res) => {

    res.sendFile(path.join(__dirname, "index.html"));

});


// ========================================
// BASIC TEST API
// ========================================

app.get("/api/test", (req, res) => {

    res.json({

        success: true,

        message: "Prashikshan API is working successfully 🚀"

    });

});


// ========================================
// DATABASE TEST API
// ========================================

app.get("/api/test-db", (req, res) => {

    const sql = "SELECT 1 AS test";

    db.query(sql, (err, result) => {

        if (err) {

            console.error("================================");
            console.error("❌ DATABASE TEST FAILED");
            console.error("================================");

            console.error("Code:", err.code);
            console.error("Message:", err.message);

            return res.status(500).json({

                success: false,

                message: "Database connection failed",

                error: err.message

            });

        }


        res.json({

            success: true,

            message: "Database connected successfully",

            database:
                process.env.MYSQLDATABASE ||
                process.env.DB_NAME ||
                "Unknown",

            host:
                process.env.MYSQLHOST ||
                process.env.DB_HOST ||
                "Unknown",

            port:
                process.env.MYSQLPORT ||
                process.env.DB_PORT ||
                "Unknown",

            result: result

        });

    });

});


// ========================================
// REGISTER API
// ========================================

app.post("/api/register", (req, res) => {

    const {
        name,
        email,
        password,
        role
    } = req.body;


    // ----------------------------------------
    // VALIDATION
    // ----------------------------------------

    if (!name || !email || !password || !role) {

        return res.status(400).json({

            success: false,

            message: "All fields are required"

        });

    }


    // ----------------------------------------
    // CHECK VALID ROLE
    // ----------------------------------------

    const validRoles = [
        "student",
        "industry",
        "institute"
    ];

    if (!validRoles.includes(role)) {

        return res.status(400).json({

            success: false,

            message:
                "Invalid role. Use student, industry or institute."

        });

    }


    // ----------------------------------------
    // CHECK EXISTING USER
    // ----------------------------------------

    const checkSql = `
        SELECT id
        FROM users
        WHERE email = ?
        LIMIT 1
    `;


    db.query(
        checkSql,
        [email],
        (err, result) => {

            if (err) {

                console.error("User check error:", err);

                return res.status(500).json({

                    success: false,

                    message: "Database error",

                    error: err.message

                });

            }


            // ----------------------------------------
            // USER ALREADY EXISTS
            // ----------------------------------------

            if (result.length > 0) {

                return res.status(409).json({

                    success: false,

                    message: "Email already registered"

                });

            }


            // ----------------------------------------
            // INSERT USER
            // ----------------------------------------

            const insertSql = `
                INSERT INTO users
                (name, email, password, role)
                VALUES (?, ?, ?, ?)
            `;


            db.query(
                insertSql,
                [name, email, password, role],
                (err, result) => {

                    if (err) {

                        console.error(
                            "Registration error:",
                            err
                        );

                        return res.status(500).json({

                            success: false,

                            message:
                                "Registration failed",

                            error: err.message

                        });

                    }


                    // ----------------------------------------
                    // SUCCESS
                    // ----------------------------------------

                    res.status(201).json({

                        success: true,

                        message:
                            "User registered successfully",

                        userId: result.insertId

                    });

                }
            );

        }
    );

});


// ========================================
// LOGIN API
// ========================================

app.post("/api/login", (req, res) => {

    const {
        email,
        password
    } = req.body;


    // ----------------------------------------
    // VALIDATION
    // ----------------------------------------

    if (!email || !password) {

        return res.status(400).json({

            success: false,

            message:
                "Email and password are required"

        });

    }


    // ----------------------------------------
    // LOGIN QUERY
    // ----------------------------------------

    const sql = `
        SELECT *
        FROM users
        WHERE email = ?
        AND password = ?
        LIMIT 1
    `;


    db.query(
        sql,
        [email, password],
        (err, result) => {

            if (err) {

                console.error(
                    "Login error:",
                    err
                );

                return res.status(500).json({

                    success: false,

                    message:
                        "Login failed",

                    error:
                        err.message

                });

            }


            // ----------------------------------------
            // USER NOT FOUND
            // ----------------------------------------

            if (result.length === 0) {

                return res.status(401).json({

                    success: false,

                    message:
                        "Invalid email or password"

                });

            }


            // ----------------------------------------
            // LOGIN SUCCESS
            // ----------------------------------------

            const user = result[0];


            res.json({

                success: true,

                message:
                    "Login successful",

                user: {

                    id: user.id,

                    name: user.name,

                    email: user.email,

                    role: user.role

                }

            });

        }
    );

});


// ========================================
// 404 API HANDLER
// ========================================

app.use((req, res) => {

    res.status(404).json({

        success: false,

        message: "Route not found",

        path: req.originalUrl

    });

});


// ========================================
// GLOBAL ERROR HANDLER
// ========================================

app.use((err, req, res, next) => {

    console.error("================================");
    console.error("❌ SERVER ERROR");
    console.error("================================");

    console.error(err);


    res.status(500).json({

        success: false,

        message: "Internal server error",

        error: err.message

    });

});


// ========================================
// START SERVER
// ========================================

app.listen(PORT, () => {

    console.log("========================================");
    console.log("🚀 PRASHIKSHAN SERVER STARTED");
    console.log("========================================");

    console.log("PORT:", PORT);

    console.log("API:", `/api/test`);

    console.log("DATABASE TEST:", `/api/test-db`);

    console.log("========================================");

});