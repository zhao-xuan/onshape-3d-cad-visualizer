// Sync job tracking for background operations 
export interface SyncJob {    
  id?: string;                        
  cadRevisionId?: number | null;              
  status: 'queued' | 'running' | 'completed' | 'failed';         
  createdAt: Date;                     
  startedAt?: Date | null;             
  finishedAt?: Date | null;            
  errorMessage?: string | null;           
}

export interface SyncProgress {     
  jobId: number;                    
  status: 'queued' | 'running' | 'completed' | 'failed';       
  progressPercent: number;            
  currentStep: string | null;              
}