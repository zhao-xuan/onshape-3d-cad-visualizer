// packages/cad-core/index.ts - Shared CAD core types and interfaces

export interface CadComponent {
  id: string;
  name: string;
  partNumber?: string;
  category: string;
  shortDescription?: string;
  description?: string;
  functionality?: string;
  material?: string;
  weight?: number;
  tags: string[];
}

export interface CadOccurrence {
  id: string;
  occurrenceIndex: number;
  componentId: string;
  parentId?: string | null;
  path: string[];
  transform: number[]; // 4x4 matrix as flat array [16 numbers]
  boundingBox?: { min: [number, number, number]; max: [number, number, number] };
  isSuppressed?: boolean;
}

export interface CadAssembly {
  id: string;
  name: string;
  versionId?: string;
  microversionId?: string;
  documentId?: string;
  syncTimestamp: string;
  components: CadComponent[];
  occurrences: CadOccurrence[];
}

export interface CadEntityMapping {
  cadElementId: string; // CAD-derived identifier
  componentId: string;    // Logical component in our DB
  confidence?: 'high' | 'medium' | 'low' | 'needs_review';
}

export interface CadRevision {
  id: string;
  cadAssemblyId: string;
  documentId: string;
  workspaceId: string;
  versionId?: string;
  microversionId?: string;
  syncTimestamp: string;
  sourceUrl?: string;
}

export interface CadProvider {
  init(): Promise<void>;
  
  // Document operations
  listDocuments?(): Promise<Array<{ id: string; name: string }>>;
  getDocumentInfo(documentId: string): Promise<{ id: string; name: string }>;
  
  // Assembly loading and parsing from CAD source - primary entry point
  loadAssembly(onshapeUrlOrContext: { documentId: string; workspaceId?: string }): Promise<CadRevision & CadAssembly>;
  
  // Component management
  listComponents(documentId: string): Promise<{ id: string; name: string; partNumber?: string }[]>;
  getComponentDetails(occurrenceId: string): Promise<CadOccurrence & { componentInfo?: CadComponent }> | Promise<null> | null;
  
  // Change detection between revisions - TODO implement comparison logic
  detectChanges(oldRevisionId: string, newAssemblyData: CadAssembly): Promise<{
    additions: CadComponent[];
    modifications: Array<{ occurrence: CadOccurrence; changes: Record<string, any> }>;
    deletions: { components: string[]; occurrences: string[] };
    unlinkedCadElements: CadEntityMapping[];
  }>;
  
  // Geometry pipeline - placeholder for actual mesh extraction from CAD tessellation
  computeGeometryHash(occurrences: CadOccurrence[]): Promise<string>;
  getComponentMesh?(componentId: string): Promise<{ url: string; format: 'glb' | 'gltf' } | null>;
}
