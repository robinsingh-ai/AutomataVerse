import React from 'react';
import useAutomataSimulator from '../../shared/hooks/useAutometaSimulator';
import ControlPanel from '../../shared/components/ControlPanel';
import NodeCanvas from '../../shared/components/NodeCanvas';
import PDARenderer from './renderers/PDARenderer';
import pdaSimulationEngine from './engines/pdaSimulationEngine';
import pdaSerializer from './pdaSerialiser';
import pdaNodeFactory from './pdaNodeFactory';

interface PDASimulatorProps {
  initialPDA?: string;
  problemId?: string;
}

const PDASimulator: React.FC<PDASimulatorProps> = ({ initialPDA, problemId }) => {
  const simulator = useAutomataSimulator(
    {
      simulatorType: 'PDA',
      serializer: pdaSerializer,
      simulator: {
        ...pdaSimulationEngine,
        step: (currentState, inputString, stepIndex) =>
          pdaSimulationEngine.step(
            currentState,
            inputString,
            stepIndex,
            simulator.nodes,
            simulator.finiteNodes
          ),
      },
      nodeFactory: pdaNodeFactory,
    },
    initialPDA,
    problemId
  );

  const renderCustomControls = () => (
    <button className="btn btn-info" onClick={() => console.log('Show stack trace')}>Stack Trace</button>
  );

  const renderSelectedNodeInfo = (node: any) => (
    <div><strong>State:</strong> {node.id}</div>
  );

  return (
    <div className="h-screen w-screen relative">
      <NodeCanvas {...{
        nodes: simulator.nodes,
        selectedNode: simulator.selectedNode,
        highlightedNodes: simulator.highlightedNodes,
        highlightedTransitions: simulator.highlightedTransitions,
        onNodeSelect: simulator.handleNodeSelect,
        onNodeDrag: simulator.handleNodeDrag,
        onCanvasClick: simulator.handleCanvasClick,
        renderer: PDARenderer,
        stageProps: simulator.stageProps,
        onStagePropsChange: simulator.setStageProps,
        showGrid: simulator.showGrid
      }}/>
      <ControlPanel
        config={{ simulatorType: 'PDA', supportsEpsilon: true }}
        {...simulator}
        renderCustomControls={renderCustomControls}
        renderSelectedNodeInfo={renderSelectedNodeInfo}
      />
    </div>
  );
};

export default PDASimulator;
