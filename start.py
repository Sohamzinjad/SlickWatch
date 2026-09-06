#!/usr/bin/env python3
"""
seaLens Quickstart Launcher.
Starts the FastAPI application and opens the interactive dashboard.
"""
import sys
import os
import uvicorn

# Ensure project root is in sys.path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

if __name__ == "__main__":
    print("===================================================================")
    print("           🌊 Sealens: AI MARITIME DOMAIN AWARENESS & C2          ")
    print("                      SIH Problem #143 (NTRO)                      ")
    print("===================================================================")
    print("✨ Landing Page:       http://localhost:8000")
    print("🛰️  Tactical C2 Center: http://localhost:8000/c2")
    print("📖 API Documentation:  http://localhost:8000/docs")
    print("===================================================================")
    
    uvicorn.run("backend.main:app", host="0.0.0.0", port=8000, reload=True)

