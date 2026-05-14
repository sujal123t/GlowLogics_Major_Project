const loggedInUser =
    JSON.parse(
        localStorage.getItem("loggedInUser")
    );

if (!loggedInUser) {
    window.location.href = "login.html";
    throw new Error("User not authenticated.");
}
const dashboardCourses =
    document.getElementById("dashboardCourses");

let enrolledCoursesData = [];
let currentDashTab = 'progress';

async function fetchDashboardCourses() {
    try {
        const res = await fetch(`https://e-learning-platform-1-qohf.onrender.com/api/enrollments/user/${loggedInUser.id}`);
        if (res.ok) {
            enrolledCoursesData = await res.json();
            displayDashboardCourses();
        }
    } catch (err) {
        console.error(err);
    }
}

function displayDashboardCourses() {

    if (!document.getElementById("dashboardTabs")) {
        const tabsHtml = `
            <div id="dashboardTabs" style="display: flex; gap: 30px; border-bottom: 1px solid var(--border-color); margin-bottom: 30px; overflow-x: auto;">
                <button class="dash-tab-btn active" onclick="switchDashTab('progress')" style="background:none; border:none; color:var(--accent); font-weight:bold; font-size:1.2rem; padding-bottom:10px; border-bottom:3px solid var(--accent); cursor:pointer;">In Progress</button>
                <button class="dash-tab-btn" onclick="switchDashTab('completed')" style="background:none; border:none; color:var(--text-secondary); font-weight:bold; font-size:1.2rem; padding-bottom:10px; border-bottom:3px solid transparent; cursor:pointer;">Completed</button>
            </div>
        `;
        dashboardCourses.insertAdjacentHTML('beforebegin', tabsHtml);
    }

    dashboardCourses.innerHTML = "";
    
    const filteredData = enrolledCoursesData.filter(data => currentDashTab === 'completed' ? data.enrollment.completed : !data.enrollment.completed);

    if (filteredData.length === 0) {

        dashboardCourses.innerHTML = `
            <h2 style="color: var(--text-secondary); margin-top: 20px; font-weight: 500;">No ${currentDashTab === 'completed' ? 'completed' : 'in-progress'} courses found.</h2>
        `;

        return;
    }

    filteredData.forEach(data => {
        const course = data.course;
        const enrollment = data.enrollment;

        const courseCard =
            document.createElement("div");

        courseCard.classList.add("course-card");

        courseCard.innerHTML = `
        
            <img src="${course.thumbnail}">
            
            <div class="course-content">
            
                <h2>${course.title}</h2>
                
                <p>${course.description}</p>
                
                <div class="progress-container">
                
                    <div class="progress-bar"
                         style="width:${enrollment.progress}%">
                    </div>
                
                </div>
                ${enrollment.completed ? `
<button onclick="viewCertificate(${course.id})">
    View Certificate
</button>
` : ""}
                
                <span>${enrollment.progress}% Completed</span>
                
                <button onclick="continueLearning(${course.id})">
                    Continue Learning
                </button>
            
            </div>
        `;

        dashboardCourses.appendChild(courseCard);
    });
}

window.switchDashTab = function(tab) {
    currentDashTab = tab;
    document.querySelectorAll('.dash-tab-btn').forEach(el => {
        el.style.color = 'var(--text-secondary)';
        el.style.borderBottom = '3px solid transparent';
    });
    const activeBtn = document.querySelector(`button[onclick="switchDashTab('${tab}')"]`);
    if(activeBtn) {
        activeBtn.style.color = 'var(--accent)';
        activeBtn.style.borderBottom = '3px solid var(--accent)';
    }
    displayDashboardCourses();
}

function continueLearning(id) {

    localStorage.setItem(
        "selectedCourseId",
        id
    );

    window.location.href =
        "course-details.html";
}
function viewCertificate(id) {

    const selectedData =
        enrolledCoursesData.find(
            data => data.course.id == id
        );

    localStorage.setItem(
        "completedCourse",
        JSON.stringify(selectedData.course)
    );

    window.location.href =
        "certificate.html";
}

function markCompleted(id) {
    // Deprecated: Progress is now tracked automatically via interactive course modules.
}

fetchDashboardCourses();
function logout() {

    localStorage.removeItem(
        "loggedInUser"
    );

    window.location.href =
        "login.html";
}