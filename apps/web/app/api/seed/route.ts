import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    success: true,
    message: 'Seed endpoint (mock mode)',
    note: 'Set DATABASE_URL to enable PostgreSQL seeding',
    demoModels: [
      { slug: 'product-alpha-mvp1-demo', name: 'Product Alpha Demo' }
    ]
  });
}
