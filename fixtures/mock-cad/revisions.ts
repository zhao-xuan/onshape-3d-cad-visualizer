// Mock CAD fixtures for development - Product Assembly Alpha
// Revision 1: Base assembly with main components

export interface CadRevisionFixture {
  versionId?: string;
  microversionId?: number;
  sourceUrl: string;
  syncTimestamp: Date;
  occurrences: OccurrenceFixture[];
}

export interface OccurrenceFixture {
  cadComponentId: string;
  parentId: string | null;
  path: string[];
  transform: Float32Array|number[];
  boundingBox: {min: number[], max: number[]};
  isSuppressed: boolean;
}

/** Revision 1 assembly structure */
export const productAlphaRevision1: CadRevisionFixture = {
  sourceUrl: 'https://cadplatform.io/models/product-alpha',
  syncTimestamp: new Date('2024-01-15T10:00:00Z'),
  occurrences: [
    // Main chassis/frame components
    {
      cadComponentId: 'PART_001_base_plate',
      parentId: null,
      path: ['Base_Plate'],
      transform: [1,0,0,0, 0,1,0,0, 0,0,1,0, 0,-60,0,0],
      boundingBox: {min: [-80,-90,-5], max: [80,10,5]},
      isSuppressed: false
    },
    {
      cadComponentId: 'PART_002_front_bracket',
      parentId: null,
      path: ['Front_Bracket'],
      transform: [1,0,0,0, 0,1,0,0, 0,0,1,0, 0,-65,40,70],
      boundingBox: {min: [-55,-25,0], max: [55,25,80]},
      isSuppressed: false
    },
    {
      cadComponentId: 'PART_003_rear_bracket',
      parentId: null,
      path: ['Rear_Bracket'],
      transform: [1,0,0,0, 0,1,0,0, 0,0,1,0, 0,-75,-40,-80],
      boundingBox: {min: [-55,-25,0], max: [55,25,60]},
      isSuppressed: false
    },
    // Motor and power system (M1 - main drive motor)
    {
      cadComponentId: 'PART_011_m1_motor_assembly',
      parentId: null,
      path: ['Power_System','M1_Motor_Assembly'],
      transform: [1,0,0,0, 0,1,0,0, 0,0,1,0, -45,30,15],
      boundingBox: {min: [-30,-60,-20], max: [30,60,80]},
      isSuppressed: false
    },
    {
      cadComponentId: 'PART_012_m1_motor_housing',
      parentId: null,
      path: ['Power_System','M1_Motor_Assembly','Motor_Housing'],
      transform: [1,0,0,0, 0,1,0,0, 0,0,1,0, -52,-34,0],
      boundingBox: {min: [-34,-68,-39], max: [34,68,39]},
      isSuppressed: false
    },
    // Motor and power system (M2)  
    {
      cadComponentId: 'PART_015_m2_motor_assembly',
      parentId: null,
      path: ['Power_System','M2_Motor_Assembly'],
      transform: [1,0,0,0, 0,1,0,0, 0,0,1,0, -45,-30,-75],
      boundingBox: {min: [-30,-60,-65], max: [30,60,9]},
      isSuppressed: false
    },
    // PCB and electronics group (PCBA)
    {
      cadComponentId: 'PART_101_main_pcba',
      parentId: null,
      path: ['Electronics','Main_PCBA'],
      transform: [1,0,0,0, 0,1,0,0, 0,0,1,0, -5,-55,-2],
      boundingBox: {min: [-48,-72,-30], max: [48,62,5]},
      isSuppressed: false
    },
    // Camera system subassembly
    {
      cadComponentId: 'PART_201_camera_subassembly',
      parentId: null,
      path: ['Camera_Module','Camera_Subassembly'],
      transform: [1,0,0,0, 0,1,0,0, 0,0,1,0, -65,-34,38],
      boundingBox: {min: [-72,-43,0], max: [10,29,100]},
      isSuppressed: false
    },
    // Enclosure/cover components (some suppressed by default)
    {
      cadComponentId: 'PART_301_top_cover',
      parentId: null,
      path: ['Enclosure','Top_Cover'],
      transform: [1,0,0,0, 0,1,0,0, 0,0,1,0, -45,-27.5,17.5],
      boundingBox: {min: [-69.8,-44.2,0], max: [69.8,39,35]},
      isSuppressed: false
    },
  ]
} as CadRevisionFixture

