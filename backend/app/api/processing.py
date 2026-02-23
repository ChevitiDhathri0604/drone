from fastapi import APIRouter, HTTPException
from app.services.processing_service import processing_service
import os

router = APIRouter()

UPLOAD_DIR = "uploads"

@router.get("/{file_id}")
async def process_data(file_id: str):
    # Find the file by ID
    files = os.listdir(UPLOAD_DIR)
    target_file = next((f for f in files if f.startswith(file_id)), None)
    
    if not target_file:
        raise HTTPException(status_code=404, detail="File not found")
    
    file_path = os.path.join(UPLOAD_DIR, target_file)
    
    try:
        # 1. Load LAS
        points = processing_service.load_las(file_path)
        
        # 2. Generate DTM
        dtm, transform = processing_service.generate_dtm(points)
        
        # 3. Detect Waterlogging (GeoJSON)
        waterlogging = processing_service.detect_waterlogging(dtm, transform)
        
        # 4. Optimized Drainage (GeoJSON)
        drainage = processing_service.design_drainage(dtm, transform)
        
        return {
            "status": "completed",
            "results": {
                "waterlogging": waterlogging,
                "drainage": drainage,
                "dtm_summary": {
                    "min_z": float(np.min(dtm)),
                    "max_z": float(np.max(dtm)),
                    "area_covered": float(dtm.size)
                }
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

import numpy as np # Needed for the return summary
