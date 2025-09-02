#!/usr/bin/env python3
"""
Mobile Torch-Based EEG Glucose Estimation System
Uses mobile phone torch to simulate EEG data collection and estimate glucose levels
"""

from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import numpy as np
import json
import asyncio
import time
from datetime import datetime
import math

app = FastAPI(title="Mobile Torch EEG Glucose Estimation", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:3001", 
        "http://localhost:3002",
        "http://localhost:3003",
        "http://localhost:5173",
        "http://localhost:3006"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Data models
class TorchEEGRequest(BaseModel):
    torch_intensity: float = 0.8
    measurement_duration: int = 30
    user_id: str = "mobile-user"
    torch_position: str = "forehead"  # forehead, temple, back_of_head

class EEGSignalData(BaseModel):
    eeg_signal: List[float]
    timestamp: str
    torch_intensity: float
    measurement_duration: int
    user_id: str
    source: str = "mobile_torch"

class GlucoseEstimate(BaseModel):
    estimated_glucose: float
    confidence: float
    method: str
    timestamp: str
    features_used: int
    session_id: str
    torch_intensity: float
    measurement_duration: int

# Store active WebSocket connections
active_connections: dict = {}

# EEG signal processing functions
def generate_torch_based_eeg_signal(torch_intensity: float, duration: int, sampling_rate: int = 256) -> List[float]:
    """
    Generate EEG-like signal based on torch intensity and duration
    Simulates how torch light affects brain activity
    """
    samples = duration * sampling_rate
    t = np.linspace(0, duration, samples)
    
    # Base brain wave frequencies (Hz)
    alpha_freq = 10  # Alpha waves (8-13 Hz)
    beta_freq = 20   # Beta waves (13-30 Hz)
    theta_freq = 6   # Theta waves (4-8 Hz)
    gamma_freq = 40  # Gamma waves (30-100 Hz)
    
    # Torch intensity affects signal amplitude and frequency content
    intensity_factor = torch_intensity
    
    # Generate different brain wave components
    alpha_signal = intensity_factor * 0.4 * np.sin(2 * np.pi * alpha_freq * t)
    beta_signal = intensity_factor * 0.3 * np.sin(2 * np.pi * beta_freq * t)
    theta_signal = intensity_factor * 0.2 * np.sin(2 * np.pi * theta_freq * t)
    gamma_signal = intensity_factor * 0.1 * np.sin(2 * np.pi * gamma_freq * t)
    
    # Add noise and artifacts
    noise = 0.05 * np.random.normal(0, 1, samples)
    
    # Combine signals
    eeg_signal = alpha_signal + beta_signal + theta_signal + gamma_signal + noise
    
    # Apply torch-specific modulation (light affects brain activity)
    torch_modulation = 1 + 0.3 * intensity_factor * np.sin(2 * np.pi * 0.5 * t)
    eeg_signal = eeg_signal * torch_modulation
    
    return eeg_signal.tolist()

def extract_eeg_features(eeg_signal: List[float]) -> dict:
    """
    Extract features from EEG signal for glucose estimation
    """
    signal = np.array(eeg_signal)
    
    # Time domain features
    mean_amplitude = np.mean(np.abs(signal))
    std_amplitude = np.std(signal)
    rms_amplitude = np.sqrt(np.mean(signal**2))
    peak_amplitude = np.max(np.abs(signal))
    
    # Frequency domain features using FFT
    fft = np.fft.fft(signal)
    freqs = np.fft.fftfreq(len(signal), 1/256)  # 256 Hz sampling rate
    
    # Power in different frequency bands
    delta_power = np.sum(np.abs(fft[(freqs >= 0.5) & (freqs <= 4)])**2)
    theta_power = np.sum(np.abs(fft[(freqs >= 4) & (freqs <= 8)])**2)
    alpha_power = np.sum(np.abs(fft[(freqs >= 8) & (freqs <= 13)])**2)
    beta_power = np.sum(np.abs(fft[(freqs >= 13) & (freqs <= 30)])**2)
    gamma_power = np.sum(np.abs(fft[(freqs >= 30) & (freqs <= 100)])**2)
    
    # Total power
    total_power = delta_power + theta_power + alpha_power + beta_power + gamma_power
    
    # Relative power ratios
    alpha_ratio = alpha_power / total_power if total_power > 0 else 0
    beta_ratio = beta_power / total_power if total_power > 0 else 0
    theta_ratio = theta_power / total_power if total_power > 0 else 0
    
    # Spectral features
    dominant_freq = freqs[np.argmax(np.abs(fft))]
    spectral_centroid = np.sum(freqs * np.abs(fft)) / np.sum(np.abs(fft))
    
    return {
        'mean_amplitude': float(mean_amplitude),
        'std_amplitude': float(std_amplitude),
        'rms_amplitude': float(rms_amplitude),
        'peak_amplitude': float(peak_amplitude),
        'delta_power': float(delta_power),
        'theta_power': float(theta_power),
        'alpha_power': float(alpha_power),
        'beta_power': float(beta_power),
        'gamma_power': float(gamma_power),
        'alpha_ratio': float(alpha_ratio),
        'beta_ratio': float(beta_ratio),
        'theta_ratio': float(theta_ratio),
        'dominant_freq': float(dominant_freq),
        'spectral_centroid': float(spectral_centroid),
        'total_power': float(total_power)
    }

def estimate_glucose_from_eeg(features: dict, torch_intensity: float, duration: int) -> tuple:
    """
    Estimate glucose level from EEG features
    This is a simplified model - in reality, this would require extensive training data
    """
    
    # Base glucose estimation using EEG features
    # These coefficients are hypothetical and would need real data to calibrate
    
    # Alpha wave activity correlates with glucose metabolism
    alpha_factor = features['alpha_ratio'] * 50
    
    # Beta wave activity indicates brain glucose consumption
    beta_factor = features['beta_ratio'] * 30
    
    # Theta waves relate to glucose regulation
    theta_factor = features['theta_ratio'] * 20
    
    # Torch intensity affects measurement accuracy
    torch_factor = torch_intensity * 10
    
    # Duration affects signal quality
    duration_factor = min(duration / 30, 1.0) * 5
    
    # Base glucose level (normal range: 70-140 mg/dL)
    base_glucose = 100
    
    # Calculate estimated glucose
    estimated_glucose = base_glucose + alpha_factor + beta_factor - theta_factor + torch_factor + duration_factor
    
    # Add some randomness to simulate real measurement variability
    noise = np.random.normal(0, 5)
    estimated_glucose += noise
    
    # Clamp to reasonable range
    estimated_glucose = max(60, min(200, estimated_glucose))
    
    # Calculate confidence based on signal quality
    signal_quality = (
        features['alpha_ratio'] * 0.3 +
        features['beta_ratio'] * 0.3 +
        torch_intensity * 0.2 +
        duration_factor * 0.2
    )
    
    confidence = min(0.95, max(0.3, signal_quality))
    
    return estimated_glucose, confidence

@app.get("/")
async def root():
    return {
        "message": "Mobile Torch EEG Glucose Estimation API",
        "version": "1.0.0",
        "status": "active"
    }

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "active_connections": len(active_connections)
    }

