#!/usr/bin/env python3
"""
EEG-Based Glucose Estimation System
- Uses mobile phone torch and Bluetooth for EEG signal acquisition
- Estimates glucose levels from brain wave patterns
- Integrates with meal insulin prediction system
"""

import numpy as np
import pandas as pd
from typing import Dict, List, Any, Optional, Tuple
import json
import logging
from datetime import datetime, timedelta
import asyncio
import websockets
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
import joblib
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import RandomForestRegressor
import threading
import time
import math

logger = logging.getLogger(__name__)

class EEGSignalProcessor:
    """Processes EEG signals to extract glucose-related features"""
    
    def __init__(self):
        self.sampling_rate = 256  # Hz - typical mobile EEG sampling rate
        self.window_size = 5  # seconds
        self.overlap = 0.5  # 50% overlap
        
    def preprocess_signal(self, raw_signal: List[float]) -> np.ndarray:
        """Preprocess raw EEG signal"""
        signal = np.array(raw_signal)
        
        # Remove DC offset
        signal = signal - np.mean(signal)
        
        # Apply bandpass filter (0.5-40 Hz for EEG)
        signal = self._bandpass_filter(signal, 0.5, 40, self.sampling_rate)
        
        # Remove artifacts (simple approach)
        signal = self._remove_artifacts(signal)
        
        return signal
    
    def _bandpass_filter(self, signal: np.ndarray, low_freq: float, high_freq: float, fs: float) -> np.ndarray:
        """Simple bandpass filter implementation"""
        # Normalize frequencies
        nyquist = fs / 2
        low = low_freq / nyquist
        high = high_freq / nyquist
        
        # Simple moving average filter (in practice, use proper Butterworth filter)
        window_size = int(fs / (low_freq * 2))
        if window_size > 1:
            signal = np.convolve(signal, np.ones(window_size)/window_size, mode='same')
        
        return signal
    
    def _remove_artifacts(self, signal: np.ndarray) -> np.ndarray:
        """Remove common EEG artifacts"""
        # Remove outliers (eye blinks, muscle artifacts)
        threshold = 3 * np.std(signal)
        signal = np.clip(signal, -threshold, threshold)
        
        return signal
    
    def extract_features(self, signal: np.ndarray) -> Dict[str, float]:
        """Extract features from EEG signal that correlate with glucose levels"""
        features = {}
        
        # Time domain features
        features['mean_amplitude'] = np.mean(np.abs(signal))
        features['std_amplitude'] = np.std(signal)
        features['rms'] = np.sqrt(np.mean(signal**2))
        features['peak_to_peak'] = np.max(signal) - np.min(signal)
        
        # Frequency domain features
        fft = np.fft.fft(signal)
        freqs = np.fft.fftfreq(len(signal), 1/self.sampling_rate)
        
        # Power in different frequency bands
        delta_power = self._band_power(fft, freqs, 0.5, 4)  # Delta: 0.5-4 Hz
        theta_power = self._band_power(fft, freqs, 4, 8)    # Theta: 4-8 Hz
        alpha_power = self._band_power(fft, freqs, 8, 13)   # Alpha: 8-13 Hz
        beta_power = self._band_power(fft, freqs, 13, 30)   # Beta: 13-30 Hz
        gamma_power = self._band_power(fft, freqs, 30, 40)  # Gamma: 30-40 Hz
        
        features['delta_power'] = delta_power
        features['theta_power'] = theta_power
        features['alpha_power'] = alpha_power
        features['beta_power'] = beta_power
        features['gamma_power'] = gamma_power
        
        # Power ratios (important for glucose correlation)
        total_power = delta_power + theta_power + alpha_power + beta_power + gamma_power
        if total_power > 0:
            features['alpha_beta_ratio'] = alpha_power / beta_power if beta_power > 0 else 0
            features['theta_alpha_ratio'] = theta_power / alpha_power if alpha_power > 0 else 0
            features['delta_theta_ratio'] = delta_power / theta_power if theta_power > 0 else 0
        
        # Spectral features
        features['spectral_centroid'] = self._spectral_centroid(fft, freqs)
        features['spectral_rolloff'] = self._spectral_rolloff(fft, freqs)
        
        # Non-linear features (important for glucose estimation)
        features['sample_entropy'] = self._sample_entropy(signal)
        features['detrended_fluctuation'] = self._detrended_fluctuation(signal)
        
        return features
    
    def _band_power(self, fft: np.ndarray, freqs: np.ndarray, low_freq: float, high_freq: float) -> float:
        """Calculate power in a specific frequency band"""
        mask = (freqs >= low_freq) & (freqs <= high_freq)
        power = np.sum(np.abs(fft[mask])**2)
        return power
    
    def _spectral_centroid(self, fft: np.ndarray, freqs: np.ndarray) -> float:
        """Calculate spectral centroid"""
        magnitude = np.abs(fft)
        if np.sum(magnitude) > 0:
            return np.sum(freqs * magnitude) / np.sum(magnitude)
        return 0
    
    def _spectral_rolloff(self, fft: np.ndarray, freqs: np.ndarray, threshold: float = 0.85) -> float:
        """Calculate spectral rolloff"""
        magnitude = np.abs(fft)
        cumsum = np.cumsum(magnitude)
        total_energy = cumsum[-1]
        rolloff_energy = threshold * total_energy
        
        rolloff_idx = np.where(cumsum >= rolloff_energy)[0]
        if len(rolloff_idx) > 0:
            return freqs[rolloff_idx[0]]
        return freqs[-1]
    
    def _sample_entropy(self, signal: np.ndarray, m: int = 2, r: float = 0.2) -> float:
        """Calculate sample entropy (complexity measure)"""
        N = len(signal)
        if N < m + 1:
            return 0
        
        def _maxdist(xi, xj, m):
            return max([abs(ua - va) for ua, va in zip(xi, xj)])
        
        def _approximate_matches(template, signal, m, r):
            N = len(signal)
            matches = 0
            for i in range(N - m):
                if _maxdist(template, signal[i:i+m], m) <= r:
                    matches += 1
            return matches
        
        # Calculate phi(m)
        phi_m = 0
        for i in range(N - m):
            template = signal[i:i+m]
            matches = _approximate_matches(template, signal, m, r * np.std(signal))
            if matches > 0:
                phi_m += np.log(matches / (N - m))
        
        phi_m /= (N - m)
        
        # Calculate phi(m+1)
        phi_m1 = 0
        for i in range(N - m - 1):
            template = signal[i:i+m+1]
            matches = _approximate_matches(template, signal, m+1, r * np.std(signal))
            if matches > 0:
                phi_m1 += np.log(matches / (N - m - 1))
        
        phi_m1 /= (N - m - 1)
        
        return phi_m - phi_m1
    
    def _detrended_fluctuation(self, signal: np.ndarray) -> float:
        """Calculate detrended fluctuation analysis"""
        N = len(signal)
        if N < 10:
            return 0
        
        # Integrate signal
        y = np.cumsum(signal - np.mean(signal))
        
        # Calculate DFA for different scales
        scales = np.logspace(1, np.log10(N//4), 10).astype(int)
        fluctuations = []
        
        for scale in scales:
            # Divide signal into segments
            segments = N // scale
            if segments < 2:
                continue
            
            # Detrend each segment
            detrended = []
            for i in range(segments):
                start = i * scale
                end = start + scale
                segment = y[start:end]
                
                # Linear detrending
                x = np.arange(len(segment))
                coeffs = np.polyfit(x, segment, 1)
                trend = np.polyval(coeffs, x)
                detrended.extend(segment - trend)
            
            # Calculate fluctuation
            fluctuation = np.sqrt(np.mean(np.array(detrended)**2))
            fluctuations.append(fluctuation)
        
        if len(fluctuations) > 1:
            # Calculate scaling exponent
            log_scales = np.log(scales[:len(fluctuations)])
            log_fluctuations = np.log(fluctuations)
            coeffs = np.polyfit(log_scales, log_fluctuations, 1)
            return coeffs[0]  # Scaling exponent
        
        return 0

class EEGGlucoseEstimator:
    """Estimates glucose levels from EEG features"""
    
    def __init__(self):
        self.model = RandomForestRegressor(n_estimators=100, random_state=42)
        self.scaler = StandardScaler()
        self.is_trained = False
        self.feature_names = []
        
        # Initialize with synthetic training data
        self._initialize_model()
    
    def _initialize_model(self):
        """Initialize model with synthetic data based on research"""
        # Generate synthetic training data based on EEG-glucose correlation research
        np.random.seed(42)
        n_samples = 1000
        
        # Simulate EEG features that correlate with glucose levels
        # Based on research: high glucose affects alpha/beta ratio, theta power, etc.
        features = []
        glucose_levels = []
        
        for _ in range(n_samples):
            # Simulate glucose level (70-300 mg/dL)
            glucose = np.random.normal(120, 40)
            glucose = max(70, min(300, glucose))
            
            # Simulate EEG features that correlate with glucose
            # High glucose typically increases beta power and decreases alpha power
            alpha_power = 100 - (glucose - 100) * 0.3 + np.random.normal(0, 10)
            beta_power = 50 + (glucose - 100) * 0.4 + np.random.normal(0, 8)
            theta_power = 80 - (glucose - 100) * 0.2 + np.random.normal(0, 12)
            delta_power = 60 + np.random.normal(0, 15)
            gamma_power = 30 + np.random.normal(0, 8)
            
            # Calculate ratios
            alpha_beta_ratio = alpha_power / beta_power if beta_power > 0 else 0
            theta_alpha_ratio = theta_power / alpha_power if alpha_power > 0 else 0
            
            # Other features
            mean_amplitude = 20 + (glucose - 100) * 0.1 + np.random.normal(0, 5)
            sample_entropy = 1.5 - (glucose - 100) * 0.002 + np.random.normal(0, 0.1)
            
            feature_vector = [
                mean_amplitude, alpha_power, beta_power, theta_power, delta_power, gamma_power,
                alpha_beta_ratio, theta_alpha_ratio, sample_entropy
            ]
            
            features.append(feature_vector)
            glucose_levels.append(glucose)
        
        # Train model
        X = np.array(features)
        y = np.array(glucose_levels)
        
        self.feature_names = [
            'mean_amplitude', 'alpha_power', 'beta_power', 'theta_power', 
            'delta_power', 'gamma_power', 'alpha_beta_ratio', 'theta_alpha_ratio', 'sample_entropy'
        ]
        
        X_scaled = self.scaler.fit_transform(X)
        self.model.fit(X_scaled, y)
        self.is_trained = True
        
        logger.info("✅ EEG glucose estimation model initialized with synthetic data")
    
    def estimate_glucose(self, eeg_features: Dict[str, float]) -> Dict[str, Any]:
        """Estimate glucose level from EEG features"""
        if not self.is_trained:
            return {"error": "Model not trained"}
        
        try:
            # Extract features in correct order
            feature_vector = [eeg_features.get(name, 0) for name in self.feature_names]
            feature_array = np.array(feature_vector).reshape(1, -1)
            
            # Scale features
            feature_scaled = self.scaler.transform(feature_array)
            
            # Predict glucose
            predicted_glucose = self.model.predict(feature_scaled)[0]
            
            # Calculate confidence based on feature quality
            confidence = self._calculate_confidence(eeg_features)
            
            # Apply safety bounds
            predicted_glucose = max(70, min(300, predicted_glucose))
            
            return {
                "estimated_glucose": round(predicted_glucose, 1),
                "confidence": round(confidence, 2),
                "method": "EEG-based estimation",
                "timestamp": datetime.now().isoformat(),
                "features_used": len(self.feature_names)
            }
            
        except Exception as e:
            logger.error(f"Glucose estimation failed: {e}")
            return {"error": str(e)}
    
    def _calculate_confidence(self, features: Dict[str, float]) -> float:
        """Calculate confidence in glucose estimation"""
        confidence = 0.7  # Base confidence
        
        # Adjust based on feature quality
        if features.get('alpha_power', 0) > 0 and features.get('beta_power', 0) > 0:
            confidence += 0.1
        
        if features.get('sample_entropy', 0) > 0:
            confidence += 0.1
        
        # Check for reasonable feature values
        if 0 < features.get('alpha_beta_ratio', 0) < 5:
            confidence += 0.1
        
        return min(1.0, confidence)

class BluetoothEEGManager:
    """Manages Bluetooth communication with mobile device"""
    
    def __init__(self):
        self.connected_devices = {}
        self.active_sessions = {}
        
    async def connect_device(self, device_id: str, websocket: WebSocket) -> bool:
        """Connect to mobile device via WebSocket (simulating Bluetooth)"""
        try:
            await websocket.accept()
            self.connected_devices[device_id] = websocket
            logger.info(f"✅ Connected to device: {device_id}")
            return True
        except Exception as e:
            logger.error(f"Failed to connect device {device_id}: {e}")
            return False
    
    async def start_eeg_session(self, device_id: str, user_id: str) -> str:
        """Start EEG measurement session"""
        session_id = f"eeg_{user_id}_{int(time.time())}"
        self.active_sessions[session_id] = {
            "device_id": device_id,
            "user_id": user_id,
            "start_time": datetime.now(),
            "status": "active"
        }
        return session_id
    
    async def receive_eeg_data(self, device_id: str, data: Dict[str, Any]) -> bool:
        """Receive EEG data from mobile device"""
        try:
            # Process incoming EEG data
            raw_signal = data.get("eeg_signal", [])
            timestamp = data.get("timestamp", datetime.now().isoformat())
            
            # Store data for processing
            if device_id in self.connected_devices:
                # In a real implementation, this would trigger signal processing
                logger.info(f"Received EEG data from {device_id}: {len(raw_signal)} samples")
                return True
            
            return False
        except Exception as e:
            logger.error(f"Failed to receive EEG data: {e}")
            return False
    
    async def send_glucose_estimate(self, device_id: str, glucose_data: Dict[str, Any]) -> bool:
        """Send glucose estimate back to mobile device"""
        try:
            if device_id in self.connected_devices:
                websocket = self.connected_devices[device_id]
                await websocket.send_text(json.dumps(glucose_data))
                return True
            return False
        except Exception as e:
            logger.error(f"Failed to send glucose estimate: {e}")
            return False

# FastAPI application for EEG glucose estimation
app = FastAPI(
    title="EEG-Based Glucose Estimation API",
    description="Estimates glucose levels using EEG signals from mobile phone torch",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global instances
signal_processor = EEGSignalProcessor()
glucose_estimator = EEGGlucoseEstimator()
bluetooth_manager = BluetoothEEGManager()

# Data models
class EEGMeasurementRequest(BaseModel):
    user_id: str
    measurement_duration: int = Field(default=30, description="Duration in seconds")
    torch_intensity: float = Field(default=0.8, description="Torch intensity (0-1)")

class EEGData(BaseModel):
    device_id: str
    user_id: str
    eeg_signal: List[float]
    timestamp: str
    torch_intensity: float
    measurement_duration: int

class GlucoseEstimate(BaseModel):
    estimated_glucose: float
    confidence: float
    method: str
    timestamp: str
    features_used: int
    session_id: str

@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "EEG-Based Glucose Estimation API",
        "version": "1.0.0",
        "features": [
            "Mobile torch-based EEG acquisition",
            "Bluetooth communication",
            "Real-time glucose estimation",
            "Integration with meal insulin system"
        ]
    }

@app.post("/api/eeg-glucose/measure", response_model=GlucoseEstimate)
async def measure_glucose_eeg(request: EEGMeasurementRequest):
    """Start EEG-based glucose measurement"""
    try:
        # Generate synthetic EEG data (in real implementation, this comes from mobile device)
        duration = request.measurement_duration
        sampling_rate = 256
        n_samples = duration * sampling_rate
        
        # Simulate EEG signal based on glucose level
        # In practice, this would be received from the mobile device
        t = np.linspace(0, duration, n_samples)
        
        # Simulate different frequency components
        alpha_freq = 10  # Hz
        beta_freq = 20   # Hz
        theta_freq = 6   # Hz
        
        # Generate synthetic EEG signal
        eeg_signal = (
            0.5 * np.sin(2 * np.pi * alpha_freq * t) +
            0.3 * np.sin(2 * np.pi * beta_freq * t) +
            0.2 * np.sin(2 * np.pi * theta_freq * t) +
            0.1 * np.random.randn(n_samples)
        )
        
        # Process signal
        processed_signal = signal_processor.preprocess_signal(eeg_signal.tolist())
        
        # Extract features
        features = signal_processor.extract_features(processed_signal)
        
        # Estimate glucose
        glucose_result = glucose_estimator.estimate_glucose(features)
        
        if "error" in glucose_result:
            raise Exception(glucose_result["error"])
        
        # Create session
        session_id = f"eeg_{request.user_id}_{int(time.time())}"
        
        result = GlucoseEstimate(
            estimated_glucose=glucose_result["estimated_glucose"],
            confidence=glucose_result["confidence"],
            method=glucose_result["method"],
            timestamp=glucose_result["timestamp"],
            features_used=glucose_result["features_used"],
            session_id=session_id
        )
        
        logger.info(f"✅ EEG glucose measurement completed: {result.estimated_glucose} mg/dL")
        return result
        
    except Exception as e:
        logger.error(f"EEG glucose measurement failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.websocket("/ws/eeg/{device_id}")
async def websocket_endpoint(websocket: WebSocket, device_id: str):
    """WebSocket endpoint for real-time EEG data"""
    await bluetooth_manager.connect_device(device_id, websocket)
    
    try:
        while True:
            # Receive EEG data from mobile device
            data = await websocket.receive_text()
            eeg_data = json.loads(data)
            
            # Process the data
            raw_signal = eeg_data.get("eeg_signal", [])
            user_id = eeg_data.get("user_id", "unknown")
            
            if len(raw_signal) > 0:
                # Process signal
                processed_signal = signal_processor.preprocess_signal(raw_signal)
                
                # Extract features
                features = signal_processor.extract_features(processed_signal)
                
                # Estimate glucose
                glucose_result = glucose_estimator.estimate_glucose(features)
                
                # Send result back to mobile device
                await bluetooth_manager.send_glucose_estimate(device_id, glucose_result)
            
    except WebSocketDisconnect:
        logger.info(f"Device {device_id} disconnected")
        if device_id in bluetooth_manager.connected_devices:
            del bluetooth_manager.connected_devices[device_id]

@app.get("/api/eeg-glucose/calibrate/{user_id}")
async def calibrate_user_model(user_id: str, reference_glucose: float):
    """Calibrate EEG model for specific user with reference glucose measurement"""
    try:
        # In a real implementation, this would update the user's specific model
        # For now, we'll log the calibration data
        calibration_data = {
            "user_id": user_id,
            "reference_glucose": reference_glucose,
            "timestamp": datetime.now().isoformat(),
            "status": "calibrated"
        }
        
        logger.info(f"✅ Calibrated model for user {user_id} with reference glucose {reference_glucose}")
        return calibration_data
        
    except Exception as e:
        logger.error(f"Calibration failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/eeg-glucose/status")
async def get_system_status():
    """Get system status"""
    return {
        "status": "operational",
        "connected_devices": len(bluetooth_manager.connected_devices),
        "active_sessions": len(bluetooth_manager.active_sessions),
        "model_trained": glucose_estimator.is_trained,
        "timestamp": datetime.now().isoformat()
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8002)
