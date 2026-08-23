// ========================================
// PRASHIKSHAN REGISTRATION
// ========================================

let selectedUserRole = "";

const API_URL = "http://localhost:5000";

// ========================================
// SELECT ROLE
// ========================================

function selectRole(role) {

    console.log("🔥 Role selected:", role);

    const validRoles = [
        "student",
        "industry",
        "institute"
    ];

    if (!validRoles.includes(role)) {
        console.error("❌ Invalid role:", role);
        return;
    }

    selectedUserRole = role;

    const roleSection =
        document.getElementById("roleSection");

    const selectedRoleBox =
        document.getElementById("selectedRoleBox");

    const registerForm =
        document.getElementById("registerForm");

    const roleInput =
        document.getElementById("role");

    const roleText =
        document.getElementById("selectedRoleText");

    const roleIcon =
        document.getElementById("selectedRoleIcon");

    const roleDisplay =
        document.getElementById("roleDisplay");


    // ========================================
    // ROLE INFORMATION
    // ========================================

    let roleName = "";
    let icon = "";

    if (role === "student") {

        roleName = "Student";
        icon = "🎓";

    } else if (role === "industry") {

        roleName = "Industry";
        icon = "🏭";

    } else if (role === "institute") {

        roleName = "Institute";
        icon = "🏫";
    }


    // ========================================
    // SET HIDDEN ROLE
    // ========================================

    if (roleInput) {
        roleInput.value = role;
    }


    // ========================================
    // UPDATE ROLE DISPLAY
    // ========================================

    if (roleText) {
        roleText.textContent = roleName;
    }

    if (roleIcon) {
        roleIcon.textContent = icon;
    }

    if (roleDisplay) {
        roleDisplay.textContent =
            `${icon} ${roleName}`;
    }


    // ========================================
    // HIDE ROLE SELECTION
    // ========================================

    if (roleSection) {
        roleSection.hidden = true;
    }


    // ========================================
    // SHOW SELECTED ROLE
    // ========================================

    if (selectedRoleBox) {
        selectedRoleBox.hidden = false;
    }


    // ========================================
    // SHOW FORM
    // ========================================

    if (registerForm) {

        registerForm.hidden = false;

        setTimeout(() => {

            registerForm.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

        }, 100);
    }


    console.log(
        `✅ ${roleName} registration selected`
    );
}


// ========================================
// CHANGE ROLE
// ========================================

function changeRole() {

    console.log("🔄 Changing role");

    selectedUserRole = "";

    const roleSection =
        document.getElementById("roleSection");

    const selectedRoleBox =
        document.getElementById("selectedRoleBox");

    const registerForm =
        document.getElementById("registerForm");

    const roleInput =
        document.getElementById("role");


    // Clear role

    if (roleInput) {
        roleInput.value = "";
    }


    // Hide selected role

    if (selectedRoleBox) {
        selectedRoleBox.hidden = true;
    }


    // Hide registration form

    if (registerForm) {
        registerForm.hidden = true;
    }


    // Show role selection

    if (roleSection) {

        roleSection.hidden = false;

        roleSection.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    }
}


