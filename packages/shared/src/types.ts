// Shared type definitions for CAD platform - core domain entities

export interface ComponentDefinition {
  id: string;                    
  displayName?: string;          
  partNumber?: string;           
  category?: string;             
  tags: string[];                
  status: 'draft' | 'published';
}

export interface ManualDimensionsWithUnit {  
  width?: number;                    
  height?: number;                   
  depth?: number;                     
  unit: string = 'mm';               
}  

// CAD auto-calculated bounding box dimensions (from geometry)
export interface CADDetectionBounds {      
  minX?: number;                       
  maxX?: number;                        
  minY?: number;                      
  maxY?: number;                      
  minZ?: number;                        
  maxZ?: number;                    
}

/** Component occurrence in a specific assembly context */
export interface ComponentOccurrence {
  id: string;                 
  cadComponentId: string;     
  parentOccurrenceId?: string; 
  assemblyPath: string[];    
  transform: number[];   
  boundingBox: CADDetectionBounds;  
  isSuppressed: boolean;       
  sourceDocument?: string;    
}

/** CAD revision - represents a specific snapshot of a CAD model */
export interface CadRevision {
  id: string;                 
  documentId: string;         
  workspaceId: string;        
  versionId?: string;          
  microversionId?: string;    
  elementId?: string;       
  syncTimestamp: Date;   
  sourceUrl: string;           
  componentIds: string[];      
  structureHash: string;       
  geometryHash: string;        
}

/** Component change detected during diff */
export interface ComponentChange {
  occurrenceId: string;       
  type: 'added' | 'removed' | 'geometry' | 'transform' | 'metadata'; 
  previousValue?: any;        
  newValue: any;              
}
