// Inject dark mode styles if missing
if (!document.getElementById("darkModeStyles")) {
    const style = document.createElement("style");
    style.id = "darkModeStyles";
    style.innerHTML = `
        body.dark-mode {
            --bg-primary: #0f172a;
            --bg-secondary: #1e293b;
            --text-primary: #f8fafc;
            --text-secondary: #cbd5e1;
            --border-color: #334155;
            --accent: #38bdf8;
            background-color: var(--bg-primary) !important;
            color: var(--text-primary) !important;
        }
        body.dark-mode .navbar, body.dark-mode header {
            background-color: var(--bg-secondary) !important;
            border-bottom-color: var(--border-color) !important;
        }
        body.dark-mode section, body.dark-mode div.auth-container {
            background-color: var(--bg-primary) !important;
        }
        body.dark-mode .hero h1, body.dark-mode h1, body.dark-mode h2, body.dark-mode h3 {
            color: var(--text-primary) !important;
        }
        body.dark-mode .hero p, body.dark-mode p {
            color: var(--text-secondary) !important;
        }

        /* --- Refactored Styles (from inline) --- */
        /* Course Details Tabs */
        .course-tabs .tab-btn {
            background:none; border:none;
            color:var(--text-secondary);
            font-weight:bold; font-size:1.1rem;
            padding-bottom:10px;
            border-bottom:3px solid transparent;
            cursor:pointer;
            transition: color 0.2s, border-color 0.2s;
        }
        .course-tabs .tab-btn.active {
            color: var(--accent);
            border-bottom-color: var(--accent);
        }

        /* Q&A Discussion Item */
        .qa-item { background: rgba(0,0,0,0.03); padding: 15px; border-radius: 8px; }
        body.dark-mode .qa-item { background: var(--bg-secondary); }
        .qa-item-header strong { color: var(--accent); }
        .qa-item-header span { font-size: 0.8rem; color: #888; margin-left: 8px; }
        .qa-item p { margin-top: 8px; color: var(--text-primary); }
    `;
    document.head.appendChild(style);
}

const themeToggle =
    document.getElementById("themeToggle");

const body = document.body;

const savedTheme =
    localStorage.getItem("theme");

if (savedTheme === "dark") {
    body.classList.add("dark-mode");
    if (themeToggle) themeToggle.innerText = "☀️";
} else {
    // Light Mode (Coursera Style) is Default
    if (themeToggle) themeToggle.innerText = "🌙";
}

if (themeToggle) {
    themeToggle.addEventListener("click", () => {
        body.classList.toggle("dark-mode");
        const isDark = body.classList.contains("dark-mode");
        localStorage.setItem("theme", isDark ? "dark" : "light");
        themeToggle.innerText = isDark ? "☀️" : "🌙";
    });
}

