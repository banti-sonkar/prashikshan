const studentSearch =
    document.getElementById("studentSearch");

const studentStatusFilter =
    document.getElementById("studentStatusFilter");

const internshipSearch =
    document.getElementById("internshipSearch");

const internshipStatusFilter =
    document.getElementById("internshipStatusFilter");

const applicationSearch =
    document.getElementById("applicationSearch");

const applicationStatusFilter =
    document.getElementById("applicationStatusFilter");


function readStorage(key) {
    try {
        return JSON.parse(localStorage.getItem(key)) || [];
    } catch (error) {
        return [];
    }
}


function saveStorage(key, value) {
    localStorage.setItem(
        key,
        JSON.stringify(value)
    );
}


function getStudents() {
    return readStorage("users").filter(
        user =>
            !user.role ||
            user.role.toLowerCase() === "student"
    );
}


function getInternships() {
    return readStorage("internships");
}


function getApplications() {
    return readStorage("applications");
}


function displayStudents() {
    const searchValue =
        studentSearch.value.trim().toLowerCase();

    const selectedStatus =
        studentStatusFilter.value;

    const students = getStudents();

    const filteredStudents = students.filter(student => {
        const searchableText = `
            ${student.fullName || ""}
            ${student.email || ""}
            ${student.mobile || ""}
            ${student.course || ""}
            ${student.collegeName || ""}
        `.toLowerCase();

        const status =
            student.verificationStatus || "Pending";

        const matchesSearch =
            searchableText.includes(searchValue);

        const matchesStatus =
            selectedStatus === "all" ||
            status === selectedStatus;

        return matchesSearch && matchesStatus;
    });

    const tableBody =
        document.getElementById("studentTableBody");

    tableBody.innerHTML = "";

    document.getElementById("studentCount")
        .textContent = students.length;

    const noStudentsMessage =
        document.getElementById("noStudentsMessage");

    const tableWrapper =
        document.getElementById("studentTableWrapper");

    if (filteredStudents.length === 0) {
        tableWrapper.style.display = "none";
        noStudentsMessage.style.display = "block";
        return;
    }

    tableWrapper.style.display = "block";
    noStudentsMessage.style.display = "none";

    filteredStudents.forEach(student => {
        const row = document.createElement("tr");

        const status =
            student.verificationStatus || "Pending";

        row.innerHTML = `
            <td>${student.fullName || "Not provided"}</td>

            <td>${student.email || "Not provided"}</td>

            <td>${student.mobile || "Not provided"}</td>

            <td>
                ${student.course || student.role || "Student"}
            </td>

            <td>
                <span class="${getStatusClass(status)}">
                    ${status}
                </span>
            </td>

            <td>
                <div class="action-group">

                    <button
                        type="button"
                        class="action-btn view-btn"
                        onclick="viewStudent('${student.email}')"
                    >
                        View
                    </button>

                    <button
                        type="button"
                        class="action-btn approve-btn"
                        onclick="updateStudentStatus(
                            '${student.email}',
                            'Verified'
                        )"
                    >
                        Verify
                    </button>

                    <button
                        type="button"
                        class="action-btn reject-btn"
                        onclick="updateStudentStatus(
                            '${student.email}',
                            'Rejected'
                        )"
                    >
                        Reject
                    </button>

                </div>
            </td>
        `;

        tableBody.appendChild(row);
    });
}


function updateStudentStatus(email, newStatus) {
    const users = readStorage("users");

    const student = users.find(
        user => user.email === email
    );

    if (!student) {
        alert("Student account not found.");
        return;
    }

    student.verificationStatus = newStatus;

    saveStorage("users", users);

    displayStudents();
    updateDashboardCounts();

    alert(
        `Student status changed to ${newStatus}.`
    );
}


function viewStudent(email) {
    const student = readStorage("users").find(
        user => user.email === email
    );

    if (!student) {
        alert("Student account not found.");
        return;
    }

    document.getElementById("studentDetails").innerHTML = `
        <div class="details-modal-grid">

            ${createDetail(
                "Full Name",
                student.fullName
            )}

            ${createDetail(
                "Email",
                student.email
            )}

            ${createDetail(
                "Mobile Number",
                student.mobile
            )}

            ${createDetail(
                "Role",
                student.role || "Student"
            )}

            ${createDetail(
                "College",
                student.collegeName
            )}

            ${createDetail(
                "Course / Branch",
                student.course
            )}

            ${createDetail(
                "Current Year",
                student.currentYear
            )}

            ${createDetail(
                "Verification Status",
                student.verificationStatus || "Pending"
            )}

        </div>
    `;

    document
        .getElementById("studentDetailsModal")
        .classList.add("show");
}


