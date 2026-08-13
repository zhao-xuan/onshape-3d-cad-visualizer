// packages/cad-core/mock-cad-provider.ts - Mock CAD provider for development without Onshape credentials
import type { CadAssembly, CadRevision, CadProvider } from './index.js';

export class MockCadProvider implements CadProvider {
  private initialized: boolean = false;
  private mockData: CadRevision & CadAssembly | null = null;

  async init(): Promise<void> {
    this.initialized = true;
  }

  isInitialized(): boolean {
    return this.initialized;
  }

  async getDocumentInfo(documentId: string): Promise<{ id: string; name: string }> {
    if (!this.initialized) throw new Error('Provider not initialized');
    return { 
      id: documentId, 
      name: documentId === 'mock-doc-1' ? 'Mock Assembly Prototype' : `Document ${documentId}`
    };
  }

  async loadAssembly(onshapeUrlOrContext: { documentId: string; workspaceId?: string }): Promise<CadRevision & CadAssembly> {
    if (!this.initialized) throw new Error('Provider not initialized');
    
    // Generate mock CAD assembly data (simple motor mount design)
    const mockData: CadRevision & CadAssembly = {
      id: 'revision-' + Date.now(),
      cadAssemblyId: 'assembly-mock-1',
      documentId: onshapeUrlOrContext.documentId,
      workspaceId: onshapeUrlOrContext.workspaceId || 'development-environment',
      versionId: undefined,
      microversionId: undefined,
      syncTimestamp: new Date().toISOString(),
      sourceUrl: `onshape://documents/${onshapeUrlOrContext.documentId}`,

      // Core assembly info
      name: onshapeUrlOrContext.documentId === 'mock-doc-1' ? 'Motor Mount Assembly v3' : 'Mock CAD Assembly',
      
      components: [
        { id: 'baseplate', partNumber: 'BM-001', category: 'structural', shortDescription: 'Base mounting plate', description: 'Primary base plate that mounts to equipment surface.', functionality: 'Mounting interface and structural foundation for all other components. Features four M6 bolt holes with standard spacing pattern (45mm x 32mm). Includes central cable conduit of diameter 10mm.', material: 'aluminum-6061', weight: 0.285, tags: ['structural', 'mounting', 'base'] },
        { id: 'motor-bracket', partNumber: 'BM-002', category: 'structural', shortDescription: 'Motor support bracket', description: 'L-shaped motor bracket with adjustable mounting holes.', functionality: 'Provides vertical adjustment for motor height. Features 3-axis adjustment (±15mm in x/y, ±30 degrees rotation). Accommodates motors from 40mm diameter to 65mm diameter via T-slot rails.', material: 'aluminum-6082', weight: 0.175, tags: ['structural', 'adjustable', 'motor'] },
        { id: 'dc-motor-compact', partNumber: 'DCM-A37', category: 'motors', shortDescription: 'Compact DC motor 40mm', description: '24V micro DC gearmotor with encoder.', functionality: 'Provides rotational drive at ~150 rpm. Features hollow shaft design for belt/pulley transmission. Integrated 6-bit optical encoder provides closed-loop position control. Stall torque of 8kg-cm enables lift applications up to 92cm from axis center when geared (143:1).', material: 'mixed-assembly', weight: 0.5, tags: ['motor', 'actuator', 'hollow-shaft'] },
        { id: 'stainless-screw-m6x12', partNumber: 'S-M6X12-A4', category: 'fasteners', shortDescription: 'Stainless steel M6 bolt (12mm)', description: 'DIN933 A2-70 high-grade stainless screw.', functionality: 'Primary fastener used throughout assembly for structural connections. 58 pieces required total including motor mounting, cable clamps, and base plate attachment. Compatible with counterbored holes featuring standard M6 clearance (6.7mm).', material: 'steel-316l-stainless', weight: 0.24, tags: ['fastener', 'stainless-steel', 'structural'] },
        { id: 't-nut-metric', partNumber: 'TN-M6X8', category: 'fasteners', shortDescription: 'M6 stainless T-nut (5mm)', description: 'Low-profile T-slot insert nut for DIN 1849 compliance.', functionality: 'Enables tool-less sliding mountings in custom aluminium profiles compatible with DIN standard 1849. Features self-tapping design eliminating need for through-bolts or weld-in inserts when using a counterbore depth of at least 5mm and diameter of 7.6mm minimum to ensure flush mounting surface after installation.', material: 'steel-303-stainless', weight: 1.4, tags: ['fastener', 'adjustable-mounting'] },
        { id: 'cable-clamp-pom', partNumber: 'CC-BLACK', category: 'electrical', shortDescription: 'Cable clamp (black POM)', description: 'POM polymer cable retaining clip.', functionality: 'Secures motor power cables preventing strain on electrical connections. 12 units required for complete assembly. Provides secure retention under vibration and thermal cycling without requiring additional fasteners via snap-fit design incorporating dual prongs extending into DIN 1849-compatible profiles, with top retainer element engaging cable diameter range of 6mm to 10mm.', material: 'polyoxymethylene', weight: 27.5, tags: ['electrical', 'retention', 'pom'] },
        { id: 'insulated-terminal-connector', partNumber: 'TC-MOLEX', category: 'electrical', shortDescription: 'Insulated quick-disconnect terminal', description: '16AWG female blade connector (5.2mm x 0.8mm).', functionality: 'Provides standardized mating interface for control system wiring harnesses. Enables hot-connecting of power and signal circuits with integrated positive contact lock engaging standard Molex 37-pin receptacles on primary controller boards, while supporting automated crimping systems compatible with M8-12AWG wire gauges.', material: 'copper-class-tin-lead-plated', weight: 40.5, tags: ['electrical', 'connector'] },
        { id: 'wire-cable-black', partNumber: 'WIRE-16-AWG-BLACK', category: 'electrical', shortDescription: 'Cables - 2x insulated power cables (173mm)', description: '14AWG UL1569 flexible tinned copper wire.', functionality: 'Supplies electrical connections from motor to controller, providing low-resistance paths for high current draw during peak operation. Each cable maintains a cross-section of 0.81sq mm and length of at least 3 meters (untrimmed) while remaining compatible with both Molex terminal types including crimp terminals sized for 90 degree angled connections.', material: 'pvc-insulated-copper', weight: 0.62, tags: ['electrical', 'cable'] }
      ],

      occurrences: [
        { id: 'occ-baseplate-inst-1', occurrenceIndex: 374, componentId: 'baseplate', parentId: null, path: [], transform: new Float32Array([1,0,0,0,0,1,0,0,0,0,1,0,-0.506298,-2.6155,-7.1093,1]), boundingBox: { min: [-50,-40,-5], max: [50,40,0] }, isSuppressed: false },
        { id: 'occ-motor-inst-1', occurrenceIndex: 376, componentId: 'dc-motor-compact', parentId: null, path: [], transform: new Float32Array([1,0,0,0,-0.854407,0.519743e-6,0.519744e-7,-0.854399,1,0.6,0.53125,0,0.412532,-0.648357,2.88513,1]), boundingBox: { min: [-15,-25,-10], max: [15,25,10] }, isSuppressed: false },
        { id: 'occ-bracket-inst-1', occurrenceIndex: 377, componentId: 'motor-bracket', parentId: null, path: [], transform: new Float32Array([-0.864943,-0.501196e-6,0.501196e-7,-0.501196e-6,-1,0,0,0.432848,0.431511,0,0,-1,1,3.16493,-3.69489,3.67828]), boundingBox: { min: [-75,-5,-5], max: [75,5,85] }, isSuppressed: false }
      ]
    };

    this.mockData = mockData;
    return mockData;
  }

