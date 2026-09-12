/* =====================================================
   PRASHIKSHAN INDUSTRY PORTAL
===================================================== */


/* =====================================================
   LOAD INDUSTRY USER
===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        const user =
            JSON.parse(
                localStorage.getItem(
                    "loggedInUser"
                )
            );


        const nameElement =
            document.getElementById(
                "industryUserName"
            );


        if (
            user &&
            nameElement
        ) {

            nameElement.textContent =
                user.fullName ||
                user.companyName ||
                "Industry";

        }


        updateStatistics();

    }
);



/* =====================================================
   LOGOUT
===================================================== */

function logoutUser() {

    localStorage.removeItem(
        "loggedInUser"
    );

    localStorage.removeItem(
        "isLoggedIn"
    );

    localStorage.removeItem(
        "registeredEmail"
    );

    localStorage.removeItem(
        "registeredRole"
    );


    window.location.href =
        "login.html";

}



/* =====================================================
   INTERNSHIP DATA
===================================================== */

const internshipData = [

    {

        id: 1,

        title:
            "Software Development Intern",

        company:
            "Tata Consultancy Services",

        category:
            "Software Development",

        type:
            "Paid",

        duration:
            "6 Months",

        location:
            "India",

        qualification:
            "B.Tech CSE / IT",

        minimumCGPA:
            6.0,

        skills: [
            "Java",
            "Python",
            "DSA",
            "SQL"
        ]

    },


    {

        id: 2,

        title:
            "Web Development Intern",

        company:
            "Infosys",

        category:
            "Web Development",

        type:
            "Unpaid",

        duration:
            "3 Months",

        location:
            "India",

        qualification:
            "B.Tech / BCA",

        minimumCGPA:
            6.0,

        skills: [
            "HTML",
            "CSS",
            "JavaScript"
        ]

    },


    {

        id: 3,

        title:
            "AI / ML Intern",

        company:
            "Technology Partner",

        category:
            "AI / ML",

        type:
            "Paid",

        duration:
            "4 Months",

        location:
            "India / Remote",

        qualification:
            "B.Tech CSE / AIML",

        minimumCGPA:
            7.0,

        skills: [
            "Python",
            "Machine Learning",
            "SQL"
        ]

    }

];



/* =====================================================
   VIEW INTERNSHIP
===================================================== */

function viewInternship(id) {

    const internship =
        internshipData.find(
            function (item) {

                return item.id === id;

            }
        );


    if (!internship) {

        return;

    }


    alert(

        "INTERNSHIP OPPORTUNITY\n\n" +

        "Position: " +
        internship.title +

        "\nCompany: " +
        internship.company +

        "\nCategory: " +
        internship.category +

        "\nType: " +
        internship.type +

        "\nDuration: " +
        internship.duration +

        "\nLocation: " +
        internship.location +

        "\nQualification: " +
        internship.qualification +

        "\nMinimum CGPA: " +
        internship.minimumCGPA +

        "\nRequired Skills: " +
        internship.skills.join(", ") +

        "\n\nStudents can apply from the Prashikshan Student Portal."

    );

}



/* =====================================================
   OPEN INTERNSHIP FORM
===================================================== */

function openInternshipForm() {

    const modal =
        document.getElementById(
            "internshipModal"
        );


    modal.classList.add(
        "active"
    );


    document.body.style.overflow =
        "hidden";

}



/* =====================================================
   CLOSE INTERNSHIP FORM
===================================================== */

function closeInternshipForm() {

    const modal =
        document.getElementById(
            "internshipModal"
        );


    modal.classList.remove(
        "active"
    );


    document.body.style.overflow =
        "auto";

}



/* =====================================================
   SUBMIT INTERNSHIP
===================================================== */

function submitInternship(event) {

    event.preventDefault();


    const internship = {

        id:
            Date.now(),

        title:
            document.getElementById(
                "jobTitle"
            ).value,

        category:
            document.getElementById(
                "jobCategory"
            ).value,

        type:
            document.getElementById(
                "jobType"
            ).value,

        duration:
            document.getElementById(
                "jobDuration"
            ).value,

        minimumCGPA:
            document.getElementById(
                "minimumCGPA"
            ).value,

        eligibleBranch:
            document.getElementById(
                "eligibleBranch"
            ).value,

        skills:
            document.getElementById(
                "requiredSkills"
            ).value,

        location:
            document.getElementById(
                "jobLocation"
            ).value,

        description:
            document.getElementById(
                "jobDescription"
            ).value,

        createdAt:
            new Date().toISOString()

    };


    const internships =
        JSON.parse(
            localStorage.getItem(
                "industryInternships"
            )
        ) || [];


    internships.push(
        internship
    );


    localStorage.setItem(

        "industryInternships",

        JSON.stringify(
            internships
        )

    );


    alert(
        "Internship opportunity published successfully!"
    );


    document
        .getElementById(
            "internshipForm"
        )
        .reset();


    closeInternshipForm();


    updateStatistics();

}



/* =====================================================
   SHORTLIST STUDENT
===================================================== */

function shortlistStudent(
    button,
    studentName
) {

    const application =
        button.closest(
            ".student-application"
        );


    if (!application) {

        return;

    }


    const status =
        application.querySelector(
            ".status"
        );


    status.textContent =
        "Shortlisted";


    status.className =
        "status shortlisted";


    application.dataset.status =
        "shortlisted";


    button.textContent =
        "Shortlisted";


    button.disabled =
        true;


    updateStatistics();


    alert(

        studentName +
        " has been shortlisted for the next round."

    );

}



/* =====================================================
   REJECT STUDENT
===================================================== */