@app.post("/api/torch-eeg/estimate", response_model=GlucoseEstimate)
async def estimate_glucose_torch_eeg(request: TorchEEGRequest):
    """
    Estimate glucose using torch-based EEG simulation
    """
    try:
        # Generate EEG signal based on torch parameters
        eeg_signal = generate_torch_based_eeg_signal(
            request.torch_intensity,
            request.measurement_duration
        )
        
        # Extract features
        features = extract_eeg_features(eeg_signal)
        
        # Estimate glucose
        estimated_glucose, confidence = estimate_glucose_from_eeg(
            features,
            request.torch_intensity,
            request.measurement_duration
        )
        
        # Create response
        estimate = GlucoseEstimate(
            estimated_glucose=round(estimated_glucose, 1),
            confidence=round(confidence, 3),
            method="torch_eeg_simulation",
            timestamp=datetime.now().isoformat(),
            features_used=len(features),
            session_id=f"torch_{int(time.time())}",
            torch_intensity=request.torch_intensity,
            measurement_duration=request.measurement_duration
        )
        
        return estimate
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Estimation failed: {str(e)}")

@app.websocket("/ws/torch-eeg/{device_id}")
async def websocket_torch_eeg(websocket: WebSocket, device_id: str):
    """
    WebSocket endpoint for real-time torch-based EEG measurement
    """
    await websocket.accept()
    active_connections[device_id] = websocket
    
    try:
        while True:
            # Wait for EEG data from client
            data = await websocket.receive_text()
            eeg_data = json.loads(data)
            
            # Process the EEG signal
            features = extract_eeg_features(eeg_data['eeg_signal'])
            
            # Estimate glucose
            estimated_glucose, confidence = estimate_glucose_from_eeg(
                features,
                eeg_data['torch_intensity'],
                eeg_data['measurement_duration']
            )
            
            # Send back the estimate
            estimate = GlucoseEstimate(
                estimated_glucose=round(estimated_glucose, 1),
                confidence=round(confidence, 3),
                method="torch_eeg_realtime",
                timestamp=datetime.now().isoformat(),
                features_used=len(features),
                session_id=f"torch_ws_{device_id}_{int(time.time())}",
                torch_intensity=eeg_data['torch_intensity'],
                measurement_duration=eeg_data['measurement_duration']
            )
            
            await websocket.send_text(json.dumps(estimate.dict()))
            
    except WebSocketDisconnect:
        if device_id in active_connections:
            del active_connections[device_id]
    except Exception as e:
        print(f"WebSocket error: {e}")
        if device_id in active_connections:
            del active_connections[device_id]

@app.get("/api/torch-eeg/status")
async def get_status():
    """
    Get system status and active connections
    """
    return {
        "status": "active",
        "active_connections": len(active_connections),
        "timestamp": datetime.now().isoformat(),
        "supported_methods": ["torch_eeg_simulation", "torch_eeg_realtime"]
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8002)
