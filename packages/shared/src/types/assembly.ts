// Assembly - top-level CAD model representation with components and revisions
import { ComponentDefinition, ManualDimensions } from './component';

export interface CadRevisionMetadata {
  revisionId: string;                     // UUID primary key from database
  documentId?: string | null;             // Onshape document ID
  workspaceId?: string | null;            // e.g., "main", or numeric ID
  versionNumberedMicroversionId?: string; // Version-specific sync identifier

  cadDocumentMetadata?: {                 
    name?: string | null;                 
    status?: any;                         
    createdDate?: Date | null            
  };

  sourceUrl: string;                      // Onshape document URL
  timestamp: string;                      // ISO datetime of sync
}

export interface Assembly extends CadRevisionMetadata {
  assemblyId: string;                     // Short, human-readable ID (e.g., "alpha-machine")
  name: string;                           // Display name for the entire assembly
  
  components?: ComponentDefinition[];     // Reference-only links to DB
  componentIds?: string[];                // Fallback array of IDs if no references

  metadata?: {                            // Assembly-level documentation
    description?: string | null;          // Full product overview text
    specificationsUrl?: string | null;    
    drawingsFolderId?: string | null;     
    manufacturer?: string | null;         
    totalWeight?: number;                 
  };
}

export interface NodeMapping {
  componentId: string;                    // ComponentDefinition ID in DB  
  occurrenceId: string;                   // Unique cadence instance identifier 
}

export type CadComponentDimensions = ManualDimensions & { unit: string } | 
                                    (({ x: number; y: number; z: number; unit: "mm" }) | null);
