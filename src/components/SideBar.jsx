import React from "react";

export default function Sidebar({
  params,
  setParams,
  addTube,
  undo,
  redo,
  deleteTube,
  deselect,
  transformMode,
  setTransformMode,
  angleSnapDeg,
  setAngleSnapDeg,
  moveObj,
  rotateObj,
  wireframe,
  setWireframe,
  tubes = [],
  onSelectTube,
}) {
  const handleChange = (key, value) => {
    let newVal = parseFloat(value);
    
    if (params.type === "square" && (key === "width" || key === "height")) {
      setParams({ ...params, width: newVal, height: newVal });
    } else {
      setParams({ ...params, [key]: newVal });
    }
  };

  const toggleType = (e) => {
    const type = e.target.value;
    if (type === "square") {
      // When switching to square, force height to match width
      setParams({ ...params, type, height: params.width });
    } else {
      setParams({ ...params, type });
    }
  };

  const rotationStep = angleSnapDeg === 0 ? 15 : angleSnapDeg;
  const positionStep = 0.5;

  return (
    <div className="sidebar">
      {/* HEADER */}
      <div className="header">
        <h2>TubeJoint <span>Pro</span></h2>
        <p>Joint Visualization System</p>
      </div>
      <div className="panel-section">
        <h4>New Tube Settings</h4>
        
        <div className="tube-controls">
          <div className="control-group">
            <label>Shape</label>
            <select value={params.type} onChange={toggleType}>
              <option value="square">Square Tube</option>
              <option value="rect">Rectangular Tube</option>
            </select>
          </div>

          <div className="control-grid">
            <div className="control-group">
              <label>Width</label>
              <input
                type="number" step="0.1" min="0.1"
                value={params.width}
                onChange={(e) => handleChange("width", e.target.value)}
              />
            </div>

            <div className="control-group">
              <label>Height</label>
              <input
                type="number" step="0.1" min="0.1"
                disabled={params.type === "square"} // Disable height if square
                value={params.height}
                onChange={(e) => handleChange("height", e.target.value)}
              />
            </div>

            <div className="control-group">
              <label>Thick</label>
              <input
                type="number" step="0.01" min="0.01"
                value={params.thickness}
                onChange={(e) => handleChange("thickness", e.target.value)}
              />
            </div>

            <div className="control-group">
              <label>Length</label>
              <input
                type="number" step="0.5" min="0.5"
                value={params.length}
                onChange={(e) => handleChange("length", e.target.value)}
              />
            </div>
          </div>
        </div>

        <button 
          className="btn btn-primary full-width" 
          onClick={addTube}
        >
          + Create Tube
        </button>
      </div>

      <div className="divider"></div>

      {/* INTERACTION TOOLS */}
      <div className="panel-section">
        <h4>Interaction Tools</h4>
        
        {/* Tool Toggle */}
        <div className="tool-toggle">
          <button 
            className={transformMode === 'translate' ? 'active' : ''} 
            onClick={() => setTransformMode("translate")}
          >
            Move
          </button>
          <button 
            className={transformMode === 'rotate' ? 'active' : ''} 
            onClick={() => setTransformMode("rotate")}
          >
            Rotate
          </button>
        </div>

        {/* Rotation Snap */}
        <div className="control-row" style={{marginTop: '15px'}}>
          <label>Rotation Snap</label>
          <select
            value={angleSnapDeg}
            onChange={(e) => setAngleSnapDeg(parseInt(e.target.value))}
          >
            <option value={0}>Free (Off)</option>
            <option value={15}>15°</option>
            <option value={30}>30°</option>
            <option value={45}>45°</option>
            <option value={90}>90°</option>
          </select>
        </div>

        {/* Manual Controls */}
        {transformMode === 'translate' ? (
          <div className="control-group" style={{marginTop: '10px'}}>
            <label style={{fontSize:'11px', color: '#aaa', marginBottom:'5px', display:'block'}}>
              Manual Position (Step: {positionStep}m)
            </label>
            <div className="control-grid buttons-grid">
              <button className="btn" onClick={() => moveObj('x', -positionStep)}>X -</button>
              <button className="btn" onClick={() => moveObj('x', positionStep)}>X +</button>
              <button className="btn" onClick={() => moveObj('y', -positionStep)}>Y -</button>
              <button className="btn" onClick={() => moveObj('y', positionStep)}>Y +</button>
              <button className="btn" onClick={() => moveObj('z', -positionStep)}>Z -</button>
              <button className="btn" onClick={() => moveObj('z', positionStep)}>Z +</button>
            </div>
          </div>
        ) : (
          <div className="control-group" style={{marginTop: '10px'}}>
            <label style={{fontSize:'11px', color: '#aaa', marginBottom:'5px', display:'block'}}>
              Manual Rotation (Step: {rotationStep}°)
            </label>
            <div className="control-grid buttons-grid">
              <button className="btn" onClick={() => rotateObj('x', -rotationStep)}>X -</button>
              <button className="btn" onClick={() => rotateObj('x', rotationStep)}>X +</button>
              <button className="btn" onClick={() => rotateObj('y', -rotationStep)}>Y -</button>
              <button className="btn" onClick={() => rotateObj('y', rotationStep)}>Y +</button>
              <button className="btn" onClick={() => rotateObj('z', -rotationStep)}>Z -</button>
              <button className="btn" onClick={() => rotateObj('z', rotationStep)}>Z +</button>
            </div>
          </div>
        )}

        <div className="control-row checkbox-row" style={{marginTop: '15px'}}>
          <input
            type="checkbox"
            id="wf"
            checked={wireframe}
            onChange={(e) => setWireframe(e.target.checked)}
          />
          <label htmlFor="wf">Wireframe Mode</label>
        </div>
      </div>

      <div className="divider"></div>

      {/* ACTIONS */}
      <div className="panel-section">
        <h4>Actions</h4>
        <div className="btn-group">
          <button className="btn" onClick={undo}>Undo</button>
          <button className="btn" onClick={redo}>Redo</button>
        </div>
        <div className="btn-group">
          <button className="btn btn-danger" onClick={deleteTube}>Delete</button>
          <button className="btn" onClick={deselect}>Deselect</button>
        </div>
      </div>

      {/* WORKSPACE */}
      <div className="panel-section flex-grow">
        <h4>Workspace Objects</h4>
        <div className="list-container">
            {(!tubes || tubes.length === 0) ? (
              <div style={{padding: '10px', color: '#666', fontStyle: 'italic', fontSize: '12px'}}>
                No tubes created
              </div>
            ) : (
              tubes.map((tube, index) => (
                <div 
                  key={tube.id || index} 
                  className={`list-item ${tube.isSelected ? 'selected' : ''}`}
                  onClick={() => onSelectTube && onSelectTube(tube.id)}
                >
                  {tube.name || `Tube ${index + 1}`}
                </div>
              ))
            )}
        </div>
      </div>
    </div>
  );
}