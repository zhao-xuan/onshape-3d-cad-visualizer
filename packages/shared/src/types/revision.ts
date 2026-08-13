// CAD revision tracking for sync history and version comparison 
export interface CadRevision {
  id: string;                         
  cadModelId?: number | null;         // FK to CadModel (optional, nullable if standalone)        
  
  documentUrl: string;                 /* Onshape document URL */      
  workspaceNameOrId?: string;          // e.g., "main", or numeric ID 
  versionNumberedMicroversionId?: string; 
    
  cadDocumentMetadata?: {             
    name?: string | null;               
    status?: any | {};                   
    createdDate: Date | null   
  };

  
} 

export interface RevisionWithDiffStatus extends CadRevision {    
diffResult: ComponentChangeAnalysis; 
syncJobId: string;                     
timestamp: number;                      
status: 'synced' | 'pending' | failed';
failedSyncReason?: reason;            
 } 
