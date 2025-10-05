import type { CapabilityNodeData } from '../types';

const LEAF_WIDTH = 200;
const LEAF_HEIGHT = 100;
const PADDING = 12; // Corresponds to p-3
const GAP = 16; // Corresponds to gap-4
const HEADER_HEIGHT = 24; // Corresponds to min-h-[24px]
const HEADER_MARGIN_TOP = 12; // Corresponds to mt-3
const CONTAINER_HEADER_TOTAL_HEIGHT = HEADER_HEIGHT + HEADER_MARGIN_TOP;

interface LayoutNodeData extends CapabilityNodeData {
  layout: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  children: LayoutNodeData[];
}

function layoutNode(node: LayoutNodeData): void {
  const isLeaf = !node.children || node.children.length === 0;

  if (isLeaf) {
    node.layout.width = LEAF_WIDTH;
    node.layout.height = LEAF_HEIGHT;
    return;
  }

  node.children.forEach(layoutNode);

  const count = node.children.length;
  if (count === 0) {
    node.layout.width = LEAF_WIDTH;
    node.layout.height = LEAF_HEIGHT;
    return;
  }

  const gridCols = Math.ceil(Math.sqrt(count));
  const gridRows = Math.ceil(count / gridCols);

  const childMaxWidth = Math.max(0, ...node.children.map(c => c.layout.width));
  const childMaxHeight = Math.max(0, ...node.children.map(c => c.layout.height));

  node.children.forEach((child, i) => {
    const col = i % gridCols;
    const row = Math.floor(i / gridCols);
    child.layout.x = col * (childMaxWidth + GAP);
    child.layout.y = row * (childMaxHeight + GAP);
  });
  
  const contentWidth = gridCols * childMaxWidth + (gridCols > 1 ? (gridCols - 1) * GAP : 0);
  const contentHeight = gridRows * childMaxHeight + (gridRows > 1 ? (gridRows - 1) * GAP : 0);

  node.layout.width = Math.max(LEAF_WIDTH, contentWidth + PADDING * 2);
  node.layout.height = CONTAINER_HEADER_TOTAL_HEIGHT + contentHeight + PADDING;
}

function generateCells(nodes: LayoutNodeData[], parentCellId: string): string {
  let cellsXml = '';
  
  for (const node of nodes) {
    const value = node.name.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');
    
    const style = `rounded=1;whiteSpace=wrap;html=1;fillColor=#fef3c7;strokeColor=#1f2937;strokeWidth=2;verticalAlign=top;align=left;spacing=8;fontFamily=sans-serif;fontStyle=1;fontSize=14;`;
    
    cellsXml += `
      <mxCell id="${node.id}" value="${value}" style="${style}" vertex="1" parent="${parentCellId}">
        <mxGeometry x="${node.layout.x}" y="${node.layout.y}" width="${node.layout.width}" height="${node.layout.height}" as="geometry" />
      </mxCell>
    `;

    if (node.children && node.children.length > 0) {
      const childrenWithShiftedLayout = node.children.map(child => ({
        ...child,
        layout: {
          ...child.layout,
          x: child.layout.x + PADDING,
          y: child.layout.y + CONTAINER_HEADER_TOTAL_HEIGHT,
        }
      }));
      cellsXml += generateCells(childrenWithShiftedLayout, node.id);
    }
  }

  return cellsXml;
}

export const generateDrawioXml = (capabilities: CapabilityNodeData[]): string => {
  const rootNodes: LayoutNodeData[] = JSON.parse(JSON.stringify(capabilities));
  const addLayout = (nodes: any[]) => {
    nodes.forEach(node => {
      node.layout = { x: 0, y: 0, width: 0, height: 0 };
      if (node.children) {
        addLayout(node.children);
      }
    });
  };
  addLayout(rootNodes);
  
  rootNodes.forEach(layoutNode);

  const count = rootNodes.length;
  if (count > 0) {
    const gridCols = Math.ceil(Math.sqrt(count));
    const childMaxWidth = Math.max(0, ...rootNodes.map(c => c.layout.width));
    const childMaxHeight = Math.max(0, ...rootNodes.map(c => c.layout.height));

    rootNodes.forEach((node, i) => {
      const col = i % gridCols;
      const row = Math.floor(i / gridCols);
      node.layout.x = col * (childMaxWidth + GAP);
      node.layout.y = row * (childMaxHeight + GAP);
    });
  }

  const cells = generateCells(rootNodes, '1');
  
  const xml = `
<mxfile host="app.diagrams.net" type="device">
  <diagram id="capability-map-diagram" name="Capability Map">
    <mxGraphModel dx="1200" dy="800" grid="1" gridSize="10" guides="1" tooltips="1" connect="1" arrows="1" fold="1" page="1" pageScale="1" pageWidth="1600" pageHeight="1200" background="#ffffff">
      <root>
        <mxCell id="0" />
        <mxCell id="1" parent="0" />
        ${cells}
      </root>
    </mxGraphModel>
  </diagram>
</mxfile>
  `.trim();

  return xml;
};