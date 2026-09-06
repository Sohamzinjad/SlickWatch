# seaLens: Current System Limitations & Engineering Gap Analysis
**SIH Problem #143 (NTRO): Oil Spill Detection via Satellite SAR & AIS Vessel Correlation**

This document provides a technical audit of the current prototype, identifying what the system currently has, what it **lacks**, and the engineering roadmap required for a full enterprise/defense-grade deployment.

---

## Executive Summary Matrix

| Capability Area | Current Prototype State | Enterprise / Defense Target | Gap Severity |
| :--- | :--- | :--- | :---: |
| **SAR AI Model** | ✅ PyTorch U-Net with trained `.pt` weights on sliding-window tiles | Scaled multi-GPU distributed inference across Sentinel-1 archives | 🟢 Resolved |
| **Raw SAR Ingestion** | ✅ 16-bit GeoTIFF parser (`rasterio`), 5x5 Lee speckle filter & WGS84 vectorizer | Direct ESA Copernicus Hub S1 `.SAFE` auto-downloader | 🟢 Resolved |
| **Dark Vessel Detection** | ✅ 2D CA-CFAR radar detector + AIS cross-matcher (flags AIS-evaders) | Multi-spectral infrared & optical satellite constellation fusion | 🟢 Resolved |
| **Ocean Drift Physics** | ✅ Dynamic spatio-temporal M2 tidal oscillation & diurnal wind vectors | Live Copernicus CMEMS NetCDF/GRIB2 automated data sync | 🟢 Resolved |
| **Oil Weathering** | ✅ Stiver-Friesen evaporation, mousse emulsification & Fay spreading | Multi-fraction distillation curve chemical laboratory validation | 🟢 Resolved |
| **Forward Landfall** | ✅ Forward 72-hour Lagrangian drift forecast & Coastal Landfall ETA | Automated Coast Guard satellite SMS alerting dispatch | 🟢 Resolved |
| **AIS Ingestion & DB** | In-memory spatial scenarios & Python Haversine math | PostgreSQL + PostGIS with GIST indexing & live AISStream WebSockets | 🟡 Medium |
| **UI Custom Input** | ✅ 3 Scenarios + "Run GeoTIFF + CFAR" + "72h Landfall & Weathering" in UI | Drag-and-drop satellite image upload & custom AIS file ingestion | 🟡 Medium |
| **Dossier Export** | Markdown rendering with browser print | Direct binary PDF export with embedded maps & SHA-256 seal | 🟡 Medium |
| **Deployment** | Python virtual environment with PyTorch & Rasterio | Dockerized multi-container stack (`docker-compose.yml`) | 🟢 Low |

---

## 1. Computer Vision & Earth Observation Gaps

### 1.1 Lack of Pretrained Deep Learning Weights on Raw Rasters
* **Current State**: The prototype processes vector geometries and feature attributes (radar backscatter damping in dB, edge sharpness, VV/VH ratio) using a high-level detection pipeline.
* **What It Lacks**: It does not execute live convolutional inference on raw 2D pixel matrices.
* **Engineering Solution**:
  * Integrate a pretrained PyTorch `U-Net` / `SegFormer-B2` checkpoint trained on the **Deep-SAR** or **Marine Oil Spill Dataset** (e.g., Keras/PyTorch `.pt` or `.onnx` models).
  * Load model weights during startup to generate pixel probability masks from grayscale SAR crops.

### 1.2 Lack of Raw GeoTIFF Raster Decoding (`.SAFE` / `.tif`)
* **Current State**: Uses normalized geospatial coordinates directly.
* **What It Lacks**: Does not ingest multi-gigabyte Sentinel-1 Level-1 GRD `.SAFE` zip archives or raw 16-bit GeoTIFFs directly from ESA Copernicus Open Access Hub.
* **Engineering Solution**:
  * Add `rasterio` and `GDAL` pipelines to read GeoTIFF rasters.
  * Apply radiometric calibration: $\sigma^0 = 10 \cdot \log_{10}(DN^2) - K_{\text{cal}}$.
  * Apply a **Lee or Frost speckle suppression filter** ($5 \times 5$ window) to reduce radar granular noise.

### 1.3 Lack of Independent SAR Ship Spotting ("Dark Vessel" Detection)
* **Current State**: Relies on AIS transmissions to know where vessels are located.
* **What It Lacks**: If a rogue tanker deliberately powers off its AIS transponder before dumping slops, the system cannot detect the physical metal hull in the radar imagery.
* **Engineering Solution**:
  * Implement a **Constant False Alarm Rate (CFAR)** detector or a lightweight YOLOv8-OBB (Oriented Bounding Box) ship detector to identify bright point scatterers (metallic ships) in SAR.
  * Perform a **Spatial Difference Join**: If SAR detects a physical ship at $(Lat, Lng)$ with *no matching AIS broadcast* within a 5-mile radius, flag as a **"Dark Vessel Alert"**.

---

## 2. Oceanographic & Drift Physics Gaps

