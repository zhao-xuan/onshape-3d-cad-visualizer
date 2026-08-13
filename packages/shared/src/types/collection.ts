/** Manual dimensions with unit - user-entered override for CAD-derived measurements */
export interface ManualDimensions {
  width?: number;   
  height?: number;  
  depth?: number;      
}  

/** CAD auto-calculated bounding box dimensions (from geometry export) */
export interface CADDetectionBounds {      // TODO: rename to BoundingBox2D or similar 
  minX?: number;                     
  maxX?: number;                       
  minY?: number;                     

  minZ?: number;                         
  maxZ?: number;                   
}

