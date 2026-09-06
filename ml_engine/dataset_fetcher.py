"""
Dataset Ingestion, Downloader & Corpus Generator for SAR Oil Spill Training.

Provides tools to:
1. Fetch benchmark public datasets (MMSD, Kaggle SAR Oil Spill, Sentinel-1 samples).
2. Generate a structured local training dataset corpus (Images & Ground Truth Masks)
   with realistic SAR speckle, polarimetric damping, wind look-alikes, and metallic ships.
"""
import os
import json
import urllib.request
import cv2
import numpy as np
from typing import Dict, Any
try:
    import rasterio
    from rasterio.transform import from_bounds
    HAS_RASTERIO = True
except ImportError:
    HAS_RASTERIO = False
    rasterio = None
    from_bounds = None

DATASET_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "data_samples", "training_data")

# Benchmark open dataset references & download endpoints
PUBLIC_DATASET_REGISTRY = {
    "MMSD_Marine_Oil_Spill": {
        "description": "Marine Oil Spill Dataset (Technical University of Crete) with pixel-level ground truth.",
        "url": "https://github.com/ayyushutup/seaLens/releases/download/v1.0-data/mmsd_sample_batch.zip",
        "format": "GeoTIFF + PNG masks",
        "classes": ["Oil Spill", "Look-Alike", "Ship", "Sea Surface"]
    },
    "Kaggle_SAR_Oil_Spills": {
        "description": "Kaggle Sentinel-1 SAR Oil Spill Detection Dataset",
        "url": "https://www.kaggle.com/datasets/nikitaduster/sar-oil-spill-dataset",
        "format": "256x256 Patches + Masks"
    },
    "Sentinel1_GRD_Samples": {
        "description": "ESA Copernicus Sentinel-1 dual-pol IW GRD ocean observations",
        "url": "https://dataspace.copernicus.eu/stac/collections/SENTINEL-1",
        "format": "16-bit SAFE GeoTIFF"
    }
}

class SARDatasetManager:
    def __init__(self, base_dir: str = DATASET_DIR):
        self.base_dir = base_dir
        self.images_dir = os.path.join(self.base_dir, "images")
        self.masks_dir = os.path.join(self.base_dir, "masks")
        os.makedirs(self.images_dir, exist_ok=True)
        os.makedirs(self.masks_dir, exist_ok=True)

    def generate_corpus(
        self,
        num_scenes: int = 50,
        tile_size: int = 256
    ) -> Dict[str, Any]:
        """
        Generates a high-fidelity local training corpus of SAR GeoTIFF images & ground truth masks.
        Simulates:
        - Deep dark oil slicks (6-14 dB damping)
        - Natural biogenic look-alikes (soft gradients, low damping)
        - Low-wind ocean calm water zones
        - Bright metallic ship scatterers
        """
        print(f"📦 Generating local SAR training corpus ({num_scenes} GeoTIFF scenes)...")
        manifest = []

        for i in range(1, num_scenes + 1):
            img_filename = f"sar_scene_{i:03d}.tif"
            mask_filename = f"sar_mask_{i:03d}.png"
            
            img_path = os.path.join(self.images_dir, img_filename)
            mask_path = os.path.join(self.masks_dir, mask_filename)

            # Random center coordinates around ocean shipping lanes
            base_lat = np.random.uniform(15.0, 22.0)
            base_lng = np.random.uniform(68.0, 74.0)
            span_deg = 0.15

            west, east = base_lng - span_deg / 2, base_lng + span_deg / 2
            south, north = base_lat - span_deg / 2, base_lat + span_deg / 2
            transform = from_bounds(west, south, east, north, tile_size, tile_size) if HAS_RASTERIO else None

            # 1. Background sea clutter (Gamma speckle noise)
            clutter = np.random.gamma(4.0, 0.15, (tile_size, tile_size)).astype(np.float32)
            clutter = np.clip(clutter / 1.5, 0.2, 0.9)
            mask = np.zeros((tile_size, tile_size), dtype=np.uint8)

            # 2. Wind speed scenario (below 2.5 m/s creates low-wind look-alikes)
            wind_speed = np.random.uniform(1.8, 12.0)
            is_lookalike_scene = wind_speed < 3.0 and np.random.rand() > 0.4

            # 3. Add Oil Slicks or Look-alikes
            num_features = np.random.randint(1, 3)
            for _ in range(num_features):
                cx, cy = np.random.randint(40, tile_size - 40), np.random.randint(40, tile_size - 40)
                rx, ry = np.random.randint(15, 45), np.random.randint(8, 25)
                angle = np.random.uniform(0, np.pi)

                y, x = np.ogrid[:tile_size, :tile_size]
                cos_a, sin_a = np.cos(angle), np.sin(angle)
                dx = (x - cx) * cos_a + (y - cy) * sin_a
                dy = -(x - cx) * sin_a + (y - cy) * cos_a
                ellipse = (dx**2 / rx**2 + dy**2 / ry**2) <= 1.0

                if is_lookalike_scene:
                    # Look-alike: soft attenuation, not true oil slick ground truth mask
                    clutter[ellipse] = clutter[ellipse] * np.random.uniform(0.55, 0.75)
                else:
                    # True oil spill: severe damping (6-12 dB)
                    clutter[ellipse] = clutter[ellipse] * np.random.uniform(0.12, 0.30)
                    mask[ellipse] = 255

            # 4. Add bright ship scatterers (Point targets)
            num_ships = np.random.randint(0, 4)
            for _ in range(num_ships):
                sx, sy = np.random.randint(10, tile_size - 10), np.random.randint(10, tile_size - 10)
                clutter[sy-1:sy+2, sx-1:sx+2] = np.random.uniform(1.8, 2.5)

            # Save 16-bit GeoTIFF
            raw_16bit = (np.clip(clutter, 0.0, 2.0) / 2.0 * 65535.0).astype(np.uint16)
            if HAS_RASTERIO:
                with rasterio.open(
                    img_path, 'w', driver='GTiff',
                    height=tile_size, width=tile_size, count=1,
                    dtype=rasterio.uint16, crs='EPSG:4326', transform=transform
                ) as dst:
                    dst.write(raw_16bit, 1)
            else:
                cv2.imwrite(img_path, raw_16bit)

            # Save mask
            import cv2
            cv2.imwrite(mask_path, mask)

            manifest.append({
                "scene_id": f"SCENE-{i:03d}",
                "image_path": img_path,
                "mask_path": mask_path,
                "wind_speed_ms": round(wind_speed, 2),
                "is_lookalike_scene": is_lookalike_scene
            })

        manifest_file = os.path.join(self.base_dir, "dataset_manifest.json")
        with open(manifest_file, "w") as f:
            json.dump({"total_scenes": num_scenes, "scenes": manifest}, f, indent=2)

        print(f"✅ Generated dataset corpus with {num_scenes} scenes at: {self.base_dir}")
        return {"status": "success", "manifest_file": manifest_file, "scenes": num_scenes}

if __name__ == "__main__":
    manager = SARDatasetManager()
    manager.generate_corpus(num_scenes=40)
