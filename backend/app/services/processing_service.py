import laspy
import numpy as np
from scipy.spatial import Delaunay
from shapely.geometry import Polygon, MultiPolygon, LineString
import geojson
import os

class ProcessingService:
    def __init__(self, upload_dir="uploads"):
        self.upload_dir = upload_dir

    def load_las(self, file_path):
        with laspy.open(file_path) as las:
            points = las.read()
            # Extract basic coordinates
            coords = np.vstack((points.x, points.y, points.z)).transpose()
            return coords

    def generate_dtm(self, points, resolution=1.0):
        # Extremely simplified DTM: Binning points and taking the minimum Z
        x_min, y_min = np.min(points[:, :2], axis=0)
        x_max, y_max = np.max(points[:, :2], axis=0)
        
        nx = int((x_max - x_min) / resolution) + 1
        ny = int((y_max - y_min) / resolution) + 1
        
        # Initialize grid with infinity
        grid = np.full((ny, nx), np.inf)
        
        # Calculate grid indices
        ix = ((points[:, 0] - x_min) / resolution).astype(int)
        iy = ((points[:, 1] - y_min) / resolution).astype(int)
        
        # Efficiently fill grid with minimum Z per cell
        for i in range(len(points)):
            if points[i, 2] < grid[iy[i], ix[i]]:
                grid[iy[i], ix[i]] = points[i, 2]
        
        # Fill missing values (holes) with mean or interpolate
        # For simplicity in this demo, we'll just use a small constant for holes
        mask = np.isinf(grid)
        grid[mask] = np.mean(grid[~mask])
        
        return grid, (x_min, y_min, resolution)

    def detect_waterlogging(self, dtm, transform):
        x_min, y_min, res = transform
        # Simplified: Detect local depressions (sinks)
        # In a real app, this would use more complex hydrological fill/sink algorithms
        mean_z = np.mean(dtm)
        depressions = dtm < (mean_z - 0.5) # Threshold for "low points"
        
        # Convert depressions to GeoJSON polygons (simplified)
        features = []
        # This is a placeholder for actual contouring/polygonization logic
        # For the demo, we'll return a few mock polygons around the center
        center_x, center_y = x_min + (dtm.shape[1]/2)*res, y_min + (dtm.shape[0]/2)*res
        
        poly = Polygon([
            (center_x - 10, center_y - 10),
            (center_x + 10, center_y - 10),
            (center_x + 10, center_y + 10),
            (center_x - 10, center_y + 10)
        ])
        
        features.append(geojson.Feature(geometry=poly, properties={"depth": 1.2, "type": "depressed_area"}))
        return geojson.FeatureCollection(features)

    def design_drainage(self, dtm, transform):
        x_min, y_min, res = transform
        # Simplified: Flow lines based on gradient
        # Mocking a flow line from a high point to a low point
        start = (x_min + 5, y_min + 5)
        end = (x_min + dtm.shape[1]*res - 5, y_min + dtm.shape[0]*res - 5)
        
        line = LineString([start, end])
        feature = geojson.Feature(geometry=line, properties={"slope": 2.5, "type": "optimized_drainage"})
        
        return geojson.FeatureCollection([feature])

processing_service = ProcessingService()
