# আমার ক্যারিয়ার — Amar Career

> **A personal job hunt management system built to bring order, clarity, and strategy to the job application process.**

![Version](https://img.shields.io/badge/version-0.1.0-f59e0b?style=flat-square)
![React](https://img.shields.io/badge/React-19-61dafb?style=flat-square&logo=react)
![Firebase](https://img.shields.io/badge/Firebase-Firestore-ff6d00?style=flat-square&logo=firebase)
![Tailwind](https://img.shields.io/badge/Tailwind-v4-38bdf8?style=flat-square&logo=tailwindcss)
![Vite](https://img.shields.io/badge/Vite-8-646cff?style=flat-square&logo=vite)
![License](https://img.shields.io/badge/license-Personal-94a3b8?style=flat-square)

---

## 📖 What Is This?

**Amar Career** (আমার ক্যারিয়ার, meaning _My Career_ in Bengali) is a private, personal web application designed to solve a very real problem: managing multiple job applications across different platforms while keeping everything — job details, deadlines, preparation notes, and application history — organized in one central place.

The idea came from the frustration of hunting for jobs across LinkedIn, Bdjobs, company websites, and Facebook groups, then losing track of what was applied to, when, with what CV version, and what the outcome was. Amar Career is the answer to that chaos.

This is **not a public product**. It is a personal productivity tool, built by one person for one person, to track their own career journey, analyze patterns, and improve over time.

---

## ✨ Features

### ✅ Currently Built

- **Job Management** — Create, edit, and delete job entries with 30+ structured fields covering every aspect of a job posting
- **7-Section Smart Form** — Multi-step tabbed form (Basic Info → Overview → Role Details → Qualifications → Compensation → Application Process → Selection Process)
- **Job Status Tracking** — Mark jobs as `Saved`, `Applied`, `Shortlisted`, `Interview`, `Rejected`, or `Accepted` with a single click
- **Inline Status Change** — Click any status badge on a job card to instantly change status via a dropdown
- **Live Dashboard** — Real-time stats (jobs saved, applied, interviews, rejections) and pipeline visualization
- **Job Cards** — Clean information cards showing all key details at a glance, with deadline countdowns
- **Search & Filter** — Search by company, role, skills, or location; filter by job source and status tab
- **Real-time Sync** — Firestore real-time listener means data updates instantly across tabs without refresh
- **Responsive Layout** — Sidebar nav on desktop, hamburger menu on mobile

### 🔜 Planned (Upcoming)

- **Profile Management** — Store personal skills, portfolio links, GitHub, LinkedIn, education, and contact info
- **AI Analysis Storage** — Save AI-generated match percentages, strength/weakness analysis, and recommendations per job
- **Notes & Preparation** — Interview questions, preparation notes, mistakes, and role-specific materials
- **Analytics Dashboard** — Application timeline, success rate, source effectiveness, response rate charts
- **Job Detail View** — Full-page view for a single job with all sections expanded
- **CV Link Tracking** — Store GitHub/Drive links to the exact CV version submitted per application

---

## 🛠 Tech Stack

| Technology             | Purpose                    | Why Chosen                                                  |
| ---------------------- | -------------------------- | ----------------------------------------------------------- |
| **React 19**           | Frontend UI                | Component model, fast re-renders, hooks-based state         |
| **Vite 8**             | Build tool & dev server    | Instant HMR, modern ESM bundling                            |
| **Tailwind CSS v4**    | Utility styling foundation | Rapid layout utilities alongside custom CSS                 |
| **Firebase Firestore** | Cloud database             | Free tier, real-time listeners, no backend needed           |
| **Google Fonts**       | Typography                 | Syne (display), DM Sans (body), Noto Serif Bengali (script) |
| **Vercel** _(planned)_ | Deployment                 | Free hosting, git-based deploys                             |

> **Cost**: $0. The entire stack runs on free tiers. No Firebase Storage is used (paid). All data stored as text in Firestore.

---

## 📁 Project Structure

```
amar-career/
├── public/
│   └── favicon.svg
├── src/
│   ├── firebase.js               # Firebase app init & Firestore export
│   ├── main.jsx                  # React root mount
│   ├── App.jsx                   # Shell: layout, routing, sidebar state
│   ├── index.css                 # Full design system (tokens, components, layout)
│   ├── App.css                   # Minimal app-level resets
│   │
│   ├── hooks/
│   │   └── useJobs.js            # Firestore CRUD hook (create, read, update, delete, status)
│   │
│   ├── components/
│   │   ├── Sidebar.jsx           # Navigation sidebar with active state
│   │   ├── JobForm.jsx           # Multi-section job create/edit form modal
│   │   └── JobCard.jsx           # Job list card with status dropdown
│   │
│   └── pages/
│       ├── Dashboard.jsx         # Overview: stats, pipeline, recent jobs, quick actions
│       ├── Jobs.jsx              # Job list with search, filter, tabs
│       ├── Profile.jsx           # Personal profile (shell — in progress)
│       ├── Analytics.jsx         # Statistics & charts (shell — in progress)
│       └── Notes.jsx             # Preparation notes (shell — in progress)
│
├── index.html
├── vite.config.js
├── package.json
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v18 or later
- **npm** v9 or later
- A **Firebase** account (free) — [console.firebase.google.com](https://console.firebase.google.com)

---

### 1. Clone and Install

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/amar-career.git
cd amar-career

# Install dependencies
npm install

# Install Firebase SDK
npm install firebase
```

---

### 2. Set Up Firebase

**Step 1 — Create a Firebase Project**

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click **Add project** → give it a name (e.g. `amar-career`)
3. Disable Google Analytics if you don't need it → **Create project**

**Step 2 — Add a Web App**

1. Inside your project, click the **</>** (Web) icon
2. Register the app with a nickname (e.g. `amar-career-web`)
3. Copy the `firebaseConfig` object shown — you'll need it in the next step

**Step 3 — Create Firestore Database**

1. In the left sidebar, go to **Build → Firestore Database**
2. Click **Create database**
3. Choose **Start in test mode** (allows read/write for 30 days — fine for personal use)
4. Select any region close to you (e.g. `asia-south1` for Bangladesh)
5. Click **Enable**

**Step 4 — Configure Your App**

Open `src/firebase.js` and replace the placeholder values:

```javascript
const firebaseConfig = {
  apiKey: "YOUR_ACTUAL_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID",
};
```

> ⚠️ **Security Note**: This config is safe to include in a personal project. Firebase security rules protect your data. If you ever make this public, set up Firebase Authentication and proper Firestore rules.

---

### 3. Run the App

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

### 4. Build for Production

```bash
npm run build
npm run preview  # preview the production build locally
```

---

## 📋 How to Use

### Adding a New Job

1. Click **"Add Job"** from the Dashboard or Jobs page
2. The multi-section form opens as a modal overlay
3. Work through the 7 sections — fill in as much or as little as you have from the job circular:

| Section            | Key Fields                                                           |
| ------------------ | -------------------------------------------------------------------- |
| **Basic Info**     | Job title, company name, reference code, industry, source            |
| **Overview**       | Job type (full-time/internship/etc.), location, vacancies            |
| **Role Details**   | Responsibilities, KPIs, tools/software required                      |
| **Qualifications** | Education, certifications, experience level, technical & soft skills |
| **Compensation**   | Salary range, salary type                                            |
| **Application**    | Deadline, submission method, required documents, apply link          |
| **Selection**      | Screening steps, interview type, assessment details, personal notes  |

4. At minimum, fill in **Job Title** and **Company Name** (required)
5. Click **Save Job** on the last section — it saves to Firestore instantly

> 💡 **Tip**: Copy-paste directly from the job circular into the textarea fields. No need to reformat — just paste and go.

---

### Changing Job Status

**Method 1 — Status badge on job card**
Click the colored status badge (e.g. `Saved`) on any job card. A dropdown appears. Select the new status. Updates instantly in Firestore.

**Method 2 — Edit the job**
Click the ✏️ edit button on a job card → change status via the form → save.

---

### Editing a Job

Click the **pencil icon** on any job card. The same multi-section form opens, pre-filled with all saved data. Make your changes and click **Save Changes**.

---

### Deleting a Job

Click the **trash icon** on any job card. A confirmation prompt appears. Confirm to permanently delete from Firestore.

---

### Searching and Filtering

- **Search bar** — searches across job title, company name, skills, industry, and location
- **Source filter** — filter by where you found the job (LinkedIn, Bdjobs, etc.)
- **Status tabs** — click any tab (Applied, Interview, etc.) to see only jobs in that stage

---

## 🗃 Database Schema

All data is stored as plain text in Firestore. No binary files, no attachments. The `jobs` collection has one document per job with this structure:

```javascript
// Firestore Collection: "jobs"
// Document ID: auto-generated by Firestore

{
  // ── Metadata ──────────────────────────────────────
  status:             "Saved",           // Saved | Applied | Shortlisted | Interview | Rejected | Accepted
  createdAt:          Timestamp,         // Firestore server timestamp
  updatedAt:          Timestamp,         // Firestore server timestamp

  // ── Section 1: Basic Info ─────────────────────────
  jobTitle:           "Software Engineer",
  refCode:            "IT-2025-042",
  companyName:        "bKash Limited",
  companyLink:        "https://bkash.com",
  industry:           "IT / Software",
  jobSource:          "LinkedIn",

  // ── Section 2: Overview ───────────────────────────
  jobType:            "Full-time",
  location:           "Dhaka, Bangladesh",
  vacancies:          "3",

  // ── Section 3: Role Details ───────────────────────
  responsibilities:   "• Develop REST APIs\n• Write unit tests\n...",
  kpis:               "Code review turnaround < 24hrs...",
  projects:           "Mobile payment gateway, merchant dashboard",
  tools:              "Jira, GitHub, Postman, Docker",

  // ── Section 4: Qualifications ─────────────────────
  education:          "BSc in CSE, CGPA min 3.0",
  certifications:     "AWS Certified Developer (preferred)",
  experienceLevel:    "Mid Level",
  yearsExperience:    "2–4 years",
  industryExperience: "Fintech",
  technicalSkills:    "Python, Django, React, PostgreSQL, Redis",
  softSkills:         "Problem solving, team collaboration",
  languages:          "English (Fluent), Bengali (Native)",
  computerLiteracy:   "MS Office, Google Workspace",

  // ── Section 5: Compensation ───────────────────────
  salaryRange:        "60,000–80,000 BDT/month",
  salaryType:         "Gross",

  // ── Section 6: Application Process ───────────────
  deadline:           "2025-06-30",
  applicationMethod:  "Email",
  documentsRequired:  "CV, Cover Letter, Transcripts",
  applicationFormat:  "PDF",
  submissionLink:     "careers@bkash.com",

  // ── Section 7: Selection Process ─────────────────
  screeningSteps:     "CV Review → Written Test → Technical Interview → HR Round",
  interviewType:      "In-person",
  assessmentDetails:  "90-min test: Data Structures, System Design, SQL",
  notes:              "Referred by a friend at bKash. Strong company culture."
}
```

---

## 🎨 Design System

The UI follows a **dark editorial** aesthetic — serious, organized, and personal.

| Token              | Value                | Purpose                      |
| ------------------ | -------------------- | ---------------------------- |
| `--bg`             | `#0f1117`            | Main background              |
| `--bg-surface`     | `#161b27`            | Sidebar background           |
| `--bg-card`        | `#1c2235`            | Card backgrounds             |
| `--accent`         | `#f59e0b`            | Amber — primary accent, CTAs |
| `--text-primary`   | `#e8edf5`            | Main readable text           |
| `--text-secondary` | `#8b97b8`            | Supporting text              |
| `--text-muted`     | `#4a5578`            | Placeholder, hints           |
| `--font-display`   | `Syne`               | Headings, labels, buttons    |
| `--font-body`      | `DM Sans`            | Body text, inputs            |
| `--font-bn`        | `Noto Serif Bengali` | Bengali script in logo       |

**Status colors:**

| Status      | Color              |
| ----------- | ------------------ |
| Saved       | `#94a3b8` (slate)  |
| Applied     | `#60a5fa` (blue)   |
| Shortlisted | `#fbbf24` (yellow) |
| Interview   | `#34d399` (green)  |
| Rejected    | `#f87171` (red)    |
| Accepted    | `#a78bfa` (purple) |

---

## 🗺 Roadmap

### Phase 1 — Core (✅ Complete)

- [x] Project structure and design system
- [x] Sidebar navigation
- [x] Dashboard with live stats and pipeline
- [x] Job create/edit form (7 sections, 30+ fields)
- [x] Job cards with status management
- [x] Search, filter, and status tabs
- [x] Firestore real-time integration

### Phase 2 — Content (🔄 In Progress)

- [ ] Profile page — personal info, skills, links, education
- [ ] Notes page — interview questions, prep materials, learnings
- [ ] Job detail view — full single-job expanded view
- [ ] AI Analysis section — save ChatGPT/Gemini analysis results per job

### Phase 3 — Intelligence (📅 Planned)

- [ ] Analytics dashboard — charts, timeline, success rate
- [ ] Application timeline view
- [ ] Source effectiveness analysis (which platform gives best results)
- [ ] Deadline calendar view
- [ ] Export to CSV / PDF report

### Phase 4 — Polish (📅 Planned)

- [ ] Firebase Authentication (Google sign-in)
- [ ] Proper Firestore security rules
- [ ] Deploy to Vercel
- [ ] PWA support (installable on Android)
- [ ] Dark/light mode toggle

---

## 🔒 Privacy & Security

- This app is for **personal use only** — no multi-user system, no public access
- Firebase is configured in **test mode** initially — update Firestore rules before any public deployment
- No passwords, personal data, or sensitive financial information should be stored in plain text fields
- The Firebase API key in `firebase.js` is safe to commit for personal projects; it is not a secret key

**Recommended Firestore rules for personal use:**

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true; // Only safe on a private/personal project
    }
  }
}
```

---

## 📦 Dependencies

```json
{
  "dependencies": {
    "firebase": "^11.x",
    "react": "^19.x",
    "react-dom": "^19.x",
    "@tailwindcss/vite": "^4.x",
    "tailwindcss": "^4.x"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^6.x",
    "vite": "^8.x"
  }
}
```

---

## 🤝 Contributing

This is a personal project and is not open for public contributions. If you want to build something similar for yourself, feel free to use this as inspiration or a starting point.

---

## 📄 License

This project is for personal use. No license is granted for redistribution or commercial use.

---

## 👤 Author

Built by a job seeker, for a job seeker — to stay organized, stay strategic, and track every step of the hunt.

> _"The job hunt is hard enough. At least let the tracking be easy."_

---

<div align="center">
  <p>আমার ক্যারিয়ার &mdash; Amar Career</p>
  <p><sub>Built with React · Firebase · Tailwind · Vite</sub></p>
</div>
