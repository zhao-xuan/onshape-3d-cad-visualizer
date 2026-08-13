'use client';
'use client';
import { useState } from 'react';
import Link from 'next/link';

const mockModels = [
  { slug: 'ac-motor', name: 'Simple AC Motor Assembly', description: 'Industrial single-phase motor assembly' },
  { slug: 'product-alpha', name: 'Product Alpha Prototype', description: 'Motor mount prototype v3 - complete BOM' },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <header className="border-b border-slate-800 px-8 py-6">
        <h1 className="text-3xl font-bold">Onshape CAD Visualizer</h1>
        <p className="text-slate-400 mt-2">Interactive 3D assembly viewer & component database</p>
      </header>

      <main className="px-8 py-12 max-w-5xl mx-auto">
        <section className="mb-12 text-center">
          <h2 className="text-xl font-semibold mb-4">Featured Assemblies</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {mockModels.map((m) => (
              <Link key={m.slug} href={`/models/${m.slug}`}>
                <article className="bg-slate-900 border border-slate-800 rounded-xl p-6 hover:border-indigo-500 transition-colors">
                  <h3 className="text-lg font-semibold mb-2">{m.name}</h3>
                  <p className="text-sm text-slate-400">{m.description}</p>
                </article>
              </Link>
            ))}
          </div>
        </section>

        <section className="bg-indigo-600/20 border border-indigo-500/30 rounded-xl p-8">
          <h3 className="text-lg font-semibold mb-3 text-indigo-400">Features</h3>
          <ul className="grid md:grid-cols-2 gap-3 text-sm text-slate-300">
            <li>✓ Interactive Three.js 3D viewer</li>
            <li>✓ Component selection & highlighting</li>
            <li>✓ Detailed engineering specs panel</li>
            <li>✓ Mock CAD provider (Dev)</li>
          </ul>
        </section>
      </main>

      <footer className="border-t border-slate-800 px-8 py-6 text-center text-sm text-slate-500">
        Built with Next.js, React Three Fiber & @react-three/drei
      </footer>
    </div>
  );
}
