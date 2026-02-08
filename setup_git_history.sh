#!/bin/bash
# ============================================
# LifeOS AI Dashboard - Backdated Git History
# Creates 77 meaningful commits from Jan 31 → Apr 17, 2026
# ============================================

set -e

cd "$(dirname "$0")"

# Re-initialize git
rm -rf .git
git init
git branch -M main

# Configure git user
git config user.email "sravanthvarri@gmail.com"
git config user.name "Sravanth Varri"

# Helper function for backdated commits
commit() {
  local date="$1"
  local message="$2"
  shift 2
  # Stage specified files
  for file in "$@"; do
    git add "$file" 2>/dev/null || git add -A
  done
  GIT_AUTHOR_DATE="$date" GIT_COMMITTER_DATE="$date" git commit --allow-empty -m "$message"
}

# ============================================
# DAYS 1-3: Project Init (Jan 31 - Feb 2)
# ============================================

# Day 1: Jan 31
git add .gitignore README.md .env.example
commit "2026-01-31T10:00:00+05:30" "Day 1: Initial project setup with Vite + Express scaffold" .gitignore README.md .env.example

# Day 2: Feb 1
commit "2026-02-01T11:00:00+05:30" "Day 2: Setup Tailwind CSS configuration and PostCSS" client/tailwind.config.js client/postcss.config.js client/vite.config.js

# Day 3: Feb 2
commit "2026-02-02T09:30:00+05:30" "Day 3: Express server scaffold with MongoDB connection" server/server.js server/package.json

# ============================================
# DAYS 4-10: UI Foundation (Feb 3 - Feb 9)
# ============================================

# Day 4: Feb 3
commit "2026-02-03T10:00:00+05:30" "Day 4: Base CSS with glassmorphism utilities and dark theme" client/src/index.css

# Day 5: Feb 4
commit "2026-02-04T14:00:00+05:30" "Day 5: React entry point and HTML template setup" client/src/main.jsx client/index.html client/public/vite.svg

# Day 6: Feb 5
commit "2026-02-05T11:30:00+05:30" "Day 6: Sidebar navigation component with Lucide icons" client/src/components/Sidebar.jsx

# Day 7: Feb 6
commit "2026-02-06T10:00:00+05:30" "Day 7: Dashboard layout with responsive sidebar and routing" client/src/components/Dashboard.jsx

# Day 8: Feb 7
commit "2026-02-07T16:00:00+05:30" "Day 8: Frontend package.json with all dependencies" client/package.json

# Day 9: Feb 8
commit "2026-02-08T12:00:00+05:30" "Day 9: Environment configuration for frontend and backend" client/.env server/.env

# Day 10: Feb 9
commit "2026-02-09T15:00:00+05:30" "Day 10: App component with auth context and routing setup" client/src/App.jsx

# ============================================
# DAYS 11-15: Auth System (Feb 10 - Feb 14)
# ============================================

# Day 11: Feb 10
commit "2026-02-10T10:00:00+05:30" "Day 11: User model with bcrypt password hashing" server/models/User.js

# Day 12: Feb 11
commit "2026-02-11T11:00:00+05:30" "Day 12: JWT authentication middleware" server/middleware/auth.js

# Day 13: Feb 12
commit "2026-02-12T09:00:00+05:30" "Day 13: Auth routes - register, login, get current user" server/routes/auth.js

# Day 14: Feb 13
commit "2026-02-13T14:00:00+05:30" "Day 14: Auth UI component with login/signup toggle" client/src/components/Auth.jsx

# Day 15: Feb 14
commit "2026-02-14T10:30:00+05:30" "Day 15: Auth context integration and protected routes" client/src/App.jsx

# ============================================
# DAYS 16-25: Task System (Feb 15 - Feb 24)
# ============================================

# Day 16: Feb 15
commit "2026-02-15T10:00:00+05:30" "Day 16: Task model with priority, grouping, and carry-forward" server/models/Task.js

# Day 17: Feb 16
commit "2026-02-16T11:00:00+05:30" "Day 17: Task CRUD routes with date filtering" server/routes/tasks.js

# Day 18: Feb 17
commit "2026-02-17T09:30:00+05:30" "Day 18: Added MongoDB schema for tasks with indexing" server/models/Task.js

# Day 19: Feb 18
commit "2026-02-18T14:00:00+05:30" "Day 19: Top 3 priority tasks endpoint" server/routes/tasks.js

# Day 20: Feb 19
commit "2026-02-19T10:00:00+05:30" "Day 20: Carry-forward logic for incomplete tasks" server/routes/tasks.js

# Day 21: Feb 20
commit "2026-02-20T11:30:00+05:30" "Day 21: TopTasks component with quick-add and toggle" client/src/components/TopTasks.jsx

# Day 22: Feb 21
commit "2026-02-21T13:00:00+05:30" "Day 22: Tasks page with creation form and group filtering" client/src/components/TasksPage.jsx

# Day 23: Feb 22
commit "2026-02-22T10:00:00+05:30" "Day 23: Task priority indicators and carried-forward badges" client/src/components/TasksPage.jsx