function closeStudentDetails() {
    document
        .getElementById("studentDetailsModal")
        .classList.remove("show");
}


function displayInternships() {
    const searchValue =
        internshipSearch.value.trim().toLowerCase();

    const selectedStatus =
        internshipStatusFilter.value;

    const internships = getInternships();

    const filteredInternships =
        internships.filter(internship => {
            const searchableText = `
                ${internship.title || ""}
                ${internship.companyName || ""}
                ${internship.category || ""}
                ${internship.location || ""}
            `.toLowerCase();

            const status =
                internship.approvalStatus || "Pending";

            return (
                searchableText.includes(searchValue) &&
                (
                    selectedStatus === "all" ||
                    status === selectedStatus
                )
            );
        });

    const container =
        document.getElementById("instituteInternships");

    const emptyMessage =
        document.getElementById("noInternshipsMessage");

    container.innerHTML = "";

    document.getElementById("internshipCount")
        .textContent = internships.length;

    if (filteredInternships.length === 0) {
        emptyMessage.style.display = "block";
        return;
    }

    emptyMessage.style.display = "none";

    filteredInternships
        .slice()
        .reverse()
        .forEach(internship => {
            const status =
                internship.approvalStatus || "Pending";

            const skills =
                Array.isArray(internship.skills)
                    ? internship.skills
                    : [];

            const card =
                document.createElement("article");

            card.className = "internship-card";

            card.innerHTML = `
                <div class="card-top">

                    <div>
                        <h3>${internship.title}</h3>

                        <p class="company-name">
                            ${internship.companyName}
                        </p>
                    </div>

                    <span class="${getStatusClass(status)}">
                        ${status}
                    </span>

                </div>

                <div class="details-grid">

                    <div class="detail-item">
                        📂 ${internship.category}
                    </div>

                    <div class="detail-item">
                        📍 ${internship.location}
                    </div>

                    <div class="detail-item">
                        💻 ${internship.mode}
                    </div>

                    <div class="detail-item">
                        ⏳ ${internship.duration}
                    </div>

                    <div class="detail-item">
                        💰 ${internship.stipend}
                    </div>

                    <div class="detail-item">
                        📅 ${formatDate(internship.deadline)}
                    </div>

                </div>

                <div class="skill-list">

                    ${skills.map(
                        skill =>
                            `<span class="skill">${skill}</span>`
                    ).join("")}

                </div>

                <div class="action-group">

                    <button
                        type="button"
                        class="action-btn approve-btn"
                        onclick="updateInternshipStatus(
                            ${internship.id},
                            'Approved'
                        )"
                    >
                        Approve
                    </button>

                    <button
                        type="button"
                        class="action-btn reject-btn"
                        onclick="updateInternshipStatus(
                            ${internship.id},
                            'Rejected'
                        )"
                    >
                        Reject
                    </button>

                </div>
            `;

            container.appendChild(card);
        });
}


function updateInternshipStatus(
    internshipId,
    newStatus
) {
    const internships = getInternships();

    const internship = internships.find(
        item => item.id === internshipId
    );

    if (!internship) {
        alert("Internship not found.");
        return;
    }

    internship.approvalStatus = newStatus;

    /*
        Sirf approved internship student module me
        apply karne ke liye open hogi.
    */
    internship.status =
        newStatus === "Approved"
            ? "Open"
            : newStatus;

    saveStorage("internships", internships);

    displayInternships();
    updateDashboardCounts();

    alert(
        `Internship status changed to ${newStatus}.`
    );
}


function displayApplications() {
    const searchValue =
        applicationSearch.value.trim().toLowerCase();

    const selectedStatus =
        applicationStatusFilter.value;

    const applications = getApplications();

    const filteredApplications =
        applications.filter(application => {
            const internshipTitle =
                application.internshipTitle ||
                application.title ||
                "";

            const searchableText = `
                ${application.fullName || ""}
                ${application.email || ""}
                ${application.company || ""}
                ${application.course || ""}
                ${internshipTitle}
            `.toLowerCase();

            return (
                searchableText.includes(searchValue) &&
                (
                    selectedStatus === "all" ||
                    application.status === selectedStatus
                )
            );
        });

    const tableBody =
        document.getElementById("applicationTableBody");

    const tableWrapper =
        document.getElementById(
            "applicationTableWrapper"
        );

    const emptyMessage =
        document.getElementById(
            "noApplicationsMessage"
        );

    tableBody.innerHTML = "";

    document.getElementById("applicationCount")
        .textContent = applications.length;

    if (filteredApplications.length === 0) {
        tableWrapper.style.display = "none";
        emptyMessage.style.display = "block";
        return;
    }

    tableWrapper.style.display = "block";
    emptyMessage.style.display = "none";

    filteredApplications
        .slice()
        .reverse()
        .forEach(application => {
            const internshipTitle =
                application.internshipTitle ||
                application.title ||
                "Internship";

            const row = document.createElement("tr");

            row.innerHTML = `
                <td>
                    ${application.fullName || "Not provided"}
                </td>

                <td>${internshipTitle}</td>

                <td>
                    ${application.company || "Not provided"}
                </td>

                <td>
                    ${application.course || "Not provided"}
                </td>

                <td>
                    <span class="${getStatusClass(
                        application.status
                    )}">
                        ${application.status || "Pending"}
                    </span>
                </td>

                <td>
                    <button
                        type="button"
                        class="action-btn view-btn"
                        onclick="viewApplication(
                            ${application.applicationId}
                        )"
                    >
                        View
                    </button>
                </td>
            `;

            tableBody.appendChild(row);
        });
}


