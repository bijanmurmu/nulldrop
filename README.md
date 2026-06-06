# Nulldrop.

> **Sever the Background.**

An elegant, browser-based utility for high-fidelity subject isolation. Powered by state-of-the-art dichotomous image segmentation (BriaRMBG 1.4 / ISNet). Built with absolute zero data retention.

---

### Philosophy
Nulldrop rejects the typical "SaaS" aesthetic. It is designed with the typographic rigor and intentional negative space of high-fashion print editorial magazines. 

No subscriptions. No tracking. Pure local inference.

### Technical Architecture
- **Frontend:** React + TypeScript + Vite + TailwindCSS
- **Backend:** FastAPI + Python
- **AI Core:** `rembg` utilizing BriaRMBG 1.4 for sub-pixel edge detection and alpha matting
- **Export Formats:** Lossless WEBP, PNG, JPG (canvas-based client-side conversion)

### Local Deployment

**1. Backend (AI Inference Engine)**
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python -m uvicorn main:app --reload
```

**2. Frontend (Editorial Interface)**
```bash
cd frontend
npm install
npm run dev
```

### Community & Contribution
Nulldrop is an open-source initiative. We welcome architectural improvements, UI refinements, and deployment templates. Please read [CONTRIBUTING.md](CONTRIBUTING.md) before submitting pull requests.

Engineered by Bijan Murmu.