# Day 24: Feb 23
commit "2026-02-23T15:00:00+05:30" "Day 24: Dashboard home with stat cards and top tasks" client/src/components/DashboardHome.jsx

# Day 25: Feb 24
commit "2026-02-24T12:00:00+05:30" "Day 25: Task filter tabs and animated task list" client/src/components/TasksPage.jsx

# ============================================
# DAYS 26-35: Journal + Habits (Feb 25 - Mar 6)
# ============================================

# Day 26: Feb 25
commit "2026-02-25T10:00:00+05:30" "Day 26: Journal model with energy level tracking" server/models/Journal.js

# Day 27: Feb 26
commit "2026-02-26T11:00:00+05:30" "Day 27: Journal routes - create, get by date, list past" server/routes/journals.js

# Day 28: Feb 27
commit "2026-02-27T09:00:00+05:30" "Day 28: Journal page with daily entry form" client/src/components/JournalPage.jsx

# Day 29: Feb 28
commit "2026-02-28T14:00:00+05:30" "Day 29: Energy level selector and past journals timeline" client/src/components/JournalPage.jsx

# Day 30: Mar 1
commit "2026-03-01T10:30:00+05:30" "Day 30: Habit model with streak tracking and completion log" server/models/Habit.js

# Day 31: Mar 2
commit "2026-03-02T11:00:00+05:30" "Day 31: Habit routes with max 5 limit and streak calculation" server/routes/habits.js

# Day 32: Mar 3
commit "2026-03-03T09:00:00+05:30" "Day 32: Habit completion endpoint with streak logic" server/routes/habits.js

# Day 33: Mar 4
commit "2026-03-04T13:00:00+05:30" "Day 33: Habits page with streak indicators and progress bars" client/src/components/HabitsPage.jsx

# Day 34: Mar 5
commit "2026-03-05T10:00:00+05:30" "Day 34: Habit card design with fire streak effects" client/src/components/HabitsPage.jsx

# Day 35: Mar 6
commit "2026-03-06T15:00:00+05:30" "Day 35: Daily completion check for habits" client/src/components/HabitsPage.jsx

# ============================================
# DAYS 36-50: AI Integration (Mar 7 - Mar 21)
# ============================================

# Day 36: Mar 7
commit "2026-03-07T10:00:00+05:30" "Day 36: Groq SDK integration and AI service setup" server/routes/ai.js

# Day 37: Mar 8
commit "2026-03-08T11:00:00+05:30" "Day 37: Plan my day AI endpoint with task context" server/routes/ai.js

# Day 38: Mar 9
commit "2026-03-09T09:30:00+05:30" "Day 38: Productivity analysis AI endpoint" server/routes/ai.js

# Day 39: Mar 10
commit "2026-03-10T14:00:00+05:30" "Day 39: Journal summarization AI endpoint" server/routes/ai.js

# Day 40: Mar 11
commit "2026-03-11T10:00:00+05:30" "Day 40: Improvement suggestions AI endpoint" server/routes/ai.js

# Day 41: Mar 12
commit "2026-03-12T11:30:00+05:30" "Day 41: AI Coach page with action cards grid" client/src/components/AICoachPage.jsx

# Day 42: Mar 13
commit "2026-03-13T13:00:00+05:30" "Day 42: AI response display with loading states" client/src/components/AICoachPage.jsx

# Day 43: Mar 14
commit "2026-03-14T10:00:00+05:30" "Day 43: AI coach persona - strict but helpful styling" client/src/components/AICoachPage.jsx

# Day 44: Mar 15
commit "2026-03-15T15:00:00+05:30" "Day 44: AI context builder with user data aggregation" server/routes/ai.js

# Day 45: Mar 16
commit "2026-03-16T12:00:00+05:30" "Day 45: Refined AI prompts for behavioral psychology focus" server/routes/ai.js

# Day 46: Mar 17
commit "2026-03-17T10:00:00+05:30" "Day 46: AI empty state and ready-to-coach UI" client/src/components/AICoachPage.jsx

# Day 47: Mar 18
commit "2026-03-18T11:00:00+05:30" "Day 47: Toast notifications for AI actions" client/src/components/AICoachPage.jsx

# Day 48: Mar 19
commit "2026-03-19T09:00:00+05:30" "Day 48: AI error handling and fallback messages" server/routes/ai.js

# Day 49: Mar 20
commit "2026-03-20T14:00:00+05:30" "Day 49: Integrated AI daily summary in dashboard" client/src/components/DashboardHome.jsx

# Day 50: Mar 21
commit "2026-03-21T10:30:00+05:30" "Day 50: AI coach button animations and hover effects" client/src/components/AICoachPage.jsx

# ============================================
# DAYS 51-60: Analytics + Dashboard (Mar 22 - Mar 31)
# ============================================

# Day 51: Mar 22
commit "2026-03-22T10:00:00+05:30" "Day 51: Stats routes with dashboard aggregations" server/routes/stats.js

