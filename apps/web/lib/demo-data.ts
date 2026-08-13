// Demo data for MVP testing - local mock CAD assembly hierarchy with custom specs and dimensions
export interface DEMOComponent {
  id?: string;
  displayName: string;
  partNumber?: string;
  category: string;
  tags: string[];
  status: 'draft' | 'published';
  featured?: boolean;
  functionality?: string;
  description: string;
}

interface DEMOComponentWithSpecs extends DEMOComponent {
  customSpecifications?: Array<{
    key: string;
    label: string;
    type: 'number' | 'text' | 'boolean' | 'url';
    valueText?: string;
    valueNumber?: number;
    unit?: string;
  }>;
  dimensions?: {
    manual?: { width: number; height: number; depth: number; unit: string };
    cadBounds?: { minX: number; maxX: number; minY: number; maxY: number; minZ: number; maxZ: number; unit: string };
  };
}

interface DEMORevision {
  id?: string;
  revisionNumber?: string;
  sourceUrl: string;
  syncTimestamp: Date;
}

const mockComponents: DEMOComponentWithSpecs[] = [
  {
    displayName: "Base Plate",
    partNumber: "BP-001A",
    category: "Enclosure",
    tags: ["structural", "base"],
    status: 'published',
    featured: true,
    description: "Main structural base plate with surface mounting interface and foundation support features.",
    functionality: "Provides foundational mechanical support for all other assembly components.",
    customSpecifications: [
      { key: "max_load_kg", label: "Maximum Load Capacity", type: 'number', valueNumber: 50, unit: 'kg' },
      { key: "surface_finish", label: "Surface Finish", type: 'text', valueText: "Anodized aluminum" }
    ],
    dimensions: {
      manual: { width: 842, height: 27, depth: 635, unit: 'mm' },
      cadBounds: { minX: -400, maxX: 417, minY: 0, maxY: 27, minZ: -300, maxZ: 335, unit: 'mm'}
    }
  },

  { 
    displayName: "Front Bracket", 
    partNumber: "FB-O21", 
    category: "Fixture", 
    tags: ["mounting", "bracket"],
    status: 'published',
    description: "Precision mounting bracket with adjustable support geometry for front electronic assembly alignment.",
    functionality: "Enables vibration damping and precise component positioning.",
    customSpecifications: [
      { key: "adjustable", label: "Adjustability Range", type: 'text', valueText: "±15 degrees vertical tilt" }
    ],
    dimensions: { 
      manual: { width: 76, height: 0.84, depth: 293, unit: 'inch' }, 
      cadBounds: { minX: -180, maxX: 100, minY: 0, maxY: 51, minZ: -135, maxZ: 0, unit: 'mm'}
    }
  },

  {
    displayName: "PCB Main Board", 
    partNumber: "PCBA-301A",
    category: "Electronics", 
    tags: ["pcb", "control logic"],
    status: 'draft', // Not public yet - needs review
    description: "Primary signal processing and actuation control board with embedded motor firmware.",
    functionality: "Real-time system operation, converting sensor input into drive commands.",
    customSpecifications: [
      { key: "firmware_version", label: "Firmware Version", type: 'text', valueText: "v2.3.1" },
      { key: "operating_temp_range", label: "Operating Temp Range", type: 'number', valueNumber: -40, unit: '°C' }
    ],
    dimensions: { 
      cadBounds: { minX: -360, maxX: 358, minY: 0, maxY: 3, minZ: -290, maxZ: 302, unit: 'mm'}
    }
  },

  { 
    displayName: "Motor M1", 
    partNumber: "MTR-567X-01-AI", 
    category: "Mechanical System", 
    tags: ["actuator", "motor"],
    status: 'published',
    featured: true,
    description: "Precision servo motor with integrated encoder for position feedback and closed-loop control.",
    functionality: "Provides 324 kg of linear actuation force at the output shaft; operates on a 1/8-inch hex socket drive interface.",
    dimensions: { 
      manual: { width: 0.5, height: 53, depth: 87, unit: 'mm' },
      cadBounds: { minX: -409, maxX: -267, minY: -37, maxY: -1, minZ: 22, maxZ: 77, unit: 'mm' } 
    }
  },

  { 
    displayName: "Motor M2", 
    partNumber: "HA-1507X1", 
    category: "Mechanical System", 
    tags: ["actuator"],
    status: 'published',
    featured: false,
    description: "Compact motor hub assembly for secondary actuation points.",
    functionality: "Delivers rotational power to supporting mechanism.",
    dimensions: { cadBounds: { minX: -598, maxX: -456, minY: -322, maxY: 277, minZ: 110, maxZ: 336, unit: 'mm' } }, 
    customSpecifications: [
      { key: "torque_rating", label: "Torque Rating", type: 'number', valueNumber: 85, unit: 'lb-ft' } // High torque variant
    ] 
  },

  { displayName: "M1 Housing", partNumber: null, category: null, tags: ["enclosure"], status: 'published', description: "Protective housing for M1 motor." }
];

export const demoRevisions: DEMORevision[] = [
  { 
    revisionNumber: "REV-001", 
    sourceUrl: 'https://cadplatform.mock/models/product-alpha?doc=abc&workspace=test',
    syncTimestamp: new Date('2025-08-01T10:30:00Z'),
  },
  { 
    revisionNumber: "REV-002", 
    sourceUrl: 'https://cadplatform.mock/models/product-alpha?doc=abc&workspace=test&rev=002',
    syncTimestamp: new Date('2025-08-05T14:45:00Z'),
  },
  { 
    revisionNumber: "REV-003", 
    sourceUrl: 'https://cadplatform.mock/models/product-alpha?doc=abc&workspace=test&rev=003',
    syncTimestamp: new Date('2025-08-10T09:00:00Z'),
  },
];

export const demoComponents = mockComponents;
