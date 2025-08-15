import React from 'react';

interface Props {
  onLoadJson?: () => void;
  onSave?: () => void;
  isLoggedIn: boolean;
  simulatorType: string;
}

const SaveLoadSection: React.FC<Props> = ({
  onLoadJson,
  onSave,
  isLoggedIn,
  simulatorType
}) => (
  <div className="flex flex-wrap gap-2 items-center">
    {onLoadJson && (
      <button className="btn btn-purple" onClick={onLoadJson}>Load JSON</button>
    )}
    {onSave && isLoggedIn && (
      <button className="btn btn-warning" onClick={onSave}>Save {simulatorType}</button>
    )}
    {!isLoggedIn && <span className="text-xs text-gray-500">Login to save</span>}
  </div>
);

export default SaveLoadSection;
