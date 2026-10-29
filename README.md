# GRAMSEVA · National Rural Civic Redressal & E-Governance Portal

A high-performance Indian village governance platform built with **React.js (Three.js 3D GIS)** and **Django** (default integrated SQLite database).

---

## Key Features & Architecture

### 1. Zero-Friction Citizen Access (No Login or Signup Required)
* Local villagers do **not** need an account or login.
* Anyone can search their village, inspect local infrastructure problems, submit new grievances, and track existing tickets in 1 click.

### 2. Local Officer Authentication (No Signup Needed)
* Local Panchayat Officers (VDO, Sachiv, Inspector) log in using pre-assigned government credentials.
* **Pre-configured Accounts:**
  - `vdo.pipariya` (Password: `admin123`) — *Shri Rajesh Verma (Village Development Officer)*
  - `sachiv.rampur` (Password: `admin123`) — *Smt. Anita Sharma (Panchayat Secretary)*
  - `officer` (Password: `officer123`) — *District Panchayat Inspector*
* Features a 1-click demo credential selector in the login dialog.
* Officer session unlocks:
  - Full **Officer Command Radar** (1-view metrics & ward bottleneck analysis).
  - 1-Click fast actions: dispatch repair teams, sanction contingency funds, and certify resolution.
  - 1-Click digital seal stamping for certificate requests.
  - Unmasks citizen identity and phone numbers for official verification.

### 3. Interactive 3D Map of India & Place Search Bar
* Powered by **Three.js WebGL**.
* Renders a 3D topographic relief map of the Indian subcontinent with glowing boundary contours, coordinate particle grids, and live radar beacons for Gram Panchayats.
* Interactive mouse-parallax and depth tilt.
* Prominent search bar overlaid on top with instant autocomplete matching registered Gram Panchayats (`Pipariya`, `Rampur`, `Khedi`, `Semri Harchand`, `Mandla Rural`).
* Includes an extensible geocoding API hook ready to connect with Google Places, OpenStreetMap, or custom GIS backends.

### 4. Area Civic Breakdown Dossier
* Selecting or searching any place displays all active civic problems (drinking water pipeline fractures, power grid/transformer failures, road culvert repairs, solar street lighting, etc.) registered in that specific area.
* Provides category and urgency filters (Emergency, Urgent, Normal).

### 5. Citizen Privacy Guard (Complainer Data Protected)
* **Public / Citizen View:** Complainer name (`R****** P****`) and phone number (`+91 98******23`) are cryptographically masked to protect citizen privacy and prevent harassment.
* **Authorized Officer View:** Unmasks citizen name and contact number with direct call/SMS actions for field inspection.

### 6. Clean, Professional Government UI (Zero Emojis)
* All emojis have been eliminated.
* Built using official National Informatics Centre (NIC) and Ministry of Panchayati Raj design conventions: deep slate/navy palette, high contrast, clean typography, and crisp Lucide SVG iconography.

---

## Running the Application

### 1. Django Backend
```bash
cd "D:\PAST PROJECTS\gramseva\backend"
python manage.py runserver 127.0.0.1:8000
```
* API Root: `http://127.0.0.1:8000/api/`

### 2. React Frontend
```bash
cd "D:\PAST PROJECTS\gramseva\frontend"
npm run dev -- --port 5173
```
* Portal URL: `http://localhost:5173/`