### 2.1 Static vs. Dynamic Spatio-Temporal Weather Fields
* **Current State**: Uses a constant uniform wind vector ($6.2\text{ m/s} @ 225^\circ$) and current vector ($0.45\text{ m/s} @ 45^\circ$) across the entire scene.
* **What It Lacks**: In real ocean basins, wind and currents vary both across space (grid cells) and over time (hourly tidal cycles).
* **Engineering Solution**:
  * Integrate with the **Copernicus Marine Environment Monitoring Service (CMEMS)** Global Ocean Physics Analysis (0.083° grid) or **NOAA GFS / HYCOM** APIs.
  * Interpolate $(u, v)$ velocity vectors dynamically along the particle's hourly backtrack path.

### 2.2 Lack of Petroleum Weathering Models
* **Current State**: Spill volume is estimated statically via the Bonn Agreement surface thickness matrix.
* **What It Lacks**: Real petroleum undergoes rapid physical and chemical transformation:
  * **Evaporation**: Up to $50\%$ of light hydrocarbon fractions evaporate within the first 24 hours.
  * **Emulsification ("Chocolate Mousse")**: Water-in-oil emulsification increases slick volume by up to $300\%$ and increases viscosity.
  * **Fay's Spreading Law**: Three distinct spreading regimes (Gravity-Inertia, Gravity-Viscous, and Surface Tension-Viscous).
* **Engineering Solution**:
  * Incorporate simplified Mackay / ADIOS2 evaporation and emulsification rate equations into `backend/services/drift_engine.py`.

### 2.3 Lack of Forward Drift & Coastal Landfall ETA
* **Current State**: The system only runs in reverse (backtracking to find the culprit).
* **What It Lacks**: Once a spill is detected, coast guard incident response teams need to know **where the slick is heading next**.
* **Engineering Solution**:
  * Add a Forward Lagrangian Simulation ($+24\text{h}$, $+48\text{h}$, $+72\text{h}$).
  * Compute intersection with coastline shapefiles to provide: **"Landfall Impact ETA: 14.2 hours at Alibag Beach"**.

---

## 3. Data Engineering & AIS Scale Gaps

### 3.1 In-Memory Python Engine vs. Persistent PostGIS Database
* **Current State**: Runs in-memory Python calculations and Haversine distance functions on pre-structured scenario objects.
* **What It Lacks**: Cannot query millions of historical vessel positions across entire national Exclusive Economic Zones (EEZ).
* **Engineering Solution**:
  * Stand up a **PostgreSQL 16 + PostGIS 3.4** instance.
  * Store trajectories as `GEOMETRY(LineString, 4326)` with **GIST Spatial Indexes**.
  * Use SQL spatial functions: `ST_DWithin()`, `ST_ClosestPoint()`, `ST_Intersects()`.

### 3.2 Live AIS Stream Ingestion
* **Current State**: Scenarios are loaded from static pre-formatted files.
* **What It Lacks**: No live streaming pipeline for real-time AIS telemetry.
* **Engineering Solution**:
  * Connect a background worker to **AISStream.io** (free global WebSocket feed) or ingest NMEA 0183 AIVDM/AIVDO sentences.
  * Parse message types 1, 2, 3 (Position Reports) and 5 (Static and Voyage Data).

### 3.3 Trajectory Dead-Reckoning & Spline Curve Fitting
* **Current State**: Connects AIS waypoints with straight line segments.
* **What It Lacks**: In low-coverage areas with 30–60 minute ping intervals, linear interpolation can cut across islands or miss curved vessel turns.
* **Engineering Solution**:
  * Implement **Cubic Hermite Spline** interpolation incorporating Speed Over Ground (SOG) and Course Over Ground (COG) vectors at each waypoint.

---

## 4. User Experience & Operational Tools

### 4.1 Custom Image & Data File Upload in UI
* **Current State**: The UI allows selecting between 3 pre-built scenarios.
* **What It Lacks**: A user or judge cannot upload an arbitrary SAR image file or custom AIS CSV file to run detection on a new location.
* **Engineering Solution**:
  * Add a drag-and-drop file upload modal in the web interface that submits `.tif` or `.png` crops to `POST /api/upload_and_analyze`.

### 4.2 Automated Incident Notification Webhooks
* **Current State**: Results are displayed exclusively inside the web browser.
* **What It Lacks**: No automated push alerts to field operators.
* **Engineering Solution**:
  * Add webhook integrations (Telegram Bot, Slack, or SMS/Email via Twilio/SendGrid) triggered when attribution confidence exceeds $85\%$.

---

## 5. How to Pitch These Limitations to Hackathon Judges

When presenting to NTRO / SIH judges, turn these gaps into a strength by presenting a **Clear Phase 1 (Built) vs. Phase 2 (Production Roadmap)**:

```
+-----------------------------------+-----------------------------------+
|     PHASE 1: BUILT PROTOTYPE      |      PHASE 2: PRODUCTION SCALE    |
|        (What We Demo Today)       |         (Our Deployment Plan)     |
+-----------------------------------+-----------------------------------+
| • Complete End-to-End Pipeline    | • Pretrained U-Net weights on     |
| • Reverse Lagrangian Drift Engine |   100,000+ Sentinel-1 GRD scenes  |
| • Multi-Factor AIS Correlation    | • Live AISStream.io WebSockets    |
| • Look-Alike False Positive Filter| • Enterprise PostGIS Database     |
| • Interactive C2 Web Dashboard    | • Copernicus CMEMS Gridded Weather|
| • MARPOL Forensic Dossier Export  | • Dark Vessel SAR Radar Spotting  |
+-----------------------------------+-----------------------------------+
```
