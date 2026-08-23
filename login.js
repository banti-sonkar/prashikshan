// ========================================
// PRASHIKSHAN LOGIN
// ========================================

"use strict";

// ========================================
// BACKEND CONFIGURATION
// ========================================

// IMPORTANT:
// Node.js server is running on port 5000
const API_BASE_URL = "http://localhost:5000";

// Login API
const LOGIN_API_URL = `${API_BASE_URL}/api/login`;

// ========================================
// GET LOGIN FORM
// ========================================

const loginForm = document.getElementById("loginForm");

// ========================================
// PASSWORD SHOW / HIDE
// ========================================

function togglePassword() {
    const passwordInput = document.getElementById("loginPassword");
    const button = document.getElementById("showPasswordButton");

    if (!passwordInput || !button) {
        console.error("❌ Password elements not found.");
        return;
    }

    if (passwordInput.type === "password") {
        passwordInput.type = "text";
        button.textContent = "Hide";
    } else {
        passwordInput.type = "password";
        button.textContent = "Show";
    }
}

// ========================================
// MAKE TOGGLE FUNCTION AVAILABLE
// ========================================

window.togglePassword = togglePassword;

// ========================================
// LOGIN FORM
// ========================================

if (loginForm) {

    loginForm.addEventListener("submit", async function (e) {

        e.preventDefault();

        console.log("================================");
        console.log("🔥 LOGIN FORM SUBMITTED");
        console.log("================================");

        // ========================================
        // GET ELEMENTS
        // ========================================

        const loginIdElement =
            document.getElementById("loginId");

        const passwordElement =
            document.getElementById("loginPassword");

        const loginMessage =
            document.getElementById("loginMessage");

        const loginIdError =
            document.getElementById("loginIdError");

        const passwordError =
            document.getElementById("loginPasswordError");

        const loginButton =
            document.getElementById("loginButton");

        const rememberElement =
            document.getElementById("remember");

        // ========================================
        // CHECK ELEMENTS
        // ========================================

        if (!loginIdElement || !passwordElement) {

            console.error("❌ Login form elements missing.");

            if (loginMessage) {
                loginMessage.textContent =
                    "Login form is incomplete.";

                loginMessage.className =
                    "login-message error";
            }

            return;
        }

        // ========================================
        // GET VALUES
        // ========================================

        const loginId =
            loginIdElement.value
                .trim()
                .toLowerCase();

        const password =
            passwordElement.value;

        // ========================================
        // CLEAR PREVIOUS MESSAGES
        // ========================================

        if (loginIdError) {
            loginIdError.textContent = "";
        }

        if (passwordError) {
            passwordError.textContent = "";
        }

        if (loginMessage) {
            loginMessage.textContent = "";
            loginMessage.className = "login-message";
        }

        // ========================================
        // VALIDATE LOGIN ID
        // ========================================

        if (!loginId) {

            if (loginIdError) {
                loginIdError.textContent =
                    "Please enter email or mobile number.";
            }

            loginIdElement.focus();
            return;
        }

        // ========================================
        // VALIDATE PASSWORD
        // ========================================

        if (!password) {

            if (passwordError) {
                passwordError.textContent =
                    "Please enter your password.";
            }

            passwordElement.focus();
            return;
        }

        // ========================================
        // DISABLE LOGIN BUTTON
        // ========================================

        const originalButtonText =
            loginButton
                ? loginButton.textContent
                : "Login";

        if (loginButton) {
            loginButton.disabled = true;
            loginButton.textContent = "Logging in...";
        }

        // ========================================
        // SEND LOGIN DATA TO NODE.JS
        // ========================================

        try {

            console.log("📤 Sending login request...");
            console.log("Login ID:", loginId);
            console.log("Backend:", API_BASE_URL);
            console.log("Login API:", LOGIN_API_URL);

            // ========================================
            // LOGIN REQUEST
            // ========================================

            const response = await fetch(LOGIN_API_URL, {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    loginId: loginId,
                    password: password
                })
            });

            // ========================================
            // SERVER RESPONSE STATUS
            // ========================================

            console.log("HTTP Status:", response.status);

            let data;

            // ========================================
            // READ JSON RESPONSE
            // ========================================

            try {

                data = await response.json();

            } catch (jsonError) {

                console.error(
                    "❌ Invalid server response:",
                    jsonError
                );

                throw new Error(
                    "Server returned an invalid response."
                );
            }

            // ========================================
            // SHOW SERVER RESPONSE
            // ========================================

            console.log("📥 Server response:", data);

            // ========================================
            // LOGIN FAILED
            // ========================================

            if (!response.ok || !data.success) {

                console.error("❌ LOGIN FAILED");

                if (loginMessage) {

                    loginMessage.textContent =
                        data.message ||
                        "Invalid email/mobile or password.";

                    loginMessage.className =
                        "login-message error";
                }

                return;
            }

            // ========================================
            // CHECK USER DATA
            // ========================================

            if (!data.user) {

                console.error(
                    "❌ User data missing from server."
                );

                if (loginMessage) {

                    loginMessage.textContent =
                        "Login successful, but user information was not received.";

                    loginMessage.className =
                        "login-message error";
                }

                return;
            }

            // ========================================
            // GET USER
            // ========================================

            const user = data.user;

            console.log("================================");
            console.log("✅ LOGIN SUCCESS");
            console.log("User ID:", user.id);
            console.log("Name:", user.fullName);
            console.log("Email:", user.email);
            console.log("Mobile:", user.mobile);
            console.log("Role:", user.role);
            console.log("================================");

            // ========================================
            // SAVE LOGIN SESSION
            // ========================================

            localStorage.setItem(
                "loggedInUser",
                JSON.stringify(user)
            );

            localStorage.setItem(
                "isLoggedIn",
                "true"
            );

            // ========================================
            // SAVE BASIC USER INFORMATION
            // ========================================

            if (user.email) {

                localStorage.setItem(
                    "registeredEmail",
                    user.email
                );
            }

            if (user.role) {

                localStorage.setItem(
                    "registeredRole",
                    user.role
                );
            }

            if (user.id) {

                localStorage.setItem(
                    "userId",
                    user.id
                );
            }

            // ========================================
            // REMEMBER ME
            // ========================================

            if (
                rememberElement &&
                rememberElement.checked
            ) {

                localStorage.setItem(
                    "rememberLogin",
                    "true"
                );

            } else {

                localStorage.removeItem(
                    "rememberLogin"
                );
            }

            // ========================================
            // SUCCESS MESSAGE
            // ========================================

            if (loginMessage) {

                loginMessage.textContent =
                    "✅ Login successful! Redirecting...";

                loginMessage.className =
                    "login-message success";
            }

            // ========================================
            // ROLE CHECK
            // ========================================

            const role =
                String(user.role || "")
                    .trim()
                    .toLowerCase();

            console.log("🔐 User role:", role);

            // ========================================
            // SELECT DASHBOARD
            // ========================================

            let dashboardPage = "";

            if (role === "student") {

                dashboardPage = "student.html";

            } else if (role === "institute") {

                dashboardPage = "institute.html";

            } else if (role === "industry") {

                dashboardPage = "industry.html";

            } else {

                console.error(
                    "❌ Invalid role:",
                    role
                );

                if (loginMessage) {

                    loginMessage.textContent =
                        "Invalid account role.";

                    loginMessage.className =
                        "login-message error";
                }

                return;
            }

            // ========================================
            // REDIRECT
            // ========================================

            console.log(
                "➡️ Redirecting to:",
                dashboardPage
            );

            setTimeout(function () {

                window.location.href =
                    dashboardPage;

            }, 800);

        }

        // ========================================
        // CONNECTION ERROR
        // ========================================

        catch (error) {

            console.error(
                "================================"
            );

            console.error(
                "❌ LOGIN ERROR"
            );

            console.error(error);

            console.error(
                "================================"
            );

            if (loginMessage) {

                loginMessage.textContent =
                    "Unable to connect to server. Please make sure Node.js is running.";

                loginMessage.className =
                    "login-message error";
            }
        }

        // ========================================
        // ENABLE LOGIN BUTTON
        // ========================================

        finally {

            if (loginButton) {

                loginButton.disabled = false;

                loginButton.textContent =
                    originalButtonText || "Login";
            }
        }

    });

} else {

    console.error(
        "❌ Login form not found. ID should be: loginForm"
    );
}

// ========================================
// PAGE LOAD
// ========================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        console.log("================================");
        console.log("✅ login.js loaded successfully");
        console.log("🌐 Backend:", API_BASE_URL);
        console.log("🔐 Login API:", LOGIN_API_URL);
        console.log("================================");

    }
);