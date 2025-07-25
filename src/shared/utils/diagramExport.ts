import Konva from 'konva';

export interface ExportOptions {
  format: 'png' | 'svg';
  quality?: number; // For PNG (0-1)
  pixelRatio?: number; // For high-DPI displays
  backgroundColor?: string;
  padding?: number; // Padding around the diagram
  includeGrid?: boolean;
  filename?: string;
}

export interface PNGExportOptions {
  quality?: number;
  pixelRatio?: number;
  backgroundColor?: string;
  padding?: number;
  includeGrid?: boolean;
  filename?: string;
}

export interface SVGExportOptions {
  backgroundColor?: string;
  padding?: number;
  includeGrid?: boolean;
  filename?: string;
}

export interface DiagramBounds {
  x: number;
  y: number;
  width: number;
  height: number;
}

/**
 * Calculate the bounding box of all diagram elements (nodes and transitions)
 */
export const calculateDiagramBounds = (stage: Konva.Stage, padding: number = 50): DiagramBounds => {
  const nodeLayer = stage.findOne('#node-layer') as Konva.Layer;
  
  if (!nodeLayer || nodeLayer.children.length === 0) {
    // Default bounds if no elements
    return {
      x: -200,
      y: -200,
      width: 400,
      height: 400
    };
  }

  // Get bounding box of all elements in the node layer
  const bbox = nodeLayer.getClientRect();
  
  return {
    x: bbox.x - padding,
    y: bbox.y - padding,
    width: bbox.width + (padding * 2),
    height: bbox.height + (padding * 2)
  };
};

/**
 * Create a temporary stage for export with grid background
 */
const createExportStage = (
  originalStage: Konva.Stage,
  bounds: DiagramBounds,
  options: { backgroundColor?: string; includeGrid?: boolean }
): Konva.Stage => {
  // Create a new temporary stage
  const exportStage = new Konva.Stage({
    container: document.createElement('div'),
    width: bounds.width,
    height: bounds.height,
  });

  // Add background layer
  const backgroundLayer = new Konva.Layer();
  
  // Add background rectangle
  if (options.backgroundColor) {
    const background = new Konva.Rect({
      x: 0,
      y: 0,
      width: bounds.width,
      height: bounds.height,
      fill: options.backgroundColor,
    });
    backgroundLayer.add(background);
  }

  // Add grid if requested
  if (options.includeGrid) {
    const gridSize = 20;
    const gridColor = options.backgroundColor === '#1F2937' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
    
    // Vertical lines
    for (let x = 0; x <= bounds.width; x += gridSize) {
      const line = new Konva.Line({
        points: [x, 0, x, bounds.height],
        stroke: gridColor,
        strokeWidth: 1,
      });
      backgroundLayer.add(line);
    }
    
    // Horizontal lines
    for (let y = 0; y <= bounds.height; y += gridSize) {
      const line = new Konva.Line({
        points: [0, y, bounds.width, y],
        stroke: gridColor,
        strokeWidth: 1,
      });
      backgroundLayer.add(line);
    }
  }

  exportStage.add(backgroundLayer);

  // Clone the node layer and adjust position
  const originalNodeLayer = originalStage.findOne('#node-layer') as Konva.Layer;
  if (originalNodeLayer) {
    const clonedNodeLayer = originalNodeLayer.clone() as Konva.Layer;
    
    // Adjust position to center the diagram in the export bounds
    clonedNodeLayer.x(-bounds.x);
    clonedNodeLayer.y(-bounds.y);
    
    exportStage.add(clonedNodeLayer);
  }

  return exportStage;
};

/**
 * Export diagram as PNG
 */
export const exportAsPNG = async (
  stage: Konva.Stage,
  options: PNGExportOptions = {}
): Promise<void> => {
  const {
    quality = 1,
    pixelRatio = 2,
    backgroundColor = '#FFFFFF',
    padding = 50,
    includeGrid = true,
    filename = 'diagram.png'
  } = options;

  try {
    // Calculate diagram bounds
    const bounds = calculateDiagramBounds(stage, padding);
    
    // Create export stage
    const exportStage = createExportStage(stage, bounds, {
      backgroundColor,
      includeGrid
    });

    // Export as PNG
    const dataURL = exportStage.toDataURL({
      mimeType: 'image/png',
      quality,
      pixelRatio,
    });

    // Download the image
    const link = document.createElement('a');
    link.download = filename;
    link.href = dataURL;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Cleanup
    exportStage.destroy();
  } catch (error) {
    console.error('Error exporting PNG:', error);
    throw new Error('Failed to export diagram as PNG');
  }
};

/**
 * Export diagram as SVG
 */
export const exportAsSVG = async (
  stage: Konva.Stage,
  options: SVGExportOptions = {}
): Promise<void> => {
  const {
    backgroundColor = '#FFFFFF',
    padding = 50,
    includeGrid = true,
    filename = 'diagram.svg'
  } = options;

  try {
    // Calculate diagram bounds
    const bounds = calculateDiagramBounds(stage, padding);
    
    // Create export stage
    const exportStage = createExportStage(stage, bounds, {
      backgroundColor,
      includeGrid
    });

    // Export as SVG using dataURL and conversion
    const dataURL = exportStage.toDataURL({
      mimeType: 'image/png',
      pixelRatio: 2,
    });
    
    // Create SVG with embedded PNG
    const svgString = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${bounds.width}" height="${bounds.height}" xmlns="http://www.w3.org/2000/svg">
  <image width="${bounds.width}" height="${bounds.height}" href="${dataURL}"/>
</svg>`;

    // Create blob and download
    const blob = new Blob([svgString], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.download = filename;
    link.href = url;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Cleanup
    URL.revokeObjectURL(url);
    exportStage.destroy();
  } catch (error) {
    console.error('Error exporting SVG:', error);
    throw new Error('Failed to export diagram as SVG');
  }
};

/**
 * Get suggested filename based on current timestamp and machine type
 */
export const getSuggestedFilename = (
  machineType: string = 'diagram',
  format: 'png' | 'svg' = 'png'
): string => {
  const timestamp = new Date().toISOString().slice(0, 19).replace(/[:.]/g, '-');
  return `${machineType}_${timestamp}.${format}`;
};

/**
 * Main export function that handles both PNG and SVG
 */
export const exportDiagram = async (
  stage: Konva.Stage,
  options: ExportOptions
): Promise<void> => {
  if (options.format === 'png') {
    await exportAsPNG(stage, options);
  } else if (options.format === 'svg') {
    await exportAsSVG(stage, options);
  } else {
    throw new Error(`Unsupported export format: ${options.format}`);
  }
};
