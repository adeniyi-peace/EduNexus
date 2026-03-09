# EduNexus Frontend

## Introduction

**EduNexus** is a modern Learning Management System (LMS) designed to simplify online education by providing a platform where students, instructors, and administrators can manage courses, assignments, and learning materials efficiently.

This repository contains the **frontend application** of EduNexus built using **React.js**. It provides an interactive user interface for course management, enrollment, assignments, and user authentication.

---

## Table of Contents

* Introduction
* Features
* Tech Stack
* Project Structure
* Installation
* Usage
* Configuration
* API Integration
* Troubleshooting
* Contributors
* License

---

## Features

### User Authentication

* Login and registration system
* Secure authentication
* Role-based access (Student, Instructor, Admin)

### Course Management

* View available courses
* Enroll in courses
* Access course materials

### Instructor Tools

* Create and manage courses
* Upload learning materials
* Manage assignments

### Student Tools

* Submit assignments
* Track learning progress
* Access course content

### Admin Panel

* Manage users
* Monitor courses
* System configuration

---

## Tech Stack

### Frontend

* React.js
* React Router
* Axios
* Redux (state management)
* Material UI

### Development Tools

* Node.js
* npm

---

## Project Structure

```
frontend/
│
├── public/                 # Static files
├── src/
│   ├── components/         # Reusable UI components
│   ├── pages/              # Page-level components
│   ├── services/           # API calls
│   ├── store/              # Redux store
│   ├── utils/              # Helper functions
│   ├── App.js              # Main app component
│   └── index.js            # Entry point
│
├── package.json
└── README.md
```

---

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/adeniyi-peace/EduNexus.git
```

### 2. Navigate to the Frontend Folder

```bash
cd EduNexus/frontend
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Start the Development Server

```bash
npm start
```

The app will run at:

```
http://localhost:3000
```

---

## Usage

1. Register or log in as a user.
2. Browse available courses.
3. Enroll in courses.
4. Access course materials and assignments.
5. Track progress and submit coursework.

---

## Configuration

Create a `.env` file in the frontend root directory.

Example:

```
REACT_APP_API_URL=http://127.0.0.1:8000/api
```

This variable connects the frontend to the backend API.

---

## API Integration

The frontend communicates with the backend via REST APIs.

Example endpoints:

```
POST /api/auth/login
POST /api/auth/register
GET /api/courses
POST /api/courses
```

---

## Troubleshooting

### Node Modules Error

Delete `node_modules` and reinstall dependencies.

```bash
rm -rf node_modules
npm install
```

### Port Already in Use

Run:

```bash
npm start -- --port 3001
```

---

## Contributors

* Adeniyi Peace

---

## License

This project is licensed under the **MIT License**.
