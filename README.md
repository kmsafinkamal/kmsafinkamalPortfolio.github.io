# Academic Researcher Portfolio - K. M. Safin Kamal

Production-ready web application scaffolded from **Stitch MCP Server** designs and design tokens (Project: `Academic Researcher Portfolio Website`, ID: `15262654090738978653`), backed by a persistent **SQLite Database**, an **Admin Panel** for photo uploads & bio editing, and live synchronization with [K. M. Safin Kamal's Google Scholar Profile](https://scholar.google.com/citations?user=gpR1AC8AAAAJ&hl=en).

Built with **React**, **Vite**, **Tailwind CSS**, **Express**, and **better-sqlite3**.

---

## 🎨 Design System & Tokens (Calibrated from Stitch)

The application faithfully maps the design tokens extracted directly from Stitch:

- **Typography**: Complete `Inter` typographic hierarchy (`headline-lg`, `headline-md`, `headline-sm`, `title-md`, `body-lg`, `body-md`, `body-sm`, `label-md`, `label-sm`).
- **Color Palette**:
  - `Primary`: `#1E293B` (Slate Navy) – Structural anchor for headings, primary buttons, and active mastheads.
  - `Secondary`: `#2563EB` (Royal Cobalt) – Interactive cues, active category pills, citation links, and focus rings.
  - `Neutral / Variant`: `#64748B` (Cool Slate) – Secondary metadata, venue tags, co-authors, and timestamps.
  - `Surface Foundations`: `#FFFFFF` for elevated card containers, framed by soft canvas backdrop `#F8F9FF`.
  - `Borders`: `#E2E8F0` / `#CBD5E1` subtle containment borders.
- **Elevation & Depth**: Ambient low-contrast shadows (`0 1px 3px 0 rgba(30, 41, 59, 0.05)`) with hover lift (`translate-y-[-2px]`) and border tint enhancement.
- **Shapes (`ROUND_EIGHT`)**:
  - Cards: `rounded-xl` / `rounded-2xl`
  - Action Buttons: `rounded-lg` / `rounded-xl`
  - Academic Metadata Badges: `rounded-full`

---

## 🛡️ Admin Panel & Database Features

The application features a full administrative suite accessible via the **Admin** button in the navigation bar (Default PIN: `admin123`):

1. **Profile Photo Uploader**:
   - Upload your portrait or headshot (`.jpg`, `.png`, `.webp`, `.gif` up to 5MB).
   - Saved automatically to `public/uploads/` via `multer`.
   - Real-time updates to the Hero section, Navbar, and About page.
   - Option to reset back to the default initials monogram.
2. **About & Biography Management**:
   - Edit full name, academic title, university department, and institutional email.
   - Edit the main scholarly narrative biography with live preview.
   - Manage institutional affiliations and research lab badges (add/remove).
   - Research interest tags manager.
3. **Academic Journey & Timeline Editor**:
   - Add new academic milestones, appointments, degrees, and dates.
   - Delete or reorder timeline entries with live reflection on the About page.
4. **Technical Competencies & Skills Matrix**:
   - Organize and update competencies across AI/ML Core, Frameworks, Cloud Systems, and Languages.
5. **Google Scholar Auto-Sync Hub**:
   - 1-Click **"⚡ Sync Live Now"** button in the Admin Panel that executes `scripts/sync_scholar.py` in the background.
   - Fetches newly published papers, updates citation counts, and re-indexes the SQLite database.
6. **SQLite Database Architecture** (`server/portfolio.db`):
   - Fast, persistent storage using `better-sqlite3` in WAL mode.
   - Automatic seeding on first run and dual-write to static JSON files (`src/data/`) for offline build portability.

---

## 📚 Public Portfolio Features

1. **Publications Library (Synchronized with Google Scholar)**:
   - Complete library of **46 peer-reviewed research papers** across Biomedical AI (19), Computer Vision (17), Green Cloud Computing (7), and Cybersecurity & Privacy (3).
   - **Real-time Live Search**: Instant filtering across paper titles, author names, venues, and abstracts.
   - **Dynamic Category Pills**: Instant switching and count badges computed directly from the dataset.
   - **Sorting Controls**: Sort by Citations (highest first), Year (newest first), or Title (A-Z).
   - **Collapsible Abstracts**: Clean accordion for in-depth reading without layout clutter.
   - **Highlighted Authors**: Accurately highlights all name variations (`K. M. Safin Kamal`, `KM Safin Kamal`, `KMS Kamal`) in author lists.
2. **Interactive Citation Export Modal**:
   - Supports **BibTeX**, **APA**, and **IEEE** citation formats.
   - One-click **Copy Citation** with instant visual feedback.
   - Direct **.RIS** download for Zotero, Mendeley, and EndNote.
   - Direct link to individual paper citation pages on Google Scholar.
3. **Research Hub & Overview**:
   - Verified scholar masthead with live metrics (**40+ Citations**, **h-index 4**, **46 Publications**).
   - Affiliation: Lecturer, Department of Computer Science & Engineering, East West University.
   - Interactive Core Research Pillars cards.
   - Featured high-impact publications showcase.
4. **Academic Journey & Timeline**:
   - Connected chronological boundary line with cobalt node dots (`#2563EB`).
   - Technical competencies matrix (AI/ML frameworks, cloud infrastructure, domain specialties).
5. **Collaboration & Contact**:
   - Collaboration proposal form with input states and validation feedback.
   - Verified links to Google Scholar, ResearchGate, GitHub, LinkedIn, and university channels.

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ (tested with Node.js LTS v24.19.0)
- Python 3.x (for running Google Scholar scraper)

### Start Development (Full-Stack: Express + Vite)
```bash
npm run dev
```
- Web Application: [http://localhost:3000](http://localhost:3000)
- Backend REST API & Uploads: [http://localhost:3001](http://localhost:3001)

### Admin Panel Access
1. Open the website and click **Admin** in the top navigation bar.
2. Enter the default PIN: `admin123`.
3. Upload your photo, update your bio/timeline, or click **Sync Live Now** for Google Scholar.

### Synchronize Google Scholar via Terminal
```bash
npm run sync:scholar
```

### Production Build
```bash
npm run build
npm run preview
```
Compiled, minified production assets are placed in `dist/`.
