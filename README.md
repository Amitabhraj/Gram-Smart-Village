# 🌾 GramSeva (ग्राम सेवा) - Smart Village & Officer Redressal Portal

A unified Indian village governance platform built with **React.js** and **Django** (default SQLite database) that solves problems for both **villagers** and **local village officers** in **one view and a few clicks**, without requiring any AI prompts or complex research.

---

## 🚀 Key Problems Solved in One Platform (4+ Problems Handled)

### 1. Civic Grievance & Rapid Repair Hotline (समस्या निवारण)
* **Villager direct benefit:** Report broken drinking water pipelines, burned electric transformers, contaminated handpumps, broken culverts, or dark streetlights in 3 simple steps without visiting the Tehsil office.
* **Local Officer benefit:** 
  - **1-View Command Radar:** Instantly see critical alerts and a **Ward Bottleneck Radar** (which ward has the highest complaints).
  - **1-Click Quick Actions:** Dispatch repair teams, sanction emergency repair budgets (e.g. ₹5,000 for motor pump repair), or mark resolved in 1 click. Zero manual registers, zero AI prompting.

### 2. Single-Window Certificate & Welfare Desk (प्रमाण पत्र एवं कल्याणकारी योजनाएं)
* **Villager direct benefit:** Apply for Caste, Income, Domicile, PM-Kisan Samman Nidhi e-KYC, or Widow/Old-Age Pension endorsements.
* **1-Click Token Tracker:** Enter token number or mobile number to immediately check digital stamp verification status.
* **Local Officer benefit:** Review citizen applications in a clean queue and click **"1-Click Approve & Seal"** to issue digital endorsement without paperwork delay.

### 3. Krishi Setu: Daily Mandi Rates & PACS Fertilizer Inventory (कृषि सेतु)
* **Villager (Farmer) direct benefit:** 
  - Prevents exploitation by middlemen by displaying **daily APMC Mandi modal prices vs Govt Minimum Support Price (MSP)** for Wheat, Paddy, Mustard, Soybean, and Potato.
  - **Local PACS Cooperative Society Fertilizer Stock Gauge:** Shows live bag counts of Neem Coated Urea, DAP, and NPK so farmers know whether stock is available before walking or driving to the cooperative godown.

### 4. Village Health OPD & Public Notice Board (ग्राम स्वास्थ्य एवं सूचना पट्ट)
* **Villager direct benefit:** Real-time timetable of visiting MBBS doctors, ANM child routine immunization days (Polio, BCG, DPT), and essential medicine stock status at the Primary Health Sub-Centre.
* **Local Officer benefit:** Broadcast urgent emergency announcements (e.g., water tanker schedule or Gram Sabha meeting) to the village portal in 2 clicks.

---

## 🛠️ Architecture & Tech Stack

* **Frontend:** React 19, Vite, Tailwind CSS, Lucide Icons, Bilingual (Hindi & English).
* **Backend:** Python Django 5.1, Django REST Framework (DRF), django-cors-headers.
* **Database:** Django's default integrated database (`db.sqlite3`).

---

## 🏃 Running the Application

### 1. Django Backend
```bash
cd backend
python manage.py runserver 127.0.0.1:8000
```
* API Base: `http://127.0.0.1:8000/api/`
* Seed database command (if resetting): `python manage.py seed_data`

### 2. React Frontend
```bash
cd frontend
npm run dev
```
* URL: `http://localhost:5173/`
