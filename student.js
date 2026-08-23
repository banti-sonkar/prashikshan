const applicationModal =
    document.getElementById("applicationModal");

const applicationForm =
    document.getElementById("internshipApplicationForm");

function closeApplicationForm() {
    applicationModal.classList.remove("show");

    // Dashboard par wapas bhejne ke liye
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

function getApplications() {
    try {
        return JSON.parse(
            localStorage.getItem("applications")
        ) || [];
    } catch (error) {
        return [];
    }
}

applicationForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const fullName =
        document.getElementById("applicantName").value.trim();

    const email =
        document
            .getElementById("applicantEmail")
            .value
            .trim()
            .toLowerCase();

    const mobile =
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

    const internshipId = Number(
        document.getElementById("selectedInternshipId").value
    );

    if (!/^[6-9][0-9]{9}$/.test(mobile)) {
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

    const applications = getApplications();

    const alreadyApplied = applications.some(
        application =>
            application.email === email &&
            application.internshipId === internshipId
    );

    if (alreadyApplied) {
        alert(
            "You have already submitted an application for this internship."
        );
        return;
    }

    const applicationData = {
        applicationId: Date.now(),
        internshipId,
        fullName,
        email,
        mobile,
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
        coverLetter,
        status: "Pending",
        appliedDate: new Date().toLocaleDateString("en-GB")
    };

    applications.push(applicationData);

    localStorage.setItem(
        "applications",
        JSON.stringify(applications)
    );

    alert("Application submitted successfully.");

    applicationForm.reset();

    window.location.href = "index.html";
});

applicationModal.addEventListener("click", function (event) {
    if (event.target === applicationModal) {
        closeApplicationForm();
    }
});

document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
        closeApplicationForm();
    }
});

document.addEventListener(
    "DOMContentLoaded",
    fillLoggedInUserDetails
);