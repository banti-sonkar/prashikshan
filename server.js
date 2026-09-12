// ========================================
// PRASHIKSHAN SERVER
// Student | Industry | Institute
// Registration + Login + Applications
// ========================================
require("dotenv").config();
const express = require("express");
const path = require("path");
const cors = require("cors");
const db = require("./db");

// ========================================
// EXPRESS APP
// ========================================
const app = express();
const PORT = process.env.PORT || 5000;

// ========================================
// MIDDLEWARE
// ========================================
app.use(
    cors({
        origin: true,
        credentials: true
    })
);
app.use(express.json());
app.use(
    express.urlencoded({
        extended: true
    })
);

// ========================================
// SERVE FRONTEND
// ========================================
app.use(express.static(__dirname));

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
    console.log("🔥 Server test requested");
    res.status(200).json({
        success: true,
        message: "Prashikshan API is working successfully 🚀",
        port: PORT
    });
});

// ========================================
// DATABASE TEST API
// ========================================
app.get("/api/test-db", (req, res) => {
    console.log("🔥 Database test requested");

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

        console.log("✅ Database test successful");

        return res.status(200).json({
            success: true,
            message: "Database connection is working!",
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
// Student / Industry / Institute
// ========================================
app.post("/api/register", (req, res) => {
    console.log("================================");
    console.log("🔥 REGISTRATION REQUEST");
    console.log("================================");

    const { fullName, email, mobile, role, password } = req.body;

    if (!fullName || !email || !mobile || !role || !password) {
        return res.status(400).json({
            success: false,
            message: "All fields are required."
        });
    }

    const cleanFullName = String(fullName).trim();
    const cleanEmail = String(email).trim().toLowerCase();
    const cleanMobile = String(mobile).trim();
    const cleanRole = String(role).trim().toLowerCase();
    const cleanPassword = String(password);

    const allowedRoles = ["student", "industry", "institute"];
    if (!allowedRoles.includes(cleanRole)) {
        return res.status(400).json({
            success: false,
            message:
                "Invalid account type. Use student, industry or institute."
        });
    }

    if (cleanFullName.length < 2) {
        return res.status(400).json({
            success: false,
            message: "Please enter a valid full name."
        });
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(cleanEmail)) {
        return res.status(400).json({
            success: false,
            message: "Please enter a valid email address."
        });
    }

    const mobilePattern = /^[0-9]{10}$/;
    if (!mobilePattern.test(cleanMobile)) {
        return res.status(400).json({
            success: false,
            message: "Mobile number must contain exactly 10 digits."
        });
    }

    if (cleanPassword.length < 8) {
        return res.status(400).json({
            success: false,
            message: "Password must contain at least 8 characters."
        });
    }

    const checkUserSQL = `
        SELECT id, email, mobile
        FROM users
        WHERE email = ? OR mobile = ?
        LIMIT 1
    `;

    db.query(
        checkUserSQL,
        [cleanEmail, cleanMobile],
        (err, results) => {
            if (err) {
                console.error("❌ User check error:", err.message);
                return res.status(500).json({
                    success: false,
                    message: "Database error while checking user.",
                    error: err.message
                });
            }

            if (results.length > 0) {
                const existingUser = results[0];

                if (existingUser.email === cleanEmail) {
                    return res.status(409).json({
                        success: false,
                        message: "This email is already registered."
                    });
                }

                if (existingUser.mobile === cleanMobile) {
                    return res.status(409).json({
                        success: false,
                        message:
                            "This mobile number is already registered."
                    });
                }
            }

            const insertSQL = `
                INSERT INTO users
                (full_name, email, mobile, role, password)
                VALUES (?, ?, ?, ?, ?)
            `;

            db.query(
                insertSQL,
                [
                    cleanFullName,
                    cleanEmail,
                    cleanMobile,
                    cleanRole,
                    cleanPassword
                ],
                (insertErr, result) => {
                    if (insertErr) {
                        console.error("================================");
                        console.error("❌ USER INSERT ERROR");
                        console.error("Code:", insertErr.code);
                        console.error("Message:", insertErr.message);
                        console.error("================================");

                        return res.status(500).json({
                            success: false,
                            message: "Failed to create account.",
                            error: insertErr.message
                        });
                    }

                    console.log("================================");
                    console.log("✅ USER REGISTERED");
                    console.log("User ID:", result.insertId);
                    console.log("Name:", cleanFullName);
                    console.log("Email:", cleanEmail);
                    console.log("Role:", cleanRole);
                    console.log("================================");

                    return res.status(201).json({
                        success: true,
                        message: "Registration successful!",
                        userId: result.insertId,
                        role: cleanRole
                    });
                }
            );
        }
    );
});

// ========================================
// LOGIN API
// Student / Industry / Institute
// ========================================
app.post("/api/login", (req, res) => {
    console.log("================================");
    console.log("🔥 LOGIN REQUEST");
    console.log("================================");

    const { loginId, password } = req.body;

    if (!loginId || !password) {
        return res.status(400).json({
            success: false,
            message: "Email/Mobile and password are required."
        });
    }

    const cleanLoginId = String(loginId).trim().toLowerCase();
    const cleanPassword = String(password);

    const loginSQL = `
        SELECT id, full_name, email, mobile, role, password
        FROM users
        WHERE email = ? OR mobile = ?
        LIMIT 1
    `;

    db.query(
        loginSQL,
        [cleanLoginId, cleanLoginId],
        (err, results) => {
            if (err) {
                console.error("❌ LOGIN DATABASE ERROR:", err.message);
                return res.status(500).json({
                    success: false,
                    message: "Database error.",
                    error: err.message
                });
            }

            if (results.length === 0) {
                console.log("❌ User not found:", cleanLoginId);
                return res.status(401).json({
                    success: false,
                    message: "Invalid email/mobile or password."
                });
            }

            const user = results[0];

            if (cleanPassword !== user.password) {
                console.log("❌ Wrong password:", cleanLoginId);
                return res.status(401).json({
                    success: false,
                    message: "Invalid email/mobile or password."
                });
            }

            console.log("================================");
            console.log("✅ LOGIN SUCCESS");
            console.log("User:", user.full_name);
            console.log("Email:", user.email);
            console.log("Role:", user.role);
            console.log("================================");

            return res.status(200).json({
                success: true,
                message: "Login successful!",
                user: {
                    id: user.id,
                    fullName: user.full_name,
                    email: user.email,
                    mobile: user.mobile,
                    role: user.role
                }
            });
        }
    );
});

// ========================================
// GET USER BY ID
// ========================================
app.get("/api/user/:id", (req, res) => {
    const userId = req.params.id;

    const sql = `
        SELECT id, full_name, email, mobile, role
        FROM users
        WHERE id = ?
        LIMIT 1
    `;

    db.query(sql, [userId], (err, results) => {
        if (err) {
            console.error("❌ Get user error:", err.message);
            return res.status(500).json({
                success: false,
                message: "Database error."
            });
        }

        if (results.length === 0) {
            return res.status(404).json({
                success: false,
                message: "User not found."
            });
        }

        const user = results[0];

        return res.json({
            success: true,
            user: {
                id: user.id,
                fullName: user.full_name,
                email: user.email,
                mobile: user.mobile,
                role: user.role
            }
        });
    });
});

// ========================================
// INTERNSHIP APPLICATION API
// ========================================
app.post("/api/internship/apply", (req, res) => {
    console.log("🔥 Internship application received");

    const {
        internshipId,
        applicantName,
        applicantEmail,
        applicantMobile,
        dateOfBirth,
        gender,
        qualification,
        collegeName,
        course,
        currentYear,
        academicScore,
        address,
        skills,
        resumeLink,
        coverLetter
    } = req.body;

    if (
        !internshipId ||
        !applicantName ||
        !applicantEmail ||
        !applicantMobile ||
        !dateOfBirth ||
        !gender ||
        !qualification ||
        !collegeName ||
        !course ||
        !currentYear ||
        academicScore === undefined ||
        academicScore === null ||
        !address ||
        !skills ||
        !resumeLink ||
        !coverLetter
    ) {
        return res.status(400).json({
            success: false,
            message: "All application fields are required."
        });
    }

    const sql = `
        INSERT INTO internship_applications
        (
            internship_id,
            applicant_name,
            applicant_email,
            applicant_mobile,
            date_of_birth,
            gender,
            qualification,
            college_name,
            course,
            current_year,
            academic_score,
            address,
            skills,
            resume_link,
            cover_letter
        )
        VALUES
        (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
        internshipId,
        applicantName,
        applicantEmail,
        applicantMobile,
        dateOfBirth,
        gender,
        qualification,
        collegeName,
        course,
        currentYear,
        academicScore,
        address,
        skills,
        resumeLink,
        coverLetter
    ];

    db.query(sql, values, (err, result) => {
        if (err) {
            console.error(
                "❌ APPLICATION INSERT FAILED:",
                err.message
            );
            return res.status(500).json({
                success: false,
                message: "Failed to submit internship application.",
                error: err.message
            });
        }

        console.log(
            "✅ INTERNSHIP APPLICATION SAVED:",
            result.insertId
        );

        return res.status(201).json({
            success: true,
            message: "Internship application submitted successfully!",
            applicationId: result.insertId
        });
    });
});

// ========================================
// 404 API HANDLER
// ========================================
app.use((req, res) => {
    console.log(`❌ 404: ${req.method} ${req.originalUrl}`);
    return res.status(404).json({
        success: false,
        message: `Route ${req.method} ${req.originalUrl} not found`
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
    console.error("================================");

    return res.status(500).json({
        success: false,
        message: "Internal server error.",
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
    console.log(`🌐 http://localhost:${PORT}`);
    console.log(`🧪 http://localhost:${PORT}/api/test`);
    console.log(`🗄️ http://localhost:${PORT}/api/test-db`);
    console.log("========================================");
    console.log("👨‍🎓 Student Registration: POST /api/register");
    console.log("🏢 Industry Registration: POST /api/register");
    console.log("🏫 Institute Registration: POST /api/register");
    console.log("🔐 Login: POST /api/login");
    console.log("📄 Get User: GET /api/user/:id");
    console.log("📝 Internship Apply: POST /api/internship/apply");
    console.log("========================================");
});