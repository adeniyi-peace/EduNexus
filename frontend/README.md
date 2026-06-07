# EduNexus — Frontend

Modern, responsive Single Page Application (SPA) for the EduNexus learning management platform.

---

## 🏗️ Tech Stack

| Component         | Technology                                                                 |
| ----------------- | -------------------------------------------------------------------------- |
| Framework         | React 19, React Router 7 (Vite-based)                                      |
| Language          | TypeScript                                                                 |
| Styling           | Tailwind CSS v4, DaisyUI v5                                                |
| State Management  | Zustand (global UI state), React Context (Auth/Cart)                       |
| Data Fetching     | TanStack Query v5 (React Query), Axios                                     |
| UI / Components   | Framer Motion (animations), Lucide React (icons), Recharts (data viz)      |
| Drag & Drop       | @dnd-kit/core (for Course Builder)                                         |
| Payments          | @paystack/inline-js                                                        |

---

## 📁 Project Structure

```
frontend/
├── app/
│   ├── components/      # Reusable UI components
│   │   ├── admin/       # Admin-specific components
│   │   ├── cart/        # Shopping cart components
│   │   ├── chat/        # Real-time chat interfaces
│   │   ├── cms/         # Instructor/course builder components
│   │   ├── course/      # Course player and cards
│   │   ├── dashboard/   # Dashboard widgets and layouts
│   │   ├── home/        # Landing page sections
│   │   └── ui/          # Generic UI components (buttons, modals, etc.)
│   ├── hooks/           # Custom React hooks (auth, websockets, API)
│   ├── routes/          # Page-level route components (file-based routing via react-router)
│   │   ├── admin/       # Admin views
│   │   ├── auth/        # Login, register, password reset
│   │   ├── cms/         # Instructor views
│   │   ├── dashboard/   # Student dashboard views
│   │   ├── public/      # Landing, about, course marketplace
│   │   └── user/        # Shared user profile/settings
│   ├── types/           # TypeScript interfaces and types
│   ├── utils/           # API client setup, constants, helper functions
│   ├── app.css          # Global styles and Tailwind configuration
│   ├── root.tsx         # Root application layout
│   └── routes.ts        # Route configuration definitions
├── public/              # Static assets (images, icons)
├── Dockerfile           # Multi-stage production build configuration
├── package.json
└── vite.config.ts       # Vite and React Router configuration
```

---

## 🔧 Setup & Local Development

### Prerequisites
- Node.js 20+
- npm 10+

### Installation

```bash
# Install dependencies
npm install
```

### Environment Variables

Create a `.env` file in the `frontend` root directory:

```env
# The base URL of your Django backend API
VITE_API_URL=http://localhost:8000
```

### Development Server

Start the Vite development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173`.

---

## 🛠️ Key Architectural Decisions

1. **Routing Strategy**: We use React Router 7's new layout and file-based routing features (`app/routes.ts` configures layouts mapping to `app/routes/` components). The app is divided into layouts:
   - `_public.tsx`: Marketing and marketplace pages
   - `_auth.tsx`: Authentication flows
   - `_dashboard.tsx`: Student portal
   - `_cmsLayout.tsx`: Instructor portal
   - `_admin.tsx`: Admin portal

2. **API Client Strategy**: We use a centralized `axios` instance (`utils/api.client.ts`) that automatically handles attaching JWT cookies, handling 401 Unauthorized errors, and retrying requests seamlessly.

3. **Data Fetching**: TanStack Query is used for almost all remote data fetching. It provides built-in caching, revalidation, and loading/error states. 

4. **Real-time WebSockets**: Custom hooks like `useNotificationSocket.ts` connect directly to the Django Channels backend to push real-time alerts and chat messages to the UI without polling.

5. **Course Builder**: Instructors use a drag-and-drop interface powered by `@dnd-kit/core` to build course modules and lessons visually.

---

## 📦 Build & Production

### Standard Build

```bash
# Create production build
npm run build

# Preview production build locally
npm run start
```

### Docker Build (Recommended for Production)

The included `Dockerfile` uses a multi-stage build to ensure a small, optimized production image.

```bash
# Build the Docker image
docker build -t edunexus-frontend .

# Run the Docker container
docker run -p 3000:3000 edunexus-frontend
```

---

## 🚀 Deployment

The frontend can be deployed easily to any static hosting service or containerized platform.

**For Vercel / Netlify:**
- Build Command: `npm run build`
- Output Directory: `build/client`
- Install Command: `npm install`

**For Render / Railway:**
- Use the provided `Dockerfile` as the build source.

Make sure to set the `VITE_API_URL` environment variable in your production hosting environment to point to your live backend domain (e.g., `https://api.yourdomain.com`).
