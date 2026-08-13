'use client';
import { useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import * as THREE from 'three';

interface ComponentFixture {
  componentId: string;
  displayName: string;
  partNumber: string;
  category: string;
  status: 'published' | 'draft';
  shortDescription: string;
  description: string;
}

interface SimpleMotorModel {
  assemblyId: string;
  name: string;
  components: ComponentFixture[];
  nodeMap?: Record<string, { componentId: string; occurrenceId: string }>;
}

const mockModels: Record<string, SimpleMotorModel> = {
  'ac-motor': JSON.parse(`{"assemblyId":"simple-ac-motor","name":"Simple AC Motor Assembly","components":[{"componentId":"stator","displayName":"Stator","partNumber":"STM-001","category":"electrical","status":"published","shortDescription":"Fixed outer iron core with winding slots.","description":"The stator is the stationary part of the motor containing laminated silicon steel stacks and copper windings. It generates the rotating magnetic field when AC power is applied."},{"componentId":"rotor","displayName":"Rotor","partNumber":"ROT-001","category":"electrical","status":"published","shortDescription":"Rotating inner core with squirrel cage windings.","description":"The rotor rotates inside the stator. This is a simple squirrel-cage design with aluminum bars shorted by end rings, creating induced currents that produce torque."},{"componentId":"housing","displayName":"Motor Housing","partNumber":"HSG-001","category":"structural","status":"published","shortDescription":"Cast aluminum outer casing with mounting feet.","description":"The housing encloses and protects internal components. Features four M8 mounting holes for secure installation. Includes cooling fins on the exterior surface to dissipate heat from operations."},{"componentId":"end-frames","displayName":"End Frames (Pair)","partNumber":"FRM-001","category":"structural","status":"draft","shortDescription":"Aluminum alloy end bells supporting bearings.","description":"Two identical aluminum die-cast pieces that close the motor housing and support precision ball bearings for the rotor shaft."},{"componentId":"shaft","displayName":"Drive Shaft","partNumber":"SHAFT-HR","category":"mechanical","status":"published","shortDescription":"Hardened steel shaft with keyway for load transfer.","description":"The main drive shaft transmits mechanical torque from the rotor to external loads. Constructed from 4130 chromemolybdenum steel, heat treated and ground for precise running fit."},{"componentId":"cooling-fan","displayName":"Cooling Fan","partNumber":"FAN-001","category":"mechanical","status":"published","shortDescription":"Axial fan on rotor shaft for active cooling.","description":"A small axial-flow fan mounted on the external end of the drive shaft, pulling air through the motor housing during operation."}],"nodeMap":{"stator":{"componentId":"stator","occurrenceId":"occ-stator-001"}}}`),
};

export default function ModelPage({ params }: { params: Promise<{ slug?: string }> }) {
  const [slug, setSlug] = useState<string>('ac-motor');
  const [model, setModel] = useState<SimpleMotorModel | null>(null);
  const [selectedComponentId, setSelectedComponentId] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { slug: s } = await params;
      const pathSegment = s || 'ac-motor';
      setSlug(pathSegment);
      const found = mockModels[pathSegment];
      if (!found) { throw new Error('Model not found'); }
      setModel(found);
    })();
  }, [params]);

  return (
    <div className="min-h-screen bg-slate-950 text-white flex">
      <aside className="w-64 border-r border-slate-800 p-4 overflow-auto">
        <h2 className="text-lg font-bold mb-3">{model?.name || slug}</h2>
        <ul className="space-y-1">
          {model?.components.map(c => (
            <li key={c.componentId}>
              <button
                onClick={() => setSelectedComponentId(c.componentId)}
                className={`text-left w-full text-sm p-2 rounded ${selectedComponentId === c.componentId ? 'bg-orange-600' : 'hover:bg-slate-800'} ${c.status !== 'published' ? 'opacity-60 italic' : ''}`}
              >
                {c.displayName} · {c.partNumber}
              </button>
            </li>
          ))}
        </ul>
      </aside>

      <main className="flex-1 p-4 flex gap-4">
        <div className="flex-[2] h-96 bg-slate-900 rounded-md overflow-hidden">
          {model && (
            <Viewer model={model} selectedId={selectedComponentId} onSelect={(id) => setSelectedComponentId(id)} />
          )}
        </div>

        <aside className="w-80 border-l border-slate-800 p-4 overflow-auto">
          {selectedComponentId && (model?.components.find(c => c.componentId === selectedComponentId)) ? (
            <>
              <h3 className="text-xl font-semibold mb-1">{model.components.find(c => c.componentId === selectedComponentId)?.displayName}</h3>
              <p className="text-sm text-slate-400 mb-3">PM: {model.components.find(c => c.componentId === selectedComponentId)?.partNumber}</p>
              <div className="space-y-2 text-sm">
                <p><span className="font-medium">Category:</span> {model.components.find(c => c.componentId === selectedComponentId)?.category}</p>
                <p><span className="font-medium">Status:</span> <span className={model.components.find(c => c.componentId === selectedComponentId)?.status !== 'published' ? 'italic text-amber-400' : ''}>{model.components.find(c => c.componentId === selectedComponentId)?.status}</span></p>
                <hr className="border-slate-700"/>
                <p><span className="font-medium mb-1 block">Short description:</span>{model.components.find(c => c.componentId === selectedComponentId)?.shortDescription}</p>
                <hr className="border-slate-700" />
                <p><span className="font-medium mb-1 block">Full description:</span>{model.components.find(c => c.componentId === selectedComponentId)?.description}</p>
              </div>
            </>
          ) : (
            <p className="text-slate-500 text-sm">Select a component to view details.</p>
          )}
        </aside>
      </main>
    </div>
  );
}

