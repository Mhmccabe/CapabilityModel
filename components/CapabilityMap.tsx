import React from 'react';
import type { CapabilityNodeData } from '../types';
import { CapabilityNode } from './CapabilityNode';

interface CapabilityMapProps {
  capabilities: CapabilityNodeData[];
}

export const CapabilityMap: React.FC<CapabilityMapProps> = ({ capabilities }) => {
  const count = capabilities.length;
  if (count === 0) {
    return null;
  }
  
  // Calculate grid columns to make the layout roughly square
  const gridCols = Math.ceil(Math.sqrt(count));

  return (
    <div
      className="inline-grid gap-4 content-start items-start"
      style={{ gridTemplateColumns: `repeat(${gridCols}, min-content)` }}
    >
      {capabilities.map((capability) => (
        <CapabilityNode key={capability.id} capability={capability} />
      ))}
    </div>
  );
};