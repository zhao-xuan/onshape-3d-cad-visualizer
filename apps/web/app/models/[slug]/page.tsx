'use client';

import { useState } from 'react';
import CanvasViewer from './canvas-viewer';

export default function ModelsPage() {
  const [selectedComponentId, setSelectedComponentId] = useState<string | null>(null);
  
  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="border-b border-border">
        <div className="max-w-7xl mx-auto px-6 py-12 md:py-20">
          <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl text-balance mb-4">
            Product Alpha Assembly Demo
          </h1>
          <p className="text-muted-foreground max-w-[700px] mb-8">
            Initial demo assembly with base components for platform testing. Version: REV-001
          </p>
          
          {/* Stats from mock data */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6 mt-12 max-w-[700px]">
          <div className="space-y-1 text-center">
            <div className="text-3xl font-bold">{4}</div>
            <div className="text-xs text-muted-foreground uppercase tracking-wider">components</div>
          </div>
        </div>

        </div>
      </section>

      {/* Main canvas viewer */}
    <section id="viewer" className="max-w-full mx-auto px-6 py-12 md:py-20">
  <h2 className="text-3xl font-bold tracking-tighter mb-8">Interactive Canvas</h2>
  
  <CanvasViewer 
    selectedComponentId={selectedComponentId}
    onSelectComponent={(id, name) => setSelectedComponentId(id)}
  />

</section >

      {/* Component list */}
      <section className="max-w-5xl mx-auto px-6 pb-12 md:pb-24">
        <h2 className="text-3xl font-bold tracking-tighter mb-8">Component List (4)</h2>
        
        <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
          {[
            { displayName: "Base Plate", partNumber: "BP-001A", category: "Enclosure", status: 'In Production', description: "Main structural base plate." },
            { displayName: "Front Bracket", partNumber: "FB-O21", category: "Fixture", status: 'New Product', description: "Precision mounting bracket" },
            { displayName: "PCB Main Board", partNumber: "PCBA-301A", category: "Electronics", status: 'In Development', description: "Primary signal processing board" },
            { displayName: "Motor Hub M2", partNumber: "HA-1507X1", category: "Mechanical System", status: 'In Production', description: "Actuator component" }
          ].map((component, i) => (
            <article 
              key={i}
              onClick={() => setSelectedComponentId(component.displayName)}
              className="group rounded-lg border bg-background p-6 shadow-sm transition-all hover:shadow-md cursor-pointer"
            >
              <h3 className="text-xl font-bold text-balance group-hover:text-primary transition-colors">
                {component.partNumber && <span className="mr-2 px-2 py-1 rounded bg-muted text-sm">{component.partNumber}</span>}
                {component.displayName}
              </h3>
              
              <p className="text-muted-foreground mt-2 mb-4 line-clamp-2">
                {component.description || 'No description provided yet.'}
              </p>

              <div className="flex flex-wrap gap-3 text-xs/relaxed">
                {component.status && (
                  <span className={`px-2 py-1 rounded-full ${
                    component.status === 'In Production' ? 'bg-green-50 text-green-700 border border-green-200' : 
                    component.status === 'New Product' ? 'bg-blue-50 text-blue-700 border border-blue-200' : 
                    'bg-yellow-50 text-yellow-800'
                  }`}>
                    {component.status}
                  </span>
                )}
                <div className="px-2 py-1 rounded bg-muted">
                  {component.category}&nbsp;({i+1}) tags
                </div>
              </div>
            </article>
          ))}

        </div>
      </section>

{selectedComponentId && (
  <aside 
    className="fixed right-8 bottom-8 top-auto w-full max-w-[42ch] h-[75vh] bg-background rounded-lg border shadow-md flex flex-col p-6 overflow-y-auto z-50"
  >
    <div className="flex justify-between items-start mb-4">
      <h3 className="text-xl font-bold">{selectedComponentId}</h3>
      <button 
        onClick={() => setSelectedComponentId(null)} 
        className="p-1 hover:bg-muted rounded text-sm"
      >✕</button>
    </div>

{['PCB Main Board'].includes(selectedComponentId) && (
  <>
    <h4 className="font-bold text-xs uppercase tracking-wider mt-6">Product Attributes</h4>
    {selectedComponentId === 'PCB Main Board' && (<span>Signal processing and actuation board with motor firmware embedded.</span>)}
  </>
)}

  </aside>
)}
    </div>
  );
}
