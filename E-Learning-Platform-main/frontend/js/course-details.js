const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));

const selectedCourseId =
    localStorage.getItem(
        "selectedCourseId"
    );

const videoPlayer =
    document.getElementById(
        "videoPlayer"
    );

const courseTitle =
    document.getElementById(
        "courseTitle"
    );

const courseDescription =
    document.getElementById(
        "courseDescription"
    );

const courseInstructor =
    document.getElementById(
        "courseInstructor"
    );

const courseDuration =
    document.getElementById(
        "courseDuration"
    );

const courseLevel =
    document.getElementById(
        "courseLevel"
    );

const enrollBtn =
    document.getElementById(
        "enrollBtn"
    );

let selectedCourse = null;
let currentEnrollment = null;
let ytPlayer;
let playerReady = false;

// Load YouTube IFrame API
const tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
const firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

window.onYouTubeIframeAPIReady = function() {
    playerReady = true;
    if (selectedCourse) initPlayer();
};

async function fetchCourse() {

    if (!selectedCourseId) {
        return;
    }

    try {

        const response =
            await fetch(
                `https://e-learning-platform-1-qohf.onrender.com/api/courses/${selectedCourseId}`
            );

        selectedCourse =
            await response.json();

        if (loggedInUser) {
            const enrollRes = await fetch(`https://e-learning-platform-1-qohf.onrender.com/api/enrollments/status?userId=${loggedInUser.id}&courseId=${selectedCourseId}`);
            if (enrollRes.ok) {
                currentEnrollment = await enrollRes.json();
            }
        }

        renderCourse();
    }
    catch (error) {

        console.error(error);
    }
}

function renderCourse() {

    if (playerReady && !ytPlayer) {
        initPlayer();
    }

    courseTitle.textContent =
        selectedCourse.title;

    courseDescription.textContent =
        selectedCourse.description;

    courseInstructor.textContent =
        `Instructor: ${selectedCourse.instructor}`;

    courseDuration.textContent =
        `Duration: ${selectedCourse.duration}`;

    courseLevel.textContent =
        `Level: ${selectedCourse.level}`;
        
    if (currentEnrollment) {
        enrollBtn.innerText = "Enrolled ✓";
        enrollBtn.disabled = true;
        enrollBtn.style.backgroundColor = "#6c757d";
    } else {
        enrollBtn.innerText = "Enroll Now";
        enrollBtn.disabled = false;
    }

    renderLessons();
    renderReviews();
    renderNotes();
    renderQA();
}

function initPlayer() {
    let startSeconds = 0;
    if (currentEnrollment && currentEnrollment.lastVideoTimestamp) {
        startSeconds = currentEnrollment.lastVideoTimestamp;
    }

    ytPlayer = new YT.Player('videoPlayer', {
        height: '500',
        width: '100%',
        videoId: selectedCourse.youtubeId,
        playerVars: { 'start': startSeconds },
        events: {
            'onStateChange': onPlayerStateChange
        }
    });
}

function onPlayerStateChange(event) {
    // State 1 = Playing, State 2 = Paused
    if ((event.data == YT.PlayerState.PAUSED || event.data == YT.PlayerState.ENDED) && currentEnrollment) {
        const currentTime = Math.floor(ytPlayer.getCurrentTime());
        updateEnrollmentBackend({ lastVideoTimestamp: currentTime });
        
        if (event.data == YT.PlayerState.ENDED) {
            showToast("Video finished! Check off your completed modules below.", "info");
        }
    }
}

async function updateEnrollmentBackend(updates) {
    if (!loggedInUser || !currentEnrollment) return;
    
    updates.userId = loggedInUser.id;
    updates.courseId = selectedCourse.id;

    const res = await fetch("https://e-learning-platform-1-qohf.onrender.com/api/enrollments/update", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates)
    });
    if (res.ok) {
        currentEnrollment = await res.json();
    }
}

