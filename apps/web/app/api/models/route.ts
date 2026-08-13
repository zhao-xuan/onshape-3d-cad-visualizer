import { NextRequest, NextResponse } from 'next/server';

interface CADComponentData {
  cadComponentId: string;
  displayName?: string;
  path: string[];
  transform: number[] | number[][];
  boundingBox: { min: number[]; max: number[] };
  isSuppressed: boolean;
}

interface ComponentSpecs {
  name: string;
  partNumber?: string;
  material?: string;
  functionality: string;
  description: string;
  category: 'structural' | 'electronic' | 'mechanical' | 'power-system';
  tags: string[];
}

interface CADComponentWithSpecs extends CADComponentData {
  specs: ComponentSpecs;
}

// Mock component specifications - represents database storage of human-authored content
const COMPONENT_SPECS: Record<string, ComponentSpecs> = {
  'PART_001_base_plate': {
    name: 'Base Plate',
    partNumber: 'BP-ALU-001',
    material: '6061-T6 Aluminum',
    functionality: 'Primary chassis foundation supporting all major assemblies and providing structural rigidity.',
    description: 'Precision-machined aluminum base plate forming the foundation of Product Alpha. Features integrated mounting points for front bracket enclosure, motor carriage rails, and rear electronics bay separation. T-profile extrusions provide attachment interface for modular component integration.',
    category: 'structural',
    tags: ['chassis', 'aluminum', 'machined', 'foundation'],
  },
  'PART_002_front_bracket': {
    name: 'Front Bracket',
    partNumber: 'FS-BKT-015',
    material: 'Stainless Steel 304',
    functionality: 'Reinforced enclosure bracket connecting chassis to motor carriage rails.',
    description: 'Cylindrical stainless steel front-end closure component. Acts as structural support and mounting interface for optical sensor array positioning mechanism. Provides environmental sealing while maintaining precise alignment with base plate mounting surfaces. Surface-anodized finish ensures corrosion resistance in laboratory environments.',
    category: 'structural',
    tags: ['enclosure', 'stainless-steel', 'sensor-mounting'],
  },
  'PART_011_m1_motor_assembly': {
    name: 'M1 Motor Assembly',
    partNumber: 'DRV-KIT-MOTOR01-V2',
    material: 'N/A (assembled subsystem)',
    functionality: 'High-torque drive motor with integrated gearbox and feedback sensors for primary axis actuation.',
    description: 'Multi-layer electromechanical motion system. Combines industrial brushless DC motor, precision planetary gearbox, Hall-effect current sensing, temperature monitoring thermal interface compound, optical encoder (2500 CPR), PWM-capable driver circuitry, and IP67-rated connectors. Delivers 1.8Nm continuous torque at 3,000 RPM with <±0.05° repeatability. Rated for >1M cycles in Class 10 cleanroom environments.',
    category: 'power-system',
    tags: ['motor', 'actuator', 'brushless-dc', 'enclosure'],
  },
  'PART_101_main_pcba': {
    name: 'Main PCB',
    partNumber: 'PCB-MAIN-X8432-V1.2',
    material: 'FR-4 Glass-Epoxy, ENIG finish), 6-layer stackup with copper core thermal vias.',
    functionality: 'Central electronics module executing motion control algorithms, sensor fusion (IMU data processing, communication interface handling, and safety monitoring for all drive systems.',
    description: 'High-density interconnect PCB substrate implementing dual STM32 MCU主控 architecture with real-time motion control on one core while offloading host communications USB-C, CAN bus, Wi-Fi) to companion microcontroller. Features isolated motor driver half-bridges achieving 96% peak efficiency, precision ADCs (16-bit @50kSps current sensing), and redundant watchdog systems. Operates from -20°C to +85°C with IP54 ingress protection.',
    category: 'electronic',
    tags: ['pcb', 'control-system', 'motor-driver', 'sensor-interfaces'],
  },
};

export async function GET(request: NextRequest) {
  try {
    const components = await getComponents();
    
    // Convert to response format with specs included
    const responseWithSpecs: CADComponentWithSpecs[] = components.map((comp) => ({
      ...comp,
      specs: COMPONENT_SPECS[comp.cadComponentId] || {
        name: 'Unknown Component',
        functionality: 'Description pending review. No specification data found.',
        description: '',
        category: 'structural' as const,
        tags: [],
      },
    }));

    return NextResponse.json(responseWithSpecs);
  } catch (error) {
    console.error('Error fetching components:', error);
    return NextResponse.json(
      { error: 'Failed to fetch component data', details: String(error) },
      { status: 500 }
    );
  }
}

// Simulated database/mock service - future implementation replaces this with actual storage layer
async function getComponents(): Promise<CADComponentData[]> {
  // Mock data from Product Alpha Assembly Revision 1 (mocked source)
  return [
    {
      cadComponentId: 'PART_001_base_plate',
      displayName: 'Base Plate',
      path: ['Base_Plate'],
      transform: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, -60],
      boundingBox: { min: [-80, -90, -5], max: [80, 10, 5] },
      isSuppressed: false,
    },
    {
      cadComponentId: 'PART_002_front_bracket',
      displayName: 'Front Bracket',
      path: ['Front_Bracket'],
      transform: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, -65],
      boundingBox: { min: [-55, -25, 0], max: [55, 25, 80] },
      isSuppressed: false,
    },
    {
      cadComponentId: 'PART_011_m1_motor_assembly',
      displayName: 'M1 Motor Assembly',
      path: ['Power_System', 'M1_Motor_Assembly'],
      transform: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, -45],
      boundingBox: { min: [-30, -60, -20], max: [30, 60, 80] },
      isSuppressed: false,
    },
    {
      cadComponentId: 'PART_101_main_pcba',
      displayName: 'Main PCB',
      path: ['Electronics', 'Main_PCBA'],
      transform: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, -5],
      boundingBox: { min: [-48, -72, -30], max: [48, 62, 5] },
      isSuppressed: false,
    },
  ];
}
