'use client';

import { useRef, useState } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';

interface MockComponentData {
  componentId: string;
  name: string;
  meshType: 'box' | 'cylinder' | 'sphere';
  position: [number, number, number];
  size?: [number, number, number];
  radius?: number;
  color: string;
}

interface CanvasViewerProps {
  selectedComponentId: string | null;
  onSelectComponent: (id: string, name: string) => void;
}

function InteractiveMesh({ 
  data, 
  isSelected 
}: { 
  data: MockComponentData; 
  isSelected: boolean;
}) {
  const meshRef = useRef<any>(null);
  
  return (
    <group>
      <mesh
        ref={meshRef}
        position={data.position as [number, number, number]}
        onClick={(e) => {
          e.stopPropagation();
          data.componentId && onSelectComponent(data.componentId, data.name);
        }}
        onPointerOver={() => {
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          document.body.style.cursor = 'auto';
        }}
      >
        {data.meshType === 'box' && (
          <boxGeometry args={(data.size as [number, number, number]) || [1, 1, 1]} />
        )}
        {data.meshType === 'cylinder' && (
          <cylinderGeometry args={[0.5, 0.8, data.position[2] || 1, 32]} />
        )}
        {data.meshType === 'sphere' && (
          <sphereGeometry args={[data.radius || 0.8, 32, 32]} />
        )}
        <meshStandardMaterial 
          color={isSelected ? '#ef4444' : data.color}
          roughness={0.7}
          metalness={0.1}
          emissive={isSelected ? '#591818' : undefined}
        />
      </mesh>
      
      {/* Component label */}
      {data.componentId && (
        <label 
          position={[
            data.position[0] + 2, 
            data.position[1], 
            data.position[2] - 2
          ]}
          style={{ pointerEvents: 'none' }}>
          
        </label>
      )}
    </group>
  );
}

function CADScene({ selectedComponentId, onSelectComponent }: CanvasViewerProps) {
  const [hoveredName, setHoveredName] = useState<string>('');
  
  // Mock geometry data representing the assembly components
  const mockedComponents: MockComponentData[] = [
    {
      componentId: 'mock-baseplate-1',
      name: 'Base Plate',
      meshType: 'box',
      position: [0, -2, 0],
      size: [8, 0.5, 6],
      color: '#2d6e4f' // green-green variant for baseplate
    },
    {
      componentId: 'mock-frontbracket-1',
      name: 'Front Bracket',
      meshType: 'box',
      position: [0, 0, -3],
      size: [2.5, 2, 0.8],
      color: '#e6b980' 
    },
    {
      componentId: 'mock-motor-1',
      name: 'Motor M1',
      meshType: 'cylinder',
      position: [-3, -0.5, 2],
      size: [1, 1.5, 1], // ignored for cylinders
      color: '#83674d'
    },
    {
      componentId: 'mock-motor-2',
      name: 'Motor M2',
      meshType: 'cylinder',
      position: [3, -0.5, 2],
      size: [1, 1.5, 1],
      color: '#83674d'
    },
    {
      componentId: 'mock-housing-1',
      name: 'M1 Housing',
      meshType: 'box',
      position: [-2.5, -0.5, 2],
      size: [3.5, 1.8, 2.2],
      color: '#dfe6e9'
    },
    {
      componentId: 'mock-pcb-1',
      name: 'PCB Main Board',
      meshType: 'box',
      position: [0, -1, 0],
      size: [7.2, 0.3, 5.8],
      color: '#ef4444' // red-500 for PCB
    },
    {
      componentId: 'mock-cam-1',
      name: 'Camera Module',
      meshType: 'sphere',
      position: [2, 1.5, -3],
      radius: 0.6,
      color: '#9b5c48' // woodbrown for camera module
    }
  ];

  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight 
        position={[10, 20, 10]} 
        intensity={1}
        castShadow
      />
      
      {mockedComponents.map((comp) => (
        <InteractiveMesh
          key={comp.componentId}
          data={comp}
          isSelected={selectedComponentId === comp.componentId && hoveredName !== comp.name}
        />
      ))}

    </>
  );
}

export default function CanvasViewer({ selectedComponentId, onSelectComponent }: CanvasViewerProps) {
  return (
    <div className="w-full h-[650px] bg-background rounded-lg border overflow-hidden">
      <Canvas shadows camera={{ position: [10, 10, 10], fov: 45 }}>
        <CADScene 
          selectedComponentId={selectedComponentId}
          onSelectComponent={onSelectComponent}
        />
        <OrbitControls makeDefault minPolarAngle={Math.PI / 6} maxPolarAngle={Math.PI / 2.5} />
      </Canvas>
    </div>
  );
}
