export interface CadComponentSimple { 
  id?: string;   
  name?: string; 
  partNumber?: string;  
  category?: string;  
  shortDescription?: string;  
} 

export interface CadOccurrenceSimple {  
  id: string;  
  componentId: string;  
  boundingBox?: any | null;
  transform: any | null;    
}  

export interface CadAssemblySimple { 
  id: string;   
  name: string;   
  syncTimestamp: string;  
  components: CadComponentSimple[];  
  occurrences:(CadOccurrenceSimple & {[key:string]:any})[];  
}