/** Revision 2: Same assembly with changes for testing */
export const productAlphaRevision2: CadRevisionFixture = {
  sourceUrl: 'https://cadplatform.io/models/product-alpha',  
  syncTimestamp: new Date('2024-01-20T15:30:00Z'),
  occurrences: [
    // Same main chassis
    { cadComponentId: 'PART_001_base_plate', parentId: null, path:['Base_Plate'], 
      transform:[1,0,0,0,0,1,0,0,0,0,1,0,0,-60,0,0], boundingBox:{min:[-80,-90,-5],max:[80,10,5]}, isSuppressed:false },
    { cadComponentId: 'PART_002_front_bracket', parentId: null, path:['Front_Bracket'], 
      transform:[1,0,0,0,0,1,0,0,0,0,1,0,0,-65,40,70], boundingBox:{min:[-55,-25,0],max:[55,25,80]}, isSuppressed:false },
    // M2 motor modified - dimension change
    { cadComponentId: 'PART_015_m2_motor_assembly', parentId: null, path:['Power_System','M2_Motor_Assembly'], 
      transform:[1,0,0,0,0,1,0,0,0,0,1,0,-45,-30,-78], boundingBox:{min:[-30,-60,-68],max:[30,60,6]}, isSuppressed:false },
    // Electronics updated
    { cadComponentId: 'PART_101_main_pcba',parentId:null,path:['Electronics','Main_PCBA'], 
      transform:[1,0,0,0,0,1,0,0,0,0,1,0,-5,-52,-2],boundingBox:{min:[-48,-69,-30],max:[48,62,5]},isSuppressed:false },
    // Camera unchanged
    { cadComponentId: 'PART_201_camera_subassembly',parentId:null,path:['Camera_Module','Camera_Subassembly'], 
      transform:[1,0,0,0,0,1,0,0,0,0,1,0,-65,-34,38],boundingBox:{min:[-72,-43,0],max:[10,29,100]},isSuppressed:false },
    // Cover unchanged  
    { cadComponentId: 'PART_301_top_cover',parentId:null,path:['Enclosure','Top_Cover'], 
      transform:[1,0,0,0,0,1,0,0,0,0,1,0,-45,-27.5,17.5],boundingBox:{min:[-69.8,-44.2,0],max:[69.8,39,35]},isSuppressed:false },
    // NEW COMPONENT - USB sensor hub
    { cadComponentId: 'PART_501_usb_sensor_hub',parentId:null,path:['Electronics','USB_Sensor_Hub'], 
      transform:[1,0,0,0,0,1,0,0,0,0,1,0,-34,-52,-8],boundingBox:{min:[-26,-46,-18],max:[26,42,9]},isSuppressed:false },
  ]
}

/** Component name mapping for display */
export const componentNames: Record<string, string> = {
  'PART_001_base_plate': 'Base Plate',
  'PART_002_front_bracket': 'Front Bracket', 
  'PART_003_rear_bracket': 'Rear Bracket (not in this version)',
  'PART_011_m1_motor_assembly': 'M1 Motor Assembly',
  'PART_012_m1_motor_housing': 'Motor Housing M1',
  'PART_015_m2_motor_assembly': 'M2 Motor Assembly', 
  'PART_101_main_pcba': 'Main PCB',
  'PART_201_camera_subassembly': 'Camera Module',
  'PART_301_top_cover': 'Top Cover',
  'PART_501_usb_sensor_hub': 'USB Sensor Hub (NEW)',
}
