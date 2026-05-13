# Profile & CV Management System - Implementation Documentation

## Document Information

- **Project**: Amar Career - Job Hunt Management System
- **Feature**: Profile Management & CV Generation System
- **Document Type**: Implementation Blueprint
- **Date**: 2025
- **Status**: Ready for Implementation

---

## Table of Contents

1. [Overview](#overview)
2. [Core Requirements](#core-requirements)
3. [Architecture Design](#architecture-design)
4. [Database Schema](#database-schema)
5. [GitHub Integration](#github-integration)
6. [Profile Page Structure](#profile-page-structure)
7. [Markdown Profile System](#markdown-profile-system)
8. [CV Management System](#cv-management-system)
9. [Implementation Checklist](#implementation-checklist)
10. [File Structure](#file-structure)
11. [User Workflow](#user-workflow)
12. [Security Considerations](#security-considerations)
13. [Testing Requirements](#testing-requirements)
14. [Future Enhancements](#future-enhancements)

---

## 1. Overview

### 1.1 Feature Goal

Create a centralized personal information management system that stores ALL professional information in one place and enables generation of customized, role-specific CVs using a master Markdown profile as a prompt template.

### 1.2 Problem Statement

Job seekers have extensive professional histories (multiple projects, experiences, certifications) but cannot include everything in a single CV. They need a way to:

- Store complete professional information
- Quickly generate targeted CVs for specific roles
- Track different CV versions for different applications
- Access all CVs from one unified interface

### 1.3 Solution Architecture

A dual-system approach where:

1. **Master Profile** (Firestore + Display) - Structured data stored in Firestore, displayed on Profile page
2. **Markdown Profile** (Markdown + Display) - Complete professional history stored as a single Markdown file showing in the web
3. **CV Index** (Firestore) - JSON metadata tracking all CVs stored in GitHub
4. **GitHub Storage** - Actual CV files (LaTeX source + PDF) hosted in repository

---

## 2. Core Requirements

### 2.1 Profile Information Categories

| Category                 | Sub-Categories                                          | Example Data                                 |
| ------------------------ | ------------------------------------------------------- | -------------------------------------------- |
| **Basic Info**           | Name, Title, Location, Availability                     | "Senior Software Engineer, Dhaka"            |
| **Contact**              | Email, Phone, LinkedIn, GitHub, Portfolio               | "john@example.com, /in/johndoe"              |
| **Professional Summary** | Bio, Career Objective, Key Achievements                 | 2-3 paragraph narrative                      |
| **Skills**               | Technical, Soft, Tools, Languages                       | "React, Python, Leadership, English"         |
| **Work Experience**      | Company, Role, Duration, Responsibilities, Achievements | "Google, 2020-2024, Led team of 5 engineers" |
| **Education**            | Degree, Institution, Year, CGPA, Thesis                 | "BSc CSE, BUET, 2020, CGPA 3.8"              |
| **Certifications**       | Name, Issuer, Date, Credential ID                       | "AWS Solutions Architect, Amazon, 2023"      |
| **Projects**             | Name, Tech Stack, Description, Link                     | "E-commerce App, React+Node, GitHub link"    |
| **Languages**            | Language, Proficiency Level                             | "Bengali (Native), English (Fluent)"         |
| **Achievements**         | Awards, Recognition, Publications                       | "Best Paper Award, ICSE 2023"                |
| **Volunteering**         | Organization, Role, Duration                            | "Code for Bangladesh, Mentor, 2022"          |
| **References**           | Name, Title, Company, Contact                           | "Dr. Smith, Professor, University X"         |

### 2.2 CV Types and Organization

**Type 1: Role-Based CV Templates**

- Pre-defined CVs for specific role categories
- Examples: "Frontend Developer CV", "Full Stack CV", "Data Scientist CV"
- Can be reused across multiple job applications
- Stored once, referenced many times

**Type 2: Job-Specific Custom CVs**

- Unique CV created for a specific job application
- Linked to a specific job entry in the Jobs page
- Stored once, never reused
- Contains role-specific tailoring

**Type 3: Master Profile Source**

- Complete Markdown document with ALL information
- Never used as CV directly
- Serves as source material for generating other CVs

### 2.3 CV File Management

| File Type       | Storage Location                 | Purpose               | Format         |
| --------------- | -------------------------------- | --------------------- | -------------- |
| Master Profile  | Firestore/Github Repo (Markdown) | Source information    | Markdown (.md) |
| CV LaTeX Source | GitHub Repository                | Editable source code  | .tex files     |
| CV PDF          | GitHub Repository                | Downloadable output   | .pdf files     |
| CV Metadata     | Firestore (JSON)                 | Tracking and indexing | JSON document  |
| CV Thumbnails   | GitHub Repository                | Preview images        | .png files     |

---

## 3. Architecture Design

### 3.1 System Components

```
┌─────────────────────────────────────────────────────────┐
│                    Frontend (React)                      │
├─────────────────────────────────────────────────────────┤
│  Profile Page     │  CV Manager     │  Job Page         │
│  - View Profile   │  - List CVs     │  - Link CV to Job │
│  - Edit Sections  │  - Upload CV    │  - Download CV    │
│  - Copy Markdown  │  - Generate CV  │  - Preview CV     │
└─────────┬─────────┴──────┬──────────┴───────┬──────────┘
          │                 │                  │
┌─────────▼─────────────────▼──────────────────▼──────────┐
│                    Firebase Firestore                     │
├──────────────────────────────────────────────────────────┤
│  Collection: profile                                      │
│  Collection: profile_markdown                            │
│  Collection: cv_index                                    │
│  Collection: cv_history (optional)                       │
└─────────────────────────┬────────────────────────────────┘
                          │
┌─────────────────────────▼────────────────────────────────┐
│                   GitHub Repository                       │
├──────────────────────────────────────────────────────────┤
│  /cvs/                                                    │
│    /role-based/                                          │
│      /frontend/                                          │
│        - main.tex                                        │
│        - main.pdf                                        │
│    /job-specific/                                        │
│      /job_{jobId}/                                       │
│        - customized.tex                                  │
│        - customized.pdf                                  │
│    /assets/                                              │
│      - thumbnails/                                       │
└──────────────────────────────────────────────────────────┘
```

### 3.2 Data Flow

**Profile Editing Flow:**

1. User edits structured profile fields in UI
2. Data saved to Firestore `profile` collection
3. System automatically regenerates Markdown profile
4. Markdown saved to `profile_markdown` collection
5. UI displays updated Markdown instantly

**CV Generation Flow:**

1. User opens CV Generator
2. Selects source (Master Profile + Job Details + Role Template)
3. System combines selected data into CV prompt
4. User copies prompt to AI tool (ChatGPT/Claude)
5. AI generates LaTeX/CV content
6. User uploads generated files to GitHub
7. System updates Firestore `cv_index` with metadata

**CV Linking Flow (to Job):**

1. User opens specific Job entry
2. Clicks "Link Custom CV" button
3. Selects from existing CVs or generates new
4. System stores CV reference in Job document
5. Job page shows "Download CV" button

### 3.3 External Dependencies

| Dependency         | Purpose                     | Free Tier Limit                                               |
| ------------------ | --------------------------- | ------------------------------------------------------------- |
| GitHub API         | File listing, download URLs | 60 req/hour (unauthenticated) / 5000 req/hour (authenticated) |
| GitHub Raw CDN     | Direct file access          | Unlimited                                                     |
| Firebase Firestore | Metadata storage            | 1GB storage, 50K reads/day                                    |
| React Markdown     | Markdown rendering          | N/A                                                           |
| FileSaver.js       | PDF download                | N/A                                                           |

---

## 4. Database Schema

### 4.1 Firestore Collections

#### Collection: `profile` (Single Document - "myProfile")

Stores structured, editable profile data.

#### Collection: `cv_generation_prompts` (Optional)

Stores reusable prompts for AI CV generation.

---

## 5. GitHub Integration

### 5.1 Repository Structure

Create a separate GitHub repository for CV storage: `amar-career-cvs`

```
amar-career-cvs/
├── README.md
├── cvs/
│   ├── role-based/
│   │   ├── frontend-developer/
│   │   │   ├── v1.0/
│   │   │   │   ├── cv.tex
│   │   │   │   ├── cv.pdf
│   │   │   │   └── metadata.json
│   │   │   └── v1.1/
│   │   │       ├── cv.tex
│   │   │       ├── cv.pdf
│   │   │       └── metadata.json
│   │   ├── backend-developer/
│   │   ├── fullstack-developer/
│   │   ├── data-scientist/
│   │   └── devops-engineer/
│   │
│   ├── job-specific/
│   │   ├── 2025-01-15_google_swe/
│   │   │   ├── cv_google_swe.tex
│   │   │   ├── cv_google_swe.pdf
│   │   │   └── prompt_used.md
│   │   ├── 2025-01-20_meta_frontend/
│   │   │   ├── cv_meta_frontend.tex
│   │   │   ├── cv_meta_frontend.pdf
│   │   │   └── prompt_used.md
│   │   └── ...
│   │
│   └── archive/
│       └── (old versions moved here)
│
├── assets/
│   ├── thumbnails/
│   │   ├── frontend-developer_v1.0.png
│   │   └── ...
│   └── templates/
│       ├── base_template.tex
│       └── skills_section.tex
│
└── index.json  (Backup of Firestore cv_index)
```

### 5.2 GitHub API Integration

**Required API Calls:**

| Operation         | Endpoint                                            | Authentication |
| ----------------- | --------------------------------------------------- | -------------- |
| List CV folders   | `GET /repos/{owner}/{repo}/contents/cvs/role-based` | Optional       |
| Get file metadata | `GET /repos/{owner}/{repo}/contents/{path}`         | Optional       |
| Get download URL  | Use raw.githubusercontent.com                       | None           |
| Get file contents | `GET /repos/{owner}/{repo}/contents/{path}`         | Optional       |

**Raw File Access Pattern:**

```
https://raw.githubusercontent.com/{username}/{repo}/{branch}/{filepath}
Example: https://raw.githubusercontent.com/jobseeker/amar-career-cvs/main/cvs/role-based/frontend-developer/v1.0/cv.pdf
```

### 5.3 Manual Upload Process (Since no backend)

Since there's no backend server, CV uploads will be manual:

**Option A: Direct GitHub Web Interface**

1. User creates CV using AI tool
2. Downloads/creates .tex and .pdf files
3. Opens GitHub repository in browser
4. Uploads files to appropriate folder
5. Copies file URLs
6. Pastes URLs into CV Manager form

**Option B: GitHub Desktop App**

1. Clone repository locally
2. Add CV files to local repo
3. Commit and push changes
4. Copy file URLs from GitHub web
5. Add to CV Manager

**Option C: Future Enhancement - GitHub API Upload**

- Add authenticated GitHub API calls
- Allow direct upload from web app
- Requires GitHub Personal Access Token

---

## 6. Profile Page Structure

### 6.1 Markdown View Tab

**Display Features:**

- Full Markdown rendered with syntax highlighting
- "Copy to Clipboard" button (one-click copy)
- "Download .md" button (saves as profile.md)
- "Refresh from Profile" button (regenerates from current data)
- Character/word count display
- Preview mode vs Raw mode toggle

**Markdown Format Example:**

```markdown
# Job Seeker - Senior Software Engineer

## Contact

- **Email**: jobseeker@example.com
- **Phone**: +880123456789
- **LinkedIn**: [linkedin.com/in/jobseeker](https://linkedin.com/in/jobseeker)
- **GitHub**: [github.com/jobseeker](https://github.com/jobseeker)
- **Portfolio**: [jobseeker.dev](https://jobseeker.dev)

## Professional Summary

Experienced software engineer with 5+ years of full-stack development
experience. Passionate about building scalable applications and mentoring
junior developers...

## Technical Skills

- **Languages**: JavaScript, TypeScript, Python, Java
- **Frontend**: React, Vue.js, Tailwind CSS
- **Backend**: Node.js, Express, Django
- **Database**: PostgreSQL, MongoDB, Firebase
- **Tools**: Git, Docker, AWS, Jenkins

## Work Experience

### Senior Software Engineer | Company A | Dhaka

_2022 - Present_

- Led a team of 5 engineers to rebuild legacy system
- Increased performance by 40% through optimization
- Implemented CI/CD pipeline reducing deployment time by 60%

### Software Engineer | Company B | Dhaka

_2020 - 2022_

- Developed REST APIs serving 100K+ daily users
- Collaborated with cross-functional teams for feature delivery

## Education

### Bachelor of Science in Computer Science

**BUET** | Dhaka | _2016 - 2020_

- CGPA: 3.80/4.00
- Thesis: "Machine Learning for Healthcare"

## Certifications

- **AWS Solutions Architect** - Amazon (2023)
- **Meta Frontend Specialization** - Coursera (2022)

## Projects

### E-Commerce Platform

_React, Node.js, MongoDB, Stripe_

- Built full-stack e-commerce with 1000+ monthly users
- Integrated payment gateway and inventory management
- [GitHub](link) | [Live Demo](link)
```

---

## 7. Markdown Profile System

### 7.1 Markdown Generation Logic

**Auto-generation triggers:**

- User saves any structured profile field
- User clicks "Regenerate Markdown" button
- On initial profile creation

**Generation Process:**

1. Fetch complete structured profile from Firestore
2. Convert each section to Markdown format
3. Apply formatting rules (headings, lists, links)
4. Combine sections in logical order
5. Save to `profile_markdown` collection
6. Increment version number
7. Display in Markdown View tab

### 7.2 Customization Options

**Markdown Presets:**

- **Detailed Mode**: Include all sections (default)
- **Technical Mode**: Emphasize skills, projects, technical experience
- **Management Mode**: Emphasize leadership, team management
- **Academic Mode**: Emphasize education, publications, research

**Export Options:**

- Copy raw Markdown
- Download as .md file
- Copy as formatted text (HTML)
- Send to AI tool (copy to clipboard with instructions)

---

## 8. CV Management System

### 8.1 CV Manager Interface Layout

```
┌────────────────────────────────────────────────────────────┐
│  CV MANAGER                                    [+ New CV]  │
│  Manage all your CV versions and templates                 │
├────────────────────────────────────────────────────────────┤
│  ┌─ FILTERS ─────────────────────────────────────────────┐ │
│  │  Category: [All ▼]  Role: [All ▼]  Search: [______] │ │
│  └───────────────────────────────────────────────────────┘ │
│                                                            │
│  ┌─ ROLE-BASED CVs (3) ─────────────────────────────────┐  │
│  │                                                        │  │
│  │  ┌──────────────┐  ┌──────────────┐  ┌────────────┐  │  │
│  │  │ Frontend     │  │ Backend      │  │ Full Stack │  │  │
│  │  │ Developer    │  │ Developer    │  │ Developer  │  │  │
│  │  │ React Focus  │  │ Node.js/Go   │  │ MERN Stack │  │  │
│  │  │ [Download]   │  │ [Download]   │  │ [Download] │  │  │
│  │  │ [Edit] [X]   │  │ [Edit] [X]   │  │ [Edit] [X] │  │  │
│  │  └──────────────┘  └──────────────┘  └────────────┘  │  │
│  └────────────────────────────────────────────────────────┘  │
│                                                            │
│  ┌─ JOB-SPECIFIC CVs (7) ───────────────────────────────┐  │
│  │                                                        │  │
│  │  Google - SWE II                           Jan 2025   │  │
│  │  Customized for Google's backend role       [Download]│  │
│  │  [View Job] [Edit] [Delete]                [Reuse]    │  │
│  │  ───────────────────────────────────────────────────  │  │
│  │                                                        │  │
│  │  Meta - Frontend Engineer                   Jan 2025   │  │
│  │  Focused on React and system design         [Download]│  │
│  │  [View Job] [Edit] [Delete]                [Reuse]    │  │
│  └────────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────┘
```

### 8.2 CV Creation Workflow

**Step-by-Step New CV Creation:**

**Step 1: Choose CV Type**

- [ ] Role-Based Template (reusable for multiple jobs)
- [ ] Job-Specific (for single application)

**Step 2: Provide Basic Info**

- CV Name: "Frontend Developer - React Focus"
- Description: "Optimized for frontend roles with React/Redux expertise"
- Target Role: (dropdown from existing or custom)

**Step 3: Select Source Information**

- [x] Use Master Profile (always included)
- [x] Include Job Description? (if job-specific)
- [ ] Include Specific Skills Only: [Select skills]
- [ ] Include Specific Projects Only: [Select projects]
- [ ] Include Specific Experiences: [Select experiences]

**Step 4: Generate CV Content**

- Button: "Generate AI Prompt"
- System combines selections into prompt template
- User copies prompt to ChatGPT/Claude/DeepSeek
- AI returns CV content (LaTeX or Markdown)

**Step 5: Process AI Output**

- User reviews AI-generated CV
- Makes manual adjustments if needed
- Saves as .tex and .pdf files

**Step 6: Upload to GitHub**

- User uploads files to GitHub repository
- Copies file URLs
- Pastes URLs into the form

**Step 7: Save to System**

- Button: "Save CV to Library"
- System stores metadata in Firestore
- CV appears in CV Manager

### 8.3 CV Generation Prompt Builder

**Prompt Builder Interface:**

```
┌──────────────────────────────────────────────────────────┐
│  PROMPT BUILDER FOR AI CV GENERATION                     │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  CV Type: [Job-Specific ▼]                              │
│                                                          │
│  Job Title: Software Engineer II                        │
│  Company: Google                                         │
│                                                          │
│  Additional Focus Areas:                                │
│  ☑️ Highlight backend experience                        │
│  ☑️ Emphasize system design skills                      │
│  ☐ Focus on leadership and mentoring                    │
│  ☐ Include open source contributions                    │
│                                                          │
│  Exclude Sections:                                      │
│  ☐ Volunteering                                        │
│  ☐ Certifications before 2020                          │
│                                                          │
│  Page Limit: [2] pages                                  │
│                                                          │
│  Output Format: [LaTeX] [Markdown] [Plain Text]        │
│                                                          │
│  [GENERATE PROMPT]  [COPY PROMPT]  [SAVE AS TEMPLATE]  │
└──────────────────────────────────────────────────────────┘
```

**Generated Prompt Example:**

```
Create a CV for "Software Engineer II" position at "Google".

JOB DESCRIPTION HIGHLIGHTS:
- 5+ years backend experience
- Strong system design skills
- Experience with distributed systems

FROM MY PROFILE, INCLUDE:
- 5 years at Company A (backend focus)
- System design project: E-commerce platform
- Distributed systems course and implementation

FROM MY PROFILE, EXCLUDE:
- Frontend projects
- Volunteering experience

REQUIREMENTS:
- 2 pages maximum
- Achievement-oriented language
- Use STAR format for experiences
- Output in LaTeX format

COMPLETE PROFILE MARKDOWN:
[Full profile will be inserted here]
```

### 8.4 CV Listing and Filtering

**Filter Options:**

- **Category**: Role-Based, Job-Specific, All
- **Role Type**: Frontend, Backend, Full Stack, Data Science, DevOps
- **Date Range**: Last 30 days, Last 6 months, Last year, All time
- **Tags**: React-focused, System Design, Leadership, etc.

**Sort Options:**

- Most recent
- Most downloaded
- Alphabetical (A-Z)
- Alphabetical (Z-A)

**Search Functionality:**

- Search by CV name
- Search by job title/company
- Search by tags
- Search by description text

### 8.5 CV Actions Menu

For each CV card, provide:

**Primary Actions:**

- **Download PDF** - Direct download of PDF file
- **View LaTeX** - Display LaTeX source in modal
- **Copy Link** - Copy GitHub raw URL to clipboard

**Secondary Actions (dropdown/context menu):**

- **Edit Metadata** - Update name, description, tags
- **Duplicate** - Create copy as new CV
- **Link to Job** - Associate with existing job entry
- **Generate Thumbnail** - Auto-create preview image
- **Archive** - Move to archive (not delete)
- **Delete** - Remove from index (files remain on GitHub)

**Job Association:**

- If CV is job-specific, show "View Application" button
- Links directly to the Job page for that application
- Shows job status and application date

---

## 9. Implementation Checklist

### Phase 1: Profile Data Structure (Week 1)

- [ ] Create Firestore collection `profile` with complete schema
- [ ] Create `profile_markdown` collection
- [ ] Implement security rules for personal use
- [ ] Create sample profile data for testing
- [ ] Test Firestore read/write operations

### Phase 2: Profile Page UI Components (Week 2)

- [ ] Create Profile component with tabs structure
- [ ] Implement Structured View with all sections
- [ ] Build edit forms for each section type
- [ ] Add inline editing capabilities
- [ ] Create profile completeness calculator
- [ ] Add avatar/summary card at top

### Phase 3: Markdown System (Week 3)

- [ ] Create Markdown generation function from structured data
- [ ] Implement Markdown rendering component
- [ ] Add copy to clipboard functionality
- [ ] Build Markdown download feature
- [ ] Create auto-regeneration on profile change
- [ ] Add word/character count display

### Phase 4: CV Index Database (Week 3)

- [ ] Create `cv_index` collection schema
- [ ] Implement CRUD operations for CV metadata
- [ ] Add file URL validation
- [ ] Create CV categorization logic
- [ ] Build CV search and filter functions

### Phase 5: CV Manager Interface (Week 4)

- [ ] Build CV Manager page/tab
- [ ] Implement CV cards grid/list view
- [ ] Create filter and sort controls
- [ ] Add search functionality
- [ ] Build "New CV" creation flow
- [ ] Implement CV download link generation
- [ ] Add CV delete/edit/duplicate actions

### Phase 6: GitHub Integration (Week 4)

- [ ] Create GitHub repository structure
- [ ] Upload sample CV files to GitHub
- [ ] Implement URL generation functions
- [ ] Create manual upload instructions UI
- [ ] Add file validation (check if URL exists)
- [ ] Build thumbnail generation (optional)

### Phase 7: AI Prompt Builder (Week 5)

- [ ] Create prompt builder interface
- [ ] Implement profile data selection (skills, projects)
- [ ] Build dynamic prompt generation
- [ ] Add copy to clipboard with formatting
- [ ] Create saved prompt templates
- [ ] Add job description parser (optional)

### Phase 8: Job Integration (Week 5)

- [ ] Link CV manager with Jobs page
- [ ] Add "Create CV for this Job" button on Job page
- [ ] Implement CV selector in Job edit form
- [ ] Show CV download button on Job cards
- [ ] Display CV link in Job detail view

### Phase 9: Testing and Polish (Week 6)

- [ ] Test all CRUD operations
- [ ] Validate all file URLs
- [ ] Test on different browsers
- [ ] Mobile responsiveness check
- [ ] Performance optimization
- [ ] Error handling and user feedback

---

## 10. File Structure

### 10.1 Source Code Organization

```
src/
├── firebase.js                    # Firebase config (existing)
├── hooks/
│   ├── useJobs.js                 # Existing jobs hook
│   ├── useProfile.js              # NEW: Profile CRUD operations
│   └── useCVManager.js            # NEW: CV indexing operations
│
├── components/
│   ├── Sidebar.jsx                # Existing
│   ├── JobForm.jsx                # Existing
│   ├── JobCard.jsx                # Existing
│   │
│   └── profile/                   # NEW: Profile components
│       ├── ProfileHero.jsx        # Top card with name/title/completeness
│       ├── StructuredProfile.jsx  # Tab content - structured view
│       ├── MarkdownProfile.jsx    # Tab content - markdown view
│       ├── ProfileSection.jsx     # Reusable section component
│       ├── SectionEditor.jsx      # Modal for editing sections
│       ├── SkillsManager.jsx      # Skills array editor
│       ├── ExperienceList.jsx     # Work experience list and editor
│       ├── EducationList.jsx      # Education list and editor
│       ├── ProjectList.jsx        # Projects list and editor
│       └── ProfileCompleteness.jsx # Completeness calculator
│
├── components/cv/                 # NEW: CV Management components
│   ├── CVManager.jsx              # Main CV manager component
│   ├── CVCard.jsx                 # Individual CV card
│   ├── CVGrid.jsx                 # Grid/list view of CVs
│   ├── CVFilters.jsx              # Filter and sort controls
│   ├── CVForm.jsx                 # Create/edit CV form
│   ├── CVUploader.jsx             # Manual upload helper
│   ├── PromptBuilder.jsx          # AI prompt generator
│   └── CVDownloadButton.jsx       # Reusable download button
│
└── pages/
    ├── Dashboard.jsx              # Existing (link to CVs may be added)
    ├── Jobs.jsx                   # Existing (add CV linking)
    ├── Profile.jsx                # MODIFY: Add tabs and CV Manager
    ├── Analytics.jsx              # Existing (add CV analytics later)
    └── Notes.jsx                  # Existing
```

### 10.2 Utility Functions (New)

Create `src/utils/` directory:

```
src/utils/
├── markdownGenerator.js           # Convert structured profile to Markdown
├── githubHelpers.js               # GitHub URL generators and validators
├── promptTemplates.js             # CV generation prompt templates
├── fileHelpers.js                 # File download helpers
└── validation.js                  # URL and data validation
```

### 10.3 New CSS/Design Tokens

Add to `src/index.css`:

```css
/* CV Card Styles */
.cv-card {
}
.cv-card-actions {
}
.cv-badge-role-based {
}
.cv-badge-job-specific {
}

/* Profile Section Styles */
.profile-section {
}
.profile-section-header {
}
.profile-section-content {
}
.inline-edit-form {
}

/* Markdown Viewer */
.markdown-viewer {
}
.markdown-toolbar {
}
.markdown-content {
}

/* Prompt Builder */
.prompt-builder {
}
.prompt-section {
}
.preview-pane {
}
```

---

## 11. User Workflow

### 11.1 Initial Profile Setup

1. User navigates to Profile page
2. Sees empty profile with "Complete Your Profile" prompt
3. Clicks "Edit Profile" or individual section "+ Add" buttons
4. Fills in basic information (name, title, contact)
5. Adds work experience one by one
6. Adds education, skills, projects
7. Each save triggers:
   - Firestore update
   - Markdown regeneration
   - Completeness percentage update
8. User completes all sections over time
9. Master profile Markdown is always up-to-date

### 11.2 Creating First Role-Based CV

1. User goes to "CV Manager" tab in Profile page
2. Clicks "+ New CV" button
3. Selects "Role-Based Template"
4. Names it "Frontend Developer CV"
5. Clicks "Generate AI Prompt"
6. System shows prepared prompt with Master Profile
7. User copies prompt to ChatGPT/Claude
8. AI generates CV in LaTeX format
9. User reviews and adjusts
10. Saves as .tex and converts to .pdf
11. Uploads to GitHub repository (manually)
12. Copies raw file URLs from GitHub
13. Pastes URLs into CV form
14. Clicks "Save CV"
15. CV appears in Role-Based section

### 11.3 Creating Job-Specific CV During Application

1. User finds job on Jobs page
2. Adds job details using Job Form
3. After saving, sees "Create Custom CV" button
4. Clicks button → opens CV Generator with job context
5. System auto-fills:
   - CV Type: Job-Specific
   - Job Title: from job entry
   - Company: from job entry
   - Job Description: from job entry (if added)
6. User selects which skills/projects to emphasize
7. Generates AI prompt with job-specific instructions
8. Copies prompt to AI tool
9. AI generates tailored CV
10. User uploads to GitHub in job-specific folder
11. Saves CV and automatically links to job
12. Job card now shows "Download CV" button

### 11.4 Using CV for Existing Job

1. User opens existing job entry
2. Sees "Link CV" section
3. Clicks "Browse CV Library"
4. Modal shows all role-based and other CVs
5. Selects appropriate CV
6. Optionally: "Copy and Customize for this Job"
7. System creates new CV entry based on selected CV
8. User customizes further using AI
9. New job-specific CV created and linked

### 11.5 Maintaining CVs Over Time

1. User updates Master Profile with new skills/experience
2. All future CVs automatically use updated profile
3. Existing CVs remain unchanged (historical record)
4. User can "Regenerate from Current Profile" for old CVs
5. Creates new version while keeping old version archived

---

## 12. Security Considerations

### 12.1 Data Privacy

**Firestore Security:**

- Keep database in test mode ONLY for personal use
- No public access - only your IP/device
- Consider adding Firebase Authentication for extra security
- Do NOT store sensitive personal data (national ID, bank accounts)

**GitHub Security:**

- CVs on GitHub are PUBLIC if repository is public
- Consider making CV repository PRIVATE for better privacy
- Private repos: Files accessible only to you (logged in)
- Raw URLs from private repos require authentication

**Recommendation:** Keep CV repository PRIVATE

- GitHub free tier includes unlimited private repos
- Use GitHub's raw URLs with authentication tokens
- Or download directly from GitHub web interface

### 12.2 API Key Safety

Firebase configuration in `firebase.js`:

- API keys are meant to be public in Firebase
- Security comes from database rules, not API keys
- Safe to commit to version control for personal projects
- For public deployment, use environment variables

### 12.3 Data Backup

**Automated Backup Strategy:**

1. Firestore data backed up weekly (Firebase console)
2. GitHub serves as CV file backup
3. Export profile data as JSON periodically
4. Consider backup script using Firebase CLI

**Manual Backup Options:**

- Profile page → "Export All Data" button
- Downloads complete profile as JSON + Markdown
- CV Manager → "Export Index" saves cv_index as JSON

---

## 13. Testing Requirements

### 13.1 Functional Tests

| Test ID | Test Case                      | Expected Result                              |
| ------- | ------------------------------ | -------------------------------------------- |
| P-01    | Create new profile entry       | Firestore document created                   |
| P-02    | Edit profile field             | Firestore updates, Markdown regenerates      |
| P-03    | Delete experience entry        | Entry removed from array                     |
| P-04    | Calculate completeness         | Correct percentage based on filled fields    |
| M-01    | Generate Markdown from profile | Contains all sections with proper formatting |
| M-02    | Copy Markdown to clipboard     | Clipboard contains exact Markdown text       |
| M-03    | Download Markdown file         | .md file downloads with correct content      |
| C-01    | Create new CV metadata         | Firestore document created with CV ID        |
| C-02    | Upload CV via form             | URLs saved, CV appears in list               |
| C-03    | Download CV PDF                | File downloads or opens in new tab           |
| C-04    | Filter CVs by category         | Only matching CVs displayed                  |
| C-05    | Search CVs                     | Shows only CVs containing search term        |
| C-06    | Link CV to Job                 | Job document gets cvId reference             |
| G-01    | Generate AI prompt             | Prompt includes master profile context       |
| G-02    | Copy AI prompt                 | Prompt template + profile copied             |

### 13.2 Edge Cases

- Empty profile generates empty sections message
- Very large Markdown (5000+ words) performs acceptably
- Invalid GitHub URLs show error message
- Duplicate CV names handled gracefully
- Deleting linked CV shows warning
- Network errors during save show user-friendly message

### 13.3 Browser Compatibility

- Chrome (latest)
- Firefox (latest)
- Edge (latest)
- Safari (latest)
- Mobile browsers (Chrome/Safari on iOS/Android)

---

## 14. Future Enhancements

### 14.1 Phase 2 Additions (Post-MVP)

**Automated GitHub Upload:**

- Integrate GitHub API with Personal Access Token
- Direct upload of CV files from web app
- Auto-generate thumbnails from PDF first page

**CV Analytics:**

- Track which CVs get most downloads
- Which CV versions lead to more interviews
- A/B testing different CV formats

**Job Description Parser:**

- Paste job URL → auto-extract requirements
- Highlight matching skills from profile
- Suggest which CV template to use

**Bulk CV Operations:**

- Generate CVs for multiple jobs at once
- Batch download selected CVs as ZIP
- Batch update CV tags

### 14.2 Integration with Other Features

**Analytics Dashboard Integration:**

- Show CV effectiveness metrics
- Success rate by CV type
- Interview conversion rate per CV version

**Notes Page Integration:**

- Link preparation notes to specific CV version
- Store interview questions related to CV content
- Track which CV statements were asked about

**Job Application Automation:**

- Auto-fill application forms from profile
- Generate cover letters using same profile
- Track application to interview ratio by CV version

### 14.3 Advanced CV Features

**CV Version Control:**

- Git-like version history for CVs
- Diff view between CV versions
- Rollback to previous versions

**Collaboration Features (if team use needed):**

- Share CVs for feedback
- Comment system on CV drafts
- Review workflow for CV approval

**Templating System:**

- Visual CV template designer
- Multiple layout options
- Color scheme customization

---

## 15. Success Metrics

### 15.1 Feature Completion Checklist

- [ ] Can store ALL professional information in structured format
- [ ] Master Markdown profile automatically maintained
- [ ] Users can copy Markdown with one click
- [ ] Different CV types (role-based, job-specific) supported
- [ ] CVs organized and searchable in CV Manager
- [ ] Each job can have linked custom CV
- [ ] Download PDF directly from application
- [ ] AI prompt generation saves time in CV creation
- [ ] Zero cost to maintain (Firebase + GitHub free tiers)

### 15.2 User Experience Goals

- Profile setup takes <30 minutes for complete history
- Creating new CV takes <5 minutes (excluding AI generation)
- Finding existing CV takes <10 seconds with filters
- Linking CV to job takes <15 seconds
- Copying Markdown profile takes 1 click, <2 seconds

---

## 16. Troubleshooting Guide

### Common Issues and Solutions

| Issue                       | Possible Cause               | Solution                                             |
| --------------------------- | ---------------------------- | ---------------------------------------------------- |
| Profile not saving          | Firestore rules              | Check Firebase console, update rules                 |
| Markdown not updating       | Missing regeneration trigger | Click "Refresh" button manually                      |
| CV download fails           | Invalid GitHub URL           | Verify file exists and URL format correct            |
| CV not appearing in list    | Filter active                | Clear all filters                                    |
| Prompt missing profile data | Profile not saved            | Save profile before generating prompt                |
| GitHub file not accessible  | Private repository           | Use GitHub token or make repo private but accessible |

---

## 17. Documentation Maintenance

This document should be updated when:

- New features are added
- Database schema changes
- New components are created
- User workflows change

**Document Version:** 1.0
**Last Updated:** 2025
**Maintainer:** Project Author

---

## End of Documentation

This implementation blueprint provides complete guidance for building the Profile and CV Management system. Use this document as a reference during development. Save this file in your project under `docs/profile-cv-implementation.md`
