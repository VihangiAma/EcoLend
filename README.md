# 🌍 EcoLend: Smart Hyper-Local Resource Sharing Platform

EcoLend is a full-stack web application designed to foster community sustainability by allowing neighbors to rent or lend underutilized items like tools, electronics, and kitchenware. The platform combines modern React UI, real-time chat, user authentication, file uploads, and AI-assisted item management.

---

## 🛠️ Tech Stack

* **Frontend:** React 19, Vite, Tailwind CSS, Axios
* **Backend:** Node.js, Express 5
* **Database:** MySQL via `mysql2`
* **Real-time:** Socket.io
* **AI Engine:** Groq Cloud API
* **Auth:** JWT
* **Email:** Nodemailer
* **File Uploads:** Multer

---

## 🚀 Key Features

* User registration, login, profile management, and password reset
* Item listing, browsing, and detail views
* Image uploads for user profiles and items
* Real-time chat between users via Socket.io
* AI-powered item insights through Groq Cloud API
* MySQL database connection pooling and health check endpoint

---

## ⚙️ Installation & Setup Guide

Follow these steps to get a local copy of **EcoLend** running on your machine.

### 1. Prerequisites
Ensure you have the following installed:
* **Node.js** (v18 or higher)
* **npm**
* **MySQL Server**
* **Git**

### 2. Clone the repository
```bash
git clone https://github.com/YOUR_USERNAME/EcoLend.git
cd EcoLend
```

### 3. Install dependencies
```bash
cd server
npm install
cd ../client
npm install
```

### 4. Create environment variables
Create a `.env` file in `server/` with the following values:

```env
PORT=5000
DB_HOST=localhost
DB_USER=your_mysql_user
DB_PASSWORD=your_mysql_password
DB_NAME=ecolend
JWT_SECRET=your_jwt_secret
EMAIL_USER=your_email@example.com
EMAIL_PASS=your_email_password
GROQ_API_KEY=your_groq_api_key
```

> If you use Gmail for email sending, ensure your account settings allow SMTP access and App Passwords if needed.

### 5. Initialize the database
Use `server/database-setup.sql` in MySQL Workbench or another SQL client to create the required schema and initial tables.

### 6. Run the application
Open two terminals:

Terminal 1 - start backend:
```bash
cd server
npm run dev
```

Terminal 2 - start frontend:
```bash
cd client
npm run dev
```

### 7. Access the app
* Frontend: `http://localhost:5173`
* Backend API: `http://localhost:5000`

### 8. Health check
Verify the backend is running:
```bash
curl http://localhost:5000/api/test
```

---

## 📁 Repository Structure

* `client/` - React frontend, Vite configuration, Tailwind styles
* `server/` - Express backend, routes, middleware, and database configuration
* `server/config/` - MySQL and Multer config
* `server/controllers/` - API controllers
* `server/middleware/` - Auth and request middleware
* `server/routes/` - API route definitions
* `server/uploads/` - Uploaded file storage
* `server/database-setup.sql` - Database schema setup
* `server/DIAGNOSTIC_QUERIES.sql` - diagnostic SQL queries

---

## 💡 Notes

* The backend uses `http.createServer()` so Socket.io and Express can run together.
* Frontend requests are configured to work with the backend from `http://localhost:5173`.
* Uploaded files are served from `/uploads`.

---

## 🧩 Useful commands

* `cd server && npm run dev` - run backend with nodemon
* `cd client && npm run dev` - run frontend development server
* `cd client && npm run build` - build frontend for production
* `cd client && npm run lint` - run ESLint checks

