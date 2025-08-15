import React from 'react';
import DraggablePanel from './DraggablePanel';
import StateControlsSection from './control-sections/StateControlsSection';
import SimulationControlsSection from './control-sections/SimulationControlsSection';
import CanvasControlsSection from './control-sections/CanvasControlsSection';
import SaveLoadSection from './control-sections/SaveLoadSection';
import ProblemModeIndicator from '../ProblemModeIndicator';

export interface ControlPanelConfig {
  simulatorType: string;
  supportsEpsilon?: boolean;
  customSections?: React.ReactNode;
}

export interface ControlPanelProps {
  config: ControlPanelConfig;

  onAddNode: () => void;
  onRun: () => void;
  onStep: () => void;
  onReset: () => void;
  onValidate: () => void;
  onClearCanvas: () => void;
  onToggleGrid: () => void;
  onSave?: () => void;
  onLoadJson?: () => void;
  onSetFinite?: (nodeId?: string) => void;

  selectedNode: any | null;
  isRunning: boolean;
  isRunningStepWise: boolean;
  inputString: string;
  onInputChange: (value: string) => void;
  validationResult: string | null;
  showGrid: boolean;
  stepIndex: number;
  isLoggedIn?: boolean;
  isProblemMode?: boolean;

  renderCustomControls?: () => React.ReactNode;
  renderSelectedNodeInfo?: (node: any) => React.ReactNode;
  renderValidationResult?: (result: string) => React.ReactNode;
}

const ControlPanel: React.FC<ControlPanelProps> = ({
  config,
  onAddNode,
  onRun,
  onStep,
  onReset,
  onValidate,
  onClearCanvas,
  onToggleGrid,
  onSave,
  onLoadJson,
  onSetFinite,
  selectedNode,
  isRunning,
  isRunningStepWise,
  inputString,
  onInputChange,
  validationResult,
  showGrid,
  stepIndex,
  isLoggedIn = false,
  isProblemMode = false,
  renderCustomControls,
  renderSelectedNodeInfo,
  renderValidationResult
}) => {
  return (
    <DraggablePanel title={`${config.simulatorType} Control`}>
      <div className="space-y-4">
        {isProblemMode && (
          <ProblemModeIndicator simulatorType={config.simulatorType} />
        )}
        <StateControlsSection
          onAddNode={onAddNode}
          selectedNode={selectedNode}
          onSetFinite={onSetFinite}
          renderSelectedNodeInfo={renderSelectedNodeInfo}
        />
        <SimulationControlsSection
          onRun={onRun}
          onStep={onStep}
          onReset={onReset}
          isRunning={isRunning}
          isRunningStepWise={isRunningStepWise}
          inputString={inputString}
          onInputChange={onInputChange}
          stepIndex={stepIndex}
          validationResult={validationResult}
          renderValidationResult={renderValidationResult}
          supportsEpsilon={config.supportsEpsilon}
        />
        {renderCustomControls && renderCustomControls()}
        <CanvasControlsSection
          onValidate={onValidate}
          onClearCanvas={onClearCanvas}
          showGrid={showGrid}
          onToggleGrid={onToggleGrid}
        />
        {!isProblemMode && (
          <SaveLoadSection
            onLoadJson={onLoadJson}
            onSave={onSave}
            isLoggedIn={!!isLoggedIn}
            simulatorType={config.simulatorType}
          />
        )}
        {config.customSections}
      </div>
    </DraggablePanel>
  );
};

export default ControlPanel;
