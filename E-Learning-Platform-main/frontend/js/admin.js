const courseForm =
    document.getElementById("courseForm");

const adminCourses =
    document.getElementById("adminCourses");

let platformCourses = [];

async function fetchCourses() {

    try {

        adminCourses.innerHTML = `
            <h2>Loading Courses...</h2>
        `;

        const response =
            await fetch(
                "https://e-learning-platform-1-qohf.onrender.com/api/courses"
            );

        platformCourses =
            await response.json();

        renderAdminCourses();
    }
    catch (error) {

        adminCourses.innerHTML = `
            <h2>Failed to load courses.</h2>
        `;

        console.error(error);
    }
}

function renderAdminCourses() {

    adminCourses.innerHTML = "";

    if (platformCourses.length === 0) {

        adminCourses.innerHTML = `
            <h2>No Courses Available</h2>
        `;

        return;
    }

    platformCourses.forEach(course => {

        const courseDiv =
            document.createElement("div");

        courseDiv.classList.add(
            "admin-course-card"
        );

        courseDiv.innerHTML = `
        
            <img src="${course.thumbnail}">
            
            <div>
            
                <h2>${course.title}</h2>
                
                <p>${course.category}</p>

                <button onclick="deleteCourse(${course.id})">
                    Delete
                </button>
            
            </div>
        `;

        adminCourses.appendChild(courseDiv);
    });
}

courseForm.addEventListener(
    "submit",
    async (e) => {

        e.preventDefault();

        const newCourse = {

            title:
                document.getElementById("title").value,

            instructor:
                document.getElementById("instructor").value,

            duration:
                document.getElementById("duration").value,

            category:
                document.getElementById("category").value,

            level:
                document.getElementById("level").value,

            youtubeId:
                document.getElementById("youtubeId").value,

            thumbnail:
                document.getElementById("thumbnail").value,

            description:
                document.getElementById("description").value
        };

        try {

            await fetch(
                "https://e-learning-platform-1-qohf.onrender.com/api/courses",
                {

                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify(
                        newCourse
                    )
                }
            );

            showToast("Course Added Successfully!", "success");

            fetchCourses();

            courseForm.reset();
        }
        catch (error) {

            console.error(error);

            showToast("Failed to add course!", "error");
        }
    }
);

async function deleteCourse(id) {

    const confirmDelete =
        confirm(
            "Are you sure you want to delete this course?"
        );

    if (!confirmDelete) return;

    try {

        await fetch(
            `https://e-learning-platform-1-qohf.onrender.com/api/courses/${id}`,
            {
                method: "DELETE"
            }
        );

        fetchCourses();
    }
    catch (error) {

        console.error(error);

        alert("Failed to delete course!");
    }
}

