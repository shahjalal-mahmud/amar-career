# Profile & CV Management System - Implementation Documentation (Simplified)

## Document Information

- **Project**: Amar Career - Job Hunt Management System
- **Feature**: Profile Management & CV Generation System
- **Document Type**: Implementation Blueprint
- **Date**: 2026
- **Status**: Ready for Implementation

---

## Table of Contents

1. [Overview](#1-overview)
2. [Core Requirements](#2-core-requirements)
3. [Architecture Design](#3-architecture-design)
4. [Database Schema](#4-database-schema)
5. [GitHub Integration](#5-github-integration)
6. [Profile Page Structure](#6-profile-page-structure)
7. [Markdown Profile System](#7-markdown-profile-system)
8. [CV Management System](#8-cv-management-system)
9. [Implementation Checklist](#9-implementation-checklist)
10. [File Structure](#10-file-structure)
11. [User Workflow](#11-user-workflow)
12. [Security Considerations](#12-security-considerations)

---

## 1. Overview

### 1.1 Feature Goal

Create a lightweight personal information display system where profile data is hardcoded in the codebase, markdown is shown as read-only with copy functionality, and CVs are manually managed via GitHub with JSON tracking.

### 1.2 Key Principles

- **No CRUD operations** in the web interface for profile data
- **Hardcoded profile** - Edit directly in codebase
- **Read-only markdown display** - Like GitHub README viewer
- **Manual CV management** - Upload to GitHub, update JSON manually
- **Simple linking** - Connect CV links to jobs in Firestore

### 1.3 Solution Architecture

```
┌─────────────────────────────────────────────────────────┐
│              Frontend (React) - Hardcoded Data          │
├─────────────────────────────────────────────────────────┤
│  Profile Page           │  Job Page                     │
│  - Display hardcoded    │  - List jobs                  │
│    profile data         │  - Show linked CV             │
│  - Show markdown file   │  - Download CV button         │
│  - Copy markdown button │  - Link CV URL to job         │
└────────────┬────────────┴──────┬───────────────────────┘
             │                   │
┌────────────▼───────────────────▼────────────────────────┐
│              Firebase Firestore                          │
├──────────────────────────────────────────────────────────┤
│  Collection: jobs (existing)                             │
│    - cvPdfUrl: string (optional field)                   │
│    - cvTexUrl: string (optional field)                   │
│                                                          │
│  Collection: cv_index (optional - can use JSON instead)  │
└──────────────────────────────────────────────────────────┘
             │
┌────────────▼────────────────────────────────────────────┐
│              GitHub Repository                           │
├──────────────────────────────────────────────────────────┤
│  /profile.md          - Master markdown profile         │
│  /cvs/                                                    │
│    /role-based/       - Template CVs                     │
│    /job-specific/     - Job-specific CVs                 │
│  /cv-index.json       - CV tracking index                │
└──────────────────────────────────────────────────────────┘
```

---

## 2. Core Requirements

### 2.1 What's Hardcoded in Codebase

| Item                | Location                 | Update Method       |
| ------------------- | ------------------------ | ------------------- |
| Profile Information | `src/data/profile.js`    | Manual edit in code |
| Profile Markdown    | `src/data/profile.md`    | Manual edit in code |
| CV Index (optional) | Firestore or GitHub JSON | Manual edit         |

### 2.2 What's Displayed (Read-Only)

- Structured profile information (name, skills, experience, etc.)
- Full markdown profile with syntax highlighting
- List of CVs with download links
- Job-specific CV links in job entries

### 2.3 What's Manually Managed Outside Web

- Profile content updates
- Markdown file updates
- CV LaTeX and PDF generation
- GitHub file uploads
- CV index JSON updates
- Linking CV URLs to jobs

---

## 3. Architecture Design

### 3.1 Data Flow

**Profile Display Flow:**

```
Codebase (hardcoded data)
    ↓
React Component imports data
    ↓
Display structured profile
    ↓
Markdown viewer renders profile.md
    ↓
User clicks "Copy" button
```

**CV Linking Flow:**

```
User manually uploads CV to GitHub
    ↓
User updates cv-index.json with new CV metadata
    ↓
User copies GitHub raw URL
    ↓
User opens job in web app
    ↓
User pastes URL into job's CV link field
    ↓
Job document saves cvPdfUrl in Firestore
    ↓
Job card shows "Download CV" button
```

### 3.2 External Dependencies

| Dependency         | Purpose                  | Usage                    |
| ------------------ | ------------------------ | ------------------------ |
| GitHub Raw CDN     | Serve PDF/Markdown files | Direct file access       |
| React Markdown     | Render markdown          | Display profile.md       |
| Firebase Firestore | Store job CV links       | Existing jobs collection |

---

## 4. Database Schema

### 4.1 Firestore - Jobs Collection (Modified)

Add two optional fields to existing job documents:

```javascript
{
  // ... existing job fields ...

  // NEW: CV Management Fields
  cvPdfUrl: "https://raw.githubusercontent.com/username/amar-career-cvs/main/cvs/job-specific/2025-01-15_google_swe/cv_google_swe.pdf",
  cvTexUrl: "https://raw.githubusercontent.com/username/amar-career-cvs/main/cvs/job-specific/2025-01-15_google_swe/cv_google_swe.tex",
  cvName: "Google SWE II Custom CV",

  // Optional: Track CV version
  cvVersion: "1.0",
  cvLastUpdated: "2025-01-15"
}
```

### 4.2 CV Index (GitHub JSON)

Create `cv-index.json` in GitHub repository:

```javascript
{
  "version": "1.0",
  "lastUpdated": "2025-01-15",
  "cvs": [
    {
      "id": "cv_frontend_001",
      "name": "Frontend Developer - React Focus",
      "type": "role_based",
      "category": "frontend",
      "description": "Optimized for React/Redux frontend roles",
      "pdfUrl": "https://raw.githubusercontent.com/.../frontend-developer/v1.0/cv.pdf",
      "texUrl": "https://raw.githubusercontent.com/.../frontend-developer/v1.0/cv.tex",
      "createdAt": "2025-01-10",
      "tags": ["react", "frontend", "modern-ui"]
    },
    {
      "id": "cv_google_001",
      "name": "Google SWE II Application",
      "type": "job_specific",
      "jobId": "job_123456",  // Link to Firestore job document
      "company": "Google",
      "position": "Software Engineer II",
      "pdfUrl": "https://raw.githubusercontent.com/.../google_swe/cv.pdf",
      "texUrl": "https://raw.githubusercontent.com/.../google_swe/cv.tex",
      "createdAt": "2025-01-15"
    }
  ]
}
```

### 4.3 Hardcoded Profile Data

Create `src/data/profile.js`:

```javascript
export const profileData = {
  // Basic Info
  fullName: "Your Name",
  professionalTitle: "Senior Software Engineer",
  location: "Dhaka, Bangladesh",

  // Contact
  email: "your.email@example.com",
  phone: "+880123456789",
  linkedin: "linkedin.com/in/yourprofile",
  github: "github.com/yourusername",
  portfolio: "yourportfolio.com",

  // Professional Summary
  bio: "Experienced software engineer with 5+ years...",

  // Skills
  technicalSkills: ["React", "Node.js", "Python", "PostgreSQL"],
  softSkills: ["Leadership", "Communication", "Problem Solving"],
  tools: ["Git", "Docker", "AWS"],

  // Languages
  languages: [
    { name: "Bengali", proficiency: "Native" },
    { name: "English", proficiency: "Fluent" },
  ],

  // Work Experience
  experiences: [
    {
      company: "Company Name",
      role: "Software Engineer",
      period: "2020-2024",
      location: "Dhaka",
      achievements: ["Led team of 5 engineers", "Increased performance by 40%"],
    },
  ],

  // Education
  education: [
    {
      degree: "BSc in Computer Science",
      institution: "University Name",
      year: "2020",
      cgpa: "3.80",
    },
  ],

  // Certifications
  certifications: [
    {
      name: "AWS Solutions Architect",
      issuer: "Amazon",
      year: "2023",
    },
  ],

  // Projects
  projects: [
    {
      name: "Project Name",
      description: "Project description",
      technologies: ["React", "Node.js"],
      link: "https://github.com/project",
    },
  ],
};
```

---

## 5. GitHub Integration

### 5.1 Repository Structure

**Repository Name:** `amar-career-cvs` (Private recommended)

```
amar-career-cvs/
├── README.md
├── profile.md              # Master markdown profile (copy in web shows this)
├── cv-index.json           # CV tracking index
│
├── cvs/
│   ├── role-based/
│   │   ├── frontend-dev/
│   │   │   ├── cv.tex
│   │   │   └── cv.pdf
│   │   ├── backend-dev/
│   │   │   ├── cv.tex
│   │   │   └── cv.pdf
│   │   └── fullstack-dev/
│   │       ├── cv.tex
│   │       └── cv.pdf
│   │
│   └── job-specific/
│       ├── 2025-01-15_google_swe/
│       │   ├── cv.tex
│       │   ├── cv.pdf
│       │   └── prompt.md
│       ├── 2025-01-20_meta_frontend/
│       │   ├── cv.tex
│       │   ├── cv.pdf
│       │   └── prompt.md
│       └── ...
│
└── assets/
    └── thumbnails/         # Optional: PDF preview images
```

### 5.2 URL Patterns

**Raw File Access:**

```
https://raw.githubusercontent.com/{username}/{repo}/{branch}/{filepath}

Examples:
Profile: https://raw.githubusercontent.com/username/amar-career-cvs/main/profile.md
CV PDF: https://raw.githubusercontent.com/username/amar-career-cvs/main/cvs/role-based/frontend-dev/cv.pdf
CV JSON: https://raw.githubusercontent.com/username/amar-career-cvs/main/cv-index.json
```

### 5.3 Manual Update Process

**To update profile:**

1. Edit `profile.md` locally
2. Commit and push to GitHub
3. Web app shows updated markdown (no code change needed)

**To add new CV:**

1. Generate CV using AI
2. Save .tex and .pdf files
3. Upload to GitHub via web or git
4. Update `cv-index.json` with new entry
5. Commit and push
6. Web app shows new CV in list

**To link CV to job:**

1. Copy PDF raw URL from GitHub
2. Open job in web app
3. Click "Edit Job"
4. Paste URL into "CV PDF Link" field
5. Save job
6. Job card shows download button

---

## 6. Profile Page Structure

### 6.1 Read-Only Display Components

**No edit forms needed** - all data is hardcoded. Components only display:

- `ProfileHero.jsx` - Shows name, title, location, contact
- `SkillsList.jsx` - Renders skills as tags
- `ExperienceTimeline.jsx` - Shows work history
- `EducationList.jsx` - Shows education
- `ProjectGrid.jsx` - Shows projects with links

---

## 7. Markdown Profile System

### 7.1 Implementation Approach

**Option A: Fetch from GitHub (Recommended)**

```javascript
// Fetch markdown directly from GitHub raw URL
const markdownUrl =
  "https://raw.githubusercontent.com/username/amar-career-cvs/main/profile.md";

// Use fetch() to get content
// Display using ReactMarkdown component
// Copy button copies the raw markdown text
```

**Option B: Hardcoded Import**

```javascript
// Import markdown file directly
import profileMarkdown from "../data/profile.md";

// Use in component
// Copy button copies the imported string
```

### 7.2 Features

| Feature              | Implementation                    |
| -------------------- | --------------------------------- |
| Display markdown     | `ReactMarkdown` component         |
| Syntax highlighting  | `remark-gfm` plugin               |
| Copy markdown        | `navigator.clipboard.writeText()` |
| Download .md         | Create blob and trigger download  |
| Word/character count | Count text length                 |

### 7.3 Copy Button Functionality

```javascript
// Pseudo-code for copy functionality
const handleCopyMarkdown = async () => {
  const markdownText = fetchMarkdownContent(); // or from import
  await navigator.clipboard.writeText(markdownText);
  showToast("Markdown copied to clipboard!");
};
```

---

## 8. CV Management System

### 8.1 CV Library Component

**Purpose:** Display all CVs from `cv-index.json` with download buttons

**Data Source:** Fetch from GitHub raw URL

```javascript
const CV_INDEX_URL =
  "https://raw.githubusercontent.com/username/amar-career-cvs/main/cv-index.json";
```

**Display Categories:**

- Role-Based CVs (type: "role_based")
- Job-Specific CVs (type: "job_specific")

**Each CV Card Shows:**

- CV Name
- Description/Category
- Download PDF button
- Download LaTeX button (optional)
- Copy Link button
- For job-specific: "View Job" button (if linked)

### 8.2 Job CV Linking

**Add to Job Edit Form:**

Add these fields to existing job form:

```
┌────────────────────────────────────────┐
│  CV LINKING (Optional)                 │
├────────────────────────────────────────┤
│  CV Name: [__________________]         │
│  CV PDF URL: [__________________]      │
│  CV LaTeX URL: [__________________]    │
│                                         │
│  [Browse CV Library] [Paste URL]       │
└────────────────────────────────────────┘
```

**Browse CV Library Modal:**

- Shows all CVs from cv-index.json
- Click "Select" to auto-fill URLs
- Or "Copy URL" to manually paste

**Save to Firestore:**

```javascript
// When saving job
const jobData = {
  // ... existing fields
  cvPdfUrl: submittedCvPdfUrl,
  cvTexUrl: submittedCvTexUrl,
  cvName: submittedCvName,
};
```

### 8.3 Job Card Display

**Add to existing JobCard component:**

```javascript
// If job has cvPdfUrl
{
  job.cvPdfUrl && (
    <div className="job-cv-link">
      <button onClick={() => window.open(job.cvPdfUrl)}>📄 Download CV</button>
      <small>CV: {job.cvName || "Custom CV"}</small>
    </div>
  );
}
```

---

## 9. Implementation Checklist

### Phase 1: Profile Data Setup (Day 1)

- [ ] Create `src/data/profile.js` with hardcoded profile data
- [ ] Create `src/data/profile.md` with markdown version
- [ ] Set up GitHub repository `amar-career-cvs`
- [ ] Upload `profile.md` to GitHub
- [ ] Create initial `cv-index.json` on GitHub

### Phase 2: Profile Page Components (Day 2-3)

- [ ] Create `ProfileHero.jsx` component
- [ ] Create `StructuredProfile.jsx` component
- [ ] Create `MarkdownProfile.jsx` with markdown viewer
- [ ] Add copy to clipboard functionality
- [ ] Add markdown download button
- [ ] Create tabs switching UI

### Phase 3: CV Library (Day 3-4)

- [ ] Create `CVLibrary.jsx` component
- [ ] Fetch cv-index.json from GitHub
- [ ] Display CVs in categorized sections
- [ ] Add PDF download buttons
- [ ] Add LaTeX download (optional)
- [ ] Add "Copy URL" functionality

### Phase 4: Job Integration (Day 4)

- [ ] Modify JobForm to include CV link fields
- [ ] Add "Browse CV Library" button to JobForm
- [ ] Create CV library modal for selection
- [ ] Update JobCard to show CV download button
- [ ] Save cvPdfUrl to Firestore jobs collection

### Phase 5: Polish (Day 5)

- [ ] Add loading states
- [ ] Add error handling for failed fetches
- [ ] Mobile responsive design
- [ ] Test all download links
- [ ] Add user instructions/help text

---

## 10. File Structure

### 10.1 Source Code Organization

```
src/
├── data/
│   ├── profile.js            # Hardcoded structured profile
│   └── profile.md            # Hardcoded markdown (or fetch from GitHub)
│
├── components/
│   ├── Sidebar.jsx           # Existing
│   ├── JobForm.jsx           # MODIFY: Add CV link fields
│   ├── JobCard.jsx           # MODIFY: Add CV download button
│   │
│   └── profile/              # NEW
│       ├── ProfileHero.jsx
│       ├── StructuredProfile.jsx
│       ├── MarkdownProfile.jsx
│       ├── SkillsList.jsx
│       ├── ExperienceList.jsx
│       ├── EducationList.jsx
│       ├── ProjectList.jsx
│       └── CVLibrary.jsx
│
└── pages/
    ├── Profile.jsx           # MODIFY: Add tabs and components
    └── Jobs.jsx              # Existing (uses modified JobForm/JobCard)
```

### 10.2 GitHub Repository Structure

```
amar-career-cvs/
├── profile.md                # Master markdown
├── cv-index.json             # CV index file
├── cvs/
│   ├── role-based/
│   │   ├── frontend-dev/
│   │   │   ├── cv.tex
│   │   │   └── cv.pdf
│   │   └── backend-dev/
│   │       ├── cv.tex
│   │       └── cv.pdf
│   └── job-specific/
│       └── 2025-01-15_google_swe/
│           ├── cv.tex
│           └── cv.pdf
└── README.md
```

---

## 11. User Workflow

### 11.1 Initial Setup (One Time)

1. Create GitHub repository `amar-career-cvs`
2. Create `profile.md` with all professional information
3. Upload to GitHub
4. Create `cv-index.json` with initial CV entries
5. Generate first role-based CVs using AI
6. Upload CV files to GitHub
7. Update `cv-index.json` with CV metadata

### 11.2 Daily Usage - Adding New Job

1. Add job details in Jobs page
2. Generate job-specific CV using AI with profile.md
3. Upload new CV files to GitHub job-specific folder
4. Update `cv-index.json` with new CV entry
5. Copy PDF raw URL from GitHub
6. Open job in web app, click Edit
7. Paste URL into CV PDF Link field
8. Save job
9. Job card now shows "Download CV" button

### 11.3 Updating Profile

1. Edit `profile.md` locally
2. Commit and push to GitHub
3. (Optional) Update structured `profile.js` if used
4. Web app automatically shows updated markdown

### 11.4 Finding CV for Existing Job

1. Go to Jobs page
2. Find job in Applied list
3. Click "Download CV" button
4. Or click job to view details and see CV link

### 11.5 Managing CV Library

1. Open Profile → CV Library tab
2. See all CVs organized by type
3. Click Download to get any CV
4. Click "View Job" to see which job used a specific CV

---

## 12. Security Considerations

### 12.1 Data Privacy

- **GitHub repository** - Keep PRIVATE for CVs
- **Firestore** - Keep in test mode (personal use only)
- **No sensitive data** - Don't store passwords, financial info

### 12.2 URL Security

- GitHub raw URLs are publicly accessible if repo is public
- Private repo URLs require authentication
- For personal use, private repo is sufficient

### 12.3 Recommended Setup

- GitHub repo: **Private**
- Firestore rules: `allow read, write: if true;` (personal project only)
- No authentication needed (single user)

---
