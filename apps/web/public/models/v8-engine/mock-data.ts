export interface ComponentSpec {
  id: string;
  displayName: string;
  partNumber?: string;
  description?: string;
}

const mockData: ComponentSpec[] = [
  {
    id: 'v8-main-engine-block',
    displayName: 'Main Engine Block',
    partNumber: 'ENG-001-BLK',
    description: 'Primary engine block housing cylinders and main bearings, forged aluminum alloy with machined cylinder bores providing structural integrity for the V-configuration powerplant assembly.',
  },
  {
    id: 'v8-cylinder-heads-pair',
    displayName: 'Cylinder Heads (Pair)',
    partNumber: 'ENG-002-HDDS',
    description: 'Dual cylinder heads with integrated combustion chambers, valve train mounting surfaces, and coolant passages designed for optimal heat dissipation in high-performance V8 configuration.',
  },
  {
    id: 'v8-alternator-bracket',
    displayName: 'Alternator Mounting Bracket',
    partNumber: 'ENG-012-BRKT',
    description: 'Stainless steel mounting bracket for alternator assembly, precision machined with bolt hole pattern matching engine block accessory drive provisions.',
  },
];

export default mockData;
