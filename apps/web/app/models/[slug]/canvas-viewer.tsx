'use client';

import { useState, useCallback } from 'react';
import React from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { OrbitControls, PerspectiveCamera, Box } from '@react-three/drei';

export interface CADComponentData {
  cadComponentId: string;
  displayName?: string;
  path: string[];
  transform: number[] | number[][];
  boundingBox: { min: number[]; max: number[] };
  isSuppressed: boolean;
}

interface CanvasViewerProps {
  selectedComponentId: string | null;
  onSelectComponent: (id: string, name?: string) => void;
}

type HoveredComponentData = { id: string; name?: string } | null;

/** Interactive mesh component for a single CAD component */
export function CadMesh({ 
  data, 
  isSelected,
}: {
  data: CADComponentData;
  isSelected: boolean;
}) {
  // Color and opacity based on state
  const materialColor = isSelected ? 'rgb(124, 58, 237)' : 'rgb(99, 102, 241)';

  return (
    <mesh
      userData={{ ...data }} // Pass full component data for click handling
      onClick={() => console.log('Clicked:', data.cadComponentId)}
    >
      <boxGeometry 
        args={[
          Math.abs(data.boundingBox.max[0] - data.boundingBox.min[0]),
          Math.abs(data.boundingBox.max[1] - data.boundingBox.min[1]),
          Math.abs(data.boundingBox.max[2] - data.boundingBox.min[2])
        ]} 
      />
      <meshStandardMaterial color={materialColor} transparent={!isSelected && data.isSuppressed} opacity={data.isSuppressed ? 0.5 : 1} />
    </mesh>
  );
}
/** Group all cad components in the scene */
function CADScene({ 
  components, 
  selectedComponentId,
}: { 
  components: CADComponentData[];
  selectedComponentId: string | null;
}) {
  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[15, 20, 15]} intensity={1} castShadow shadow-mapSize={[1024, 1024]}>
        <orthographicCamera attach="shadow-camera" args={[-30, 30, -30, 30]} />
      </directionalLight>
      
      {components.map((component) => (
        component.isSuppressed ? null : 
        <CadMesh 
          key={component.cadComponentId}
          data={{ ...component }}
          isSelected={selectedComponentId === component.cadComponentId}
        />
      ))}

      {/* Base plate */}
      <mesh position={[0, -20, 5]} receiveShadow>
        <boxGeometry args={[180, 15, 60]} />
        <meshStandardMaterial color="#4b5563" roughness={0.9} metalness={0.1} />
      </mesh>

      {/* Grid helper for reference */}
      <gridHelper args={[200, 20, '#808080', '#a0a0a0']} position={[0, -20.5, 5]} />
    </>
  );
}

/** Viewer state management */
const selectedState = { isSelected: false };

export default function CanvasViewer({ selectedComponentId, onSelectComponent }: CanvasViewerProps) {
  const [hoveredComponentData, setHoveredComponentData] = useState<HoveredComponentData>(null);
  const [clicked, setClicked] = useState<CADComponentData | null>(null);

  // Mock data from fixtures - Product Alpha Assembly Revision 1  
  const mockComponents: CADComponentData[] = React.useMemo(() => ([
    { cadComponentId: 'base_plate', displayName: 'Base Plate', path: ['Base_Plate'], transform: [1,0,0,0,0,1,0,0,0,0,1,-60], boundingBox: { min: [-80, -90, -5], max: [80, 10, 5] }, isSuppressed: false },
    { cadComponentId: 'front_bracket', displayName: 'Front Bracket', path: ['Front_Bracket'], transform: [1,0,0,0,0,1,0,0,0,0,1,-65], boundingBox: { min: [-55, -25, 0], max: [55, 25, 80] }, isSuppressed: false },
    { cadComponentId: 'm1_motor_assembly', displayName: 'M1 Motor Assembly', path: ['Power_System', 'M1_Motor_Assembly'], transform: [1,0,0,0,0,1,0,0,0,0,1,-45], boundingBox: { min: [-30, -60, -20], max: [30, 60, 80] }, isSuppressed: false },
    { cadComponentId: 'main_pcba', displayName: 'Main PCB', path: ['Electronics', 'PCB'], transform: [1,0,0,0,0,1,0,0,0,0,1,-5], boundingBox: { min: [-48, -72, -30], max: [48, 62, 5] }, isSuppressed: false },
  ]), []);

  const handleIntersect = useCallback((componentData: CADComponentData) => {
    setHoveredComponentData(null);
    onSelectComponent(componentData.cadComponentId, componentData.displayName);
    console.log('Selected:', componentData);
  }, [onSelectComponent]);

  React.useEffect(() => {
    if (clicked && onClickHandlerEnabledRef.current) handleIntersect(clicked);
  }, [clicked?.cadComponentId]);

  const onClickHandlerEnabledRef = React.useRef(false);
  React.useEffect(() => {
    onClickHandlerEnabledRef.current = true; setTimeout(() => { onClickHandlerEnabledRef.current = false; }, 500);
  }, []);

  return (
    <div className="w-full h-[650px] bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 rounded-xl border border-slate-700 overflow-hidden relative">
      {/* Overlay info */}
      <div className="absolute top-4 left-4 z-10 pointer-events-none">
        <h3 className="text-white font-semibold text-lg drop-shadow-md">Product Alpha Assembly</h3>
        <p className="text-slate-300 text-sm drop-shadow-md">@hover to inspect components</p>
      </div>

      {/* Canvas */}
      <Canvas shadows camera={{ position: [120, 80, 150], fov: 45 }} gl={{ antialias: true }}>
        <PerspectiveCamera makeDefault position={[120, 60, 130]} />
        <CADScene components={mockComponents} selectedComponentId={selectedComponentId} />
      </Canvas>

      {/* Status bar */}
      {hoveredComponentData && !selectedComponentId && (
        <>
          <div className="absolute bottom-4 left-4 z-10 px-3 py-2 bg-slate-700/80 backdrop-blur-sm rounded-lg">
            <p className="text-white text-xs">@hover {hoveredComponentData.id}</p>
          </div>
        </>
      )}
    </div>
  );
}