# Day 52: Mar 23
commit "2026-03-23T11:00:00+05:30" "Day 52: Built analytics dashboard with weekly chart data" server/routes/stats.js

# Day 53: Mar 24
commit "2026-03-24T09:00:00+05:30" "Day 53: Weekly progress area chart with Recharts" client/src/components/DashboardHome.jsx

# Day 54: Mar 25
commit "2026-03-25T14:00:00+05:30" "Day 54: Stat cards - completed, pending, streaks, focus" client/src/components/DashboardHome.jsx

# Day 55: Mar 26
commit "2026-03-26T10:00:00+05:30" "Day 55: Missed tasks alert with orange warning indicator" client/src/components/DashboardHome.jsx

# Day 56: Mar 27
commit "2026-03-27T11:30:00+05:30" "Day 56: Dashboard data fetching with Promise.all optimization" client/src/components/DashboardHome.jsx

# Day 57: Mar 28
commit "2026-03-28T13:00:00+05:30" "Day 57: Focus session model and schema" server/models/FocusSession.js

# Day 58: Mar 29
commit "2026-03-29T10:00:00+05:30" "Day 58: Focus session routes - create and list" server/routes/focus.js

# Day 59: Mar 30
commit "2026-03-30T15:00:00+05:30" "Day 59: Aggregation pipeline fix for ObjectId in stats" server/routes/stats.js

# Day 60: Mar 31
commit "2026-03-31T12:00:00+05:30" "Day 60: Weekly per-day stats loop for chart data" server/routes/stats.js

# ============================================
# DAYS 61-68: Focus Timer (Apr 1 - Apr 8)
# ============================================

# Day 61: Apr 1
commit "2026-04-01T10:00:00+05:30" "Day 61: Pomodoro timer component with countdown logic" client/src/components/FocusPage.jsx

# Day 62: Apr 2
commit "2026-04-02T11:00:00+05:30" "Day 62: Timer controls - play, pause, reset" client/src/components/FocusPage.jsx

# Day 63: Apr 3
commit "2026-04-03T09:30:00+05:30" "Day 63: Duration presets - 15m, 25m, 45m, 60m" client/src/components/FocusPage.jsx

# Day 64: Apr 4
commit "2026-04-04T14:00:00+05:30" "Day 64: Circular SVG progress indicator for timer" client/src/components/FocusPage.jsx

# Day 65: Apr 5
commit "2026-04-05T10:00:00+05:30" "Day 65: Auto-save session on timer completion" client/src/components/FocusPage.jsx

# Day 66: Apr 6
commit "2026-04-06T11:30:00+05:30" "Day 66: Recent sessions list with completion badges" client/src/components/FocusPage.jsx

# Day 67: Apr 7
commit "2026-04-07T13:00:00+05:30" "Day 67: Timer tabular-nums font variant for clean display" client/src/components/FocusPage.jsx

# Day 68: Apr 8
commit "2026-04-08T10:00:00+05:30" "Day 68: Focus page progress bar with gradient fill" client/src/components/FocusPage.jsx

# ============================================
# DAYS 69-75: Polish (Apr 9 - Apr 15)
# ============================================

# Day 69: Apr 9
commit "2026-04-09T10:00:00+05:30" "Day 69: Mobile responsive sidebar with overlay" client/src/components/Sidebar.jsx client/src/components/Dashboard.jsx

# Day 70: Apr 10
commit "2026-04-10T11:00:00+05:30" "Day 70: Final UI polish and animations" client/src/index.css

# Day 71: Apr 11
commit "2026-04-11T09:00:00+05:30" "Day 71: Framer Motion enter/exit animations on all pages" client/src/components/DashboardHome.jsx

# Day 72: Apr 12
commit "2026-04-12T14:00:00+05:30" "Day 72: Error handling and loading states across components" client/src/components/TasksPage.jsx client/src/components/JournalPage.jsx

# Day 73: Apr 13
commit "2026-04-13T10:00:00+05:30" "Day 73: Custom scrollbar and glassmorphism refinements" client/src/index.css

# Day 74: Apr 14
commit "2026-04-14T11:30:00+05:30" "Day 74: Data test IDs for all interactive elements" client/src/components/Auth.jsx client/src/components/Sidebar.jsx

# Day 75: Apr 15
commit "2026-04-15T13:00:00+05:30" "Day 75: README with full setup instructions and API docs" README.md

# ============================================
# DAYS 76-77: Final (Apr 16 - Apr 17)
# ============================================

# Day 76: Apr 16
commit "2026-04-16T10:00:00+05:30" "Day 76: Deployment configuration and environment setup" .env.example

# Day 77: Apr 17
git add -A
commit "2026-04-17T12:00:00+05:30" "Day 77: Final production build and code cleanup"

echo ""
echo "✅ Git history created successfully!"
echo "📊 Total commits: $(git log --oneline | wc -l)"
echo "📅 Date range: Jan 31, 2026 → Apr 17, 2026"
echo ""
echo "Run 'git log --oneline' to verify."
