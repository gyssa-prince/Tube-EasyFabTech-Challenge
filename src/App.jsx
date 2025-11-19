import React from "react";
import ThreeScene from "./components/ThreeScene";
import "./index.css";

export default function App() {
  return (
    <div className="app-container">
      {/* Just the canvas for now */}
      <div className="canvas-wrapper">
        <ThreeScene />
      </div>
    </div>
  );
}