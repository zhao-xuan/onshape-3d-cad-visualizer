// ComponentDefinition interface definition for this fixture module (standalone to avoid cross-package dependencies)
export interface ManualDimensions {
  width?: number;
  height?: number;
  depth?: number;
}

export interface ComponentDefinition {
  id: string;                    // UUID generated within database schema  
  displayName?: string;          // Human-friendly name shown in UI
  shortDescription?: string;     
  functionality?: string;        
  description?: string;          
  partNumber?: string;           
  category?: string;             
  tags?: string[];               
  metadata?: Record<string, any>;    // Additional CAD-derived data
  manualDimensions?: ManualDimensions & { unit: string };       // Optional user-entered dimensions 
  cadModelId?: string | null;    
  versionNumber?: string;     
  microversionId?: string;    
}

// Mock component definitions for MVP demo without requiring Onshape integration

export const mockComponentDefinitions: ComponentDefinition[] = [
  {
    id: "m3-motor",
    displayName: "Main Drive Motor",
    functionality: "Provides rotational motion to the assembly output shaft.",
    description: "High-torque brushless motor with integrated encoder. Operates at 24V DC with rated speed of 3000 RPM through internal gearing reduction.",
    category: "Actuation",
    tags: ["motor", "actuator", "brushless"],
    metadata: { manufacturer: "Industrial Motor Corp" },
    manualDimensions: { width: 80, height: 150, depth: 60, unit: "mm" }
  },
  {
    id: "pcb-main",
    displayName: "Primary Control Board",
    shortDescription: "Cortex-M7 control board",
    functionality: "Microcontroller board that controls all system actuators.",
    description: "Custom 4-layer PCB with ARM Cortex-M7 microcontroller. Features Ethernet connectivity and CAN bus interface.",
    category: "Electronics",
    tags: ["pcb", "controller"],
  },
];

export function getAllComponentDefinitions(): ComponentDefinition[] {
  return mockComponentDefinitions;
}

export function getPublishedOnly(): ComponentDefinition[] {
  return [...mockComponentDefinitions];
}

export function getById(id: string): ComponentDefinition | undefined {
  return mockComponentDefinitions.find(c => c.id === id);
}
