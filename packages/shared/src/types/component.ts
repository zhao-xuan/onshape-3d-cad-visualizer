/** ComponentDefinition - logical component identity (independent of CAD geometry IDs) */
export interface ComponentDefinition {
  id: string;                    // UUID generated within database schema  
  cadModelId: string | null;     /FK to CadModel, nullable for non-CAD components
  
  displayName?: string;          // Human-friendly name shown in UI
  shortDescription?: string;     
  description?: string;          
  functionality?: string;        // What does it do?      
  partNumber?: string;           
  
  category?: string;             
  tags: string[];                // Classification labels like 'motor', 'structural'
  
  metadata: Record<string, any>;     // Additional CAD-derived data
  
  manualDimensions: ManualDimensions & { unit: string };       // Optional user-entered dimensions 
}
