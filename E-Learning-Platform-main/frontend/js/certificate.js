const loggedInUser =
    JSON.parse(
        localStorage.getItem("loggedInUser")
    );

const completedCourse =
    JSON.parse(
        localStorage.getItem("completedCourse")
    );

const studentName =
    document.getElementById("studentName");

const courseName =
    document.getElementById("courseName");

const completionDate =
    document.getElementById("completionDate");

if (!loggedInUser) {

    alert("Please login first!");

    window.location.href = "login.html";

    throw new Error("User not authenticated. Redirecting to login...");
}

if (loggedInUser) {

    studentName.textContent =
        loggedInUser.name;
}

if (completedCourse) {

    courseName.textContent =
        completedCourse.title;
}

const today = new Date();

completionDate.textContent =
    today.toLocaleDateString();

const certIdElement = 
    document.getElementById("certificateId");

if (certIdElement) {
    certIdElement.textContent = "CERT-" + Math.random().toString(36).substr(2, 10).toUpperCase();

    if (loggedInUser && completedCourse) {
        fetch("https://e-learning-platform-1-qohf.onrender.com/api/enrollments/update", {
            method: "PUT", headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId: loggedInUser.id, courseId: completedCourse.id, certificateId: certIdElement.textContent })
        });
    }
}

function downloadCertificate() {

    window.print();
}

async function emailCertificate() {
    const btn = document.getElementById("emailCertBtn");
    btn.innerText = "Sending Email...";
    btn.disabled = true;

    const emailData = {
        email: loggedInUser.email,
        studentName: loggedInUser.name,
        courseName: completedCourse.title,
        certificateId: certIdElement ? certIdElement.textContent : "N/A"
    };

    try {
        const response = await fetch("https://e-learning-platform-1-qohf.onrender.com/api/email/certificate", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(emailData)
        });

        if (response.ok) {
            showToast("Certificate successfully sent to " + loggedInUser.email + "!", "success");
            btn.innerText = "Email Sent ✓";
            btn.style.backgroundColor = "#6c757d";
        } else {
            throw new Error("Failed to send email");
        }
    } catch (error) {
        console.error(error);
        showToast("Could not send email. Ensure backend is running and configured.", "error");
        btn.innerText = "Email to Me";
        btn.disabled = false;
    }
}

window.shareOnLinkedIn = function() {
    const shareText = `I just successfully completed the "${completedCourse.title}" course on Best Free Courses! Check out my verifiable certificate.`;
    window.open(`https://www.linkedin.com/feed/?shareActive=true&text=${encodeURIComponent(shareText)}`, "_blank");
};