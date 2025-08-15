import React, { useState } from 'react';
import DraggablePanel from './DraggablePanel';

interface TransitionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (transition: any) => void;
  fields: any[];
  fromNode: string;
  toNode: string;
}

const TransitionDialog: React.FC<TransitionDialogProps> = ({
  isOpen, onClose, onSubmit, fields, fromNode, toNode
}) => {
  const [values, setValues] = useState<Record<string, string>>({});
  
  if (!isOpen) return null;
  
  const handleSubmit = () => {
    onSubmit({ from: fromNode, to: toNode, ...values });
    onClose();
    setValues({});
  };
  
  return (
    <DraggablePanel title="Add Transition">
      <div>
        <p>From: {fromNode} → To: {toNode}</p>
        {fields.map(field => (
          <div key={field.name}>
            <label>{field.label}:</label>
            <input
              type="text"
              placeholder={field.placeholder}
              value={values[field.name] || ''}
              onChange={(e) => setValues(prev => ({
                ...prev,
                [field.name]: e.target.value
              }))}
            />
          </div>
        ))}
        <button onClick={handleSubmit}>Add</button>
        <button onClick={onClose}>Cancel</button>
      </div>
    </DraggablePanel>
  );
};

export default TransitionDialog;
