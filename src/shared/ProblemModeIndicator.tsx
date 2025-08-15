import React from 'react';

interface ProblemModeIndicatorProps {
  simulatorType: string;
}

const ProblemModeIndicator: React.FC<ProblemModeIndicatorProps> = ({ simulatorType }) => {
  return (
    <div
      style={{
        padding: '8px 12px',
        backgroundColor: '#fff3cd',
        border: '1px solid #ffeaa7',
        borderRadius: '4px',
        fontSize: '12px',
        fontWeight: 'bold',
        color: '#856404',
        textAlign: 'center'
      }}
    >
      🎯 Problem Mode - {simulatorType}
    </div>
  );
};

export default ProblemModeIndicator;