function viewApplication(applicationId) {
    const application = getApplications().find(
        item => item.applicationId === applicationId
    );

    if (!application) {
        alert("Application not found.");
        return;
    }

    const internshipTitle =
        application.internshipTitle ||
        application.title ||
        "Internship";

    const resumeHTML = application.resumeLink
        ? `
            <a
                href="${application.resumeLink}"
                target="_blank"
                rel="noopener noreferrer"
                class="resume-link"
            >
                Open Resume
            </a>
        `
        : "Not provided";

    document.getElementById(
        "applicationDetails"
    ).innerHTML = `
        <div class="details-modal-grid">

            ${createDetail(
                "Student Name",
                application.fullName
            )}

            ${createDetail(
                "Email",
                application.email
            )}

            ${createDetail(
                "Mobile",
                application.mobile
            )}

            ${createDetail(
                "Internship",
                internshipTitle
            )}

            ${createDetail(
                "Company",
                application.company
            )}

            ${createDetail(
                "Qualification",
                application.qualification
            )}

            ${createDetail(
                "College",
                application.collegeName
            )}

            ${createDetail(
                "Course / Branch",
                application.course
            )}

            ${createDetail(
                "Current Year",
                application.currentYear
            )}

            ${createDetail(
                "Academic Score",
                application.academicScore
            )}

            ${createDetail(
                "Status",
                application.status
            )}

            <div class="modal-detail">
                <strong>Resume</strong>
                <p>${resumeHTML}</p>
            </div>

            ${createDetail(
                "Address",
                application.address,
                true
            )}

            ${createDetail(
                "Skills",
                application.skills,
                true
            )}

            ${createDetail(
                "Cover Letter",
                application.coverLetter,
                true
            )}

        </div>
    `;

    document
        .getElementById("applicationDetailsModal")
        .classList.add("show");
}


function closeApplicationDetails() {
    document
        .getElementById("applicationDetailsModal")
        .classList.remove("show");
}


function createDetail(
    label,
    value,
    fullWidth = false
) {
    return `
        <div class="modal-detail ${
            fullWidth ? "full-detail" : ""
        }">
            <strong>${label}</strong>
            <p>${value || "Not provided"}</p>
        </div>
    `;
}


function getStatusClass(status = "Pending") {
    return `status ${status.toLowerCase()}`;
}


function formatDate(dateValue) {
    if (!dateValue) {
        return "Not specified";
    }

    return new Date(dateValue).toLocaleDateString(
        "en-GB"
    );
}


function updateDashboardCounts() {
    const students = getStudents();
    const internships = getInternships();
    const applications = getApplications();

    const verified = students.filter(
        student =>
            student.verificationStatus === "Verified"
    );

    document.getElementById("totalStudents")
        .textContent = students.length;

    document.getElementById("verifiedStudents")
        .textContent = verified.length;

    document.getElementById("totalInternships")
        .textContent = internships.length;

    document.getElementById("totalApplications")
        .textContent = applications.length;
}


function logoutInstitute() {
    const confirmed = confirm(
        "Are you sure you want to logout?"
    );

    if (!confirmed) {
        return;
    }

    localStorage.removeItem("loggedInUser");

    window.location.href = "login.html";
}


studentSearch.addEventListener(
    "input",
    displayStudents
);

studentStatusFilter.addEventListener(
    "change",
    displayStudents
);

internshipSearch.addEventListener(
    "input",
    displayInternships
);

internshipStatusFilter.addEventListener(
    "change",
    displayInternships
);

applicationSearch.addEventListener(
    "input",
    displayApplications
);

applicationStatusFilter.addEventListener(
    "change",
    displayApplications
);


document.addEventListener(
    "DOMContentLoaded",
    function () {
        displayStudents();
        displayInternships();
        displayApplications();
        updateDashboardCounts();
    }
);