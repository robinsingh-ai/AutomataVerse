import React from 'react';

interface Props {
  onRun: () => void;
  onStep: () => void;
  onReset: () => void;
  isRunning: boolean;
  isRunningStepWise: boolean;
  inputString: string;
  onInputChange: (value: string) => void;
  stepIndex: number;
  validationResult: string | null;
  renderValidationResult?: (result: string) => React.ReactNode;
  supportsEpsilon?: boolean;
}

const SimulationControlsSection: React.FC<Props> = ({
  onRun,
  onStep,
  onReset,
  isRunning,
  isRunningStepWise,
  inputString,
  onInputChange,
  stepIndex,
  validationResult,
  renderValidationResult,
  supportsEpsilon = false
}) => (
  <div className="space-y-2">
    <input
      className="input w-full"
      type="text"
      value={inputString}
      onChange={(e) => onInputChange(e.target.value)}
      placeholder={supportsEpsilon ? 'Enter input (ε allowed)' : 'Enter input'}
      disabled={isRunning || isRunningStepWise}
    />
    <div className="flex gap-2">
      <button className="btn btn-success" onClick={onRun} disabled={isRunning || isRunningStepWise}>
        Run
      </button>
      <button className="btn btn-primary" onClick={onStep} disabled={isRunning}>
        {isRunningStepWise ? `Step ${stepIndex + 1}` : 'Step'}
      </button>
      <button className="btn btn-danger" onClick={onReset}>Reset</button>
    </div>
    {validationResult && (
      <div className="text-xs">
        {renderValidationResult ? renderValidationResult(validationResult) : validationResult}
      </div>
    )}
  </div>
);

export default SimulationControlsSection;
