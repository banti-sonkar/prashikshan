const internshipPostForm =
    document.getElementById("internshipPostForm");

const industryPostingsContainer =
    document.getElementById("industryPostings");

const industryApplicationsContainer =
    document.getElementById("industryApplications");

const noPostingsMessage =
    document.getElementById("noPostingsMessage");

const noApplicationsMessage =
    document.getElementById("noApplicationsMessage");

const applicationSearch =
    document.getElementById("applicationSearch");

const statusFilter =
    document.getElementById("statusFilter");


function readStorage(key) {
    try {
        return JSON.parse(localStorage.getItem(key)) || [];
    } catch (error) {
        return [];
    }
}


function getInternships() {
    return readStorage("internships");
}


function getApplications() {
    return readStorage("applications");
}


function saveInternships(internships) {
    localStorage.setItem(
        "internships",
        JSON.stringify(internships)
    );
}


function saveApplications(applications) {
    localStorage.setItem(
        "applications",
        JSON.stringify(applications)
    );
}


internshipPostForm.addEventListener(
    "submit",
    function (event) {
        event.preventDefault();

        const companyName =
            document.getElementById("companyName")
                .value.trim();

        const title =
            document.getElementById("internshipTitle")
                .value.trim();

        const category =
            document.getElementById("internshipCategory")
                .value;

        const duration =
            document.getElementById("internshipDuration")
                .value.trim();

        const mode =
            document.getElementById("internshipMode")
                .value;

        const location =
            document.getElementById("internshipLocation")
                .value.trim();

        const stipend =
            document.getElementById("internshipStipend")
                .value.trim();

        const deadline =
            document.getElementById("applicationDeadline")
                .value;

        const skillsText =
            document.getElementById("requiredSkills")
                .value.trim();

        const eligibility =
            document.getElementById("eligibility")
                .value.trim();

        const description =
            document.getElementById("internshipDescription")
                .value.trim();

        const deadlineDate = new Date(deadline);
        const today = new Date();

        today.setHours(0, 0, 0, 0);

        if (deadlineDate < today) {
            alert(
                "Application deadline cannot be in the past."
            );
            return;
        }

        const skills = skillsText
            .split(",")
            .map(skill => skill.trim())
            .filter(skill => skill !== "");

        const internships = getInternships();

        const newInternship = {
            id: Date.now(),
            companyName,
            title,
            category,
            duration,
            mode,
            location,
            stipend,
            deadline,
            skills,
            eligibility,
            description,
            status: "Open",
            postedDate:
                new Date().toLocaleDateString("en-GB")
        };

        internships.push(newInternship);

        saveInternships(internships);

        alert("Internship posted successfully.");

        internshipPostForm.reset();

        displayIndustryPostings();
    }
);


function displayIndustryPostings() {
    const internships = getInternships();

    industryPostingsContainer.innerHTML = "";

    document.getElementById("postingCount")
        .textContent = internships.length;

    if (internships.length === 0) {
        noPostingsMessage.style.display = "block";
        return;
    }

    noPostingsMessage.style.display = "none";

    internships
        .slice()
        .reverse()
        .forEach(internship => {
            const card = document.createElement("article");

            card.className = "posting-card";

            card.innerHTML = `
                <div class="posting-top">

                    <div>
                        <h3>${internship.title}</h3>

                        <p class="company-text">
                            ${internship.companyName}
                        </p>
                    </div>

                    <span class="status">
                        ${internship.status}
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
                        📅 Deadline: ${formatDate(
                            internship.deadline
                        )}
                    </div>

                </div>

                <div class="skill-list">

                    ${internship.skills
                        .map(
                            skill =>
                                `<span class="skill">${skill}</span>`
                        )
                        .join("")}

                </div>

                <div class="card-actions">

                    <button
                        type="button"
                        class="action-btn delete-btn"
                        onclick="deleteInternship(${internship.id})"
                    >
                        Delete Posting
                    </button>

                </div>
            `;

            industryPostingsContainer.appendChild(card);
        });
}


function deleteInternship(internshipId) {
    const confirmed = confirm(
        "Are you sure you want to delete this internship?"
    );

    if (!confirmed) {
        return;
    }

    const updatedInternships =
        getInternships().filter(
            internship => internship.id !== internshipId
        );

    saveInternships(updatedInternships);

    displayIndustryPostings();
}


