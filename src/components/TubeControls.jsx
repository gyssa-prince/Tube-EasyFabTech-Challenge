import React from "react";

export default function TubeControls({ params, setParams }) {
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
      setParams({ ...params, type, height: params.width });
    } else {
      setParams({ ...params, type });
    }
  };

  return (
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
            disabled={params.type === "square"}
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
  );
}