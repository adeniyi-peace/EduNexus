# EduNexus — Backend

Django 6.0 REST API and WebSocket server powering the EduNexus learning management platform.

---

## 🏗️ Tech Stack

| Component       | Technology                                          |
| --------------- | --------------------------------------------------- |
| Framework       | Django 6.0, Django REST Framework 3.16              |
| Auth            | SimpleJWT (HttpOnly cookies), dj-rest-auth, allauth |
| Real-time       | Django Channels 4.3 + Daphne (ASGI)                 |
| Database        | PostgreSQL (prod) / SQLite (dev)                     |
| File Storage    | Backblaze B2 via django-storages (prod) / Local (dev)|
| Static Files    | WhiteNoise                                           |
| Payments        | Paystack (webhook-based)                             |
| API Docs        | drf-spectacular (Swagger UI + Redoc)                 |
| Env Management  | django-environ                                       |
| Telemetry       | GeoIP2, django-user-agents                           |

---

## 📁 App Structure

```
backend/
├── authentication/      # User registration, login, social auth, email verification
├── backend/             # Project settings, ASGI config, root URL conf
├── chat/                # Real-time messaging — WebSocket consumers, models, views
├── courses/             # Core LMS — courses, modules, lessons, quizzes, reviews
├── geoip/               # MaxMind GeoIP database files
├── payments/            # Paystack integration — webhooks, payment models
├── user/                # Custom user model, notifications, achievements, admin views
├── build.sh             # Render deployment build script
├── render.yaml          # Render Blueprint (infrastructure-as-code)
├── manage.py
└── requirements.txt
```

---

## 🔧 Setup

### Prerequisites
- Python 3.12+
- pip

### Installation

```bash
# Create and activate virtual environment
python -m venv venv

# Windows
venv\Scripts\activate
# macOS/Linux
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### Environment Variables

Copy the provided `.env` file and adjust values as needed:

```env
DEBUG=True
SECRET_KEY=your-secret-key
ALLOWED_HOSTS=localhost,127.0.0.1
FRONTEND_URL=http://localhost:5173

# Database (leave commented for SQLite)
# DATABASE_URL=postgres://user:password@localhost:5432/edunexus

# Paystack
PAYSTACK_PUBLIC_KEY=pk_test_xxx
PAYSTACK_SECRET_KEY=sk_test_xxx
PAYSTACK_WEBHOOK_SECRET=xxx

# Backblaze B2 (production only)
# AWS_ACCESS_KEY_ID=
# AWS_SECRET_ACCESS_KEY=
# AWS_STORAGE_BUCKET_NAME=
# AWS_S3_ENDPOINT_URL=
# AWS_S3_REGION_NAME=us-west-004
```

### Run Migrations & Create Superuser

```bash
python manage.py migrate
python manage.py createsuperuser
```

### Start Development Server

```bash
python manage.py runserver
```

> The dev server uses **Daphne** (ASGI) automatically, supporting both HTTP and WebSocket connections.

---

## 📡 API Reference

### Authentication (`/auth/`)

| Method | Endpoint                         | Description                       |
| ------ | -------------------------------- | --------------------------------- |
| POST   | `/auth/registration/`            | Register a new user               |
| POST   | `/auth/login/`                   | Login (returns JWT in cookies)    |
| POST   | `/auth/logout/`                  | Logout (blacklists refresh token) |
| POST   | `/auth/token/refresh/`           | Refresh access token              |
| GET    | `/auth/user/`                    | Get current user details          |
| POST   | `/auth/activate/<uid>/<token>/`  | Activate account via email link   |
| POST   | `/auth/resend-activation/`       | Resend activation email           |
| POST   | `/auth/password/reset/`          | Request password reset            |
| POST   | `/auth/password/reset/confirm/`  | Confirm password reset            |
| POST   | `/auth/api/auth/google/`         | Google OAuth login                |
| POST   | `/auth/api/auth/apple/`          | Apple Sign-In                     |

### Courses (`/`)

| Method   | Endpoint                                              | Description                        |
| -------- | ----------------------------------------------------- | ---------------------------------- |
| GET      | `/courses/`                                           | List all published courses         |
| POST     | `/courses/`                                           | Create a new course (instructor)   |
| GET      | `/courses/<id>/`                                      | Course detail                      |
| PUT/PATCH| `/courses/<id>/`                                      | Update a course                    |
| DELETE   | `/courses/<id>/`                                      | Delete a course                    |
| GET/POST | `/courses/<id>/modules/`                              | List/create modules for a course   |
| GET/POST | `/modules/<id>/lessons/`                              | List/create lessons for a module   |
| GET/POST | `/lessons/<id>/resources/`                            | List/create resources for a lesson |
| GET/POST | `/lessons/<id>/notes/`                                | List/create notes for a lesson     |
| GET/POST | `/lessons/<id>/quiz-questions/`                       | List/create quiz questions         |
| GET/POST | `/lessons/<id>/questions/`                            | Q&A questions for a lesson         |
| POST     | `/courses/<id>/modules/<id>/complete-lesson`           | Mark a lesson complete             |
| POST     | `/modules/<id>/reorder/`                              | Reorder lessons via drag-and-drop  |
| GET/POST | `/courses/<id>/reviews/`                              | List/create course reviews         |
| GET      | `/enrollments/`                                       | List user enrollments              |
| GET      | `/wishlists/`                                         | List user wishlist                 |
| GET      | `/certificates/`                                      | List user certificates             |
| GET      | `/categories/`                                        | List course categories             |

### Chat (`/chat/`)

| Method | Endpoint             | Description                        |
| ------ | -------------------- | ---------------------------------- |
| GET    | `/chat/rooms/`       | List group chat rooms              |
| GET    | `/chat/dms/`         | List direct message rooms          |
| POST   | `/chat/dms/start/`   | Start a new DM conversation        |
| GET    | `/chat/messages/`    | List messages for a room           |
| POST   | `/chat/upload/`      | Upload a file attachment           |
| GET    | `/chat/participants/`| List participants in a room        |

**WebSocket endpoints:**
- `ws://<host>/ws/chat/<room_id>/` — Group chat
- `ws://<host>/ws/notifications/` — Real-time notifications