// ========================================
// PAGE LOAD
// ========================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        console.log(
            "================================"
        );

        console.log(
            "✅ register.js loaded"
        );

        console.log(
            "🌐 API:",
            API_URL
        );

        console.log(
            "================================"
        );


        const registerForm =
            document.getElementById(
                "registerForm"
            );


        if (!registerForm) {

            console.error(
                "❌ registerForm not found"
            );

            return;
        }


        // ========================================
        // FORM SUBMIT
        // ========================================

        registerForm.addEventListener(
            "submit",
            async function (e) {

                e.preventDefault();

                console.log(
                    "🔥 Registration form submitted"
                );


                // ========================================
                // GET ELEMENTS
                // ========================================

                const fullNameElement =
                    document.getElementById(
                        "fullName"
                    );

                const emailElement =
                    document.getElementById(
                        "email"
                    );

                const mobileElement =
                    document.getElementById(
                        "mobile"
                    );

                const passwordElement =
                    document.getElementById(
                        "password"
                    );

                const confirmPasswordElement =
                    document.getElementById(
                        "confirmPassword"
                    );

                const roleElement =
                    document.getElementById(
                        "role"
                    );

                const termsElement =
                    document.getElementById(
                        "terms"
                    );

                const messageElement =
                    document.getElementById(
                        "formMessage"
                    );

                const submitButton =
                    document.getElementById(
                        "sendOtpButton"
                    );


                // ========================================
                // CHECK ELEMENTS
                // ========================================

                if (
                    !fullNameElement ||
                    !emailElement ||
                    !mobileElement ||
                    !passwordElement ||
                    !confirmPasswordElement ||
                    !roleElement
                ) {

                    console.error(
                        "❌ Required registration elements missing"
                    );

                    showFormMessage(
                        "Registration form is incomplete.",
                        "error"
                    );

                    return;
                }


                // ========================================
                // GET VALUES
                // ========================================

                const fullName =
                    fullNameElement.value.trim();

                const email =
                    emailElement.value
                        .trim()
                        .toLowerCase();

                const mobile =
                    mobileElement.value.trim();

                const password =
                    passwordElement.value;

                const confirmPassword =
                    confirmPasswordElement.value;

                const role =
                    roleElement.value
                        .trim()
                        .toLowerCase();


                // ========================================
                // CLEAR MESSAGE
                // ========================================

                if (messageElement) {

                    messageElement.textContent = "";

                    messageElement.className =
                        "form-message";
                }


                // ========================================
                // ROLE VALIDATION
                // ========================================

                const validRoles = [
                    "student",
                    "industry",
                    "institute"
                ];

                if (!validRoles.includes(role)) {

                    showFormMessage(
                        "Please select Student, Industry or Institute.",
                        "error"
                    );

                    return;
                }


                // ========================================
                // NAME VALIDATION
                // ========================================

                if (!fullName) {

                    showFormMessage(
                        "Please enter your full name.",
                        "error"
                    );

                    return;
                }


                if (fullName.length < 2) {

                    showFormMessage(
                        "Name must contain at least 2 characters.",
                        "error"
                    );

                    return;
                }


                // ========================================
                // EMAIL VALIDATION
                // ========================================

                if (!email) {

                    showFormMessage(
                        "Please enter your email address.",
                        "error"
                    );

                    return;
                }


                const emailPattern =
                    /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


                if (!emailPattern.test(email)) {

                    showFormMessage(
                        "Please enter a valid email address.",
                        "error"
                    );

                    return;
                }


                // ========================================
                // MOBILE VALIDATION
                // ========================================

                if (!mobile) {

                    showFormMessage(
                        "Please enter your mobile number.",
                        "error"
                    );

                    return;
                }


                const mobilePattern =
                    /^[0-9]{10}$/;


                if (!mobilePattern.test(mobile)) {

                    showFormMessage(
                        "Mobile number must contain exactly 10 digits.",
                        "error"
                    );

                    return;
                }


                // ========================================
                // PASSWORD VALIDATION
                // ========================================

                if (!password) {

                    showFormMessage(
                        "Please enter your password.",
                        "error"
                    );

                    return;
                }


                if (password.length < 8) {

                    showFormMessage(
                        "Password must contain at least 8 characters.",
                        "error"
                    );

                    return;
                }


                const upperCase =
                    /[A-Z]/;

                const lowerCase =
                    /[a-z]/;

                const number =
                    /[0-9]/;


                if (
                    !upperCase.test(password) ||
                    !lowerCase.test(password) ||
                    !number.test(password)
                ) {

                    showFormMessage(
                        "Password must contain uppercase, lowercase and number.",
                        "error"
                    );

                    return;
                }


                // ========================================
                // CONFIRM PASSWORD
                // ========================================

                if (
                    password !==
                    confirmPassword
                ) {

                    showFormMessage(
                        "Passwords do not match.",
                        "error"
                    );

                    return;
                }


                // ========================================
                // TERMS
                // ========================================

                if (
                    termsElement &&
                    !termsElement.checked
                ) {

                    showFormMessage(
                        "Please agree to the Terms and Privacy Policy.",
                        "error"
                    );

                    return;
                }


                // ========================================
                // USER DATA
                // ========================================

                const userData = {

                    fullName:
                        fullName,

                    email:
                        email,

                    mobile:
                        mobile,

                    role:
                        role,

                    password:
                        password
                };


                console.log(
                    "📤 Registration data:",
                    {
                        fullName,
                        email,
                        mobile,
                        role
                    }
                );


                // ========================================
                // DISABLE BUTTON
                // ========================================

                const originalText =
                    submitButton
                        ? submitButton.textContent
                        : "Create Account";


                if (submitButton) {

                    submitButton.disabled =
                        true;

                    submitButton.textContent =
                        "Creating Account...";
                }


                // ========================================
                // SERVER REQUEST
                // ========================================

                try {

                    console.log(
                        "🌐 Connecting to:",
                        `${API_URL}/api/register`
                    );


                    // ========================================
                    // TIMEOUT CONTROLLER
                    // ========================================

                    const controller =
                        new AbortController();


                    const timeout =
                        setTimeout(
                            () => {

                                controller.abort();

                            },
                            10000
                        );


                    // ========================================
                    // FETCH
                    // ========================================

                    const response =
                        await fetch(
                            `${API_URL}/api/register`,
                            {

                                method: "POST",

                                headers: {
                                    "Content-Type":
                                        "application/json"
                                },

                                body:
                                    JSON.stringify(
                                        userData
                                    ),

                                signal:
                                    controller.signal
                            }
                        );


                    clearTimeout(timeout);


                    console.log(
                        "📥 HTTP Status:",
                        response.status
                    );


                    // ========================================
                    // READ RESPONSE
                    // ========================================

                    const responseText =
                        await response.text();


                    console.log(
                        "📥 Raw response:",
                        responseText
                    );


                    let data;


                    try {

                        data =
                            responseText
                                ? JSON.parse(
                                    responseText
                                )
                                : {};

                    } catch (jsonError) {

                        console.error(
                            "❌ Invalid JSON:",
                            responseText
                        );

                        throw new Error(
                            "Server returned invalid JSON."
                        );
                    }


                    console.log(
                        "📥 Server data:",
                        data
                    );


                    // ========================================
                    // SUCCESS
                    // ========================================

                    if (
                        response.ok &&
                        data.success
                    ) {

                        console.log(
                            "================================"
                        );

                        console.log(
                            "✅ REGISTRATION SUCCESS"
                        );

                        console.log(
                            "User ID:",
                            data.userId
                        );

                        console.log(
                            "Role:",
                            role
                        );

                        console.log(
                            "================================"
                        );


                        showFormMessage(
                            "✅ Registration successful! Redirecting to login...",
                            "success"
                        );


                        // ========================================
                        // SAVE USER DATA
                        // ========================================

                        localStorage.setItem(
                            "registeredEmail",
                            email
                        );

                        localStorage.setItem(
                            "registeredRole",
                            role
                        );


                        if (data.userId) {

                            localStorage.setItem(
                                "registeredUserId",
                                data.userId
                            );
                        }


                        // ========================================
                        // REDIRECT
                        // ========================================

                        setTimeout(
                            function () {

                                window.location.href =
                                    "login.html";

                            },
                            1500
                        );


                        return;
                    }


                    // ========================================
                    // SERVER ERROR
                    // ========================================

                    console.error(
                        "❌ Registration failed:",
                        data
                    );


                    showFormMessage(
                        data.message ||
                        "Failed to create account.",
                        "error"
                    );


                } catch (error) {

                    console.error(
                        "================================"
                    );

                    console.error(
                        "❌ REGISTRATION ERROR"
                    );

                    console.error(
                        error
                    );

                    console.error(
                        "================================"
                    );


                    // ========================================
                    // TIMEOUT
                    // ========================================

                    if (
                        error.name ===
                        "AbortError"
                    ) {

                        showFormMessage(
                            "❌ Server response timeout. Check that Node.js is running on port 5000.",
                            "error"
                        );

                    }

                    // ========================================
                    // CONNECTION ERROR
                    // ========================================

                    else {

                        showFormMessage(
                            "❌ Unable to connect to server. Start Node.js with: node server.js",
                            "error"
                        );
                    }


                } finally {

                    // ========================================
                    // ENABLE BUTTON
                    // ========================================

                    if (submitButton) {

                        submitButton.disabled =
                            false;

                        submitButton.textContent =
                            originalText;
                    }
                }

            }
        );
    }
);