function Viewer({ model, selectedId, onSelect }: { model: SimpleMotorModel; selectedId: string | null; onSelect: (id: string) => void }) {
  const [hoveredComponentId, setHoveredComponentId] = useState<string | null>(null);
  
  return (
    <Canvas camera={{ position: [180, 150, 300], fov: 55 }}>
      <ambientLight intensity={0.4} />
      <pointLight position={[200, 200, 200]} intensity={0.9} castShadow />
      {model.components.map((c) => (
        <ComponentMesh key={c.componentId} component={c} highlighted={selectedId === c.componentId || hoveredComponentId === c.componentId} onEnter={() => setHoveredComponentId(c.componentId)} onExit={() => setHoveredComponentId(null)} onSelect={() => onSelect(c.componentId)} />
      ))}
    </Canvas>
  );
}

function ComponentMesh({ component, highlighted, onEnter, onExit, onSelect }: { component: ComponentFixture; highlighted: boolean; onEnter?: () => void; onExit?: () => void; onSelect: () => void }) {
  return (
    <mesh onClick={onSelect} onPointerOver={(e) => { e.stopPropagation(); document.body.style.cursor = 'pointer'; onEnter?.(); }} onPointerOut={() => { document.body.style.cursor = ''; onExit?.()}} castShadow receiveShadow position={getComponentPosition(component.componentId)}>
      <MeshGeometry componentId={component.componentId} />
      <meshStandardMaterial color={highlighted ? '#f97316' : getComponentColor(component.componentId, component.category)} opacity={0.85} metalness={0.4} roughness={0.3} />
    </mesh>
  );
}

function MeshGeometry({ componentId }: { componentId: string }) {
  if (componentId === 'stator') return <cylinderGeometry args={[35, 40, 120, 32]} />;
  if (componentId === 'rotor') return <cylinderGeometry args={[28, 32, 110, 32]} />;
  if (['housing', 'end-frames'].includes(componentId)) return <boxGeometry args={[150, 160, 200]} />;
  if (componentId === 'shaft') return <cylinderGeometry args={[8, 8, 220, 32]} />;
  return <coneGeometry args={[45, 100, 32]} />;
}

function getComponentPosition(componentId: string): [number, number, number] {
  // Simple offsets for mock components to make them visible as a group
  if (componentId === 'stator') return [0, 0, 0];
  if (componentId === 'rotor') return [0, 65, 0];
  if (['housing', 'end-frames'].includes(componentId)) return [0, 110, 80] as any;
  if (componentId === 'shaft') return [0, 55, 0];
  return [0, 170, 120];
}

function getComponentColor(componentId: string, category: string): string {
  if (componentId === 'stator') return '#ef4444';
  if (componentId === 'rotor') return '#eab308';
  if (componentId === 'housing') return '#7c2d12';
  if (componentId === 'end-frames') return '#b45309';
  if (componentId === 'shaft') return '#64748b';
  switch(category) {
    case 'electrical': return '#3b82f6';
    case 'mechanical': return '#059669';
    case 'structural': return '#d97706';
  }
  return '#ea580c';
}