async function renderNotes() {
    if (!loggedInUser || !selectedCourse) return;
    const notesContainer = document.getElementById("notesContainer");
    try {
        const res = await fetch(`https://e-learning-platform-1-qohf.onrender.com/api/notes/user/${loggedInUser.id}/course/${selectedCourse.id}`);
        if (res.ok) {
            const notes = await res.json();
            notesContainer.innerHTML = notes.map(n => `
                <div style="background: rgba(255,255,255,0.1); padding: 10px 15px; border-radius: 8px; display: flex; gap: 15px; align-items: center;">
                    <button onclick="ytPlayer.seekTo(${n.videoTimestamp}, true); ytPlayer.playVideo();" style="background: #38bdf8; color: black; padding: 5px 10px; border-radius: 5px; font-size: 0.9rem; border: none; cursor: pointer; font-weight: bold;">▶ ${Math.floor(n.videoTimestamp / 60)}:${(n.videoTimestamp % 60).toString().padStart(2, '0')}</button>
                    <span style="color: var(--text-primary); font-size: 1.05rem;">${n.content}</span>
                </div>
            `).join("");
        }
    } catch (e) {}
}

window.saveNote = async function() {
    if (!loggedInUser || !currentEnrollment || !ytPlayer) return showToast("Enroll and start the video to take notes!", "error");
    const content = document.getElementById("noteInput").value;
    if (!content.trim()) return;
    const time = Math.floor(ytPlayer.getCurrentTime());
    
    try {
        const res = await fetch("https://e-learning-platform-1-qohf.onrender.com/api/notes", {
            method: "POST", headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId: loggedInUser.id, courseId: selectedCourse.id, videoTimestamp: time, content: content })
        });
        if (res.ok) {
            document.getElementById("noteInput").value = "";
            showToast("Note saved successfully!", "success");
            renderNotes();
        }
    } catch (e) {}
};

window.toggleCodeEditor = function() {
    const container = document.getElementById("codeEditorContainer");
    container.style.display = container.style.display === "none" ? "block" : "none";
};

async function renderQA() {
    const qaContainer = document.getElementById("qaContainer");
    if (!qaContainer || !selectedCourse) return;
    try {
        const res = await fetch(`https://e-learning-platform-1-qohf.onrender.com/api/discussions/course/${selectedCourse.id}`);
        qaContainer.innerHTML = ""; // Clear previous content

        if (res.ok) {
            const discussions = await res.json();
            if (discussions.length === 0) {
                qaContainer.innerHTML = `<p>No questions yet. Be the first to ask!</p>`;
                return;
            }

            discussions.forEach(d => {
                const item = document.createElement('div');
                item.className = 'qa-item';

                const header = document.createElement('div');
                header.className = 'qa-item-header';
                
                const user = document.createElement('strong');
                user.textContent = d.userName;
                
                const timestamp = document.createElement('span');
                timestamp.textContent = new Date(d.timestamp).toLocaleString();
                
                header.appendChild(user);
                header.appendChild(timestamp);

                const content = document.createElement('p');
                content.textContent = d.content;

                item.appendChild(header);
                item.appendChild(content);
                
                qaContainer.appendChild(item);
            });
        }
    } catch (e) {
        qaContainer.innerHTML = `<p>Could not load discussions at this time.</p>`;
    }
}

window.postQuestion = async function() {
    if (!loggedInUser) return showToast("Login to post a question!", "error");
    const content = document.getElementById("qaInput").value;
    if (!content.trim()) return;
    try {
        const res = await fetch("https://e-learning-platform-1-qohf.onrender.com/api/discussions", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ courseId: selectedCourse.id, userId: loggedInUser.id, userName: loggedInUser.name, content: content })
        });
        if (res.ok) {
            document.getElementById("qaInput").value = "";
            showToast("Question posted to the community!", "success");
            renderQA();
        }
    } catch (e) {}
};

window.switchTab = function(tabId) {
    // Hide all tab content panels
    document.querySelectorAll('.tab-content').forEach(el => el.style.display = 'none');
    // Deactivate all tab buttons
    document.querySelectorAll('.tab-btn').forEach(el => el.classList.remove('active'));
    // Show the target tab content panel
    document.getElementById(tabId).style.display = 'block';
    // Activate the target tab button
    const activeBtn = document.querySelector(`button[onclick="switchTab('${tabId}')"]`);
    activeBtn.classList.add('active');
}

