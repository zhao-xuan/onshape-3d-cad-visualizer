// CAD revision tracking for sync history and version comparison 
export interface CadRevision {
  id: string;                         // UUID primary key from database
  
  cadModelId?: number | null;         // FK to CadModel (optional, nullable if standalone)      
  
  documentUrl: string;                 // Onshape document URL    
  workspaceNameOrId?: string;          // e.g., "main", or numeric ID 
  versionNumberedMicroversionId?: string; 

  cadDocumentMetadata?: {          
    name?: string | null;              
    status?: any;                       
    createdDate?: Date | null   
  };

} 

export interface ComponentChangeAnalysis {}
// Placeholder for diff analysis logic to be implemented
  
export type SyncStatus = 'synced' | 'pending' | 'failed';

export interface RevisionWithSyncStatus {    
  id: string;                         
  cadModelId?: number | null;         
  documentUrl: string;              
  workspaceNameOrId?: string;          
  versionNumberedMicroversionId?: string;
  status: SyncStatus             
}
