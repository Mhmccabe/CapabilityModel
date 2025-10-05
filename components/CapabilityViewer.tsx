import React, { useState, useCallback } from 'react';
import type { CapabilityNodeData } from '../types';
import { CapabilityMap } from './CapabilityMap';
import { ZoomInIcon } from './icons/ZoomInIcon';
import { ZoomOutIcon } from './icons/ZoomOutIcon';
import { ResetZoomIcon } from './icons/ResetZoomIcon';
import { DownloadIcon } from './icons/DownloadIcon';
import { generateDrawioXml } from '../services/drawioGenerator';


interface CapabilityViewerProps {
  capabilities: CapabilityNodeData[];
}

const ZOOM_FACTOR = 1.2;
const MAX_ZOOM = 5;
const MIN_ZOOM = 0.2;

export const CapabilityViewer: React.FC<CapabilityViewerProps> = ({ capabilities }) => {
  const [zoom, setZoom] = useState(1);

  const zoomIn = useCallback(() => {
    setZoom(prevZoom => Math.min(prevZoom * ZOOM_FACTOR, MAX_ZOOM));
  }, []);

  const zoomOut = useCallback(() => {
    setZoom(prevZoom => Math.max(prevZoom / ZOOM_FACTOR, MIN_ZOOM));
  }, []);

  const resetZoom = useCallback(() => {
    setZoom(1);
  }, []);

  const downloadAsDrawio = useCallback(() => {
    const xml = generateDrawioXml(capabilities);
    const blob = new Blob([xml], { type: 'application/vnd.jgraph.mxfile' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'capability-map.drawio';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [capabilities]);

  return (
    <div className="w-full h-full overflow-auto bg-gray-50 relative">
      <div 
        className="p-8 transition-transform duration-200" 
        style={{ 
          transform: `scale(${zoom})`,
          transformOrigin: 'top left'
        }}
      >
        <CapabilityMap capabilities={capabilities} />
      </div>

      <div className="absolute bottom-4 right-4 bg-white bg-opacity-80 backdrop-blur-sm rounded-lg shadow-lg flex items-center border border-gray-200">
        <button 
          onClick={downloadAsDrawio}
          className="p-2 text-gray-600 hover:text-blue-600 hover:bg-gray-100 rounded-l-md transition-colors"
          aria-label="Download as Draw.io"
          title="Download as Draw.io"
        >
          <DownloadIcon className="w-5 h-5" />
        </button>
        <button 
          onClick={zoomOut}
          className="p-2 text-gray-600 hover:text-blue-600 hover:bg-gray-100 transition-colors border-l border-gray-200"
          aria-label="Zoom out"
          title="Zoom out"
        >
          <ZoomOutIcon className="w-5 h-5" />
        </button>
        <span className="px-3 text-sm font-medium text-gray-700 select-none border-l border-r border-gray-200">
          {Math.round(zoom * 100)}%
        </span>
        <button 
          onClick={zoomIn}
          className="p-2 text-gray-600 hover:text-blue-600 hover:bg-gray-100 transition-colors"
          aria-label="Zoom in"
          title="Zoom in"
        >
          <ZoomInIcon className="w-5 h-5" />
        </button>
        <button 
          onClick={resetZoom}
          className="p-2 text-gray-600 hover:text-blue-600 hover:bg-gray-100 rounded-r-md border-l border-gray-200 transition-colors"
          aria-label="Reset zoom"
          title="Reset zoom"
        >
          <ResetZoomIcon className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};