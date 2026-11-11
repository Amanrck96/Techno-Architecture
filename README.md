# TECHNO ARCHITECTURE & DESIGN STUDIO

> **Architecture · Space · Form**
> A contemporary, production-ready, data-driven web application for **Techno Architecture**, inspired by the spatial rhythm, typography hierarchy, and interaction model of `studiobomb.in`.

[![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38bdf8?logo=tailwind-css)](https://tailwindcss.com/)
[![WCAG](https://img.shields.io/badge/WCAG-2.2_AA-green)](https://www.w3.org/WAI/standards-guidelines/wcag/)

---

## 🏛️ Executive Summary

This repository hosts the complete source code for **Techno**, an architectural practice specializing in context-driven residential, commercial, mass timber, and civic projects.

### Key Architectural Behaviors & Design Highlights
- **Signature Right-Rail Navigation**: Pinned fixed right-hand desktop navigation rail (`width: 6vw`–`8vw`) with minimal typography, monogram logo, social links, back-to-top trigger, and active indicators matching `studiobomb.in`'s iconic desktop behavior.
- **Responsive Slideout Drawer**: Deliberately designed mobile navigation featuring animated trigger, escape-key support, and accessible focus management.
- **Architectural 3-Column Spatial Grid**: Dense 0.5%–1% margin presentation with smooth hover overlays featuring 5px letter-spaced uppercase titles and category indicators.
- **Priority Visual Gallery with Lightbox**: Large-format visual browser with full keyboard navigation (left/right/escape), touch/swipe support, project links, and category filters.
- **100% Data-Driven & Headless CMS**: Zero hard-coded component content. Backed by an in-browser live **CMS Content Studio** (`/admin`) allowing real-time entity updates and JSON export/import.
- **Deep Project Dossiers**: Case studies featuring full-bleed hero visuals, conceptual narratives, process sections, alternating portrait/landscape sequences, technical metadata matrices, and bidirectional pager navigation.
- **Validated Contact System**: Multi-field intake form with service selectors, budget range parameters, client/server validation, and spam honeypot protection.

---

## 🗺️ Information Architecture & Sitemap

| Route | Purpose | Highlights |
|---|---|---|
| `/` | **Home** | Hero with positioning statement, curated 3-column project grid, Why Techno narrative, client testimonials |
| `/about` | **About Us** | Editorial story, dual-column layout, Vision, Mission, Core Values, USP |
| `/services` | **Services Overview** | 6 architectural disciplines with process stages, deliverables checklist |
| `/services/[slug]` | **Service Detail** | Dynamic discipline deep dive with related built work links |
| `/projects` | **Projects Directory** | Interactive category & status filtering across all commissions |
| `/projects/completed` | **Completed Archive** | Dedicated view for finished works |
| `/projects/ongoing` | **Ongoing Works** | Works in progress, under-construction commissions |
| `/projects/[slug]` | **Project Case Study** | Full-screen hero, concept narrative, image sequence, credits, pager |
| `/team` | **Our Team** | Editorial portraits, leadership bios, discipline filter, careers CTA |
| `/contact` | **Contact Us** | Validated consultation form, studio coordinates (Bengaluru, Hyderabad, Dubai) |
| `/gallery` | **Visual Gallery** | Priority feature: full-screen lightbox viewer with keyboard controls |
| `/blog` | **Monographs & Essays** | Architectural research articles, reading times, tags, search |
| `/blog/[slug]` | **Monograph Detail** | Pull quotes, formatted sections, author credentials, related essays |
| `/faq` | **FAQ** | Categorized accessible accordion with deep-linkable questions |
| `/recognitions` | **Honors & Awards** | IIA Gold Medal, AD100, Dezeen longlist, Biennale showcase |
| `/admin` | **Live CMS Studio** | In-browser live editor for all entities with export/import |

---

## 🛠️ Tech Stack & Dependencies

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router, Server & Client Components)
- **Language**: [TypeScript](https://www.typescriptlang.org/) (Strict typing across all data layers)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) + Custom CSS Variables & architectural scrollbars
- **Motion**: [Framer Motion](https://www.framer.com/motion/) + CSS Hardware-Accelerated transitions
- **Icons**: [Lucide React](https://lucide.dev/)
- **SEO**: Semantic HTML5, dynamic XML sitemap (`/sitemap.xml`), robots (`/robots.txt`), JSON-LD schema

---

## 🚀 Getting Started

### 1. Clone & Install
```bash
git clone https://github.com/Amanrck96/Techno-Architecture.git
cd Techno-Architecture
npm install
```

### 2. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Production Build
```bash
npm run build
npm run start
```

---

## 🔐 Environment Variables & Production Architecture (Google Firebase)

On Google Firebase (App Hosting / Cloud Run), Application Default Credentials (ADC) are automatically provided by the compute service account. Server-side CMS data persists permanently to Firebase Cloud Storage (`technoarchitecture-7d718.firebasestorage.app`) and Firestore without needing manual private keys in production.

### 1. Admin Authentication & Session Security (Required)
| Variable | Description |
|---|---|
| `ADMIN_PASSWORD` | Strong password required for `/admin` studio login. Endpoints fail closed if missing. |
| `ADMIN_SESSION_SECRET` | Cryptographically random secret key (32+ chars) used for HMAC session tokens. |
| `ADMIN_USERNAME` | Admin username (defaults to `admin` if omitted). |

### 2. Firebase Cloud Storage & Admin SDK (ADC on Google Cloud / Fallback for Local Dev)
| Variable | Description | Example / Recommended Value |
|---|---|---|
| `FIREBASE_PROJECT_ID` | Google Cloud / Firebase project identifier | `technoarchitecture-7d718` |
| `FIREBASE_STORAGE_BUCKET` | Default Google Cloud Storage bucket name | `technoarchitecture-7d718.firebasestorage.app` |
| `FIREBASE_CLIENT_EMAIL` | *(Local dev fallback only)* Service Account email | `firebase-adminsdk-...@technoarchitecture-7d718.iam.gserviceaccount.com` |
| `FIREBASE_PRIVATE_KEY` | *(Local dev fallback only)* Service Account private key | `"-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"` |

*(Alternatively, for local dev you can provide the full JSON string via `FIREBASE_SERVICE_ACCOUNT_KEY`).*

### 3. Firebase Client SDK (Web)
| Variable | Description |
|---|---|
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Public Firebase Web API Key |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | `technoarchitecture-7d718.firebaseapp.com` |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | `technoarchitecture-7d718` |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | `technoarchitecture-7d718.firebasestorage.app` |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | `361435214203` |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | Web application App ID |

---

## 📁 Repository Structure

```
├── src/
│   ├── app/                    # 15 App Router pages & API handlers
│   │   ├── layout.tsx          # Shell layout (Fonts, Nav Rail, Mobile Nav, Footer)
│   │   ├── page.tsx            # Home page
│   │   ├── about/              # About Us
│   │   ├── services/           # Services & dynamic [slug]
│   │   ├── projects/           # Directory, completed, ongoing, [slug]
│   │   ├── team/               # Team directory
│   │   ├── contact/            # Validated intake page
│   │   ├── gallery/            # Visual gallery & Lightbox
│   │   ├── blog/               # Research essays & [slug]
│   │   ├── faq/                # Categorized accordion
│   │   ├── recognitions/       # Awards & publications
│   │   ├── admin/              # Live CMS Studio
│   │   ├── api/contact/        # Contact validation route handler
│   │   ├── sitemap.ts          # Dynamic XML Sitemap
│   │   ├── robots.ts           # Robots.txt
│   │   └── not-found.tsx       # 404 Error State
│   ├── components/
│   │   ├── layout/             # DesktopRailNav, MobileNav, Footer
│   │   ├── home/               # HeroSection, HomeProjectsGrid, WhyTechno, Testimonials
│   │   ├── gallery/            # LightboxViewer
│   │   └── common/             # CustomCursor, CookieConsent
│   ├── data/                   # Typed data models & seeds (Projects, Services, Team, Blog, etc.)
│   ├── lib/                    # CMS store, motion tokens, utility functions
│   └── styles/                 # Design tokens, scrollbar, and typography in globals.css
```

---

## 🔒 License & Copyright

© 2026 **Techno Architecture & Design Studio**. All Rights Reserved.
Built as an original, legally clean implementation for Techno.
