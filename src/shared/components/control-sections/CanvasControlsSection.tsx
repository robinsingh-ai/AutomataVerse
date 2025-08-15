import React from 'react';

interface Props {
  onValidate: () => void;
  onClearCanvas: () => void;
  showGrid: boolean;
  onToggleGrid: () => void;
}

const CanvasControlsSection: React.FC<Props> = ({
  onValidate,
  onClearCanvas,
  showGrid,
  onToggleGrid
}) => (
  <div className="flex flex-wrap gap-2">
    <button className="btn btn-info" onClick={onValidate}>Validate</button>
    <button className="btn" onClick={onToggleGrid}>{showGrid ? 'Hide Grid' : 'Show Grid'}</button>
    <button className="btn btn-danger" onClick={onClearCanvas}>Clear Canvas</button>
  </div>
);

export default CanvasControlsSection;
