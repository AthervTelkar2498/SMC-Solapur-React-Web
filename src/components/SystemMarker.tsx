import React from 'react';
import { MarkerComponentProps } from '../types';
import '../styles/SystemMarker.css';

const SystemMarker: React.FC<MarkerComponentProps> = ({
  marker,
  onClick,
  onRemove
}) => {
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onClick) {
      onClick(marker);
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onRemove) {
      onRemove(marker.id);
    }
  };

  const getMarkerIcon = () => {
    switch (marker.type) {
      case 'info':
        return 'ℹ️';
      case 'warning':
        return '⚠️';
      case 'error':
        return '❌';
      case 'success':
        return '✅';
      default:
        return '📍';
    }
  };

  return (
    <div
      className={`system-marker ${marker.type} ${marker.isActive ? 'active' : ''}`}
      style={{
        left: `${marker.position.x}px`,
        top: `${marker.position.y}px`
      }}
      onClick={handleClick}
      title={marker.description || marker.label}
    >
      <div className="marker-icon">
        {getMarkerIcon()}
      </div>
      <div className="marker-label">
        {marker.label}
      </div>
      <button
        className="marker-remove"
        onClick={handleRemove}
        aria-label="Remove marker"
      >
        ×
      </button>
      {marker.isActive && (
        <div className="marker-tooltip">
          <div className="tooltip-header">
            <strong>{marker.label}</strong>
            <span className="tooltip-type">{marker.type}</span>
          </div>
          {marker.description && (
            <div className="tooltip-description">
              {marker.description}
            </div>
          )}
          <div className="tooltip-timestamp">
            {marker.timestamp.toLocaleString()}
          </div>
        </div>
      )}
    </div>
  );
};

export default SystemMarker;