# NutriScan (FairPack)

> **Ministry of Consumer Affairs, Food & Public Distribution**  
> **Smart India Hackathon (SIH26034)**  
> *Software System to check compliance of Packaged Commodities under Legal Metrology (Packaged Commodities) Rules, 2011 & 2024 Amendments by scanning products, images, and labels.*

---

## 🌟 Overview
NutriScan is a full-stack, field-ready Progressive Web App (PWA) and regulatory compliance auditing engine designed for consumers and Legal Metrology enforcement officers. It combines OCR text extraction, deterministic mathematical validation, gazette legal citation grounding, and Big-8 nutritional intelligence.

### Key Features
- 🔍 **Live Scanner & Image Upload**: Camera and drag-and-drop label scanning with deskewing, normalization, and bounding box inspection.
- ⚖️ **LMPC Statutory Compliance (2024 Amendments)**:
  - **Rule 6(1)(s)**: Unit Sale Price (USP) validation per gram/kg/ml/litre.
  - **Rule 6(1)(d)**: Maximum Retail Price (MRP) mandatory "inclusive of all taxes" clause.
  - **Rule 6(1)(a)**: Complete manufacturer / Indian importer postal address with PIN code.
  - **Rule 6(1)(h)**: Dual-channel Consumer Care details (Email + Phone number).
  - **Rule 6(1)(n)**: Country of Origin declaration.
- 📜 **Official Rule 32 Enforcement Notices**: Generates official notices of non-compliance with Ministry letterhead and printable PDF certificates.
- 📱 **Progressive Web App (PWA)**: Standalone installable app for mobile and tablet with offline caching, bottom dock navigation, and 1-tap quick action bar.
- 🧊 **3D Packaging Models**: Kinetic 3D visuals for protein powder tubs, cold drink bottles, snacks/crisps pouches, and chocolate bars.

---

## 🛠️ Tech Stack
- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, Framer Motion, Lucide Icons, React Bits Pro patterns.
- **Backend**: Python 3.10+, FastAPI, Uvicorn, Pydantic, OpenCV.

---

## 🚀 Quickstart

### 1. Backend (FastAPI)
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python run.py
```
Backend runs at `http://127.0.0.1:8000` (Swagger docs at `/docs`).

### 2. Frontend (Vite PWA)
```bash
cd frontend
npm install
npm run dev
```
Frontend runs at `http://localhost:5173`.
