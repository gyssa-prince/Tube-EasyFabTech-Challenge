import React, { useState, useRef, useImperativeHandle, forwardRef, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, TransformControls, Environment, Grid } from "@react-three/drei";
import * as THREE from "three";

// --- 1. TUBE GEOMETRY (HOLLOW) ---
const TubeGeometry = ({ width, height, length, thickness, isSelected, wireframe }) => {
  const t = Math.min(thickness, Math.min(width, height) / 2 - 0.005);
  const color = isSelected ? "#007acc" : "#888888";
  const materialProps = { 
    color: color, 
    wireframe: wireframe, 
    roughness: 0.4, 
    metalness: 0.6 
  };

  return (
    <group>
      <mesh position={[(width - t) / 2, 0, 0]}>
        <boxGeometry args={[t, length, height]} />
        <meshStandardMaterial {...materialProps} />
      </mesh>
      <mesh position={[-(width - t) / 2, 0, 0]}>
        <boxGeometry args={[t, length, height]} />
        <meshStandardMaterial {...materialProps} />
      </mesh>
      <mesh position={[0, 0, (height - t) / 2]}>
        <boxGeometry args={[width - 2 * t, length, t]} />
        <meshStandardMaterial {...materialProps} />
      </mesh>
      <mesh position={[0, 0, -(height - t) / 2]}>
        <boxGeometry args={[width - 2 * t, length, t]} />
        <meshStandardMaterial {...materialProps} />
      </mesh>
    </group>
  );
};

// --- 2. NEW: JOINT HIGHLIGHTER ---
// This component continuously checks for collisions and draws the intersection box
const JointHighlighter = ({ tubes }) => {
  const { scene } = useThree();
  const [joints, setJoints] = useState([]);

  useFrame(() => {
    // 1. Find all tube groups in the scene
    const tubeObjects = [];
    scene.traverse((obj) => {
      if (obj.name === "tube-group") {
        tubeObjects.push(obj);
      }
    });

    const newJoints = [];

    // 2. Check collisions between every pair
    for (let i = 0; i < tubeObjects.length; i++) {
      for (let j = i + 1; j < tubeObjects.length; j++) {
        const objA = tubeObjects[i];
        const objB = tubeObjects[j];

        // Compute bounding boxes in world space
        const boxA = new THREE.Box3().setFromObject(objA);
        const boxB = new THREE.Box3().setFromObject(objB);

        // 3. If they intersect, calculate the intersection box
        if (boxA.intersectsBox(boxB)) {
          const intersection = boxA.clone().intersect(boxB);
          
          // Get center and size of the intersection
          const center = new THREE.Vector3();
          const size = new THREE.Vector3();
          intersection.getCenter(center);
          intersection.getSize(size);

          newJoints.push({ center, size, id: `${objA.uuid}-${objB.uuid}` });
        }
      }
    }

    // Only update state if joints changed to prevent render loops
    // (Simple check: count change. For clearer visualization we just update)
    if (newJoints.length !== joints.length || (newJoints.length > 0 && joints.length > 0)) {
       setJoints(newJoints);
    }
  });

  return (
    <>
      {joints.map((joint) => (
        <mesh key={joint.id} position={joint.center}>
          <boxGeometry args={[joint.size.x + 0.02, joint.size.y + 0.02, joint.size.z + 0.02]} />
          <meshBasicMaterial color="#ffaa00" transparent opacity={0.5} depthTest={false} />
          <lineSegments>
            <edgesGeometry args={[new THREE.BoxGeometry(joint.size.x + 0.02, joint.size.y + 0.02, joint.size.z + 0.02)]} />
            <lineBasicMaterial color="#ffffff" linewidth={2} />
          </lineSegments>
        </mesh>
      ))}
    </>
  );
};

// --- 3. MESH COMPONENT ---
const MeshWithControls = ({ meshData, isSelected, onSelect, wireframe, mode, angleSnapDeg, onTransformEnd }) => {
  const meshRef = useRef();
  
  const w = meshData.width || 1;
  const length = meshData.length || 3;
  const h = meshData.height || 1;
  const thick = meshData.thickness || 0.1;

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
      
      <group
        ref={meshRef}
        name="tube-group" // Identifying tag for the highlighter
        position={meshData.position || [0, length / 2, 0]}
        rotation={meshData.rotation || [0, 0, 0]}
        onClick={(e) => { 
          e.stopPropagation(); 
          onSelect(); 
        }}
      >
        <TubeGeometry 
          width={w} 
          height={h} 
          length={length} 
          thickness={thick}
          isSelected={isSelected}
          wireframe={wireframe}
        />
      </group>
    </>
  );
};

// --- 4. MAIN SCENE ---
const ThreeScene = forwardRef(({ sharedParams, wireframe, mode, angleSnapDeg, onSelectObject }, ref) => {
  const [meshes, setMeshes] = useState([]); 
  const [selectedId, setSelectedId] = useState(null);

  const history = useRef([[]]); 
  const historyIndex = useRef(0);

  const recordHistory = (newMeshesState) => {
    const currentHistory = history.current.slice(0, historyIndex.current + 1);
    currentHistory.push(newMeshesState);
    history.current = currentHistory;
    historyIndex.current = currentHistory.length - 1;
  };

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
    recordHistory(updatedMeshes);
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
      recordHistory(nextState);
    },

    selectObject: (id) => setSelectedId(id),
    
    deleteSelected: () => {
      if (!selectedId) return;
      const nextState = meshes.filter(m => m.id !== selectedId);
      setMeshes(nextState);
      setSelectedId(null);
      recordHistory(nextState);
    },

    deselect: () => setSelectedId(null),

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
      recordHistory(nextState);
    },

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
      recordHistory(nextState);
    },

    undo: () => {
      if (historyIndex.current > 0) {
        historyIndex.current--;
        const prevState = history.current[historyIndex.current];
        setMeshes(prevState);
        if (selectedId && !prevState.find(m => m.id === selectedId)) {
          setSelectedId(null);
        }
      }
    },

    redo: () => {
      if (historyIndex.current < history.current.length - 1) {
        historyIndex.current++;
        const nextState = history.current[historyIndex.current];
        setMeshes(nextState);
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
      
      {/* NEW: Highlight Intersections */}
      <JointHighlighter />

      {meshes.map((mesh) => (
        <MeshWithControls
          key={mesh.id}
          meshData={mesh}
          isSelected={mesh.id === selectedId}
          onSelect={() => {
            setSelectedId(mesh.id);
            if (onSelectObject) onSelectObject(mesh.id);
          }}
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