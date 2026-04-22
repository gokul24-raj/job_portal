# VELLAI ILLATHA PATTATHARI - Job Portal System

A modern, enterprise-grade Full-Stack Job Portal designed to connect students with employers seamlessly. Originally built as a React frontend, it has been transformed into a fully integrated Spring Boot web application featuring advanced security, AI-based resume matching, and social networking capabilities.

## 🚀 Tech Stack
* **Frontend**: React, Vite, TailwindCSS, TypeScript, Shadcn UI
* **Backend**: Java 17, Spring Boot 3.2.x, Spring Security, Spring Data JPA
* **Database**: MySQL 8.0+
* **Security**: BCrypt Password Hashing, JJWT (JSON Web Tokens)

## 🌟 Key Features
* **Custom Rebranding**: Fully customized UI with a premium "Golden Shield" logo and aesthetic "Dark/Light Mode" toggling.
* **Role-Based Architecture**: Distinct entities and isolated database tables for `Admin`, `Employer`, and `Student`.
* **Social Networking Integration**: Users can make social posts (like LinkedIn) with image attachments.
* **Advanced Resume Parsing**: AI-powered keyword matching between student skills and job requirements to generate tailored recommendations.
* **Comprehensive Analytics**: Dashboard for employers to track recruitment success rates and applicant metrics.
* **Secure Authentication**: Stateless API design using JWT tokens and BCrypt hashed passwords.

## 📂 Project Structure
* `src/main/java/com/jobportal/backend/`: Spring Boot controllers, services, repositories, and models.
* `src/main/resources/static/`: Compiled production-ready React frontend bundle.
* `job-connect-hub-main/`: The original Vite/React source code for UI development.

## ⚙️ Getting Started

### Prerequisites
* Java JDK 17
* Maven (`mvn`)
* Node.js (for frontend modifications)
* MySQL Server

### Database Setup
1. Open MySQL and create a database: `CREATE DATABASE job_portal_db;`
2. Ensure your MySQL credentials match those in `src/main/resources/application.properties`:
   * Username: `root`
   * Password: `020502`
   *(Update these credentials in the file if yours differ)*

### Running the Application
1. Open a terminal in the root directory.
2. Run the Spring Boot wrapper:
   ```bash
   .\mvnw spring-boot:run
   ```
3. Open your browser and navigate to `http://localhost:8080`.
   *The database tables will be automatically created on the first run via Hibernate's `ddl-auto=update`.*

### Default Accounts
The system automatically creates these demo accounts on startup:
* **Admin**: `admin@vip.dev` / `admin123`
* **Employer**: `employer@vip.dev` / `password`
* **Student**: `student@vip.dev` / `password`

## 🔒 Security Notes
* Passwords are never sent or exposed in plain text API responses (`@JsonIgnore` is enforced).
* The application utilizes stateless session management with JWT filtering (No traditional JSESSIONID cookies).
* Ensure you regularly update your JWT secret keys in a production environment.
* how to ren the project in cmd use this cmd = $env:JAVA_HOME = "C:\Program Files\Microsoft\jdk-17.0.18.8-hotspot"; .\mvnw spring-boot:run# job_portal