function rejectStudent(button) {

    const application =
        button.closest(
            ".student-application"
        );


    if (!application) {

        return;

    }


    const studentName =
        application
            .querySelector(
                "h3"
            )
            .textContent;


    const status =
        application.querySelector(
            ".status"
        );


    status.textContent =
        "Rejected";


    status.className =
        "status rejected";


    application.dataset.status =
        "rejected";


    button.disabled =
        true;


    alert(

        studentName +
        " application has been rejected."

    );

}



/* =====================================================
   FILTER APPLICATIONS
===================================================== */

function filterApplications() {

    const filter =
        document.getElementById(
            "applicationFilter"
        ).value;


    const applications =
        document.querySelectorAll(
            ".student-application"
        );


    applications.forEach(
        function (application) {

            if (
                filter === "all" ||
                application.dataset.status === filter
            ) {

                application.style.display =
                    "flex";

            } else {

                application.style.display =
                    "none";

            }

        }
    );

}



/* =====================================================
   SCHEDULE EXAM
===================================================== */

function scheduleExam(
    studentName
) {

    const examDate =
        prompt(
            "Enter examination date:"
        );


    if (!examDate) {

        return;

    }


    const examTime =
        prompt(
            "Enter examination time:"
        );


    if (!examTime) {

        return;

    }


    const exam = {

        student:
            studentName,

        date:
            examDate,

        time:
            examTime,

        status:
            "Scheduled"

    };


    const exams =
        JSON.parse(
            localStorage.getItem(
                "scheduledExams"
            )
        ) || [];


    exams.push(exam);


    localStorage.setItem(

        "scheduledExams",

        JSON.stringify(
            exams
        )

    );


    alert(

        "Technical examination scheduled.\n\n" +

        "Student: " +
        studentName +

        "\nDate: " +
        examDate +

        "\nTime: " +
        examTime

    );

}



/* =====================================================
   SELECT CANDIDATE
===================================================== */

function selectCandidate(
    studentName
) {

    const confirmSelection =
        confirm(

            "Select " +
            studentName +
            " for the internship?"

        );


    if (!confirmSelection) {

        return;

    }


    alert(

        studentName +
        " has been selected.\n\n" +

        "Please define the paid or unpaid internship terms."

    );


    document
        .querySelector(
            ".hiring-section"
        )
        .scrollIntoView({
            behavior: "smooth"
        });

}



/* =====================================================
   FINAL HIRING
===================================================== */

function confirmHiring() {

    const type =
        document.getElementById(
            "internshipPayment"
        ).value;


    const stipend =
        document.getElementById(
            "stipend"
        ).value;


    const duration =
        document.getElementById(
            "internshipDuration"
        ).value;


    if (!type) {

        alert(
            "Please select Paid or Unpaid internship."
        );

        return;

    }


    if (
        type === "paid" &&
        !stipend
    ) {

        alert(
            "Please enter the stipend amount."
        );

        return;

    }


    const offer = {

        student:
            "Neha Sharma",

        type:
            type,

        stipend:
            type === "paid"
                ? stipend
                : 0,

        duration:
            duration,

        status:
            "Selected",

        createdAt:
            new Date().toISOString()

    };


    localStorage.setItem(

        "latestInternshipOffer",

        JSON.stringify(
            offer
        )

    );


    if (type === "paid") {

        alert(

            "Candidate hired successfully!\n\n" +

            "Internship: Paid\n" +

            "Stipend: ₹" +
            stipend +
            " / month\n" +

            "Duration: " +
            duration +
            " Months"

        );

    } else {

        alert(

            "Candidate hired successfully!\n\n" +

            "Internship: Unpaid\n" +

            "Duration: " +
            duration +
            " Months"

        );

    }

}



/* =====================================================
   INSTITUTE COLLABORATION
===================================================== */

function sendInstituteRequest(
    institute
) {

    const message =
        prompt(

            "Enter your collaboration proposal for " +
            institute +
            ":"

        );


    if (!message) {

        return;

    }


    const user =
        JSON.parse(
            localStorage.getItem(
                "loggedInUser"
            )
        );


    const request = {

        institute:
            institute,

        industry:
            user?.fullName ||
            user?.companyName ||
            "Industry",

        message:
            message,

        status:
            "Pending",

        createdAt:
            new Date().toISOString()

    };


    const requests =
        JSON.parse(
            localStorage.getItem(
                "instituteCollaborationRequests"
            )
        ) || [];


    requests.push(
        request
    );


    localStorage.setItem(

        "instituteCollaborationRequests",

        JSON.stringify(
            requests
        )

    );


    alert(

        "Collaboration request sent successfully to " +
        institute +
        "."

    );

}



/* =====================================================
   UPDATE STATISTICS
===================================================== */

function updateStatistics() {

    const internships =
        JSON.parse(
            localStorage.getItem(
                "industryInternships"
            )
        ) || [];


    const internshipCount =
        document.getElementById(
            "internshipCount"
        );


    if (internshipCount) {

        internshipCount.textContent =
            3 + internships.length;

    }


    const applications =
        document.querySelectorAll(
            ".student-application"
        );


    const applicationCount =
        document.getElementById(
            "applicationCount"
        );


    if (applicationCount) {

        applicationCount.textContent =
            applications.length;

    }


    const shortlisted =
        document.querySelectorAll(
            '.student-application[data-status="shortlisted"]'
        );


    const shortlistedCount =
        document.getElementById(
            "shortlistedCount"
        );


    if (shortlistedCount) {

        shortlistedCount.textContent =
            shortlisted.length;

    }

}



/* =====================================================
   CLOSE MODAL WHEN CLICKING OUTSIDE
===================================================== */

document.addEventListener(
    "click",
    function (event) {

        const modal =
            document.getElementById(
                "internshipModal"
            );


        if (
            event.target === modal
        ) {

            closeInternshipForm();

        }

    }
);