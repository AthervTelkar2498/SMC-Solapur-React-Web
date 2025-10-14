// SMC System Types
export interface MarkerPosition {
  x: number;
  y: number;
  id: string;
}

export interface SystemMarker {
  id: string;
  position: MarkerPosition;
  label: string;
  type: 'info' | 'warning' | 'error' | 'success';
  timestamp: Date;
  description?: string;
  isActive: boolean;
}

export interface SMCProps {
  markers?: SystemMarker[];
  onMarkerClick?: (marker: SystemMarker) => void;
  onMarkerAdd?: (position: MarkerPosition) => void;
  onMarkerRemove?: (markerId: string) => void;
  className?: string;
  width?: number;
  height?: number;
}

export interface MarkerComponentProps {
  marker: SystemMarker;
  onClick?: (marker: SystemMarker) => void;
  onRemove?: (markerId: string) => void;
}