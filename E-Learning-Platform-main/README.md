# 🎓 Full-Stack E-Learning Platform

A comprehensive, feature-rich online learning management system (LMS) built with a vanilla JavaScript frontend and a robust Spring Boot Java backend. This platform allows users to browse courses, track their learning progress, earn gamified rewards, and receive dynamically generated PDF certificates upon completion.

---

## ✨ Key Features

### 👨‍🎓 For Students
*   **Authentication**: Secure Sign Up, Log In, and **Google OAuth** integration.
*   **Course Catalog**: Browse courses with dynamic search, category filtering, level filtering, and sorting.
*   **Interactive Video Player**: Embedded YouTube IFrame API with state tracking. Progress is saved automatically when pausing or finishing a video.
*   **Gamification Engine**: Earn points and unlock badges (e.g., "Course Scholar", "Centurion") for completing course modules.
*   **AI Recommender**: A built-in AI chat widget that helps users find the perfect course based on their text input.
*   **Time-Stamped Video Notes**: Take notes while watching a course; clicking a note will jump the video back to that exact timestamp.
*   **Community Q&A**: Ask questions and participate in course-specific discussion boards.
*   **Integrated Code Sandbox**: Practice coding directly in the browser using the integrated OneCompiler code editor.
*   **Dynamic Certificates**: Verifiable PDF certificates are automatically generated upon course completion and emailed directly to the user.
*   **Personalized Dashboard**: Track "In Progress" and "Completed" courses, overall watch hours, and current learning streaks.
*   **Dark/Light Mode**: Fully responsive UI with a user-toggled, locally stored dark mode theme.

### 👨‍💻 For Administrators
*   **Admin Dashboard**: Monitor total users, courses, and enrollments.
*   **Course Management**: Add new courses or delete existing ones.
*   **Demo Content Generator**: Instantly populate the platform with 200 high-quality demo courses with a single click.

---

## 🛠️ Tech Stack

### Frontend
*   **HTML5 & CSS3**: Custom responsive styling with CSS variables for dynamic theming.
*   **Vanilla JavaScript**: No heavy frameworks. Pure DOM manipulation, Fetch API, and modular file structure.
*   **APIs**: YouTube IFrame Player API.

### Backend
*   **Java 17+**: Core backend programming language.
*   **Spring Boot 3.x**: RESTful API creation, dependency injection, and security.
*   **Spring Data JPA**: Database ORM and repository management.
*   **OpenPDF (Lowagie)**: Dynamic, in-memory PDF generation for enrollment invoices and completion certificates.
*   **JavaMailSender**: Automated email dispatch for alerts and certificates.
*   **Maven**: Build automation and dependency management.

---

## 📂 Project Structure

```text
ONLINE-LEARNING/
├── frontend/                 # Vanilla JS, HTML, and CSS application
│   ├── css/
│   │   └── style.css         # Global stylesheet
│   ├── js/
│   │   ├── app.js            # Global logic (Theme, AI Widget, Toasts)
│   │   ├── auth.js           # Signup, Login, and Google Auth
│   │   ├── courses.js        # Catalog search, filter, and pagination
│   │   ├── course-details.js # YouTube API, Notes, Q&A, Modules
│   │   ├── dashboard.js      # User progress tracking
│   │   ├── profile.js        # User stats, points, and settings
│   │   └── admin.js          # Admin tools and metrics
│   └── *.html                # Web pages
│
└── backend/                  # Spring Boot Java application
    ├── src/main/java/.../
    │   ├── controllers/      # REST API endpoints
    │   ├── models/           # JPA Entities (User, Course, Enrollment, etc.)
    │   ├── repositories/     # Database access interfaces
    │   └── service/          # Business logic (e.g., EmailService)
    └── pom.xml               # Maven dependencies
```

---

## 🚀 Getting Started

### 1. Start the Backend Server
Ensure you have Java installed on your machine.

```bash
# Navigate to the backend directory
cd backend

# Run the Spring Boot application using Maven Wrapper
./mvnw spring-boot:run
```
*The backend server will start on `http://localhost:8080`.*

### 2. Configure Backend Properties (Optional but Recommended)
To enable email functionality for certificates, configure your `application.properties` (or `application.yml`) in the backend:
```properties
spring.mail.host=smtp.gmail.com
spring.mail.port=587
spring.mail.username=your-email@gmail.com
spring.mail.password=your-app-password
spring.mail.properties.mail.smtp.auth=true
spring.mail.properties.mail.smtp.starttls.enable=true
```

### 3. Start the Frontend
The frontend relies on the `http://localhost:8080` backend. Because it uses ES6 modules and the Fetch API, it must be served over an HTTP server (not just by double-clicking the HTML files).

**Option A: Using VS Code**
*   Open the `/frontend` folder in VS Code.
*   Install the **Live Server** extension.
*   Right-click `index.html` and select **"Open with Live Server"**.

**Option B: Using Python or Node**
```bash
# Navigate to frontend directory
cd frontend


```
*Navigate to `http://localhost:3000` in your browser.*

---

