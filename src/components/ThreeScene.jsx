import React, { useState, useRef, useImperativeHandle, forwardRef } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, Grid } from "@react-three/drei";
import * as THREE from "three";

// 1. Mesh Component
const MeshWithControls = ({ meshData, isSelected, onSelect, wireframe }) => {
  const meshRef = useRef();
  const w = meshData.width || 1;
  const length = meshData.length || 3;
  const h = meshData.height || 1;

  return (
    <>
      {/* TransformControls removed to disable moving */}
      
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
          // Selection is now only indicated by color
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

  useImperativeHandle(ref, () => ({
    addTube: (params) => {
      // Offset logic
      const xOffset = meshes.length * 1.5; 

      const newMesh = { 
        ...params, 
        position: [xOffset, params.length / 2, 0], 
        rotation: [0, 0, 0] 
      };
      
      setMeshes((prev) => [...prev, newMesh]);
    },

    selectObject: (id) => {
      setSelectedId(id);
    },

    deleteSelected: () => {
      if (!selectedId) return;
      setMeshes((prev) => prev.filter(m => m.id !== selectedId));
      setSelectedId(null);
    },

    deselect: () => {
      setSelectedId(null);
    },

    // Empty placeholders
    undo: () => {},
    redo: () => {},
    moveSelected: () => {},
    rotateSelected: () => {},
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
          wireframe={wireframe}
        />
      ))}
      <OrbitControls makeDefault />
    </Canvas>
  );
});

export default ThreeScene;