// ========================================
// SHOW FORM MESSAGE
// ========================================

function showFormMessage(
    message,
    type
) {

    const messageElement =
        document.getElementById(
            "formMessage"
        );


    if (!messageElement) {

        console.error(
            "❌ formMessage not found"
        );

        alert(message);

        return;
    }


    messageElement.textContent =
        message;


    messageElement.className =
        `form-message ${type}`;


    messageElement.scrollIntoView({
        behavior: "smooth",
        block: "nearest"
    });
}


// ========================================
// PASSWORD SHOW / HIDE
// ========================================

document.addEventListener(
    "click",
    function (e) {

        if (
            !e.target.classList.contains(
                "password-toggle"
            )
        ) {
            return;
        }


        const targetId =
            e.target.dataset.target;


        const passwordInput =
            document.getElementById(
                targetId
            );


        if (!passwordInput) {

            console.error(
                "❌ Password input not found:",
                targetId
            );

            return;
        }


        // ========================================
        // SHOW
        // ========================================

        if (
            passwordInput.type ===
            "password"
        ) {

            passwordInput.type =
                "text";

            e.target.textContent =
                "Hide";

        }

        // ========================================
        // HIDE
        // ========================================

        else {

            passwordInput.type =
                "password";

            e.target.textContent =
                "Show";
        }
    }
);