/** Custom specification field for flexible component specs */
export interface CustomSpec {
  key: string;                // Unique identifier (e.g., "max_torque", "voltage")
  label: string;              // Human-readable display label
  type: 'text' | 'number' | 'boolean' | 'select' | 'url' | 'measurement';
  value: unknown;             // Can be any of the above types depending on field definition
  unit?: string;              // Optional unit (e.g., "mm", "V", "Nm") for measurement/number fields
  order: number;              // Display order in UI
}

/** CAD-derived dimensions from geometry bounding box */
export interface CadDimensions {
  x: number;                  // Width in X direction
  y: number;                  // Height in Y direction  
  z: number;                  // Depth in Z direction
  unit: 'mm';                 // Always millimeters for CAD data
}

/** Manually entered user dimensions */
export interface ManualDimensions {
  width?: number;
  height?: number;
  depth?: number;
}

/** Version tracking from Onshape/source CAD system */
export type CadModelVersioned = { 
  cadModelId: string | null;    // Reference to source geometry (Onshape part ID, etc.)
  versionNumber?: string;       // Optional semantic version string
  microversionId?: string;      // Onshape micro-version reference when applicable  
};

/** Publication state for component documentation */
export type ComponentStatus = 'DRAFT' | 'PUBLISHED';

/** 
 * ComponentDefinition - logical component identity with full spec system. 
 * Independent of CAD geometry IDs (part numbers, occurrence IDs).  
 * Stores human-authored documentation/specification content.
 */
export interface ComponentDefinition extends CadModelVersioned {
  id: string;                    // Database UUID for this component definition
  
  status?: ComponentStatus;      // Publication state: DRAFT or PUBLISHED

  /** Core identifying info */
  displayName?: string;          // Human-friendly name shown in UI (e.g. "M3x12 Screw")
  shortDescription?: string;     // Short description (1-2 sentences) for quick reference  
  functionality?: string;        // What this component does / purpose
  description?: string;          // Full detailed documentation/spec

  /** Manufacturer/part catalog data */
  partNumber?: string;           // Source-of-truth part number
  
  /** Categorization & discoverability */
  category?: string;             // Classification (e.g. "structural", "electrical", "mounting")
  tags?: string[];               // Searchable labels for filtering
  metadata?: Record<string, any>;    // Extra CAD-derived or internal notes

  /** Dimensions - source distinguished explicitly */
  manualDimensions?: ManualDimensions & { unit: string };       // User-entered override dimensions  
  cadDimensions?: CadDimensions;   // Auto-calculated bounding box from geometry
  
  /** Flexible custom specifications (no DB migration required to add new keys) */
  customSpecs?: CustomSpec[];          // Array of spec fields with type safety

  /** Documentation & notes for engineering review/publishing pipeline */
  engineeringNotes?: string;           // Technical/engineering documentation notes, internal comments  
}

/** Component occurrence - where a definition appears in specific CAD assembly context. 
 * Represents geometry placement, not human-authored content.
 */
export interface CadOccurrence extends CadModelVersioned {
  id: string;                    // Unique ID for this occurrence (different from componentId)
  cadElementId?: string;         // Onshape element/part ID for this specific CAD entity
  
  /** Identity mapping to ComponentDefinition */  
  componentId: string;           // Reference to the logical ComponentDefinition
  
  /** Assembly hierarchy context */
  parentId?: string | null;      // Parent occurrence ID (null if top-level)
  path: string[];                // Full assembly path as array of parent occurrence IDs
   
  /** Geometry data from CAD system */  
  transform: number[];           // 16-element Float32Array in row-major order [4x4 matrix]
  boundingBox?: CadDimensions;   // Bounding box calculated from geometry
  
  /** State tracking for sync operations */ 
  isSuppressed?: boolean;        // Component suppressed/hidden in CAD model

  /** Source document info (for multi-document assemblies) */  
  sourceDocumentId?: string;     // If this occurrence references external Onshape doc
}

/** Assembly-level summary data with human-authored content from both definitions and occurrences. 
 * Combined view for display/UI consumption but normalized internally per component/occurrence distinction.
 */
export interface CadAssemblySummary {
  id: string;                    // Assembly/document ID (not revision) - e.g. "my-motor-mount-design"  
  name: string;                  // Human-readable assembly name
  
  sourceInfo?: {                // Source document metadata if applicable
    documentId?: string;         // Onshape doc ID or other CAD system reference
    workspaceId?: string;        // Workspace/branch in version control systems
    revisionReference?: string;  // Latest commit/tag/hashed reference  
  };

  /** Components with their latest documentation/spec */
  components: ComponentDefinition[]; 

  /** All occurrence nodes in hierarchy - flattened for rendering/UI traversal. 
   * Each node links to corresponding componentId, providing geometry placement context.
   */
  occurrences: CadOccurrence[]; 

  syncTimestamp?: string;        // When this summary last synchronized from CAD source

  status?: {                    // Overall document/assembly health indicators  
    completedSyncCount: number;       // Number of successful synchronizations  
    needsReviewCount?: number;        // Occurrences/components where mapping uncertain
    draftComponentsCount?: number;    // Count of DRAFT state definitions
  }; 
}
