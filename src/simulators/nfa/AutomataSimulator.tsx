import React from 'react';
import useAutomataSimulator from '../../shared/hooks/useAutometaSimulator';
import ControlPanel from '../../shared/components/ControlPanel';
import NodeCanvas from '../../shared/components/NodeCanvas';
import NFARenderer from './renderers/NFARenderer';
import nfaSimulationEngine from './engines/nfaSimulationEngine';
import nfaSerializer from './nfaSerializer';
import nfaNodeFactory from './nfaNodeFactory';

interface NFASimulatorProps {
  initialNFA?: string;
  problemId?: string;
}

const NFASimulator: React.FC<NFASimulatorProps> = ({ initialNFA, problemId }) => {
  const simulator = useAutomataSimulator(
    {
      simulatorType: 'NFA',
      serializer: nfaSerializer,
      simulator: {
        ...nfaSimulationEngine,
        step: (currentState, inputString, stepIndex) =>
          nfaSimulationEngine.step(
            currentState,
            inputString,
            stepIndex,
            simulator.nodes,
            simulator.finiteNodes
          ),
      },
      nodeFactory: nfaNodeFactory,
    },
    initialNFA,
    problemId
  );

  const renderCustomControls = () => (
    <div className="flex gap-2">
      <button className="btn btn-purple" onClick={() => console.log('Convert to DFA')}>
        Convert to DFA
      </button>
      <button className="btn btn-info" onClick={() => console.log('Show ε-Closures')}>
        Show ε-Closures
      </button>
    </div>
  );

  const renderSelectedNodeInfo = (node: any) => (
    <div>
      <div><strong>State:</strong> {node.id}</div>
      <div><strong>ε-Transitions:</strong> {node.transitions?.filter((t: any) => t.symbol === 'ε').length || 0}</div>
    </div>
  );

  const renderValidationResult = (result: string) => <div><strong>Result:</strong> {result}</div>;

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
        renderer: NFARenderer,
        stageProps: simulator.stageProps,
        onStagePropsChange: simulator.setStageProps,
        showGrid: simulator.showGrid
      }}/>
      <ControlPanel
        config={{ simulatorType: 'NFA', supportsEpsilon: true }}
        {...simulator}
        renderCustomControls={renderCustomControls}
        renderSelectedNodeInfo={renderSelectedNodeInfo}
        renderValidationResult={renderValidationResult}
      />
    </div>
  );
};

export default NFASimulator;
