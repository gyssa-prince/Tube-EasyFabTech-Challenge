import React, { useState } from "react";
import ThreeScene from "./components/ThreeScene";
import TubeControls from "./components/TubeControls";
import "./index.css";

export default function App() {
  // The "State" of our tube
  const [params, setParams] = useState({
    type: "square",
    width: 1,
    height: 1,
    thickness: 0.1,
    length: 3
  });

  return (
    <div className="app-container">
      {/* Sidebar Control Panel */}
      <div className="sidebar">
        <div className="header">
          <h2>TubeJoint</h2>
        </div>
        <div className="panel-section">
          <TubeControls params={params} setParams={setParams} />
        </div>
      </div>

      {/* 3D Workspace */}
      <div className="canvas-wrapper">
        <ThreeScene sharedParams={params} /> 
      </div>
    </div>
  );
}