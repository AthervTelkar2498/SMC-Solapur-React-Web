import React, { useState, useCallback, useRef } from 'react';
import { SMCProps, SystemMarker, MarkerPosition } from '../types';
import SystemMarker from './SystemMarker';
import '../styles/SMC.css';

const SMC: React.FC<SMCProps> = ({
  markers = [],
  onMarkerClick,
  onMarkerAdd,
  onMarkerRemove,
  className = '',
  width = 800,
  height = 600
}) => {
  const [localMarkers, setLocalMarkers] = useState<SystemMarker[]>(markers);
  const [selectedMarkerId, setSelectedMarkerId] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleContainerClick = useCallback((e: React.MouseEvent) => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const position: MarkerPosition = {
      x,
      y,
      id: `marker-${Date.now()}`
    };

    if (onMarkerAdd) {
      onMarkerAdd(position);
    } else {
      // Default behavior: add a new marker
      const newMarker: SystemMarker = {
        id: position.id,
        position,
        label: `Marker ${localMarkers.length + 1}`,
        type: 'info',
        timestamp: new Date(),
        description: `System marker created at (${Math.round(x)}, ${Math.round(y)})`,
        isActive: false
      };
      setLocalMarkers(prev => [...prev, newMarker]);
    }
  }, [onMarkerAdd, localMarkers.length]);

  const handleMarkerClick = useCallback((marker: SystemMarker) => {
    setSelectedMarkerId(marker.id);
    setLocalMarkers(prev =>
      prev.map(m => ({
        ...m,
        isActive: m.id === marker.id
      }))
    );

    if (onMarkerClick) {
      onMarkerClick(marker);
    }
  }, [onMarkerClick]);

  const handleMarkerRemove = useCallback((markerId: string) => {
    if (onMarkerRemove) {
      onMarkerRemove(markerId);
    } else {
      setLocalMarkers(prev => prev.filter(m => m.id !== markerId));
    }
    
    if (selectedMarkerId === markerId) {
      setSelectedMarkerId(null);
    }
  }, [onMarkerRemove, selectedMarkerId]);

  const displayMarkers = markers.length > 0 ? markers : localMarkers;

  return (
    <div className={`smc-container ${className}`}>
      <div className="smc-header">
        <h2>SMC - System Marker Component</h2>
        <div className="smc-stats">
          <span>Total Markers: {displayMarkers.length}</span>
          <span>Active: {displayMarkers.filter(m => m.isActive).length}</span>
        </div>
      </div>
      
      <div
        ref={containerRef}
        className="smc-canvas"
        style={{ width: `${width}px`, height: `${height}px` }}
        onClick={handleContainerClick}
      >
        <div className="canvas-grid"></div>
        <div className="canvas-instructions">
          Click anywhere to add a marker
        </div>
        
        {displayMarkers.map(marker => (
          <SystemMarker
            key={marker.id}
            marker={marker}
            onClick={handleMarkerClick}
            onRemove={handleMarkerRemove}
          />
        ))}
      </div>

      <div className="smc-controls">
        <button
          onClick={() => setLocalMarkers([])}
          className="btn btn-danger"
          disabled={displayMarkers.length === 0}
        >
          Clear All Markers
        </button>
        <button
          onClick={() => {
            const exportData = {
              markers: displayMarkers,
              timestamp: new Date().toISOString(),
              version: '1.0.0'
            };
            console.log('SMC Export Data:', exportData);
            navigator.clipboard?.writeText(JSON.stringify(exportData, null, 2));
          }}
          className="btn btn-primary"
          disabled={displayMarkers.length === 0}
        >
          Export Markers
        </button>
      </div>
    </div>
  );
};

export default SMC;