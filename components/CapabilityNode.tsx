import React from 'react';
import type { CapabilityNodeData } from '../types';
import { ArchimateCapabilityIcon } from './icons/ArchimateCapabilityIcon';
import { CapabilityMap } from './CapabilityMap';

interface CapabilityNodeProps {
  capability: CapabilityNodeData;
}

export const CapabilityNode: React.FC<CapabilityNodeProps> = ({ capability }) => {
  const isLeaf = !capability.children || capability.children.length === 0;

  return (
    <div className={`bg-amber-200 border-2 border-gray-800 p-3 shadow-sm flex flex-col ${isLeaf ? 'w-[200px] h-[100px]' : ''}`}>
      {/* Header for the current capability name and icon */}
      <div className={`relative flex items-start min-h-[24px] flex-shrink-0 ${isLeaf ? 'overflow-y-auto flex-grow' : ''}`}>
        <span className="font-semibold pr-8" title={capability.name}>{capability.name}</span>
        <ArchimateCapabilityIcon className="absolute top-0 right-0 h-5 w-5 text-gray-800 flex-shrink-0" />
      </div>

      {/* Render children inside the parent node */}
      {!isLeaf && (
        <div className="mt-3 flex-grow min-h-0 overflow-auto">
          <CapabilityMap capabilities={capability.children} />
        </div>
      )}
    </div>
  );
};
