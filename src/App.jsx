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
    length: 1
  });

  const [wireframe, setWireframe] = useState(false);
  const [angleSnapDeg, setAngleSnapDeg] = useState(45);
  const [transformMode, setTransformMode] = useState("translate");

  const [tubes, setTubes] = useState([]);
  const sceneApiRef = useRef();

  // --- 1. ADD ---
  const addTube = () => {
    const newId = Date.now();
    const newName = `Tube ${tubes.length + 1}`;
    setTubes(prev => [...prev, { id: newId, name: newName, isSelected: false }]);
    sceneApiRef.current?.addTube?.({ ...params, id: newId });
  };

  // --- 2. SELECT ---
  const handleSelectTube = (id) => {
    setTubes(prev => prev.map(t => ({ ...t, isSelected: t.id === id })));
    sceneApiRef.current?.selectObject?.(id);
  };

  // --- 3. DELETE ---
  const deleteTube = () => {
    sceneApiRef.current?.deleteSelected?.();
    setTubes(prev => prev.filter(t => !t.isSelected));
  };
  
  const deselect = () => {
    setTubes(prev => prev.map(t => ({ ...t, isSelected: false })));
    sceneApiRef.current?.deselect?.();
  };

  // --- 4. TRANSFORM TOOLS (Wired Up) ---
  const undo = () => sceneApiRef.current?.undo?.();
  const redo = () => sceneApiRef.current?.redo?.();
  
  // Pass axis ('x','y','z') and value (distance)
  const moveObj = (axis, val) => sceneApiRef.current?.moveSelected?.(axis, val);
  
  // Pass axis ('x','y','z') and value (degrees)
  const rotateObj = (axis, val) => sceneApiRef.current?.rotateSelected?.(axis, val);

  return (
    <div className="app-container">
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
        setWireframe={setWireframe} // <--- Logic added here
        tubes={tubes}
        onSelectTube={handleSelectTube}
      />

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