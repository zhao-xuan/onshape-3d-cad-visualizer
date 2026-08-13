import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  try {
    return NextResponse.json({
      id: 'demo-model-1',
      name: 'Product Alpha - Demo Assembly',
      slug: 'product-alpha',
      description: 'A demonstration assembly with multiple components.',
      cadModelId: null,
      metadata: {},
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error fetching model:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const slug = `model-${Date.now()}`;
    
    return NextResponse.json({
      id: `${slug}-id`,
      name: body.name || 'New Model',
      slug,
      message: 'Demo model created in mock mode',
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating model:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
