//Student-created sample records (6 internships)
const internships = [
    {
        id: 1,
        title: "Cloud DevOps Intern",
        company: "TechCloud Solutions",
        type: "Paid",
        minSemester: 5,
        requiredSkill: "Docker",
        duration: "3 Months"
    },
    {
        id: 2,
        title: "Frontend Developer Intern",
        company: "WebCraft Studio",
        type: "Paid",
        minSemester: 4,
        requiredSkill: "React",
        duration: "2 Months"
    },
    {
        id: 3,
        title: "Python Backend Intern",
        company: "DataCore Systems",
        type: "Unpaid",
        minSemester: 3,
        requiredSkill: "Python",
        duration: "3 Months"
    },
    {
        id: 4,
        title: "Full Stack Engineering Intern",
        company: "NextGen Apps",
        type: "Paid",
        minSemester: 6,
        requiredSkill: "JavaScript",
        duration: "6 Months"
    },
    {
        id: 5,
        title: "Cloud Infrastructure Assistant",
        company: "ScaleGrid Inc.",
        type: "Paid",
        minSemester: 5,
        requiredSkill: "Linux",
        duration: "3 Months"
    },
    {
        id: 6,
        title: "UI/UX & Web Design Intern",
        company: "CreativePulse",
        type: "Unpaid",
        minSemester: 2,
        requiredSkill: "HTML",
        duration: "2 Months"
    }
];

//DOM Elements
const navTabs = document.querySelectorAll(".nav-tab");
const tabPanels = document.querySelectorAll(".tab-panel");
const internshipGrid = document.getElementById("internship-grid");
const searchInput = document.getElementById("search-input");
const filterType = document.getElementById("filter-type");
const noResults = document.getElementById("no-results");
const selectInternship = document.getElementById("select-internship");
const applicantPosition = document.getElementById("applicant-position");
const eligibilityForm = document.getElementById("eligibility-form");
const eligibilityResult = document.getElementById("eligibility-result");
const applicationForm = document.getElementById("application-form");
const formFeedback = document.getElementById("form-feedback");

//Tab Switching Logic
function switchTab(targetId) {
    navTabs.forEach(tab => {
        const isTarget = tab.dataset.target === targetId;
        tab.classList.toggle("active", isTarget);
        tab.setAttribute("aria-selected", isTarget);
    });

    tabPanels.forEach(panel => {
        if (panel.id === targetId) {
            panel.classList.remove("hidden");
        } else {
            panel.classList.add("hidden");
        }
    });
}

navTabs.forEach(tab => {
    tab.addEventListener("click", () => {
        switchTab(tab.dataset.target);
    });
});

//Helper:Jump directly to Application Tab with role pre-selected
function applyForRole(title) {
    applicantPosition.value = title;
    switchTab("apply-section");
}

//Render Internships to DOM
function renderInternships(items) {
    internshipGrid.innerHTML = "";
    if (items.length === 0) {
        noResults.classList.remove("hidden");
        return;
    }
    noResults.classList.add("hidden");

    items.forEach(item => {
        const card = document.createElement("article");
        card.className = "internship-card";
        card.innerHTML = `
            <div>
                <h4>${item.title}</h4>
                <p><strong>Company:</strong> ${item.company}</p>
                <p><strong>Requirement:</strong> Sem ${item.minSemester}+ &amp; ${item.requiredSkill}</p>
                <p><strong>Duration:</strong> ${item.duration}</p>
            </div>
            <div class="card-footer-actions">
                <span class="badge">${item.type}</span>
                <button type="button" class="quick-apply-link" data-role="${item.title}">Apply Now &rarr;</button>
            </div>
        `;
        internshipGrid.appendChild(card);
    });

    //Attach click listeners to the newly rendered "Apply Now" buttons
    document.querySelectorAll(".quick-apply-link").forEach(btn => {
        btn.addEventListener("click", () => applyForRole(btn.dataset.role));
    });
}

//Populate Dropdowns dynamically
function populateDropdowns() {
    internships.forEach(item => {
        const opt1 = document.createElement("option");
        opt1.value = item.id;
        opt1.textContent = `${item.title} at ${item.company}`;
        selectInternship.appendChild(opt1);

        const opt2 = document.createElement("option");
        opt2.value = item.title;
        opt2.textContent = `${item.title} (${item.company})`;
        applicantPosition.appendChild(opt2);
    });
}

//Filter Functionality (Interaction 2)
function filterListings() {
    const query = searchInput.value.toLowerCase();
    const typeVal = filterType.value;

    const filtered = internships.filter(item => {
        const matchesQuery = item.title.toLowerCase().includes(query) || 
                             item.company.toLowerCase().includes(query) || 
                             item.requiredSkill.toLowerCase().includes(query);
        const matchesType = typeVal === "all" || item.type === typeVal;
        return matchesQuery && matchesType;
    });

    renderInternships(filtered);
}

searchInput.addEventListener("input", filterListings);
filterType.addEventListener("change", filterListings);

//Eligibility Checker Logic (Interaction 3)
eligibilityForm.addEventListener("submit", function(e) {
    e.preventDefault();
    const selectedId = parseInt(selectInternship.value);
    const semester = parseInt(document.getElementById("student-semester").value);
    const skill = document.getElementById("student-skill").value.trim().toLowerCase();

    const targetInternship = internships.find(i => i.id === selectedId);

    if (!targetInternship) {
        showFeedback(eligibilityResult, "Please select a valid internship.", false);
        return;
    }

    const semesterValid = semester >= targetInternship.minSemester;
    const skillValid = skill.includes(targetInternship.requiredSkill.toLowerCase());

    if (semesterValid && skillValid) {
        showFeedback(
            eligibilityResult,
            `Congratulations! You are eligible for the ${targetInternship.title} position at ${targetInternship.company}. Switch to the Student Application tab to apply.`,
            true
        );
    } else {
        const reason = [];
        if (!semesterValid) reason.push(`requires at least Semester ${targetInternship.minSemester} (you entered ${semester})`);
        if (!skillValid) reason.push(`requires skill "${targetInternship.requiredSkill}"`);
        showFeedback(
            eligibilityResult,
            `Not eligible right now: This position ${reason.join(" and ")}.`,
            false
        );
    }
});

//Application Form Submission Handling with Validation
applicationForm.addEventListener("submit", function(e) {
    e.preventDefault();
    const name = document.getElementById("applicant-name").value.trim();
    const email = document.getElementById("applicant-email").value.trim();
    const position = applicantPosition.value;

    if (!name || !email || !position) {
        showFeedback(formFeedback, "Please fill out all required fields correctly.", false);
        return;
    }

    showFeedback(
        formFeedback,
        `Application successfully submitted for ${position}! A confirmation has been sent to ${email}.`,
        true
    );
    applicationForm.reset();
});

function showFeedback(el, message, isSuccess) {
    el.classList.remove("hidden");
    el.className = `result-box ${isSuccess ? "success" : "error"}`;
    el.textContent = message;
}

//Initial Page Load
renderInternships(internships);
populateDropdowns();