import React from 'react';

interface Props {
  onAddNode: () => void;
  selectedNode: any | null;
  onSetFinite?: (nodeId?: string) => void;
  renderSelectedNodeInfo?: (node: any) => React.ReactNode;
}

const StateControlsSection: React.FC<Props> = ({
  onAddNode,
  selectedNode,
  onSetFinite,
  renderSelectedNodeInfo
}) => (
  <div className="space-y-2">
    <button className="btn btn-primary w-full" onClick={onAddNode}>Add State</button>
    {selectedNode && onSetFinite && (
      <button className="btn btn-secondary w-full" onClick={() => onSetFinite()}>
        {selectedNode.isFinal ? 'Remove Final' : 'Make Final'}
      </button>
    )}
    {selectedNode && renderSelectedNodeInfo && (
      <div className="text-sm bg-gray-50 rounded p-2">{renderSelectedNodeInfo(selectedNode)}</div>
    )}
  </div>
);

export default StateControlsSection;
