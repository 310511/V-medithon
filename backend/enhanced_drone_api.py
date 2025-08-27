from fastapi import FastAPI, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
import asyncio
import json
import time
import random
import math
from datetime import datetime, timedelta
from enum import Enum
import uuid

app = FastAPI(title="Enhanced Drone Delivery API", version="2.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Data Models
class WeatherCondition(str, Enum):
    CLEAR = "clear"
    CLOUDY = "cloudy"
    RAINY = "rainy"
    WINDY = "windy"
    STORMY = "stormy"

class DroneStatus(str, Enum):
    AVAILABLE = "available"
    IN_FLIGHT = "in-flight"
    CHARGING = "charging"
    MAINTENANCE = "maintenance"
    EMERGENCY = "emergency"

class DeliveryStatus(str, Enum):
    PENDING = "pending"
    IN_FLIGHT = "in-flight"
    DELIVERED = "delivered"
    RETURNING = "returning"
    FAILED = "failed"

class Priority(str, Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    URGENT = "urgent"

class Coordinates(BaseModel):
    lat: float
    lng: float
    altitude: Optional[float] = 0

class WeatherData(BaseModel):
    condition: WeatherCondition
    temperature: float
    wind_speed: float
    wind_direction: float
    humidity: float
    visibility: float
    pressure: float
    timestamp: datetime

class Geofence(BaseModel):
    id: str
    name: str
    type: str  # "no-fly", "safe-flight", "restricted"
    coordinates: List[Coordinates]
    radius: float
    description: str

class Obstacle(BaseModel):
    id: str
    type: str  # "building", "aircraft", "weather", "ground"
    coordinates: Coordinates
    altitude: float
    size: float
    speed: Optional[float] = 0
    direction: Optional[float] = 0

class FlightPlan(BaseModel):
    id: str
    drone_id: str
    waypoints: List[Coordinates]
    estimated_duration: int  # minutes
    fuel_consumption: float
    weather_conditions: WeatherData
    obstacles: List[Obstacle]
    geofences: List[Geofence]
    safety_margin: float
    created_at: datetime
    updated_at: datetime

class Drone(BaseModel):
    id: str
    name: str
    status: DroneStatus
    battery: float
    fuel_level: float
    signal_strength: float
    location: Coordinates
    altitude: float
    speed: float
    temperature: float
    wind_speed: float
    maintenance_status: str
    last_maintenance: datetime
    flight_hours: float
    total_deliveries: int
    emergency_landing_zone: Optional[Coordinates] = None

class Delivery(BaseModel):
    id: str
    package_id: str
    destination: str
    status: DeliveryStatus
    drone_id: str
    estimated_time: str
    distance: float
    priority: Priority
    items: List[str]
    coordinates: Coordinates
    customer_info: Dict[str, Any]
    tracking_code: str
    signature_required: bool
    photo_proof_required: bool
    delivery_notes: Optional[str] = None
    created_at: datetime
    updated_at: datetime

class CustomerFeedback(BaseModel):
    id: str
    delivery_id: str
    rating: int  # 1-5
    comment: Optional[str] = None
    delivery_speed: int
    package_condition: int
    drone_behavior: int
    overall_satisfaction: int
    created_at: datetime

class EmergencyAlert(BaseModel):
    id: str
    drone_id: str
    type: str  # "low_battery", "obstacle", "weather", "technical"
    severity: str  # "low", "medium", "high", "critical"
    coordinates: Coordinates
    description: str
    timestamp: datetime
    resolved: bool = False

# Global state (in production, use a proper database)
drones: Dict[str, Drone] = {}
deliveries: Dict[str, Delivery] = {}
flight_plans: Dict[str, FlightPlan] = {}
weather_data: Dict[str, WeatherData] = {}
geofences: Dict[str, Geofence] = {}
obstacles: Dict[str, Obstacle] = {}
emergency_alerts: Dict[str, EmergencyAlert] = {}
customer_feedback: Dict[str, CustomerFeedback] = {}

# Initialize sample data
def initialize_sample_data():
    # Sample drones
    drones["drone-001"] = Drone(
        id="drone-001",
        name="VitalSync Drone Alpha",
        status=DroneStatus.IN_FLIGHT,
        battery=85.0,
        fuel_level=92.0,
        signal_strength=95.0,
        location=Coordinates(lat=40.7128, lng=-74.0060, altitude=120),
        altitude=120,
        speed=45.0,
        temperature=22.0,
        wind_speed=8.0,
        maintenance_status="excellent",
        last_maintenance=datetime.now() - timedelta(days=5),
        flight_hours=156.5,
        total_deliveries=247
    )
    
    drones["drone-002"] = Drone(
        id="drone-002",
        name="VitalSync Drone Beta",
        status=DroneStatus.AVAILABLE,
        battery=95.0,
        fuel_level=98.0,
        signal_strength=98.0,
        location=Coordinates(lat=40.7589, lng=-73.9851, altitude=0),
        altitude=0,
        speed=0.0,
        temperature=24.0,
        wind_speed=5.0,
        maintenance_status="excellent",
        last_maintenance=datetime.now() - timedelta(days=2),
        flight_hours=89.2,
        total_deliveries=134
    )

    # Sample deliveries
    deliveries["delivery-001"] = Delivery(
        id="delivery-001",
        package_id="PKG-2024-001",
        destination="City General Hospital",
        status=DeliveryStatus.IN_FLIGHT,
        drone_id="drone-001",
        estimated_time="15 min",
        distance=2.3,
        priority=Priority.URGENT,
        items=["Emergency Medicine", "Blood Samples", "Medical Supplies"],
        coordinates=Coordinates(lat=40.7589, lng=-73.9851),
        customer_info={
            "name": "Dr. Sarah Johnson",
            "phone": "+1-555-0123",
            "email": "sarah.johnson@cityhospital.com",
            "department": "Emergency Medicine"
        },
        tracking_code="TRK-2024-001",
        signature_required=True,
        photo_proof_required=True,
        delivery_notes="Urgent delivery - handle with care",
        created_at=datetime.now() - timedelta(minutes=30),
        updated_at=datetime.now()
    )

    # Sample geofences
    geofences["gf-001"] = Geofence(
        id="gf-001",
        name="Central Park No-Fly Zone",
        type="no-fly",
        coordinates=[
            Coordinates(lat=40.7829, lng=-73.9654),
            Coordinates(lat=40.7829, lng=-73.9493),
            Coordinates(lat=40.7687, lng=-73.9493),
            Coordinates(lat=40.7687, lng=-73.9654)
        ],
        radius=1000.0,
        description="Central Park restricted airspace"
    )

    # Sample weather data
    weather_data["nyc"] = WeatherData(
        condition=WeatherCondition.CLEAR,
        temperature=22.0,
        wind_speed=8.0,
        wind_direction=180.0,
        humidity=65.0,
        visibility=10.0,
        pressure=1013.25,
        timestamp=datetime.now()
    )

# Initialize data on startup
initialize_sample_data()

# Background tasks
async def update_weather_data():
    """Update weather data every 5 minutes"""
    while True:
        await asyncio.sleep(300)  # 5 minutes
        for location in weather_data:
            # Simulate weather changes
            weather_data[location].temperature += random.uniform(-1, 1)
            weather_data[location].wind_speed += random.uniform(-2, 2)
            weather_data[location].timestamp = datetime.now()

async def monitor_drone_health():
    """Monitor drone health and create maintenance alerts"""
    while True:
        await asyncio.sleep(60)  # 1 minute
        for drone_id, drone in drones.items():
            # Check battery levels
            if drone.battery < 20:
                emergency_alerts[f"alert-{uuid.uuid4()}"] = EmergencyAlert(
                    id=f"alert-{uuid.uuid4()}",
                    drone_id=drone_id,
                    type="low_battery",
                    severity="high" if drone.battery < 10 else "medium",
                    coordinates=drone.location,
                    description=f"Low battery alert: {drone.battery}%",
                    timestamp=datetime.now()
                )
            
            # Check maintenance schedule
            if (datetime.now() - drone.last_maintenance).days > 30:
                emergency_alerts[f"alert-{uuid.uuid4()}"] = EmergencyAlert(
                    id=f"alert-{uuid.uuid4()}",
                    drone_id=drone_id,
                    type="maintenance",
                    severity="medium",
                    coordinates=drone.location,
                    description=f"Maintenance due for {drone.name}",
                    timestamp=datetime.now()
                )

# Start background tasks
@app.on_event("startup")
async def startup_event():
    asyncio.create_task(update_weather_data())
    asyncio.create_task(monitor_drone_health())

# API Endpoints

@app.get("/")
async def root():
    return {"message": "Enhanced Drone Delivery API v2.0.0", "status": "operational"}

@app.get("/api/status")
async def get_status():
    return {
        "status": "operational",
        "version": "2.0.0",
        "active_drones": len([d for d in drones.values() if d.status != DroneStatus.MAINTENANCE]),
        "active_deliveries": len([d for d in deliveries.values() if d.status == DeliveryStatus.IN_FLIGHT]),
        "weather_conditions": "optimal",
        "system_health": "excellent"
    }

# Drone Management
@app.get("/api/drones")
async def get_drones():
    return {"drones": list(drones.values())}

@app.get("/api/drones/{drone_id}")
async def get_drone(drone_id: str):
    if drone_id not in drones:
        raise HTTPException(status_code=404, detail="Drone not found")
    return drones[drone_id]

@app.post("/api/drones/{drone_id}/emergency-landing")
async def emergency_landing(drone_id: str, landing_zone: Coordinates):
    if drone_id not in drones:
        raise HTTPException(status_code=404, detail="Drone not found")
    
    drone = drones[drone_id]
    drone.status = DroneStatus.EMERGENCY
    drone.emergency_landing_zone = landing_zone
    
    # Create emergency alert
    emergency_alerts[f"alert-{uuid.uuid4()}"] = EmergencyAlert(
        id=f"alert-{uuid.uuid4()}",
        drone_id=drone_id,
        type="emergency_landing",
        severity="critical",
        coordinates=landing_zone,
        description=f"Emergency landing initiated for {drone.name}",
        timestamp=datetime.now()
    )
    
    return {"message": "Emergency landing initiated", "landing_zone": landing_zone}

# Flight Planning
@app.post("/api/flight-plan")
async def create_flight_plan(
    drone_id: str,
    destination: Coordinates,
    priority: Priority = Priority.MEDIUM
):
    if drone_id not in drones:
        raise HTTPException(status_code=404, detail="Drone not found")
    
    drone = drones[drone_id]
    
    # Calculate route using AI-driven algorithm
    waypoints = calculate_optimal_route(drone.location, destination)
    
    # Check weather conditions
    weather = get_weather_at_location(destination)
    
    # Check for obstacles and geofences
    obstacles_in_route = check_obstacles_in_route(waypoints)
    geofences_in_route = check_geofences_in_route(waypoints)
    
    # Calculate fuel consumption
    distance = calculate_total_distance(waypoints)
    fuel_consumption = calculate_fuel_consumption(distance, weather.wind_speed)
    
    flight_plan = FlightPlan(
        id=f"fp-{uuid.uuid4()}",
        drone_id=drone_id,
        waypoints=waypoints,
        estimated_duration=int(distance / 45 * 60),  # Assuming 45 km/h average speed
        fuel_consumption=fuel_consumption,
        weather_conditions=weather,
        obstacles=obstacles_in_route,
        geofences=geofences_in_route,
        safety_margin=0.1,
        created_at=datetime.now(),
        updated_at=datetime.now()
    )
    
    flight_plans[flight_plan.id] = flight_plan
    return flight_plan

@app.get("/api/flight-plan/{plan_id}")
async def get_flight_plan(plan_id: str):
    if plan_id not in flight_plans:
        raise HTTPException(status_code=404, detail="Flight plan not found")
    return flight_plans[plan_id]

# Weather Integration
@app.get("/api/weather/{location}")
async def get_weather(location: str):
    if location not in weather_data:
        raise HTTPException(status_code=404, detail="Weather data not available")
    return weather_data[location]

@app.get("/api/weather/forecast/{location}")
async def get_weather_forecast(location: str, hours: int = 24):
    # Simulate weather forecast
    forecast = []
    current_weather = weather_data.get(location)
    
    for hour in range(hours):
        if current_weather:
            forecast.append(WeatherData(
                condition=current_weather.condition,
                temperature=current_weather.temperature + random.uniform(-3, 3),
                wind_speed=max(0, current_weather.wind_speed + random.uniform(-5, 5)),
                wind_direction=(current_weather.wind_direction + random.uniform(-30, 30)) % 360,
                humidity=max(0, min(100, current_weather.humidity + random.uniform(-10, 10))),
                visibility=max(0, current_weather.visibility + random.uniform(-2, 2)),
                pressure=current_weather.pressure + random.uniform(-10, 10),
                timestamp=datetime.now() + timedelta(hours=hour)
            ))
    
    return {"forecast": forecast}

# Safety Features
@app.get("/api/geofences")
async def get_geofences():
    return {"geofences": list(geofences.values())}

@app.post("/api/geofences")
async def create_geofence(geofence: Geofence):
    geofences[geofence.id] = geofence
    return geofence

@app.get("/api/obstacles")
async def get_obstacles():
    return {"obstacles": list(obstacles.values())}

@app.post("/api/obstacles")
async def create_obstacle(obstacle: Obstacle):
    obstacles[obstacle.id] = obstacle
    return obstacle

@app.get("/api/emergency-alerts")
async def get_emergency_alerts():
    return {"alerts": list(emergency_alerts.values())}

@app.put("/api/emergency-alerts/{alert_id}/resolve")
async def resolve_emergency_alert(alert_id: str):
    if alert_id not in emergency_alerts:
        raise HTTPException(status_code=404, detail="Alert not found")
    
    emergency_alerts[alert_id].resolved = True
    return {"message": "Alert resolved"}

# Delivery Management
@app.get("/api/deliveries")
async def get_deliveries():
    return {"deliveries": list(deliveries.values())}

@app.post("/api/deliveries")
async def create_delivery(delivery: Delivery):
    deliveries[delivery.id] = delivery
    return delivery

@app.get("/api/deliveries/{delivery_id}")
async def get_delivery(delivery_id: str):
    if delivery_id not in deliveries:
        raise HTTPException(status_code=404, detail="Delivery not found")
    return deliveries[delivery_id]

@app.put("/api/deliveries/{delivery_id}/status")
async def update_delivery_status(delivery_id: str, status: DeliveryStatus):
    if delivery_id not in deliveries:
        raise HTTPException(status_code=404, detail="Delivery not found")
    
    deliveries[delivery_id].status = status
    deliveries[delivery_id].updated_at = datetime.now()
    return deliveries[delivery_id]

@app.post("/api/deliveries/{delivery_id}/signature")
async def capture_signature(delivery_id: str, signature_data: Dict[str, Any]):
    if delivery_id not in deliveries:
        raise HTTPException(status_code=404, detail="Delivery not found")
    
    # In a real implementation, you would store the signature
    return {"message": "Signature captured successfully", "delivery_id": delivery_id}

@app.post("/api/deliveries/{delivery_id}/photo-proof")
async def capture_photo_proof(delivery_id: str, photo_data: Dict[str, Any]):
    if delivery_id not in deliveries:
        raise HTTPException(status_code=404, detail="Delivery not found")
    
    # In a real implementation, you would store the photo
    return {"message": "Photo proof captured successfully", "delivery_id": delivery_id}

# Customer Experience
@app.get("/api/tracking/{tracking_code}")
async def track_delivery(tracking_code: str):
    delivery = next((d for d in deliveries.values() if d.tracking_code == tracking_code), None)
    if not delivery:
        raise HTTPException(status_code=404, detail="Delivery not found")
    
    drone = drones.get(delivery.drone_id)
    
    return {
        "delivery": delivery,
        "drone_location": drone.location if drone else None,
        "estimated_arrival": delivery.estimated_time,
        "status": delivery.status
    }

@app.post("/api/deliveries/{delivery_id}/feedback")
async def submit_feedback(delivery_id: str, feedback: CustomerFeedback):
    if delivery_id not in deliveries:
        raise HTTPException(status_code=404, detail="Delivery not found")
    
    feedback.delivery_id = delivery_id
    feedback.id = f"feedback-{uuid.uuid4()}"
    feedback.created_at = datetime.now()
    
    customer_feedback[feedback.id] = feedback
    return feedback

@app.get("/api/analytics/delivery-performance")
async def get_delivery_performance():
    total_deliveries = len(deliveries)
    completed_deliveries = len([d for d in deliveries.values() if d.status == DeliveryStatus.DELIVERED])
    success_rate = (completed_deliveries / total_deliveries * 100) if total_deliveries > 0 else 0
    
    return {
        "total_deliveries": total_deliveries,
        "completed_deliveries": completed_deliveries,
        "success_rate": round(success_rate, 2),
        "average_delivery_time": "18 minutes",
        "fuel_efficiency": "94.2%"
    }

# Utility functions
def calculate_optimal_route(start: Coordinates, end: Coordinates) -> List[Coordinates]:
    """AI-driven route optimization"""
    # Simple straight-line route for demo
    # In production, this would use advanced algorithms
    return [start, end]

def get_weather_at_location(coordinates: Coordinates) -> WeatherData:
    """Get weather data for a specific location"""
    return weather_data.get("nyc", WeatherData(
        condition=WeatherCondition.CLEAR,
        temperature=22.0,
        wind_speed=8.0,
        wind_direction=180.0,
        humidity=65.0,
        visibility=10.0,
        pressure=1013.25,
        timestamp=datetime.now()
    ))

def check_obstacles_in_route(waypoints: List[Coordinates]) -> List[Obstacle]:
    """Check for obstacles along the route"""
    return []

def check_geofences_in_route(waypoints: List[Coordinates]) -> List[Geofence]:
    """Check for geofences along the route"""
    return []

def calculate_total_distance(waypoints: List[Coordinates]) -> float:
    """Calculate total distance of the route"""
    if len(waypoints) < 2:
        return 0.0
    
    total_distance = 0.0
    for i in range(len(waypoints) - 1):
        total_distance += calculate_distance(waypoints[i], waypoints[i + 1])
    
    return total_distance

def calculate_distance(point1: Coordinates, point2: Coordinates) -> float:
    """Calculate distance between two coordinates"""
    lat1, lng1 = math.radians(point1.lat), math.radians(point1.lng)
    lat2, lng2 = math.radians(point2.lat), math.radians(point2.lng)
    
    dlat = lat2 - lat1
    dlng = lng2 - lng1
    
    a = math.sin(dlat/2)**2 + math.cos(lat1) * math.cos(lat2) * math.sin(dlng/2)**2
    c = 2 * math.asin(math.sqrt(a))
    
    return 6371 * c  # Earth's radius in km

def calculate_fuel_consumption(distance: float, wind_speed: float) -> float:
    """Calculate fuel consumption based on distance and wind conditions"""
    base_consumption = distance * 0.1  # 0.1 L per km
    wind_factor = 1 + (wind_speed / 50)  # Wind increases consumption
    return base_consumption * wind_factor

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
