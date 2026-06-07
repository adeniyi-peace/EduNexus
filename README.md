# 🎓 EduNexus

**A full-featured Learning Management System (LMS) built with Django & React Router.**

EduNexus is a modern, production-ready e-learning platform that enables instructors to create and sell courses, students to learn and earn certificates, and administrators to manage the entire platform — all backed by real-time chat, payment processing, and powerful analytics.

---

## 🏗️ Architecture

```
EduNexus/
├── backend/          # Django 6.0 REST API + WebSocket server
├── frontend/         # React Router 7 + TypeScript SPA
└── .gitignore
```

| Layer     | Stack                                                        |
| --------- | ------------------------------------------------------------ |
| Frontend  | React 19, React Router 7, TypeScript, TailwindCSS 4, DaisyUI 5, Zustand, TanStack Query, Framer Motion |
| Backend   | Django 6.0, Django REST Framework, Django Channels (Daphne), SimpleJWT |
| Database  | PostgreSQL (production) / SQLite (development)               |
| Storage   | Backblaze B2 (production) / Local filesystem (development)   |
| Payments  | Paystack                                                     |
| Auth      | JWT (HttpOnly cookies), Google OAuth, Apple Sign-In           |
| Real-time | Django Channels WebSockets (chat + notifications)            |
| Docs      | OpenAPI 3.0 via drf-spectacular (Swagger UI + Redoc)          |

---

## ✨ Key Features

### 👨‍🎓 Student Experience
- **Course Marketplace** — Browse, filter, search, and purchase courses
- **Course Player** — Video lessons, articles, quizzes with a theater-mode player
- **Progress Tracking** — Per-lesson completion with percentage tracking
- **Notes & Q&A** — Timestamped notes on video lessons, question/answer threads
- **Certificates** — Auto-generated certificates upon course completion
- **Achievements & XP** — Gamified learning with badges and experience points
- **Wishlist & Cart** — Save courses and checkout with Paystack
- **Real-time Chat** — Course group chats and direct messages with instructors
- **Notifications** — Real-time push notifications via WebSockets

### 👩‍🏫 Instructor CMS
- **Course Builder** — Drag-and-drop module/lesson builder with video uploads
- **Asset Library** — Manage uploaded resources and attachments
- **Student Management** — View enrolled students, message individuals or groups
- **Course Analytics** — Enrollment trends, revenue, completion rates, ratings
- **Review Management** — Read and reply to student reviews, flag inappropriate content

### 🛡️ Admin Dashboard
- **User Management** — View, deactivate, and manage all platform users
- **Course Approval** — Review and approve/reject instructor-submitted courses
- **Content Moderation** — Handle flagged reviews and reported content
- **Platform Finance** — Revenue overview, payment tracking, instructor payouts
- **Platform Analytics** — User growth, enrollment trends, traffic sources
- **System Settings** — Site name, maintenance mode, platform-wide configuration

---

## 🚀 Quick Start

### Prerequisites

- **Python** 3.12+
- **Node.js** 20+
- **npm** 10+

### 1. Clone the repository

```bash
git clone https://github.com/your-username/EduNexus.git
cd EduNexus
```

### 2. Backend Setup

```bash
cd backend

# Create and activate a virtual environment
python -m venv venv

# Windows
venv\Scripts\activate
# macOS/Linux
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create .env file (copy the template and adjust values)
# A template .env is already provided

# Run migrations
python manage.py migrate

# Create a superuser
python manage.py createsuperuser

# Start the development server
python manage.py runserver
```

The API will be available at `http://localhost:8000`.

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

The app will be available at `http://localhost:5173`.

---

## 📚 API Documentation

Once the backend is running, interactive API documentation is available at:

| Format      | URL                                           |
| ----------- | --------------------------------------------- |
| Swagger UI  | `http://localhost:8000/api/schema/swagger-ui/` |
| Redoc       | `http://localhost:8000/api/schema/redoc/`      |
| OpenAPI JSON| `http://localhost:8000/api/schema/`            |

---

## 🌐 Deployment

### Backend (Render)

The backend is configured for deployment on [Render](https://render.com) with:
- `render.yaml` — Render Blueprint (Daphne ASGI + PostgreSQL)
- `build.sh` — Build script (install deps, collectstatic, migrate)
- Backblaze B2 for media storage via `django-storages`
- WhiteNoise for static file serving

See [`backend/README.md`](./backend/README.md) for detailed deployment instructions.

### Frontend

The frontend includes a multi-stage `Dockerfile` for containerized deployment. It can be deployed to any platform that supports Node.js or Docker containers (Vercel, Render, Railway, etc.).

See [`frontend/README.md`](./frontend/README.md) for detailed deployment instructions.

---

## 🔑 Environment Variables

### Backend (`backend/.env`)

| Variable                 | Description                              | Required |
| ------------------------ | ---------------------------------------- | -------- |
| `SECRET_KEY`             | Django secret key                        | ✅        |
| `DEBUG`                  | Debug mode (`True`/`False`)              | ✅        |
| `ALLOWED_HOSTS`          | Comma-separated allowed hostnames        | ✅        |
| `DATABASE_URL`           | PostgreSQL connection string             | Prod     |
| `FRONTEND_URL`           | Frontend origin for CORS                 | ✅        |
| `AWS_ACCESS_KEY_ID`      | Backblaze B2 Key ID                      | Prod     |
| `AWS_SECRET_ACCESS_KEY`  | Backblaze B2 Application Key             | Prod     |
| `AWS_STORAGE_BUCKET_NAME`| Backblaze B2 Bucket Name                 | Prod     |
| `AWS_S3_ENDPOINT_URL`    | Backblaze S3-compatible endpoint         | Prod     |
| `AWS_S3_REGION_NAME`     | Backblaze region                         | Prod     |
| `PAYSTACK_PUBLIC_KEY`    | Paystack public key                      | ✅        |
| `PAYSTACK_SECRET_KEY`    | Paystack secret key                      | ✅        |
| `PAYSTACK_WEBHOOK_SECRET`| Paystack webhook secret                  | ✅        |

### Frontend (`frontend/.env`)

| Variable        | Description            | Required |
| --------------- | ---------------------- | -------- |
| `VITE_API_URL`  | Backend API base URL   | ✅        |

---

## 📁 Project Structure

```
EduNexus/
├── backend/
│   ├── authentication/     # JWT auth, social login, email verification
│   ├── backend/            # Django project settings, ASGI, URLs
│   ├── chat/               # Real-time chat (WebSocket consumers, models)
│   ├── courses/            # Core LMS — courses, modules, lessons, quizzes
│   ├── geoip/              # GeoIP database for telemetry
│   ├── payments/           # Paystack payment processing & webhooks
│   ├── user/               # User models, notifications, achievements, admin/CMS views
│   ├── build.sh            # Render deployment build script
│   ├── render.yaml         # Render Blueprint
│   ├── manage.py
│   └── requirements.txt
│
├── frontend/
│   ├── app/
│   │   ├── components/     # Reusable UI components
│   │   ├── hooks/          # Custom React hooks (auth, data fetching, WebSockets)
│   │   ├── routes/         # Page-level route components
│   │   ├── types/          # TypeScript type definitions
│   │   └── utils/          # API client, constants, helpers
│   ├── public/             # Static assets
│   ├── Dockerfile          # Multi-stage production Docker build
│   ├── package.json
│   └── vite.config.ts
│
└── .gitignore
```

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
