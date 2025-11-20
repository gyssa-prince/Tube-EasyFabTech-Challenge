import React, { useState, useRef, useImperativeHandle, forwardRef } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, TransformControls, Environment, Grid } from "@react-three/drei";
import * as THREE from "three";


const MeshWithControls = ({ meshData, isSelected, onSelect, wireframe, mode, angleSnapDeg, onTransformEnd }) => {
  const meshRef = useRef();
  
  // Default dimensions
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
          onMouseUp={() => {
            if (meshRef.current) {
              onTransformEnd(meshData.id, meshRef.current.position, meshRef.current.rotation);
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

  // Helper to update a specific mesh in state
  const updateMeshState = (id, newPos, newRot) => {
    setMeshes(prev => prev.map(m => {
      if (m.id === id) {
        return { 
          ...m, 
          position: [newPos.x, newPos.y, newPos.z],
          rotation: [newRot.x, newRot.y, newRot.z]
        };
      }
      return m;
    }));
  };

  useImperativeHandle(ref, () => ({
    addTube: (params) => {
      // Offset logic so they don't stack
      const xOffset = meshes.length * 1.5; 
      const newMesh = { 
        ...params, 
        position: [xOffset, params.length / 2, 0], 
        rotation: [0, 0, 0] 
      };
      setMeshes((prev) => [...prev, newMesh]);
    },

    selectObject: (id) => setSelectedId(id),
    
    deleteSelected: () => {
      if (!selectedId) return;
      setMeshes((prev) => prev.filter(m => m.id !== selectedId));
      setSelectedId(null);
    },

    deselect: () => setSelectedId(null),

    // --- MANUAL MOVE (Buttons) ---
    moveSelected: (axis, val) => {
      if (!selectedId) return;
      setMeshes(prev => prev.map(m => {
        if (m.id === selectedId) {
          const newPos = [...m.position];
          const idx = axis === 'x' ? 0 : axis === 'y' ? 1 : 2;
          newPos[idx] += val;
          return { ...m, position: newPos };
        }
        return m;
      }));
    },

    // --- MANUAL ROTATE (Buttons) ---
    rotateSelected: (axis, valDeg) => {
      if (!selectedId) return;
      const valRad = THREE.MathUtils.degToRad(valDeg);
      setMeshes(prev => prev.map(m => {
        if (m.id === selectedId) {
          const newRot = [...m.rotation];
          const idx = axis === 'x' ? 0 : axis === 'y' ? 1 : 2;
          newRot[idx] += valRad;
          return { ...m, rotation: newRot };
        }
        return m;
      }));
    },

    undo: () => {},
    redo: () => {},
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
          onTransformEnd={updateMeshState} 
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