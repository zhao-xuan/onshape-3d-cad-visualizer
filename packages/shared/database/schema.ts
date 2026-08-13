// packages/shared/database/schema.ts - Database schema types for component management
export interface ComponentDefinition {
  id: string;
  cadEntityId?: string; // Optional CAD-derived identifier (may be null if unlinked)

  name: string;
  displayName?: string;
  partNumber?: string;

  category?: string;
  tags?: string[];

  shortDescription?: string;
  description?: string;
  functionality?: string; // User-authored specifications

  metadata?: Record<string, unknown>;

  status: 'draft' | 'published';

  createdAt: Date;
  updatedAt: Date;
}

export interface ComponentOccurrenceDB {
  id: string;
  cadEntityId: string;
  revisionId: string; // Links to CadRevision

  parentId?: string;
  occurrenceIndex: number; // CAD-provided index from model tree order

  hierarchyPath: string[]; // Path from root component path segments

  transform: {
    matrix: [number, number, number, number,
             number, number, number, number,
             number, number, number, number,
             number, number, number, number]; // 4x4 matrix
    translation?: [number, number, number];
  };

  boundingBox?: {
    min: [number, number, number];
    max: [number, number, number];
    unit: 'mm';
  } | null;

  isSuppressed: boolean;

  sourceDocumentId?: string;
  sourceWorkspaceId?: string;

  cadMetadata?: {
    material?: string;
    partNumber?: string; // From CAD model itself, if present
    geometryHash?: string; // Computed from CAD data only for change detection
  } | null;
}

export interface CadRevisionDB {
  id: string;
  createdAt: Date;

  documentId: string;
  workspaceId: string; // 'development' or actual Onshape workspace ID

  versionId?: string; // For frozen view of a particular CAD snapshot (optional)
  microversionId?: string; // Specific revision within a workspace (optional for mutable viewing mode)

  sourceUrl?: string;

  cadAssemblySummary: {
    name: string;
    componentCount: number;
    occurrenceCount: number;
    boundingBoxSum?: { x: number; y: number; z: number } | null; // Approximation for quick rendering
  };

  syncMetadata?: {
    syncJobDurationMs?: number;
    exportFormat?: string;
  };
}
