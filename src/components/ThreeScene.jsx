import React, { useState, useRef, useImperativeHandle, forwardRef, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, TransformControls, Environment, Grid } from "@react-three/drei";
import * as THREE from "three";

// 1. Mesh Component
const MeshWithControls = ({ meshData, isSelected, onSelect, wireframe, mode, angleSnapDeg, onTransformEnd }) => {
  const meshRef = useRef();
  
  const w = meshData.width || 1;
  const length = meshData.length || 3;
  const h = meshData.height || 1;

  return (
    <>
      {isSelected && (
        <TransformControls 
          object={meshRef} 
          mode={mode} 
          rotationSnap={angleSnapDeg ? THREE.MathUtils.degToRad(angleSnapDeg) : null}
          // When user stops dragging, save the new position/rotation to History
          onMouseUp={() => {
            if (meshRef.current) {
              onTransformEnd(
                meshData.id, 
                meshRef.current.position, 
                meshRef.current.rotation
              );
            }
          }}
        />
      )}
      <mesh
        ref={meshRef}
        position={meshData.position || [0, length / 2, 0]}
        rotation={meshData.rotation || [0, 0, 0]}
        onClick={(e) => { 
          e.stopPropagation(); 
          onSelect(); 
        }}
      >
        <boxGeometry args={[w, length, h]} />
        <meshStandardMaterial 
          color={isSelected ? "#007acc" : "#888888"} 
          wireframe={wireframe} 
          roughness={0.4} 
          metalness={0.6} 
        />
      </mesh>
    </>
  );
};

// 2. Main Scene Logic
const ThreeScene = forwardRef(({ sharedParams, wireframe, mode, angleSnapDeg, onSelectObject }, ref) => {
  const [meshes, setMeshes] = useState([]); 
  const [selectedId, setSelectedId] = useState(null);

  // --- HISTORY STATE ---
  // Start with one empty state
  const history = useRef([[]]); 
  const historyIndex = useRef(0);

  // Helper: Save current meshes to history stack
  const saveToHistory = (newMeshes) => {
    // 1. If we are in the middle of the stack (undid previously), remove the future
    const currentHistory = history.current.slice(0, historyIndex.current + 1);
    
    // 2. Push new state
    currentHistory.push(newMeshes);
    
    // 3. Update refs
    history.current = currentHistory;
    historyIndex.current = currentHistory.length - 1;
    
    console.log("History Saved. Step:", historyIndex.current);
  };

  // Helper: Update a specific mesh (Used by Gizmo dragging)
  const handleTransformEnd = (id, newPos, newRot) => {
    const updatedMeshes = meshes.map(m => {
      if (m.id === id) {
        return { 
          ...m, 
          position: [newPos.x, newPos.y, newPos.z],
          rotation: [newRot.x, newRot.y, newRot.z]
        };
      }
      return m;
    });
    
    setMeshes(updatedMeshes);
    saveToHistory(updatedMeshes);
  };

  useImperativeHandle(ref, () => ({
    addTube: (params) => {
      const xOffset = meshes.length * 1.5; 
      const newMesh = { 
        ...params, 
        position: [xOffset, params.length / 2, 0], 
        rotation: [0, 0, 0] 
      };
      
      const nextState = [...meshes, newMesh];
      setMeshes(nextState);
      saveToHistory(nextState);
    },

    selectObject: (id) => setSelectedId(id),
    
    deleteSelected: () => {
      if (!selectedId) return;
      const nextState = meshes.filter(m => m.id !== selectedId);
      setMeshes(nextState);
      setSelectedId(null);
      saveToHistory(nextState);
    },

    deselect: () => setSelectedId(null),

    // --- MANUAL MOVE (Buttons) ---
    moveSelected: (axis, val) => {
      if (!selectedId) return;
      
      const nextState = meshes.map(m => {
        if (m.id === selectedId) {
          const newPos = [...m.position];
          const idx = axis === 'x' ? 0 : axis === 'y' ? 1 : 2;
          newPos[idx] += val;
          return { ...m, position: newPos };
        }
        return m;
      });

      setMeshes(nextState);
      saveToHistory(nextState);
    },

    // --- MANUAL ROTATE (Buttons) ---
    rotateSelected: (axis, valDeg) => {
      if (!selectedId) return;
      const valRad = THREE.MathUtils.degToRad(valDeg);
      
      const nextState = meshes.map(m => {
        if (m.id === selectedId) {
          const newRot = [...m.rotation];
          const idx = axis === 'x' ? 0 : axis === 'y' ? 1 : 2;
          newRot[idx] += valRad;
          return { ...m, rotation: newRot };
        }
        return m;
      });

      setMeshes(nextState);
      saveToHistory(nextState);
    },

    // --- UNDO ---
    undo: () => {
      if (historyIndex.current > 0) {
        historyIndex.current--;
        const prevState = history.current[historyIndex.current];
        setMeshes(prevState);
        // If the selected object doesn't exist in the past state, deselect it
        if (selectedId && !prevState.find(m => m.id === selectedId)) {
          setSelectedId(null);
        }
        console.log("Undo. Step:", historyIndex.current);
      }
    },

    // --- REDO ---
    redo: () => {
      if (historyIndex.current < history.current.length - 1) {
        historyIndex.current++;
        const nextState = history.current[historyIndex.current];
        setMeshes(nextState);
        console.log("Redo. Step:", historyIndex.current);
      }
    },
  }));

  return (
    <Canvas shadows camera={{ position: [5, 5, 10], fov: 50 }}>
      <color attach="background" args={['#050505']} />
      <Grid infiniteGrid fadeDistance={30} fadeStrength={5} />
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <Environment preset="city" />
      
      {meshes.map((mesh) => (
        <MeshWithControls
          key={mesh.id}
          meshData={mesh}
          isSelected={mesh.id === selectedId}
          onSelect={() => {
            setSelectedId(mesh.id);
            if (onSelectObject) onSelectObject(mesh.id);
          }}
          // Pass the handler to save history after dragging
          onTransformEnd={handleTransformEnd} 
          wireframe={wireframe}
          mode={mode}
          angleSnapDeg={angleSnapDeg}
        />
      ))}
      <OrbitControls makeDefault />
    </Canvas>
  );
});

export default ThreeScene;