async function insertDemoCourses() {

    const insertBtn = document.querySelector("button[onclick='insertDemoCourses()']");
    if (insertBtn) {
        insertBtn.innerText = "Inserting 200 Courses... Please Wait";
        insertBtn.style.backgroundColor = "#ffc107";
        insertBtn.style.cursor = "wait";
        insertBtn.disabled = true;
    }

    const demoCourses = [];

    // 20 Unique Core Tech Topics with verified educational YouTube IDs
    const baseTopics = [
        { name: "Python", cat: "Python", yt: "_uQrJ0TkZlc" },
        { name: "JavaScript", cat: "JavaScript", yt: "PkZNo7MFNFg" },
        { name: "React.js", cat: "React", yt: "bMknfKXIFA8" },
        { name: "Spring Boot", cat: "Spring Boot", yt: "9SGDpanrc8U" },
        { name: "Java Architecture", cat: "Java", yt: "eIrMbAQSU34" },
        { name: "Machine Learning", cat: "Machine Learning", yt: "7eh4d6sabA0" },
        { name: "Docker & Containers", cat: "DevOps", yt: "fqMOX6JJhGo" },
        { name: "System Design", cat: "System Design", yt: "bBcPnOUZ7K0" },
        { name: "Cybersecurity", cat: "Cybersecurity", yt: "U_P23SqJaDc" },
        { name: "AWS Cloud", cat: "Cloud", yt: "SOTamWNgDKc" },
        { name: "Next.js Enterprise", cat: "React", yt: "ZjAqacIC_3c" },
        { name: "Full Stack Web Dev", cat: "Full Stack", yt: "zJSY8tbf_ys" },
        { name: "Artificial Intelligence", cat: "AI", yt: "7eh4d6sabA0" },
        { name: "Data Science", cat: "Data Science", yt: "_uQrJ0TkZlc" },
        { name: "TypeScript Core", cat: "JavaScript", yt: "grEKMHGYyns" },
        { name: "SQL & Databases", cat: "Data Science", yt: "HXV3zeQKqGY" },
        { name: "Kubernetes", cat: "DevOps", yt: "fqMOX6JJhGo" },
        { name: "Ethical Hacking", cat: "Cybersecurity", yt: "U_P23SqJaDc" },
        { name: "C++ Programming", cat: "System Design", yt: "0LhBvp8qpro" },
        { name: "Go Microservices", cat: "Full Stack", yt: "YS4e4q9oBaU" }
    ];

    // 10 Professional Formats
    const courseFormats = [
        { format: "{Tech}: The Complete Beginners Guide", level: "Beginner" },
        { format: "Mastering {Tech} from Scratch", level: "Beginner" },
        { format: "{Tech} Fundamentals & Best Practices", level: "Beginner" },
        { format: "Build Real-World Projects with {Tech}", level: "Intermediate" },
        { format: "Intermediate {Tech}: Next Level Skills", level: "Intermediate" },
        { format: "{Tech} Crash Course for Developers", level: "Intermediate" },
        { format: "Advanced {Tech} Architecture", level: "Advanced" },
        { format: "{Tech} for Enterprise Applications", level: "Advanced" },
        { format: "Expert {Tech}: Under the Hood", level: "Expert" },
        { format: "{Tech} Technical Interview Prep", level: "Expert" }
    ];

    const instructors = [
        "Traversy Media", "FreeCodeCamp", "Fireship", "Programming with Mosh",
        "Amigoscode", "TechWorld with Nana", "Academind", "CS50",
        "NetworkChuck", "Hussein Nasser", "Kunal Kushwaha", "Web Dev Simplified"
    ];

    let counter = 0;

    // Generate exactly 20x10 = 200 Unique Courses
    for (const topic of baseTopics) {
        for (const fmt of courseFormats) {
            
            const title = fmt.format.replace("{Tech}", topic.name);
            const instructor = instructors[counter % instructors.length];
            const duration = `${Math.floor(Math.random() * 15) + 2} Hours`;

            demoCourses.push({
                title: title,
                instructor: instructor,
                duration: duration,
                category: topic.cat,
                level: fmt.level,
                youtubeId: topic.yt,
                thumbnail: `https://img.youtube.com/vi/${topic.yt}/maxresdefault.jpg`,
                description: `A comprehensive ${fmt.level.toLowerCase()} course covering ${topic.name}. Taught by industry expert ${instructor}, this course includes hands-on projects, modern best practices, and real-world examples to elevate your skills.`
            });
            
            counter++;
        }
    }

    try {

        for (const course of demoCourses) {

            await fetch(
                "https://e-learning-platform-1-qohf.onrender.com/api/courses",
                {

                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify(course)
                }
            );
        }

        showToast("200 Courses Inserted Successfully!", "success");

        fetchCourses();
    }
    catch (error) {

        console.error(error);

        showToast("Failed to insert demo courses!", "error");
    }
    finally {
        if (insertBtn) {
            insertBtn.innerText = "Insert 200 Demo Courses";
            insertBtn.style.backgroundColor = "#007bff";
            insertBtn.style.cursor = "pointer";
            insertBtn.disabled = false;
        }
    }
}

async function loadAdminStats() {
    try {
        const res = await fetch("https://e-learning-platform-1-qohf.onrender.com/api/admin/stats");
        if (res.ok) {
            const stats = await res.json();
            document.getElementById("statUsers").innerText = stats.totalUsers;
            document.getElementById("statCourses").innerText = stats.totalCourses;
            document.getElementById("statEnrollments").innerText = stats.totalEnrollments;
        }
    } catch (e) {}
}
loadAdminStats();
fetchCourses();