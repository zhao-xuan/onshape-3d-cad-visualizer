import { NextRequest, NextResponse } from 'next/server';

interface ComponentSpecs {
  name: string;
  partNumber?: string;
  material?: string;
  functionality: string;
  description: string;
  category: string;
  tags: string[];
}

export async function GET(request: NextRequest) {
  const productAlphaData = await getProductAlphaMockData();

  if (productAlphaData instanceof Error) {
    return NextResponse.json(
      { error: 'Failed to fetch component data', details: String(productAlphaData) },
      { status: 500 }
    );
  }

  const responseWithSpecs = productAlphaData.components.map((comp) => ({
    ...comp,
    description: comp.description || '',
  }));

  return NextResponse.json({
    assembly: productAlphaData,
    components: responseWithSpecs,
  });
}

async function getProductAlphaMockData() {
  try {
    const data = {
      id: 'product-alpha-v1',
      slug: 'product-alpha',
      name: 'Product Alpha Prototype v3',
      description: 'Motor mount prototype - complete BOM with all components documented',
      version: 'v3.0',
      sourceDocumentId: 'mock-doc-1',
      syncTimestamp: new Date().toISOString(),

      components: [
        {
          cadComponentId: 'baseplate',
          displayName: 'Base Plate',
          partNumber: 'BM-001-ALU6061',
          category: 'structural',
          status: 'published' as const,
          shortDescription: 'Base mounting plate for equipment interface.',
          description: 'Primary base plate bolted to equipment floor surface using M6 hardware. Features four 8mm clearance holes at corners (45mm x 32mm spacing pattern). Includes central Ø10mm cable conduit passing through assembly center point. Machined from 6061-T6 aluminum stock, anodized for corrosion resistance.',
          functionality: 'Serves as the structural foundation and mounting interface for all major assemblies. Provides rigid connection to equipment surface while maintaining alignment tolerances of ±0.25mm across full span.',
          material: '6061-T6 Aluminum',
          weightKg: 0.285,
          tags: ['structural', 'mounting', 'baseplate'],
        },
        {
          cadComponentId: 'dc-motor-compact',
          displayName: 'Compact DC Motor Assembly',
          partNumber: 'DCM-A37B-HS180',
          category: 'motors',
          status: 'published' as const,
          shortDescription: '40mm diameter hollow-shaft gearmotor.',
          description: '24V micro DC motor with integrated gearbox and encoder. Features 150 RPM no-load speed, ~8kg-cm continuous torque rating at nominal voltage (7x mechanical advantage versus stepper). Hollow shaft accommodates Ø3-6mm through-bolts for belt drives or cable routing.',
          functionality: 'Provides rotational drive for motor carriage mechanism with closed-loop feedback via 12-bit optical encoder giving absolute position knowledge ±0.05° repeatability at stall condition and <5% speed variation across full torque curve (8-24V operation).',
          material: 'Mixed assembly (copper windings, steel core, aluminum housing)',
          weightKg: 0.136,
          tags: ['motor', 'actuator', 'brushed-dc', 'hollow-shaft'],
        },
        {
          cadComponentId: 'motor-bracket',
          displayName: 'Motor Mount Bracket',
          partNumber: 'BM-002-A315X8L',
          category: 'brackets',
          status: 'published' as const,
          shortDescription: 'L-shaped adjustable bracket with 2-axis tilt capability.',
          description: 'Precision-machined L-shaped bracket connecting motor to sliding carriage rails. Features dual Ø8mm pivot points enabling ±15° pitch adjustment and rotational alignment of motor axis relative to rail normal. Includes spring-loaded pin-lock retaining mechanism for field setup without tools.',
          functionality: 'Supports 3-axis fine-tuning of motor position during assembly verification (y-z translation, rotation about x). The sliding carriage interface uses hardened Ø8mm pins running in linear bearings achieving <50μm repeatability across full adjustment range while maintaining perpendicularity tolerance of ±20 arc-minutes.',
          material: '6082-T6 Aluminum machined from stock',
          weightKg: 0.175,
          tags: ['bracket', 'adjustable', 'motor-mounting'],
        },
      ],

      occurrences: [
        { id: 'occ-baseplate-inst-1', cadComponentId: 'baseplate', parentId: null, transform: new Float32Array([1,0,0,0,0,1,0,0,0,0,1,-60]), isSuppressed: false },
        { id: 'occ-motor-inst-1', cadComponentId: 'dc-motor-compact', parentId: null, transform: new Float32Array([1,0,0,0,0,1,0,0,0,0,1,-50]), isSuppressed: false },
        { id: 'occ-bracket-inst-1', cadComponentId: 'motor-bracket', parentId: null, transform: new Float32Array([1,0,0,0,0,1,0,0,0,0,1,-70]), isSuppressed: false },
      ],
    };

    return data;
  } catch (err) {
    console.error('Error generating mock data:', err);
    throw new Error('Failed to generate product alpha mock data');
  }
}

export async function POST(request: NextRequest) {
  const body = await request.json();

  // In production this would store to database or object storage
  return NextResponse.json({
    success: true,
    message: 'Seed operation completed',
    timestamp: new Date().toISOString(),
  });
}
