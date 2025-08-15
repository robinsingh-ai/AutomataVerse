import React from 'react';
import useAutomataSimulator from '../../shared/hooks/useAutometaSimulator';
import ControlPanel from '../../shared/components/ControlPanel';
import NodeCanvas from '../../shared/components/NodeCanvas';
import DFARenderer from './renderers/DFARenderer';
import dfaSimulationEngine from './engines/dfaSimulationEngine';
import dfaSerializer from './dfaSerializer';
import dfaNodeFactory from './dfaNodeFactory';

interface DFASimulatorProps {
  initialDFA?: string;
  problemId?: string;
}

const DFASimulator: React.FC<DFASimulatorProps> = ({ initialDFA, problemId }) => {
  const simulator = useAutomataSimulator(
    {
      simulatorType: 'DFA',
      serializer: dfaSerializer,
      simulator: dfaSimulationEngine,
      nodeFactory: dfaNodeFactory,
    },
    initialDFA,
    problemId
  );

  const renderCustomControls = () => (
    <div className="flex gap-2">
      <button className="btn btn-purple" onClick={() => console.log('Convert to NFA')}>
        Convert to NFA
      </button>
      <button className="btn btn-pink" onClick={() => console.log('Minimize DFA')}>
        Minimize
      </button>
    </div>
  );

  const renderSelectedNodeInfo = (node: any) => (
    <div>
      <div><strong>State:</strong> {node.id}</div>
      <div><strong>Position:</strong> ({Math.round(node.x)}, {Math.round(node.y)})</div>
      <div><strong>Transitions:</strong> {node.transitions?.length || 0}</div>
      <div><strong>Final:</strong> {simulator.finiteNodes.has(node.id) ? 'Yes' : 'No'}</div>
    </div>
  );

  const renderValidationResult = (result: string) => (
    <div>
      <strong>Result:</strong> {result}
      {result.toLowerCase().includes('accept') && ' ✅'}
      {result.toLowerCase().includes('reject') && ' ❌'}
    </div>
  );

  return (
    <div className="h-screen w-screen overflow-hidden relative">
      <NodeCanvas {...{
        nodes: simulator.nodes,
        selectedNode: simulator.selectedNode,
        highlightedNodes: simulator.highlightedNodes,
        highlightedTransitions: simulator.highlightedTransitions,
        onNodeSelect: simulator.handleNodeSelect,
        onNodeDrag: simulator.handleNodeDrag,
        onCanvasClick: simulator.handleCanvasClick,
        renderer: DFARenderer,
        stageProps: simulator.stageProps,
        onStagePropsChange: simulator.setStageProps,
        showGrid: simulator.showGrid
      }}/>
      <ControlPanel
        config={{ simulatorType: 'DFA', supportsEpsilon: false }}
        {...simulator}
        renderCustomControls={renderCustomControls}
        renderSelectedNodeInfo={renderSelectedNodeInfo}
        renderValidationResult={renderValidationResult}
      />
    </div>
  );
};

export default DFASimulator;
