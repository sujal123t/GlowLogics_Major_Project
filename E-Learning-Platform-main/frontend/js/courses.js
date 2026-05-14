const courseGrid =
    document.getElementById("courseGrid");

const searchInput =
    document.getElementById("searchInput");

const categoryFilter =
    document.getElementById("categoryFilter");

const levelFilter =
    document.getElementById("levelFilter");

const sortFilter =
    document.getElementById("sortFilter");

let platformCourses = [];
let currentDisplayedCourses = [];
let currentPage = 1;
const coursesPerPage = 12;

async function fetchCourses() {

    try {
        
        courseGrid.innerHTML = Array(coursesPerPage).fill('<div class="skeleton"></div>').join("");

        const response =
            await fetch(
                "https://e-learning-platform-1-qohf.onrender.com/api/courses"
            );

        platformCourses =
            await response.json();

        currentDisplayedCourses = platformCourses;
        currentPage = 1;
        renderPage();
    }
    catch (error) {

        console.error(error);
    }
}

function renderPage() {
    const start = (currentPage - 1) * coursesPerPage;
    const end = start + coursesPerPage;
    displayCourses(currentDisplayedCourses.slice(start, end));
    renderPaginationControls();
}

function displayCourses(coursesToShow) {

    courseGrid.innerHTML = "";

    coursesToShow.forEach(course => {

        const courseCard =
            document.createElement("div");

        courseCard.classList.add("course-card");

        courseCard.innerHTML = `
        
            <img src="${course.thumbnail}">
            
            <div class="course-content">
            
                <h2>${course.title}</h2>
                
                <p>${course.description}</p>
                
                <span>${course.duration}</span>
                
                <button onclick="openCourse(${course.id})">
                    Watch Course
                </button>
            
            </div>
        `;

        courseGrid.appendChild(courseCard);
    });
}

function renderPaginationControls() {
    const paginationContainer = document.getElementById("paginationContainer");
    if (!paginationContainer) return;
    paginationContainer.innerHTML = "";
    const totalPages = Math.ceil(currentDisplayedCourses.length / coursesPerPage);
    if (totalPages <= 1) return;

    for (let i = 1; i <= totalPages; i++) {
        const btn = document.createElement("button");
        btn.innerText = i;
        if (i === currentPage) btn.classList.add("active");
        btn.onclick = () => { 
            currentPage = i; 
            renderPage(); 
            window.scrollTo({ top: 0, behavior: 'smooth' }); 
        };
        paginationContainer.appendChild(btn);
    }
}

function openCourse(id) {

    localStorage.setItem(
        "selectedCourseId",
        id
    );

    window.location.href =
        "course-details.html";
}

function applyFilters() {
    const keyword = searchInput.value.toLowerCase();
    const category = categoryFilter.value;
    const level = levelFilter.value;
    const sort = sortFilter.value;

    let filtered = platformCourses.filter(c => {
        const matchesKeyword = !keyword || c.title.toLowerCase().includes(keyword) || (c.description && c.description.toLowerCase().includes(keyword));
        const matchesCategory = !category || c.category === category;
        const matchesLevel = !level || c.level === level;
        return matchesKeyword && matchesCategory && matchesLevel;
    });

    if (sort === "title-asc") {
        filtered.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sort === "duration-asc") {
        filtered.sort((a, b) => parseInt(a.duration) - parseInt(b.duration));
    } else if (sort === "duration-desc") {
        filtered.sort((a, b) => parseInt(b.duration) - parseInt(a.duration));
    }

    currentDisplayedCourses = filtered;
    currentPage = 1;
    renderPage();
}

searchInput.addEventListener("input", applyFilters);
categoryFilter.addEventListener("change", applyFilters);
levelFilter.addEventListener("change", applyFilters);
sortFilter.addEventListener("change", applyFilters);

fetchCourses();