// src/data/profile.js
// Profile data for Md Shahajalal Mahmud — Android & Backend Engineer · Founder @ Appriyo

export const profile = {

  /* ─────────────────────────── BASIC INFO ─────────────────────────── */
  basic: {
    name: 'Md Shahajalal Mahmud',
    initials: 'SM',
    title: 'Android & Backend Engineer',
    tagline: 'Building scalable systems that solve real-world problems',
    subtitle: 'CSE Undergraduate · FinTech Enthusiast · Founder',
    location: 'Khulna, Bangladesh',
    company: 'Appriyo',
    companyRole: 'Founder & Lead Engineer',
    status: 'Open to opportunities',
    statusActive: true,
    cgpa: '3.90 / 4.00',
    university: 'Northern University of Business & Technology Khulna',
    graduationYear: '2027 (Expected)',
  },

  /* ─────────────────────────── CONTACT & LINKS ─────────────────────────── */
  contact: {
    email: 'mahmud.nubtk@gmail.com',
    phone: '+880 1889 793146',
    location: 'Khulna, Bangladesh',
  },

  links: [
    { id: 'github',    label: 'GitHub',    url: 'https://github.com/shahjalal-mahmud',                        icon: '⌥', kind: 'dev' },
    { id: 'linkedin',  label: 'LinkedIn',  url: 'https://linkedin.com/in/md-shahajalal-mahmud',               icon: '🔗', kind: 'social' },
    { id: 'portfolio', label: 'Portfolio', url: 'https://shahajalalmahmud.netlify.app/',                       icon: '🌐', kind: 'web' },
    { id: 'company',   label: 'Appriyo',   url: 'https://appriyo.com',                                        icon: '🏗️', kind: 'company' },
    { id: 'email',     label: 'Email',     url: 'mailto:mahmud.nubtk@gmail.com',                              icon: '✉️', kind: 'contact' },
  ],

  /* ─────────────────────────── BIO ─────────────────────────── */
  bio: `Android & Backend Engineer running Appriyo end-to-end — from system design and infrastructure to mobile delivery. I build production-grade software: multi-tenant SaaS with strict data isolation, offline-first Android apps that survive poor connectivity, and secure REST APIs with JWT and RBAC baked in from day one.

I care about reliability over features. My systems are designed to stay up at 3am, handle one bad query without taking everyone else down, and scale without a rewrite. I've shipped to real users, watched things break under real load, and rebuilt them better — twice.

Currently deepening expertise in multi-tenant backend architecture, on-device AI with TFLite, and production Android engineering with Kotlin and Jetpack Compose.`,

  bioShort: `Android & Backend Engineer. Founder of Appriyo. I build systems that scale, isolate data properly, and don't break at 3am. Kotlin, Node.js, PostgreSQL, Jetpack Compose — end to end.`,

  /* ─────────────────────────── HERO STATS ─────────────────────────── */
  stats: [
    { id: 'cgpa',     value: '3.90',   unit: '/4.00', label: 'CGPA',            icon: '🎓', color: '#f59e0b' },
    { id: 'projects', value: '15+',    unit: '',      label: 'Projects Shipped', icon: '🚀', color: '#34d399' },
    { id: 'hackathon',value: 'Top 100',unit: '',      label: 'SOLVIO AI 2025',  icon: '🏆', color: '#818cf8' },
    { id: 'uptime',   value: '99.9%',  unit: '',      label: 'Crash-Free Rate', icon: '⚡', color: '#f59e0b' },
  ],

  /* ─────────────────────────── SPECIALIZATIONS ─────────────────────────── */
  specializations: [
    { label: 'Android Engineering',        icon: '📱', desc: 'Kotlin, Jetpack Compose, MVVM, Coroutines, Room DB' },
    { label: 'Backend Systems',            icon: '🗄️', desc: 'Node.js, Prisma, PostgreSQL, REST APIs, JWT/RBAC' },
    { label: 'Multi-Tenant SaaS',          icon: '🏗️', desc: 'Data isolation, role-based access, transactional safety' },
    { label: 'Offline-First Architecture', icon: '📶', desc: 'Room DB, sync strategies, local-first UX' },
    { label: 'On-Device AI',               icon: '🧠', desc: 'TensorFlow Lite, model optimization, real-time inference' },
    { label: 'Secure Systems',             icon: '🔐', desc: 'AES-256, Android Keystore, secure SDK design' },
  ],

  /* ─────────────────────────── TECH STACK ─────────────────────────── */
  techStack: [
    {
      category: 'Languages',
      icon: '💬',
      items: [
        { name: 'Kotlin',      level: 'Expert',       color: '#7F52FF' },
        { name: 'Java',        level: 'Advanced',     color: '#ED8B00' },
        { name: 'TypeScript',  level: 'Proficient',   color: '#3178C6' },
        { name: 'JavaScript',  level: 'Proficient',   color: '#F7DF1E' },
        { name: 'C++',         level: 'Intermediate', color: '#00599C' },
        { name: 'SQL',         level: 'Advanced',     color: '#4479A1' },
      ],
    },
    {
      category: 'Android',
      icon: '📱',
      items: [
        { name: 'Jetpack Compose', level: 'Expert',     color: '#4285F4' },
        { name: 'Coroutines',      level: 'Expert',     color: '#7F52FF' },
        { name: 'Room DB',         level: 'Expert',     color: '#3DDC84' },
        { name: 'MVVM',            level: 'Expert',     color: '#3DDC84' },
        { name: 'WorkManager',     level: 'Advanced',   color: '#3DDC84' },
        { name: 'TFLite',          level: 'Proficient', color: '#FF6F00' },
      ],
    },
    {
      category: 'Backend',
      icon: '🗄️',
      items: [
        { name: 'Node.js',     level: 'Advanced',   color: '#339933' },
        { name: 'Prisma',      level: 'Advanced',   color: '#2D3748' },
        { name: 'PostgreSQL',  level: 'Advanced',   color: '#4169E1' },
        { name: 'Firebase',    level: 'Advanced',   color: '#FFCA28' },
        { name: 'Spring Boot', level: 'Proficient', color: '#6DB33F' },
        { name: 'Apache Kafka',level: 'Familiar',   color: '#231F20' },
      ],
    },
    {
      category: 'Architecture',
      icon: '🏛️',
      items: [
        { name: 'Multi-Tenant Design', level: 'Expert',     color: '#f59e0b' },
        { name: 'JWT / RBAC',          level: 'Expert',     color: '#f59e0b' },
        { name: 'Offline-First',       level: 'Expert',     color: '#34d399' },
        { name: 'Clean Architecture',  level: 'Advanced',   color: '#818cf8' },
        { name: 'REST API Design',     level: 'Advanced',   color: '#FF5722' },
        { name: 'Design Patterns',     level: 'Advanced',   color: '#818cf8' },
      ],
    },
    {
      category: 'Tools & CS',
      icon: '⚙️',
      items: [
        { name: 'Git',             level: 'Expert',       color: '#F05032' },
        { name: 'Linux CLI',       level: 'Advanced',     color: '#FCC624' },
        { name: 'DSA / LeetCode',  level: 'Advanced',     color: '#f59e0b' },
        { name: 'Android Studio',  level: 'Expert',       color: '#3DDC84' },
        { name: 'Prompt Engineering', level: 'Advanced',  color: '#818cf8' },
        { name: 'Technical Docs',  level: 'Advanced',     color: '#8b97b8' },
      ],
    },
  ],

  /* ─────────────────────────── CURRENT PROJECTS ─────────────────────────── */
  currentProjects: [
    {
      id: 'amar-repair',
      name: 'Amar Repair',
      tagline: 'Multi-Tenant SaaS for repair shop management',
      description: 'End-to-end repair business management platform with strict per-tenant data isolation, RBAC, and transaction-safe workflows. Production-grade Android app with 99.9% crash-free rate.',
      status: 'In Production',
      statusColor: '#34d399',
      featured: true,
      type: 'SaaS Platform',
      stack: ['Kotlin', 'Jetpack Compose', 'Node.js', 'PostgreSQL', 'Prisma', 'JWT'],
      highlights: [
        'Multi-tenant architecture with per-tenant data isolation',
        'Secure REST APIs with JWT auth and role-based access control',
        'Transaction-safe workflows for payments, repairs, and inventory',
        '99.9% crash-free Android performance in production',
      ],
      link: null,
      icon: '🔧',
    },
    {
      id: 'amar-batch',
      name: 'Amar Batch',
      tagline: 'Offline-first tutor & student management system',
      description: 'Android app for Bangladeshi tutors to manage students, attendance, and fees — works without internet. Built on Room DB with sync support, reducing manual workload by ~80%.',
      status: 'Active Development',
      statusColor: '#f59e0b',
      featured: true,
      type: 'Mobile App',
      stack: ['Kotlin', 'Jetpack Compose', 'Room DB', 'MVVM', 'Coroutines'],
      highlights: [
        'Offline-first architecture using Room DB with sync support',
        '~80% reduction in manual administrative workload',
        'Efficient local schema optimized for fast queries',
        'SMS alerts integration for student/parent communication',
      ],
      link: 'https://github.com/Appriyo/amar-batch-showcase',
      icon: '📚',
    },
    {
      id: 'nfc-card',
      name: 'NFC Digital Card',
      tagline: 'Premium physical-digital networking product',
      description: 'A premium NFC-enabled physical card linked to a dynamic elite profile engine. Tap to share, connect, and impress — digital networking reimagined for professionals.',
      status: 'Proprietary',
      statusColor: '#818cf8',
      featured: false,
      type: 'Product',
      stack: ['Android', 'NFC', 'Node.js', 'Firebase'],
      highlights: [
        'Physical NFC card with dynamic profile backend',
        'Elite profile engine with real-time updates',
        'Professional networking reimagined',
      ],
      link: 'https://appriyo.com',
      icon: '💳',
    },
    {
      id: 'appriyo',
      name: 'Appriyo',
      tagline: 'Official IT firm — scalable business solutions',
      description: 'My IT firm delivering end-to-end product engineering. Architected a responsive platform for business solutions. Running everything solo: system design, infrastructure, and mobile.',
      status: 'Live',
      statusColor: '#34d399',
      featured: false,
      type: 'Company',
      stack: ['React', 'Node.js', 'PostgreSQL'],
      highlights: [
        'End-to-end product engineering as solo technical founder',
        'Delivering production SaaS and mobile products',
        'Responsive business platform with scalable architecture',
      ],
      link: 'https://appriyo.com',
      icon: '🚀',
    },
  ],

  /* ─────────────────────────── FEATURED ENGINEERING WORK ─────────────────────────── */
  featuredWork: [
    {
      id: 'algoviz',
      name: 'AlgoViz',
      subtitle: 'Visual Algorithm Intelligence in VS Code',
      description: 'Interactive VS Code extension that visualizes algorithms step-by-step, benchmarks performance across input scales, and detects time complexity empirically — directly inside the editor.',
      year: '2026',
      link: 'https://github.com/shahjalal-mahmud/algo-viz',
      icon: '⚡',
      tags: ['VS Code Extension', 'TypeScript', 'Python', 'WebView'],
      bullets: [
        'VS Code extension + Python instrumentation layer for step-by-step execution tracking',
        'Animation engine visualizing compare, swap, and recursion flow operations',
        'Real benchmarking system with runtime graphs across input scales',
        'Empirical complexity detection using normalized curves (n, n log n, n²)',
        'Interactive WebView UI with controls, timeline, and performance insights',
      ],
    },
    {
      id: 'cashguard',
      name: 'CashGuard AI',
      subtitle: 'Real-Time On-Device Fake Currency Detection',
      description: 'AI-powered Android app using TensorFlow Lite for real-time counterfeit currency detection with 98.7% accuracy. Top 100 finalist at SOLVIO AI Hackathon 2025.',
      year: '2025',
      link: 'https://github.com/shahjalal-mahmud/CashGuardAI',
      icon: '💸',
      tags: ['TensorFlow Lite', 'Kotlin', 'On-Device AI', '🏆 Top 100'],
      bullets: [
        '98.7% detection accuracy on-device with no network dependency',
        'Optimized TFLite model for real-time camera feed inference',
        'Top 100 National Finalist — SOLVIO AI Hackathon 2025',
        'Handles detection under varied lighting and currency orientations',
      ],
    },
    {
      id: 'finpaysdk',
      name: 'FinPaySDK',
      subtitle: 'Secure Android Payment Integration Library',
      description: 'Production-ready Android payment SDK with AES-256 encryption, Android Keystore integration, and modular architecture — 100% test coverage.',
      year: '2025',
      link: 'https://github.com/shahjalal-mahmud/FinPayDemo',
      icon: '🔐',
      tags: ['Kotlin', 'AES-256', 'Android Keystore', 'SDK'],
      bullets: [
        'AES-256 encryption with Android Keystore for key management',
        'Modular architecture for easy integration into any Android project',
        '100% unit test coverage ensuring library integrity',
        'Security-first design following OWASP mobile security guidelines',
      ],
    },
    {
      id: 'jpmorgan',
      name: 'JPMorgan Chase Midas Simulation',
      subtitle: 'Kafka + Spring Boot Transaction Processor',
      description: 'Built a high-throughput transaction processor using Apache Kafka and Spring Boot with database persistence and REST APIs — part of JPMorgan Chase Forage simulation.',
      year: '2024',
      link: 'https://github.com/shahjalal-mahmud/forage-midas',
      icon: '🏦',
      tags: ['Spring Boot', 'Apache Kafka', 'JPA', 'REST API'],
      bullets: [
        'High-throughput Kafka consumer-producer pipeline for transaction processing',
        'Spring Boot REST APIs with JPA persistence layer',
        'Database-backed transaction audit trail and reconciliation',
      ],
    },
  ],

  /* ─────────────────────────── EXPERIENCE TIMELINE ─────────────────────────── */
  experience: [
    {
      id: 'appriyo-founder',
      role: 'Founder & Lead Engineer',
      company: 'Appriyo',
      companyUrl: 'https://appriyo.com',
      period: 'Oct 2025 – Present',
      type: 'Full-time · Founder',
      location: 'Khulna, Bangladesh (Remote)',
      current: true,
      description: 'Building and shipping production systems end-to-end as a solo technical founder. Responsible for system design, infrastructure, backend, Android, and client delivery.',
      highlights: [
        'Architected multi-tenant SaaS (Amar Repair) with per-tenant data isolation and RBAC',
        'Shipping production Android apps with 99.9% crash-free rates in the wild',
        'Conducted rigorous code reviews and enforced Clean Architecture standards',
        'Full-cycle ownership: system design → implementation → deployment → support',
      ],
      stack: ['Kotlin', 'Node.js', 'PostgreSQL', 'Jetpack Compose', 'Prisma'],
    },
    {
      id: 'freelance',
      role: 'Freelance Developer',
      company: 'Independent',
      companyUrl: null,
      period: '2024 – 2025',
      type: 'Freelance',
      location: 'Remote',
      current: false,
      description: 'Delivered full-stack web and Android projects for clients in Bangladesh and the US, including a wholesale business website for a Los Angeles-based client.',
      highlights: [
        'Built and deployed full website for One Stop Liquor (LA-based wholesaler)',
        'Handled domain setup, deployment, and full development lifecycle',
        'Delivered academic portfolio + CMS for a university professor',
      ],
      stack: ['React', 'Firebase', 'Firestore', 'Node.js'],
    },
  ],

  /* ─────────────────────────── EDUCATION ─────────────────────────── */
  education: [
    {
      id: 'nubtk',
      degree: 'B.Sc. in Computer Science and Engineering',
      institution: 'Northern University of Business & Technology Khulna',
      shortName: 'NUBTK',
      period: '2023 – 2027 (Expected)',
      cgpa: '3.90 / 4.00',
      status: 'Ongoing',
      coursework: [
        'Data Structures & Algorithms',
        'Database Management Systems',
        'Operating Systems',
        'Computer Networking',
        'Software Engineering',
        'Object-Oriented Programming',
      ],
      highlights: [
        'Top of cohort CGPA: 3.90/4.00',
        'Active competitive programmer (LeetCode, Codeforces)',
        'Founder of an IT firm while maintaining academic excellence',
      ],
    },
  ],

  /* ─────────────────────────── ACHIEVEMENTS ─────────────────────────── */
  achievements: [
    {
      id: 'solvio',
      title: 'Top 100 National Finalist',
      event: 'SOLVIO AI Hackathon 2025',
      description: 'Selected as Top 100 out of thousands of submissions nationwide with CashGuard AI — a real-time on-device fake currency detection system using TensorFlow Lite.',
      year: '2025',
      icon: '🏆',
      color: '#f59e0b',
      link: 'https://github.com/shahjalal-mahmud/CashGuardAI',
    },
    {
      id: 'cgpa',
      title: 'CGPA 3.90 / 4.00',
      event: 'CSE Department — NUBTK',
      description: 'Maintaining near-perfect academic performance while simultaneously building and shipping production software products as a founder.',
      year: '2023–Present',
      icon: '🎓',
      color: '#34d399',
      link: null,
    },
    {
      id: 'appriyo-founder',
      title: 'Founded Appriyo',
      event: 'IT Firm · End-to-End Product Engineering',
      description: 'Founded and operating Appriyo as a solo technical founder — delivering multi-tenant SaaS, Android apps, and client projects end-to-end.',
      year: '2025',
      icon: '🏗️',
      color: '#818cf8',
      link: 'https://appriyo.com',
    },
    {
      id: 'production',
      title: 'Production Apps — 99.9% Crash-Free',
      event: 'Amar Repair · Real Users · Real Load',
      description: 'Shipped Android apps used by real businesses, maintained 99.9% crash-free rates through rigorous state management and null-safety auditing.',
      year: '2025–Present',
      icon: '⚡',
      color: '#38bdf8',
      link: null,
    },
  ],

  /* ─────────────────────────── PHILOSOPHY & QUOTE ─────────────────────────── */
  philosophy: {
    quote: '"Systems beat features — I build software that scales, isolates data properly, and doesn\'t break at 3am. Reliability is a feature."',
    principles: [
      { label: 'Offline-First',      desc: 'Underrated in a world obsessed with the cloud', icon: '📶' },
      { label: 'RBAC Done Right',    desc: 'Proper access control is an art form',          icon: '🔐' },
      { label: 'Real-World Testing', desc: 'Shipped, watched it break, rebuilt it better',  icon: '🔄' },
      { label: 'Data Isolation',     desc: 'One bad query should never affect everyone',     icon: '🗄️' },
    ],
    funFacts: [
      'Powered by strong tea and compiler errors',
      'Shipped to real users, watched it break, rebuilt better — twice',
      'Believe offline-first is criminally underrated',
      'Run multi-tenant systems where one bad query affects everyone — keeps the standards high',
      'Think RBAC done right is an art form',
    ],
  },

  /* ─────────────────────────── INTERESTS ─────────────────────────── */
  interests: [
    { label: 'Financial Technology',  icon: '💳' },
    { label: 'Digital Banking',       icon: '🏦' },
    { label: 'On-Device AI',          icon: '🧠' },
    { label: 'Backend Architecture',  icon: '🏛️' },
    { label: 'Competitive Programming', icon: '⚔️' },
    { label: 'Open Source',           icon: '🌍' },
    { label: 'System Design',         icon: '📐' },
    { label: 'Business Operations',   icon: '📊' },
  ],

  /* ─────────────────────────── OPEN SOURCE ─────────────────────────── */
  openSource: [
    {
      name: 'GitHub Insights',
      role: 'Core Contributor',
      description: 'Developed high-contrast themes and optimized language analytics. Merged PRs implementing weighted scoring algorithms via GraphQL and TypeScript.',
      link: 'https://yourgithubinsights.netlify.app/',
      icon: '📊',
    },
  ],

  /* ─────────────────────────── PAST PROJECTS (notable) ─────────────────────────── */
  pastProjects: [
    {
      id: 'prodorshok',
      name: 'Prodorshok',
      desc: 'AI-powered career guide for Bangladeshi students · Kotlin, Jetpack Compose, GPT-3.5',
      link: 'https://github.com/shahjalal-mahmud/Prodorshok',
      icon: '🤖',
      tags: ['Kotlin', 'Jetpack Compose', 'GPT-3.5'],
    },
    {
      id: 'cpu-scheduler',
      name: 'CPU Scheduler',
      desc: 'Terminal-based CPU scheduling simulator · FCFS, SJF, Round Robin with Gantt chart',
      link: 'https://github.com/shahjalal-mahmud/CPU_Scheduler',
      icon: '⚙️',
      tags: ['C++', 'Algorithms', 'OS'],
    },
    {
      id: 'deadlock',
      name: 'Deadlock Detective',
      desc: "C++17 simulation of Dijkstra's Banker's Algorithm with step-by-step safe sequence",
      link: 'https://github.com/shahjalal-mahmud/Deadlock-Detective-Bankers-Algorithm-Simulator',
      icon: '🔍',
      tags: ['C++17', 'OS', 'Algorithms'],
    },
    {
      id: 'apraform',
      name: 'APRA Form',
      desc: 'Production-ready survey system replacing Google Forms with custom validation engine',
      link: 'https://apraform.netlify.app/',
      icon: '📋',
      tags: ['React', 'Serverless', 'Forms'],
    },
    {
      id: 'cover-page',
      name: 'Cover Page Generator',
      desc: 'Smart academic cover page automation for university students using JSON datasets',
      link: 'https://nubtk.netlify.app/',
      icon: '📄',
      tags: ['JavaScript', 'JSON', 'Automation'],
    },
    {
      id: 'mobifixer',
      name: 'MobiFixer',
      desc: 'Mobile repair management system · Java, SQLite, Firebase Auth, RecyclerView',
      link: 'https://github.com/shahjalal-mahmud/MobiFixer',
      icon: '🛠️',
      tags: ['Java', 'SQLite', 'Firebase'],
    },
  ],
}

export default profile