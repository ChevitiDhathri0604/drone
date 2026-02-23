from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import processing, upload

app = FastAPI(title="Drone Point Cloud Processor API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(upload.router, prefix="/api/upload", tags=["Upload"])
app.include_router(processing.router, prefix="/api/process", tags=["Processing"])

@app.get("/")
async def root():
    return {"message": "Drone Point Cloud Processor API is running"}
