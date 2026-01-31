# LifeOS AI Dashboard 🧠

A beautiful, high-performance personal productivity system that combines task management, journaling, habits, and AI coaching — powered by behavioral psychology principles.

![LifeOS AI Dashboard](https://img.shields.io/badge/LifeOS-AI%20Dashboard-6366f1?style=for-the-badge)
![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react)
![Node.js](https://img.shields.io/badge/Node.js-22-339933?style=flat-square&logo=node.js)
![MongoDB](https://img.shields.io/badge/MongoDB-8-47A248?style=flat-square&logo=mongodb)
![Groq](https://img.shields.io/badge/Groq-AI-FF6B35?style=flat-square)

---

## ✨ Features

- **Task Management** — Daily/Weekly/Long-term tasks with Top 3 priority focus, auto carry-forward
- **Daily Journal** — Track what you did, what you avoided, and energy levels (1–5)
- **Habit Tracker** — Max 5 habits with streak tracking and visual progress bars
- **Focus Timer** — Pomodoro timer with session logging and duration presets
- **AI Coach** — Groq-powered strict life coach for planning, productivity analysis, and improvement suggestions
- **Analytics Dashboard** — Weekly progress charts, completion stats, and streak indicators
- **Dark UI** — Glassmorphism design with smooth animations via Framer Motion

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 18 + Vite + Tailwind CSS |
| Backend | Node.js + Express |
| Database | MongoDB (Mongoose) |
| AI | Groq API (LLaMA 3.3 70B) |
| Auth | JWT |
| UI | Framer Motion, Lucide Icons, Recharts |

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- MongoDB (local or [MongoDB Atlas](https://www.mongodb.com/atlas) free tier)
- Groq API key ([console.groq.com](https://console.groq.com))

### 1. Clone the repo

```bash
git clone https://github.com/yourusername/LifeOS.git
cd LifeOS
```

### 2. Setup Backend

```bash
cd server
npm install

# Create .env file
cp ../.env.example .env
# Edit .env with your MongoDB URI, JWT secret, and Groq API key

npm run dev
```

### 3. Setup Frontend

```bash
cd client
npm install
npm run dev
```

### 4. Open in browser

Navigate to `http://localhost:5173`

---

## 📁 Project Structure

```
LifeOS/
├── client/                 # React + Vite frontend
│   ├── src/
│   │   ├── components/     # All UI components
│   │   ├── App.jsx         # Main app with auth context
│   │   ├── main.jsx        # Entry point
│   │   └── index.css       # Tailwind + glassmorphism styles
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── package.json
├── server/                 # Express backend
│   ├── models/             # Mongoose schemas
│   ├── routes/             # API routes
│   ├── middleware/          # JWT auth middleware
│   ├── server.js           # Express app
│   └── package.json
├── .env.example
├── .gitignore
└── README.md
```

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Create account |
| POST | `/api/auth/login` | Login |
| GET | `/api/auth/me` | Get current user |
| GET/POST/PATCH/DELETE | `/api/tasks` | Task CRUD |
| GET | `/api/tasks/top` | Top 3 priority tasks |
| POST | `/api/tasks/carry-forward` | Carry forward incomplete tasks |
| GET/POST/DELETE | `/api/journals` | Journal CRUD |
| GET/POST/DELETE | `/api/habits` | Habit CRUD |
| POST | `/api/habits/:id/complete` | Complete habit for today |
| GET/POST | `/api/focus` | Focus session CRUD |
| GET | `/api/stats/dashboard` | Dashboard stats |
| GET | `/api/stats/weekly` | Weekly chart data |
| POST | `/api/ai/plan-day` | AI daily plan |
| POST | `/api/ai/analyze-productivity` | AI productivity analysis |
| POST | `/api/ai/summarize-journal` | AI journal summary |
| POST | `/api/ai/suggest-improvements` | AI improvement suggestions |

---

## 🧠 Psychology Principles

- **Top 3 Rule**: Only 3 priority tasks shown prominently to reduce decision fatigue
- **Habit Limit**: Max 5 habits to prevent overwhelm
- **Streak Tracking**: Visual streak indicators for dopamine reinforcement
- **Energy Tracking**: Daily energy levels to identify patterns
- **AI Coaching**: Strict but helpful feedback to drive accountability
- **Auto Carry-Forward**: No task gets forgotten

---

## 🚢 Deployment

| Service | Platform |
|---------|----------|
| Frontend | [Vercel](https://vercel.com) |
| Backend | [Render](https://render.com) / [Railway](https://railway.app) |
| Database | [MongoDB Atlas](https://www.mongodb.com/atlas) (free tier) |

---

## 📄 License

MIT
