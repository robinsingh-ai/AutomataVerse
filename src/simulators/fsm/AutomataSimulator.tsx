import React from 'react';
import useAutomataSimulator from '../../shared/hooks/useAutometaSimulator';
import ControlPanel from '../../shared/components/ControlPanel';
import NodeCanvas from '../../shared/components/NodeCanvas';
import FSMRenderer from './renderers/FSMRenderer';
import fsmSimulationEngine from './engines/fsmSimulationEngine';
import fsmSerializer from './fsmSerializer';
import fsmNodeFactory from './fsmNodeFactory';

interface FSMSimulatorProps {
  initialFSM?: string;
  problemId?: string;
}

const FSMSimulator: React.FC<FSMSimulatorProps> = ({ initialFSM, problemId }) => {
  const simulator = useAutomataSimulator(
    {
      simulatorType: 'FSM',
      serializer: fsmSerializer,
      simulator: {
        // Spread the engine and override step to inject nodes + final states from the hook
        ...fsmSimulationEngine,
        step: (currentState, inputString, stepIndex) =>
          fsmSimulationEngine.step(
            currentState,
            inputString,
            stepIndex,
            simulator.nodes,
            simulator.finiteNodes
          ),
      },
      nodeFactory: fsmNodeFactory,
    },
    initialFSM,
    problemId
  );

  const renderCustomControls = () => (
    <div className="flex gap-2">
      <button
        className="btn btn-success"
        onClick={() => {
          if (simulator.selectedNode) {
            console.log('Set as initial state');
          }
        }}
        disabled={!simulator.selectedNode}
      >
        Set Initial
      </button>

      <button
        className="btn btn-primary"
        onClick={() => {
          console.log('Show output sequence');
        }}
      >
        Show Output
      </button>

      <button
        className="btn btn-warning"
        onClick={() => {
          console.log('Toggle Moore/Mealy');
        }}
      >
        Moore/Mealy
      </button>
    </div>
  );

  const renderSelectedNodeInfo = (node: any) => (
    <div>
      <div><strong>State:</strong> {node.id}</div>
      <div><strong>Position:</strong> ({Math.round(node.x)}, {Math.round(node.y)})</div>
      <div><strong>Transitions:</strong> {node.transitions?.length || 0}</div>
      <div><strong>Initial:</strong> {node.isInitial ? 'Yes' : 'No'}</div>
      <div><strong>Final:</strong> {simulator.finiteNodes.has(node.id) || node.isFinal ? 'Yes' : 'No'}</div>
      {node.output && <div><strong>Output:</strong> {node.output}</div>}
    </div>
  );

  const renderValidationResult = (result: string) => {
    const cfg: any = simulator.currentConfiguration || {};
    const sequence = Array.isArray(cfg.outputSequence) ? cfg.outputSequence : null;

    return (
      <div>
        <strong>Result:</strong> {result}
        {result.toLowerCase().includes('accept') && ' ✅'}
        {result.toLowerCase().includes('reject') && ' ❌'}
        {sequence && (
          <div style={{ marginTop: '4px', fontSize: '11px' }}>
            <strong>Output Sequence:</strong> {sequence.join('')}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="h-screen w-screen relative overflow-hidden">
      <NodeCanvas
        nodes={simulator.nodes}
        selectedNode={simulator.selectedNode}
        highlightedNodes={simulator.highlightedNodes}
        highlightedTransitions={simulator.highlightedTransitions}
        onNodeSelect={simulator.handleNodeSelect}
        onNodeDrag={simulator.handleNodeDrag}
        onCanvasClick={simulator.handleCanvasClick}
        renderer={FSMRenderer}
        stageProps={simulator.stageProps}
        onStagePropsChange={simulator.setStageProps}
        showGrid={simulator.showGrid}
      />

      <ControlPanel
        config={{ simulatorType: 'FSM', supportsEpsilon: false }}
        onAddNode={simulator.handleAddNode}
        onRun={simulator.handleRun}
        onStep={simulator.handleStep}
        onReset={simulator.handleReset}
        onValidate={simulator.handleValidate}
        onClearCanvas={simulator.handleClearCanvas}
        onToggleGrid={simulator.handleToggleGrid}
        onSave={simulator.handleSave}
        onLoadJson={() => {}}
        onSetFinite={simulator.handleSetFinite}
        selectedNode={simulator.selectedNode}
        isRunning={simulator.isRunning}
        isRunningStepWise={simulator.isRunningStepWise}
        inputString={simulator.inputString}
        onInputChange={simulator.setInputString}
        validationResult={simulator.validationResult}
        showGrid={simulator.showGrid}
        stepIndex={simulator.stepIndex}
        isLoggedIn={simulator.isLoggedIn}
        isProblemMode={simulator.isProblemMode}
        renderCustomControls={renderCustomControls}
        renderSelectedNodeInfo={renderSelectedNodeInfo}
        renderValidationResult={renderValidationResult}
      />
    </div>
  );
};

export default FSMSimulator;
