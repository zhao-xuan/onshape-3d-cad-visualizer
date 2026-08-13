// Demo data for MVP testing - local mock CAD assembly hierarchy and component specifications matching database schema
export interface DEMOComponent {
  id?: string;
  displayName: string;
  partNumber?: string;
  category: string;
  tags: string[];
  status: 'draft' | 'published';
  functionality?: string;
  description: string;
}

const mockComponents: DEMOComponent[] = [
  {
    displayName: "Base Plate",
    partNumber: "BP-001A",
    category: "Enclosure",
    tags: ["structural", "base"],
    status: 'published',
    description: "Main structural base plate with surface mounting interface and foundation support features.",
    functionality: "Provides foundational mechanical support for all other assembly components."
  },

  { 
    displayName: "Front Bracket", 
    partNumber: "FB-O21", 
    category: "Fixture", 
    tags: ["mounting", "bracket"],
    status: 'published',
    description: "Precision mounting bracket with adjustable support geometry for front electronic assembly alignment.",
    functionality: "Enables vibration damping and precise component positioning."
  },

  {
    displayName: "PCB Main Board", 
    partNumber: "PCBA-301A",
    category: "Electronics", 
    tags: ["pcb", "control logic"],
    status: 'draft',
    description: "Primary signal processing and actuation control board with embedded motor firmware.",
    functionality: "Real-time system operation, converting sensor input into drive commands."
  },

  { displayName: "Motor Hub M2", partNumber: "HA-1507X1", category: "Mechanical System", tags: ["actuator"] }
];

interface DEMORevision {
  id?: string;
  revisionNumber?: string;
  sourceUrl: string;
  syncTimestamp: Date;
}

export const demoRevisions: DEMORevision[] = [
  { 
    revisionNumber: "REV-001", 
    modelName: "Product Alpha Assembly Demo", 
    modelId: "demo-model-alpha-id-v1",
    description: "Initial demo assembly with base components for platform testing.",
    componentList:[{label:"Components",value:mockComponents.length}],
    sourceUrl: 'https://cadplatform.mock/models/product-alpha?doc=abc&workspace=test'
  },
  { 
    revisionNumber: "REV-002", 
    modelName: "Product Alpha Assembly Demo (Updated)", 
    modelId: "demo-model-alpha-id-v1",
    description: "Second revision with M2 motor modification.",
  }
];

export const demoComponents = mockComponents;