### Payments (`/payments/`)

| Method | Endpoint              | Description                       |
| ------ | --------------------- | --------------------------------- |
| POST   | `/payments/webhook/`  | Paystack webhook receiver         |

### Users (`/users/`)

| Method   | Endpoint                                          | Description                             |
| -------- | ------------------------------------------------- | --------------------------------------- |
| GET      | `/users/notifications/`                           | List user notifications                 |
| PATCH    | `/users/notifications/<id>/`                      | Mark notification as read               |
| GET      | `/users/achievements/`                            | List all achievements                   |
| GET      | `/users/user-achievements/`                       | List user's earned achievements         |
| GET      | `/users/student/dashboard/`                       | Student dashboard summary               |
| GET      | `/users/instructor/dashboard/`                    | Instructor CMS dashboard                |
| GET      | `/users/instructor/analytics/`                    | Instructor-wide analytics               |
| GET      | `/users/instructor/course-analytics/<id>/`        | Per-course analytics                    |
| GET      | `/users/instructor/courses/<id>/students/`        | List students enrolled in a course      |
| POST     | `/users/instructor/courses/<id>/message-all/`     | Message all students in a course        |
| POST     | `/users/instructor/message-student/`              | Message a specific student              |
| GET      | `/users/instructor/students/`                     | Global student directory                |
| GET      | `/users/admin/dashboard/`                         | Admin dashboard summary                 |
| GET/PATCH| `/users/admin/users/`                             | Admin user management                   |
| GET      | `/users/admin/courses/`                           | Admin course listing                    |
| GET      | `/users/admin/courses/pending/`                   | Pending course approvals                |
| POST     | `/users/admin/courses/<id>/approve/`              | Approve a course                        |
| POST     | `/users/admin/courses/<id>/reject/`               | Reject a course                         |
| GET      | `/users/admin/reports/`                           | Flagged review reports                  |
| POST     | `/users/admin/reports/<id>/dismiss/`              | Dismiss a report                        |
| POST     | `/users/admin/reports/<id>/remove/`               | Remove a flagged review                 |
| GET      | `/users/admin/finance/`                           | Platform financial overview             |
| GET      | `/users/admin/analytics/`                         | Platform analytics                      |
| GET/PUT  | `/users/admin/settings/`                          | Platform settings                       |

### API Documentation

| Endpoint                         | Description           |
| -------------------------------- | --------------------- |
| `/api/schema/`                   | OpenAPI 3.0 schema    |
| `/api/schema/swagger-ui/`        | Swagger UI            |
| `/api/schema/redoc/`             | Redoc documentation   |

---

## 🗄️ Data Models

### `user` App
- **User** — Custom user model (email-based auth, roles: student/instructor/admin)
- **Notification** — Generic notification system with WebSocket delivery
- **Achievement / UserAchievement** — Gamification: badges and XP points
- **AdminSetting** — Key-value platform configuration

### `courses` App
- **Category** — Course categories
- **Course** — Core course entity (UUID PK, status workflow, ratings)
- **Module** — Course sections/chapters
- **Lesson** — Video, article, or quiz lesson types
- **Resource** — Downloadable attachments per lesson
- **QuizQuestion / QuizOption** — Quiz content
- **Enrollment** — Student-course enrollment with telemetry
- **Progress** — Lesson completion tracking
- **Review** — Student course reviews with instructor replies and flagging
- **Wishlist** — Saved courses
- **Note** — Timestamped student notes on lessons
- **CertificateConfig / Certificate** — Completion certificates
- **Question / Answer** — Lesson Q&A threads

### `chat` App
- **ChatRoom** — Course group chat rooms
- **DirectMessageRoom** — 1:1 DM conversations
- **Message** — Text, image, file, or system messages

### `payments` App
- **Payment** — Paystack transaction records

---

## 🚀 Deployment (Render)

### Option 1: Using the Blueprint

1. Push your code to GitHub
2. Go to [Render Dashboard](https://dashboard.render.com) → **Blueprints** → **New Blueprint Instance**
3. Connect your repository and point to `render.yaml`
4. Render will automatically create the web service and PostgreSQL database

### Option 2: Manual Setup

1. **Create a PostgreSQL database** on Render
2. **Create a Web Service** with:
   - **Build Command:** `./build.sh`
   - **Start Command:** `daphne -b 0.0.0.0 -p $PORT backend.asgi:application`
3. **Set environment variables** (see table in root README)

### Build Script (`build.sh`)

The build script runs on every deploy:
```bash
pip install -r requirements.txt
python manage.py collectstatic --no-input
python manage.py migrate
```

---

## 🧪 Running Tests

```bash
python manage.py test
```

---

## 📝 Notes

- The development server uses **Daphne** as the ASGI server, which is also used in production for WebSocket support.
- **JWT tokens** are stored in HttpOnly cookies (not localStorage) for XSS protection. `JWT_AUTH_SECURE` and `JWT_AUTH_SAMESITE` toggle automatically based on `DEBUG`.
- **GeoIP data** is stored in `geoip/` and used for enrollment telemetry (country detection).
- The **OpenAPI schema** is auto-generated from serializers and viewsets via drf-spectacular.
