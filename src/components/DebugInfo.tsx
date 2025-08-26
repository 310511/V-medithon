import React from 'react';

const DebugInfo: React.FC = () => {
  console.log('DebugInfo component rendered');
  
  return (
    <div style={{ 
      position: 'fixed', 
      top: '10px', 
      right: '10px', 
      backgroundColor: 'rgba(0,0,0,0.8)', 
      color: 'white', 
      padding: '10px', 
      borderRadius: '5px',
      fontSize: '12px',
      zIndex: 9999
    }}>
      <div>React Version: {React.version}</div>
      <div>User Agent: {navigator.userAgent}</div>
      <div>Viewport: {window.innerWidth}x{window.innerHeight}</div>
      <div>Timestamp: {new Date().toLocaleTimeString()}</div>
    </div>
  );
};

export default DebugInfo;
