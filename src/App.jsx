import React, { useState, useRef } from "react";
import ThreeScene from "./components/ThreeScene";
import Sidebar from "./components/Sidebar";
import "./index.css";

export default function App() {
  const [params, setParams] = useState({
    type: "square",
    width: 1,
    height: 1,
    thickness: 0.1,
    length: 3
  });

  const [wireframe, setWireframe] = useState(false);
  const [angleSnapDeg, setAngleSnapDeg] = useState(45);
  const [transformMode, setTransformMode] = useState("translate");

  const [tubes, setTubes] = useState([]);

  const sceneApiRef = useRef();
  const addTube = () => {};
  const handleSelectTube = () => {};
  const deleteTube = () => {};
  const deselect = () => {};
  const undo = () => {};
  const redo = () => {};
  const moveObj = () => {};
  const rotateObj = () => {};

  return (
    <div className="app-container">
      <div className="sidebar">
        <Sidebar
          params={params}
          setParams={setParams}
          addTube={addTube}
          undo={undo}
          redo={redo}
          deleteTube={deleteTube}
          deselect={deselect}
          transformMode={transformMode}
          setTransformMode={setTransformMode}
          angleSnapDeg={angleSnapDeg}
          setAngleSnapDeg={setAngleSnapDeg}
          moveObj={moveObj}
          rotateObj={rotateObj}
          wireframe={wireframe}
          setWireframe={setWireframe}
          tubes={tubes}
          onSelectTube={handleSelectTube}
        />
      </div>

      <div className="canvas-wrapper">
        <ThreeScene
          ref={sceneApiRef}
          sharedParams={params}
          wireframe={wireframe}
          mode={transformMode}
          angleSnapDeg={angleSnapDeg}
        />

        <div className="canvas-overlay">
          Left Click: Select | Right Click: Pan | Wheel: Zoom | Drag: Orbit
        </div>
      </div>
    </div>
  );
}
