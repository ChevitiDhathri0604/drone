import laspy
import numpy as np

def generate_sample_las(filename="sample_data.las"):
    # Create header
    header = laspy.LasHeader(point_format=3, version="1.2")
    header.add_extra_dim(laspy.ExtraBytesParams(name="random", type=np.float64))
    
    # Generate coordinates for a 100x100 grid (10,000 points)
    x = np.linspace(0, 100, 100)
    y = np.linspace(0, 100, 100)
    xv, yv = np.meshgrid(x, y)
    xv = xv.flatten()
    yv = yv.flatten()
    
    # Generate elevation with a "sink" (depression) in the middle
    # Base elevation around 50m
    z = 50 + np.sin(xv/10) * np.cos(yv/10) * 2
    
    # Create the depression
    center_x, center_y = 50, 50
    dist = np.sqrt((xv - center_x)**2 + (yv - center_y)**2)
    z[dist < 15] -= (15 - dist[dist < 15]) / 2 # Gradual sink
    
    # Create a LAS file
    las = laspy.LasData(header)
    las.x = xv
    las.y = yv
    las.z = z
    
    # Set other required fields
    las.intensity = np.random.randint(0, 255, size=len(xv), dtype=np.uint16)
    las.gps_time = np.zeros(len(xv))
    
    las.write(filename)
    print(f"Successfully generated {filename}")

if __name__ == "__main__":
    generate_sample_las()
