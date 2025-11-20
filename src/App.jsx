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

  const [wireframe] = useState(false);
  const [angleSnapDeg, setAngleSnapDeg] = useState(45);
  const [transformMode, setTransformMode] = useState("translate");

  const [tubes, setTubes] = useState([]);
  const sceneApiRef = useRef();

  const addTube = () => {
    const newId = Date.now();
    const newName = `Tube ${tubes.length + 1}`;
    setTubes(prev => [...prev, { id: newId, name: newName, isSelected: false }]);
    sceneApiRef.current?.addTube?.({ ...params, id: newId });
  };
  const handleSelectTube = (id) => {
    setTubes(prev => prev.map(t => ({ ...t, isSelected: t.id === id })));
    sceneApiRef.current?.selectObject?.(id);
  };
  const deleteTube = () => {
    sceneApiRef.current?.deleteSelected?.();
    setTubes(prev => prev.filter(t => !t.isSelected));
  };
  
  const deselect = () => {
    setTubes(prev => prev.map(t => ({ ...t, isSelected: false })));
    sceneApiRef.current?.deselect?.();
  };

  const undo = () => {};
  const redo = () => {};
  const moveObj = () => {}; 
  const rotateObj = () => {};

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