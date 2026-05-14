console.log("🚀 LATEST AUTH.JS LOADED: Verification Code 999");

const signupForm =
    document.getElementById("signupForm");

const loginForm =
    document.getElementById("loginForm");

if (signupForm) {

    signupForm.addEventListener(
        "submit",
        async (e) => {

            e.preventDefault();

            const name =
                document.getElementById("signupName").value;

            const email =
                document.getElementById("signupEmail").value;
                
            const phoneNumber =
                document.getElementById("signupPhone").value;

            const password =
                document.getElementById("signupPassword").value;

            try {
                const response = await fetch("https://e-learning-platform-1-qohf.onrender.com/api/users/signup", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ name, email, phoneNumber, password })
                });
                
                if (response.ok) {
                    showToast("Signup Successful! Redirecting to login...", "success");
                    setTimeout(() => window.location.href = "login.html", 1500);
                } else {
                    try {
                        const err = await response.json();
                        showToast(err.message || "Signup failed!", "error");
                    } catch (parseError) {
                        // If it fails to parse JSON, Render is returning an HTML error page (server is asleep/starting)
                        showToast("Server is waking up. Please wait 60 seconds and try again.", "error");
                    }
                }
            } catch (error) {
                console.error(error);
                showToast("Network error: " + error.message, "error");
            }
        }
    );
}

if (loginForm) {

    loginForm.addEventListener(
        "submit",
        async (e) => {

            e.preventDefault();

            const email =
                document.getElementById("loginEmail").value;

            const password =
                document.getElementById("loginPassword").value;

            try {
                const response = await fetch("https://e-learning-platform-1-qohf.onrender.com/api/users/login", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email, password })
                });
                
                if (response.ok) {
                    const user = await response.json();
                    localStorage.setItem("loggedInUser", JSON.stringify(user));
                    showToast("Login Successful!", "success");
                    setTimeout(() => window.location.href = "dashboard.html", 1000);
                } else {
                    try {
                        const err = await response.json();
                        showToast(err.message || "Invalid Credentials!", "error");
                    } catch (parseError) {
                        showToast("Server is waking up. Please wait 60 seconds and try again.", "error");
                    }
                }
            } catch (error) {
                console.error(error);
                showToast("Network error: " + error.message, "error");
            }
        }
    );
}

// Google Auth Callback
window.handleGoogleLogin = async function(response) {
    // Decode the Google JWT Token
    const responsePayload = decodeJwtResponse(response.credential);
    
    const user = {
        name: responsePayload.name,
        email: responsePayload.email,
        password: "" // No password needed for Google Auth
    };

    try {
        const apiResponse = await fetch("https://e-learning-platform-1-qohf.onrender.com/api/users/google", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(user)
        });
        
        if (apiResponse.ok) {
            const savedUser = await apiResponse.json();
            localStorage.setItem("loggedInUser", JSON.stringify(savedUser));
            showToast("Google Login Successful! Welcome " + savedUser.name, "success");
            setTimeout(() => window.location.href = "dashboard.html", 1000);
        }
    } catch (error) {
        console.error(error);
        showToast("Google login failed at server.", "error");
    }
};

function decodeJwtResponse(token) {
    let base64Url = token.split('.')[1];
    let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    let jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}