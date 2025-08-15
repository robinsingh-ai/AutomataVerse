import React from 'react';
import useAutomataSimulator from '../../shared/hooks/useAutometaSimulator';
import ControlPanel from '../../shared/components/ControlPanel';
import NodeCanvas from '../../shared/components/NodeCanvas';
import TMRenderer from './renderers/TMRenderer';
import tmSimulationEngine from './engines/tmSimulationEngine';
import tmSerializer from './tmSerializer';
import tmNodeFactory from './tmNodeFactory';

interface TMSimulatorProps {
  initialTM?: string;
  problemId?: string;
}

const TMSimulator: React.FC<TMSimulatorProps> = ({ initialTM, problemId }) => {
  const simulator = useAutomataSimulator(
    {
      simulatorType: 'TM',
      serializer: tmSerializer,
      simulator: {
        ...tmSimulationEngine,
        step: (currentState, inputString, stepIndex) =>
          tmSimulationEngine.step(
            currentState,
            inputString,
            stepIndex,
            simulator.nodes,
            simulator.finiteNodes
          ),
      },
      nodeFactory: tmNodeFactory,
    },
    initialTM,
    problemId
  );

  const renderCustomControls = () => (
    <>
      <button className="btn btn-info" onClick={() => console.log('Show tape')}>Show Tape</button>
      <button className="btn btn-danger" disabled={!simulator.selectedNode} onClick={() => console.log('Toggle Reject state')}>Toggle Reject</button>
    </>
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
        renderer: TMRenderer,
        stageProps: simulator.stageProps,
        onStagePropsChange: simulator.setStageProps,
        showGrid: simulator.showGrid
      }}/>
      <ControlPanel
        config={{ simulatorType: 'TM', supportsEpsilon: false }}
        {...simulator}
        renderCustomControls={renderCustomControls}
        renderSelectedNodeInfo={renderSelectedNodeInfo}
      />
    </div>
  );
};

export default TMSimulator;