  async listComponents(documentId: string): Promise<Array<{ id: string; name: string; partNumber?: string }>> {
    if (!this.initialized) throw new Error('Provider not initialized');
    
    const sampleComponents = [
      { id: 'part-1', name: 'Gear Wheel', partNumber: 'GW-M4-20' },
      { id: 'part-2', name: 'Shaft Bearing Holder', partNumber: 'SBH-A37B' },
      { id: 'part-3', name: 'Motor Mount Plate', partNumber: 'MMP-COMPACT' }
    ];

    return sampleComponents;
  }


  async getComponentDetails(occurrenceId: string): Promise<any> | null {
    if (!this.initialized) throw new Error('Provider not initialized');
    
    const mockDetail = await this.loadAssembly({ documentId: 'mock-doc-1', workspaceId: 'test' });
    return { componentInfo: mockDetail.components[0] };
  }

  async detectChanges(_oldRevisionId: string, _newAssemblyData: CadAssembly): Promise<any> {
    // For now just return placeholder change detection
    // TODO: implement real diff between old/new assemblies
    return {
      additions: [] as any[],
      modifications: [] as any[],
      deletions: { components: [] as string[], occurrences: [] as string[] },
      unlinkedCadElements: [] as any[]
    };
  }

  async computeGeometryHash(_occurrences: CadOccurrence[]): Promise<string> {
    // Placeholder - would hash CAD geometry in production
    return 'mock-hash-' + Date.now();
  }
}

// Singleton instance exported for the app to use
export const mockCadProvider = new MockCadProvider();