function renderLessons() {
    const lessonsContainer = document.getElementById("lessonsContainer");
    if (!lessonsContainer) return;

    const lessons = [
        `Introduction to ${selectedCourse.category}`,
        `Setting up your Environment`,
        `Core Concepts of ${selectedCourse.title}`,
        `Advanced Industry Techniques`,
        `Final Project & Portfolio Building`
    ];

    lessonsContainer.innerHTML = "";
    
    if (!currentEnrollment) {
        lessonsContainer.innerHTML = "<p style='color: #666; margin-top: 10px;'><em>Enroll in this course to unlock lesson tracking.</em></p>";
        return;
    }

    let completedArray = JSON.parse(currentEnrollment.completedLessons || "[]");

    lessons.forEach((lesson, index) => {
        const isChecked = completedArray.includes(index) ? "checked" : "";
        lessonsContainer.innerHTML += `
            <div style="display: flex; align-items: center; margin: 15px 0; padding: 15px; background: #f8f9fa; border-radius: 8px; border-left: 4px solid #0056d2;">
                <input type="checkbox" id="lesson-${index}" ${isChecked} onchange="toggleLesson(${index}, ${lessons.length})" style="margin-right: 15px; width: 22px; height: 22px; cursor: pointer;">
                <label for="lesson-${index}" style="font-size: 1.1rem; cursor: pointer; flex-grow: 1; font-weight: 500;">Module ${index + 1}: ${lesson}</label>
            </div>
        `;
    });
}

window.toggleLesson = async function(lessonIndex, totalLessons) {
    if (!currentEnrollment) return;

    let completedArray = JSON.parse(currentEnrollment.completedLessons || "[]");
    
    if (completedArray.includes(lessonIndex)) {
        completedArray = completedArray.filter(i => i !== lessonIndex);
    } else {
        completedArray.push(lessonIndex);
        
        // Gamification: Award Points!
        let earnedPoints = 10;
        const tempProgress = Math.round((completedArray.length / totalLessons) * 100);
        if (tempProgress === 100) earnedPoints += 50; // Course completion bonus
        
        let userBadges = [];
        try { userBadges = JSON.parse(loggedInUser.badges || "[]"); } catch(e) {}

        loggedInUser.points = (loggedInUser.points || 0) + earnedPoints;
        
        let newBadge = "";
        if (tempProgress === 100 && !userBadges.includes("Course Scholar")) { newBadge = "Course Scholar"; userBadges.push(newBadge); }
        if (loggedInUser.points >= 100 && !userBadges.includes("Centurion")) { newBadge = "Centurion"; userBadges.push(newBadge); }

        loggedInUser.badges = JSON.stringify(userBadges);
        localStorage.setItem("loggedInUser", JSON.stringify(loggedInUser));
        
        fetch(`https://e-learning-platform-1-qohf.onrender.com/api/users/${loggedInUser.id}`, {
            method: "PUT", headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ points: loggedInUser.points, badges: loggedInUser.badges })
        });
        
        const profileLink = document.querySelector('a[href="profile.html"]');
        if(profileLink) profileLink.innerHTML = `🏆 ${loggedInUser.points} | Profile`;
        
        if (newBadge) {
            showToast(`Earned ${earnedPoints} pts & unlocked '${newBadge}' badge!`, "success");
        } else {
            showToast(`Awesome job! You earned ${earnedPoints} points!`, "success");
        }
    }
    
    const progress = Math.round((completedArray.length / totalLessons) * 100);
    const completed = progress === 100;
    
    await updateEnrollmentBackend({
        completedLessons: JSON.stringify(completedArray),
        progress: progress,
        completed: completed
    });

    renderLessons();
}

enrollBtn.addEventListener(
    "click",
    async () => {
        if (!loggedInUser) {
            showToast("Please login to enroll!", "error");
            setTimeout(() => window.location.href = "login.html", 1500);
            return;
        }

        if (!currentEnrollment) {
            const res = await fetch("https://e-learning-platform-1-qohf.onrender.com/api/enrollments/enroll", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId: loggedInUser.id, courseId: selectedCourse.id })
            });
            
            if (res.ok) {
                currentEnrollment = await res.json();
                showToast("Successfully Enrolled! Check off the modules below to earn points!", "success");
                enrollBtn.innerText = "Enrolled ✓";
                enrollBtn.disabled = true;
                enrollBtn.style.backgroundColor = "#6c757d";
                renderLessons();
            } else {
                showToast("Could not enroll. Try again.", "error");
            }
        }
        else {
            showToast("You are already enrolled in this course.", "info");
        }
    }
);

fetchCourse();