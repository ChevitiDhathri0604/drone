# DroneFlow AI - Point Cloud Processor

A full-stack web application for processing drone point cloud data (LAS/LAZ) to generate DTMs, detect waterlogging, and design optimized drainage networks.

## Features
- **LAS/LAZ Upload**: Securely upload point cloud files.
- **AI/ML Processing**:
  - DTM Generation: Ground points filtered from noise.
  - Waterlogging Detection: Sink/depression identification.
  - Drainage Optimization: Flow-path calculation.
- **Interactive Map**: Visualize results using Leaflet.
- **Premium UI**: Modern dark-mode dashboard.

## Tech Stack
- **Frontend**: React, Vite, TailwindCSS, Leaflet.
- **Backend**: FastAPI, Laspy, NumPy, SciPy.

## Repository Structure
To keep your GitHub repository clean, only upload the following:

- `backend/app/` - The FastAPI source code.
- `backend/requirements.txt` - Python dependencies.
- `drone-frontend/` - The React source code.
- `generate_sample_las.py` - Script for generating test data.
- `README.md` - Documentation.
- `.gitignore` - Git ignore rules.

> [!CAUTION]
> **Do NOT upload**:
> - `backend/venv/` or `drone-frontend/node_modules/`
> - `backend/uploads/` contents
> - `sample_data.las` (keep it local for testing)

## Setup Instructions

### Backend
1. Navigate to `backend/`.
2. Create a virtual environment: `python -m venv venv`.
3. Activate it: `venv\Scripts\activate`.
4. Install dependencies: `pip install -r requirements.txt`.
5. Run the server: `python -m uvicorn app.main:app --reload`.

### Frontend
1. Navigate to `drone-frontend/`.
2. Install dependencies: `npm install`.
3. Run the development server: `npm run dev`.

## Local Development
- The backend runs on [http://localhost:8000](http://localhost:8000).
- The frontend runs on [http://localhost:5173](http://localhost:5173).
