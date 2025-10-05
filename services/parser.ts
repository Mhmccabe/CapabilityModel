
import type { CapabilityNodeData } from '../types';

const getIndentation = (line: string): number => {
  const match = line.match(/^\s*/);
  return match ? match[0].length : 0;
};

export const parseCapabilityModel = (text: string): CapabilityNodeData[] => {
  const lines = text.split('\n').filter(line => line.trim() !== '');
  if (lines.length === 0) return [];

  const rootNodes: CapabilityNodeData[] = [];
  const parentStack: CapabilityNodeData[] = [];

  lines.forEach((line, index) => {
    const indentation = getIndentation(line);
    const name = line.trim().replace(/^[-*]\s*/, '').trim();

    if (!name) return;

    const newNode: CapabilityNodeData = {
      id: `node-${index}-${Date.now()}`,
      name,
      children: [],
      level: 0,
    };

    while (parentStack.length > 0 && getIndentation(lines[findParentIndex(lines, parentStack[parentStack.length - 1], index)]) >= indentation) {
      parentStack.pop();
    }

    if (parentStack.length > 0) {
      const parent = parentStack[parentStack.length - 1];
      parent.children.push(newNode);
      newNode.level = parent.level + 1;
    } else {
      rootNodes.push(newNode);
      newNode.level = 0;
    }

    parentStack.push(newNode);
  });

  return rootNodes;
};

const findParentIndex = (lines: string[], parentNode: CapabilityNodeData, currentIndex: number): number => {
    for (let i = 0; i < currentIndex; i++) {
        const name = lines[i].trim().replace(/^[-*]\s*/, '').trim();
        if(name === parentNode.name){
            // This is a naive way to find parent index but works for this structure
            // A more robust solution might involve mapping nodes to line numbers initially.
            return i;
        }
    }
    return -1;
}
