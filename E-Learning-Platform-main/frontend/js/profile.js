const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));

if (!loggedInUser) {
    window.location.href = "login.html";
    throw new Error("User not authenticated");
}

// Populate existing data
document.getElementById("profileEmail").value = loggedInUser.email;
document.getElementById("profileName").value = loggedInUser.name;
document.getElementById("profilePhone").value = loggedInUser.phoneNumber || "";
document.getElementById("profilePoints").textContent = `${loggedInUser.points || 0} Points`;
document.getElementById("profileStreak").textContent = `${loggedInUser.streak || 0} Days`;

const badgesContainer = document.getElementById("badgesContainer");
let userBadges = [];
try {
    userBadges = JSON.parse(loggedInUser.badges || "[]");
} catch(e) {}

if (userBadges.length > 0) {
    badgesContainer.innerHTML = userBadges.map(b => `<span style="background: #38bdf8; color: #fff; padding: 5px 12px; border-radius: 20px; font-size: 0.9rem; font-weight: bold;">🎖️ ${b}</span>`).join("");
} else {
    badgesContainer.innerHTML = "<p style='color: #888;'>No badges earned yet. Complete courses to earn them!</p>";
}

// Fetch Learning Analytics
async function fetchLearningStats() {
    try {
        const res = await fetch(`https://e-learning-platform-1-qohf.onrender.com/api/enrollments/user/${loggedInUser.id}`);
        if (res.ok) {
            const data = await res.json();
            document.getElementById("statEnrolled").textContent = data.length;
            
            const completed = data.filter(d => d.enrollment.completed).length;
            document.getElementById("statCompleted").textContent = completed;
            
            let hours = 0;
            data.forEach(d => {
                if(d.course.duration && d.enrollment.completed) {
                    hours += parseInt(d.course.duration);
                }
            });
            document.getElementById("statHours").textContent = hours;
        }
    } catch (e) {}
}
fetchLearningStats();

// Handle Settings Save
document.getElementById("profileForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const newName = document.getElementById("profileName").value;
    const newPhone = document.getElementById("profilePhone").value;

    try {
        const response = await fetch(`https://e-learning-platform-1-qohf.onrender.com/api/users/${loggedInUser.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: newName, phoneNumber: newPhone })
        });

        if (response.ok) {
            const updatedUser = await response.json();
            localStorage.setItem("loggedInUser", JSON.stringify(updatedUser));
            showToast("Profile updated successfully!", "success");
            setTimeout(() => window.location.reload(), 1000);
        } else {
            showToast("Failed to update profile.", "error");
        }
    } catch (error) {
        console.error(error);
        showToast("Server error. Ensure backend is running.", "error");
    }
});

window.logout = function() {
    localStorage.removeItem("loggedInUser");
    window.location.href = "login.html";
};