function displayApplications() {
    const searchValue =
        applicationSearch.value.trim().toLowerCase();

    const selectedStatus = statusFilter.value;

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
                ${application.course || ""}
                ${application.collegeName || ""}
                ${internshipTitle}
            `.toLowerCase();

            const matchesSearch =
                searchableText.includes(searchValue);

            const matchesStatus =
                selectedStatus === "all" ||
                application.status === selectedStatus;

            return matchesSearch && matchesStatus;
        });

    industryApplicationsContainer.innerHTML = "";

    document.getElementById("applicationCount")
        .textContent = applications.length;

    if (filteredApplications.length === 0) {
        noApplicationsMessage.style.display = "block";
        return;
    }

    noApplicationsMessage.style.display = "none";

    filteredApplications
        .slice()
        .reverse()
        .forEach(application => {
            const internshipTitle =
                application.internshipTitle ||
                application.title ||
                "Internship";

            const card = document.createElement("article");

            card.className = "application-card";

            card.innerHTML = `
                <div class="application-top">

                    <div>
                        <h3>${application.fullName}</h3>

                        <p class="application-subtitle">
                            ${internshipTitle}
                            • ${application.course}
                        </p>
                    </div>

                    <span class="${getStatusClass(
                        application.status
                    )}">
                        ${application.status}
                    </span>

                </div>

                <div class="details-grid">

                    <div class="detail-item">
                        📧 ${application.email}
                    </div>

                    <div class="detail-item">
                        📱 ${application.mobile}
                    </div>

                    <div class="detail-item">
                        🎓 ${application.qualification}
                    </div>

                    <div class="detail-item">
                        🏫 ${application.collegeName}
                    </div>

                    <div class="detail-item">
                        📊 ${application.academicScore}
                    </div>

                    <div class="detail-item">
                        📅 Applied: ${application.appliedDate}
                    </div>

                </div>

                <div class="card-actions">

                    <button
                        type="button"
                        class="action-btn view-btn"
                        onclick="viewApplication(
                            ${application.applicationId}
                        )"
                    >
                        View Details
                    </button>

                    <button
                        type="button"
                        class="action-btn shortlist-btn"
                        onclick="updateApplicationStatus(
                            ${application.applicationId},
                            'Shortlisted'
                        )"
                    >
                        Shortlist
                    </button>

                    <button
                        type="button"
                        class="action-btn select-btn"
                        onclick="updateApplicationStatus(
                            ${application.applicationId},
                            'Selected'
                        )"
                    >
                        Select
                    </button>

                    <button
                        type="button"
                        class="action-btn reject-btn"
                        onclick="updateApplicationStatus(
                            ${application.applicationId},
                            'Rejected'
                        )"
                    >
                        Reject
                    </button>

                </div>
            `;

            industryApplicationsContainer.appendChild(card);
        });
}


function updateApplicationStatus(
    applicationId,
    newStatus
) {
    const applications = getApplications();

    const application = applications.find(
        item => item.applicationId === applicationId
    );

    if (!application) {
        alert("Application not found.");
        return;
    }

    application.status = newStatus;

    saveApplications(applications);

    displayApplications();

    alert(
        `Application status changed to ${newStatus}.`
    );
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

    document.getElementById(
        "applicationDetails"
    ).innerHTML = `
        <div class="application-details-grid">

            ${createDetail("Full Name", application.fullName)}

            ${createDetail("Email", application.email)}

            ${createDetail("Mobile", application.mobile)}

            ${createDetail(
                "Date of Birth",
                application.dateOfBirth
            )}

            ${createDetail("Gender", application.gender)}

            ${createDetail(
                "Qualification",
                application.qualification
            )}

            ${createDetail(
                "College / University",
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
                "Internship",
                internshipTitle
            )}

            ${createDetail(
                "Application Status",
                application.status
            )}

            ${createDetail(
                "Complete Address",
                application.address,
                true
            )}

            ${createDetail(
                "Skills",
                application.skills,
                true
            )}

            <div class="application-detail detail-full">
                <strong>Resume</strong>

                <a
                    class="resume-link"
                    href="${application.resumeLink}"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Open Resume
                </a>
            </div>

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


function createDetail(label, value, fullWidth = false) {
    return `
        <div class="application-detail ${
            fullWidth ? "detail-full" : ""
        }">
            <strong>${label}</strong>
            <p>${value || "Not provided"}</p>
        </div>
    `;
}


function closeApplicationDetails() {
    document
        .getElementById("applicationDetailsModal")
        .classList.remove("show");
}


function getStatusClass(status) {
    const statusClass = status
        ? status.toLowerCase()
        : "pending";

    return `status ${statusClass}`;
}


function formatDate(dateValue) {
    if (!dateValue) {
        return "Not specified";
    }

    return new Date(dateValue).toLocaleDateString(
        "en-GB"
    );
}


function logoutIndustry() {
    const confirmed = confirm(
        "Are you sure you want to logout?"
    );

    if (!confirmed) {
        return;
    }

    localStorage.removeItem("loggedInUser");

    window.location.href = "login.html";
}


applicationSearch.addEventListener(
    "input",
    displayApplications
);

statusFilter.addEventListener(
    "change",
    displayApplications
);


document
    .getElementById("applicationDetailsModal")
    .addEventListener("click", function (event) {
        if (event.target === this) {
            closeApplicationDetails();
        }
    });


document.addEventListener(
    "DOMContentLoaded",
    function () {
        displayIndustryPostings();
        displayApplications();
    }
);