const applicationModal =
    document.getElementById("applicationModal");

const applicationForm =
    document.getElementById("internshipApplicationForm");

function closeApplicationForm() {
    applicationModal.classList.remove("show");
    window.location.href = "index.html";
}

function getLoggedInUser() {
    try {
        return JSON.parse(
            localStorage.getItem("loggedInUser")
        );
    } catch (error) {
        return null;
    }
}

function fillLoggedInUserDetails() {
    const loggedInUser = getLoggedInUser();

    if (!loggedInUser) {
        return;
    }

    document.getElementById("applicantName").value =
        loggedInUser.fullName || "";

    document.getElementById("applicantEmail").value =
        loggedInUser.email || "";

    document.getElementById("applicantMobile").value =
        loggedInUser.mobile || "";
}


/* ================================
   SUBMIT INTERNSHIP APPLICATION
================================ */

applicationForm.addEventListener("submit", async function (event) {

    event.preventDefault();

    const applicantName =
        document.getElementById("applicantName").value.trim();

    const applicantEmail =
        document
            .getElementById("applicantEmail")
            .value
            .trim()
            .toLowerCase();

    const applicantMobile =
        document.getElementById("applicantMobile").value.trim();

    const dateOfBirth =
        document.getElementById("dateOfBirth").value;

    const gender =
        document.getElementById("gender").value;

    const qualification =
        document.getElementById("qualification").value;

    const collegeName =
        document.getElementById("collegeName").value.trim();

    const course =
        document.getElementById("course").value.trim();

    const currentYear =
        document.getElementById("currentYear").value;

    const academicScore =
        document.getElementById("academicScore").value.trim();

    const address =
        document.getElementById("address").value.trim();

    const skills =
        document.getElementById("skills").value.trim();

    const resumeLink =
        document.getElementById("resumeLink").value.trim();

    const coverLetter =
        document.getElementById("coverLetter").value.trim();

    const declaration =
        document.getElementById("declaration").checked;

    const internshipId =
        Number(
            document.getElementById("selectedInternshipId").value
        );


    /* ================================
       VALIDATION
    ================================= */

    if (!/^[6-9][0-9]{9}$/.test(applicantMobile)) {
        alert(
            "Please enter a valid 10-digit Indian mobile number."
        );
        return;
    }

    if (coverLetter.length < 30) {
        alert(
            "Cover letter must contain at least 30 characters."
        );
        return;
    }

    if (!declaration) {
        alert("Please accept the declaration.");
        return;
    }


    /* ================================
       DATA FOR BACKEND
    ================================= */

    const applicationData = {

        internshipId: internshipId,

        applicantName: applicantName,

        applicantEmail: applicantEmail,

        applicantMobile: applicantMobile,

        dateOfBirth: dateOfBirth,

        gender: gender,

        qualification: qualification,

        collegeName: collegeName,

        course: course,

        currentYear: currentYear,

        academicScore: academicScore,

        address: address,

        skills: skills,

        resumeLink: resumeLink,

        coverLetter: coverLetter
    };


    /* ================================
       SEND DATA TO MYSQL
    ================================= */

    try {

        const response = await fetch(
            "http://localhost:5000/api/internship/apply",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify(applicationData)
            }
        );


        const result = await response.json();


        /* ================================
           SUCCESS
        ================================= */

        if (response.ok) {

            alert(
                "Application submitted successfully!\nApplication ID: "
                + result.applicationId
            );

            applicationForm.reset();

            window.location.href = "index.html";

            return;
        }


        /* ================================
           BACKEND ERROR
        ================================= */

        alert(
            result.message ||
            "Application submission failed."
        );

    } catch (error) {

        console.error(
            "APPLICATION SUBMISSION ERROR:",
            error
        );

        alert(
            "Server connection failed.\n" +
            "Please make sure your backend server is running."
        );
    }
});


/* ================================
   CLOSE MODAL
================================ */

applicationModal.addEventListener(
    "click",
    function (event) {

        if (event.target === applicationModal) {
            closeApplicationForm();
        }

    }
);


/* ================================
   ESC KEY
================================ */

document.addEventListener(
    "keydown",
    function (event) {

        if (event.key === "Escape") {
            closeApplicationForm();
        }

    }
);


/* ================================
   AUTO-FILL USER
================================ */

document.addEventListener(
    "DOMContentLoaded",
    fillLoggedInUserDetails
);