// AI Course Recommender Widget
document.addEventListener("DOMContentLoaded", () => {
    const aiDiv = document.createElement("div");
    aiDiv.innerHTML = `
        <div id="aiChatBox" style="display:none; position:fixed; bottom:80px; right:20px; width:320px; height:420px; background:#fff; border-radius:10px; box-shadow:0 10px 25px rgba(0,0,0,0.2); z-index:1000; flex-direction:column; overflow:hidden;">
            <div style="background:#0056d2; color:#fff; padding:15px; font-weight:bold; display:flex; justify-content:space-between; align-items:center;">
                <span>🤖 AI Recommender</span>
                <span style="cursor:pointer; font-size:1.2rem;" onclick="document.getElementById('aiChatBox').style.display='none'">✖</span>
            </div>
            <div id="aiChatHistory" style="flex-grow:1; padding:15px; overflow-y:auto; font-size:0.95rem; background:#f8f9fa;">
                <p style="margin-bottom:10px;"><strong>AI:</strong> Hi! Tell me what you want to build or learn (e.g. "I want to build an iOS app" or "I want to learn AI") and I'll find the perfect course!</p>
            </div>
            <div style="padding:10px; border-top:1px solid #ddd; display:flex;">
                <input type="text" id="aiInput" placeholder="Ask AI..." style="flex-grow:1; padding:10px; border:1px solid #ddd; border-radius:5px; margin-right:5px; outline:none;">
                <button onclick="askAI()" style="background:#0056d2; color:#fff; border:none; padding:10px 15px; border-radius:5px; cursor:pointer; font-weight:bold;">Ask</button>
            </div>
        </div>
        <button onclick="document.getElementById('aiChatBox').style.display='flex'" style="position:fixed; bottom:20px; right:20px; background:#0056d2; color:#fff; border:none; width:55px; height:55px; border-radius:50%; font-size:1.5rem; cursor:pointer; box-shadow:0 4px 10px rgba(0,0,0,0.2); z-index:1000; display:flex; align-items:center; justify-content:center;">💬</button>
    `;
    document.body.appendChild(aiDiv);

    // Dynamic Navbar Updates for Logged In Users
    const user = JSON.parse(localStorage.getItem("loggedInUser"));
    const navLinks = document.querySelector(".nav-links");
    if (user && navLinks) {
        const loginItem = Array.from(navLinks.children).find(li => li.innerText.includes("Login"));
        if (loginItem) loginItem.remove();

        const profileItem = document.createElement("li");
        profileItem.innerHTML = `<a href="profile.html" style="color: #ffc107; font-weight: bold;">🔥 ${user.streak || 0} | 🏆 ${user.points || 0} | Profile</a>`;
        
        const themeToggleLi = Array.from(navLinks.children).find(li => li.querySelector('#themeToggle'));
        const insertTarget = themeToggleLi || navLinks.lastElementChild;
        navLinks.insertBefore(profileItem, insertTarget);
        
        const leaderboardItem = document.createElement("li");
        leaderboardItem.innerHTML = `<a href="leaderboard.html">Leaderboard</a>`;
        navLinks.insertBefore(leaderboardItem, profileItem);
        
        if (user.role === "ADMIN") {
            const adminItem = document.createElement("li");
            adminItem.innerHTML = `<a href="admin.html">Admin Panel</a>`;
            navLinks.insertBefore(adminItem, profileItem);
        }
    }

    // Typewriter effect for hero section
    const typewriterElement = document.getElementById("typewriter");
    if (typewriterElement) {
        const words = ["The Future of Tech", "Web Development", "Artificial Intelligence", "Cloud Computing"];
        let wordIndex = 0;
        let charIndex = words[0].length; // Start with first word fully typed
        let isDeleting = true;

        function typeWriter() {
            const currentWord = words[wordIndex];
            if (isDeleting) {
                typewriterElement.textContent = currentWord.substring(0, charIndex - 1);
                charIndex--;
            } else {
                typewriterElement.textContent = currentWord.substring(0, charIndex + 1);
                charIndex++;
            }
            let typeSpeed = isDeleting ? 40 : 80;
            if (!isDeleting && charIndex === currentWord.length) {
                typeSpeed = 2500; // Pause at end of word
                isDeleting = true;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                wordIndex = (wordIndex + 1) % words.length;
                typeSpeed = 400; // Pause before next word
            }
            setTimeout(typeWriter, typeSpeed);
        }
        setTimeout(typeWriter, 2500); // Initial delay
    }
});

window.askAI = async function() {
    const input = document.getElementById("aiInput");
    const history = document.getElementById("aiChatHistory");
    const query = input.value.toLowerCase();
    if (!query.trim()) return;
    history.innerHTML += `<p style="margin: 10px 0; text-align:right;"><span style="background:#0056d2; color:white; padding:8px 12px; border-radius:15px 15px 0 15px; display:inline-block;">${input.value}</span></p>`;
    input.value = "";
    
    try {
        const res = await fetch("https://e-learning-platform-1-qohf.onrender.com/api/courses");
        const courses = await res.json();
        
        // Filter out punctuation and find matching keywords in the course database
        const keywords = query.replace(/[^\w\s]/gi, '').split(" ").filter(k => k.length > 2);
        let matches = courses.filter(c => 
            keywords.some(k => c.title.toLowerCase().includes(k) || c.category.toLowerCase().includes(k))
        );
        
        let reply = "I couldn't find an exact match, but I recommend checking out our **Full Stack Web Dev** courses!";
        if (matches.length > 0) {
            reply = `Based on your request, I highly recommend checking out: **${matches[0].title}**! You can search for it in the Courses tab.`;
        }
        
        setTimeout(() => {
            history.innerHTML += `<p style="margin: 10px 0; text-align:left;"><span style="background:#e9ecef; color:#333; padding:8px 12px; border-radius:15px 15px 15px 0; display:inline-block; max-width:85%;">${reply}</span></p>`;
            history.scrollTop = history.scrollHeight;
        }, 600);
    } catch (e) {
        history.innerHTML += `<p style="margin: 10px 0; text-align:left;"><span style="background:#e9ecef; color:#333; padding:8px 12px; border-radius:15px 15px 15px 0; display:inline-block; max-width:85%;">I am currently offline. Ensure your backend server is running!</span></p>`;
    }
};

// Global Toast Notification System
window.showToast = function(message, type = "success") {
    let container = document.getElementById("toast-container");
    if (!container) {
        container = document.createElement("div");
        container.id = "toast-container";
        document.body.appendChild(container);
    }
    const toast = document.createElement("div");
    toast.className = `toast ${type}`;
    toast.innerHTML = `<span>${type === 'success' ? '✅' : type === 'error' ? '❌' : 'ℹ️'} ${message}</span> <span style="cursor:pointer; margin-left:15px; color:#888;" onclick="this.parentElement.remove()">✖</span>`;
    container.appendChild(toast);
    
    setTimeout(() => {
        toast.style.opacity = "0";
        setTimeout(() => toast.remove(), 300);
    }, 4000);
};