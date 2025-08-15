const DFAControlPanel = ({ onStart, onReset, onStep }) => {
  return (
    <div style={{ display: "flex", gap: "10px", marginTop: "15px" }}>
      <button onClick={onStart}>Start</button>
      <button onClick={onStep}>Step</button>
      <button onClick={onReset}>Reset</button>
    </div>
  );
};

export default DFAControlPanel;
