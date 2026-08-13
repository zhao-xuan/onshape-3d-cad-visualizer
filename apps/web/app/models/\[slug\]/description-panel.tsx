'use client';

import { ComponentDefinition, ComponentSpecifications } from '@shared/types';

interface DescriptionPanelProps {
  selectedComponent: ComponentDefinition | null;
  description: string;
  dimensions?: any;
  tags?: string[];
  onClose: () => void;
}

export default function DescriptionPanel({ 
  selectedComponent, 
  description,
  dimensions,
  tags = [],
  onClose,
}: DescriptionPanelProps) {
  if (!selectedComponent && !description) return null;

  const productName = (dimensions?.productName as string) || 'Product Alpha Assembly';

  return (
    <aside className="w-full lg:w-96 bg-background border-l border-border flex-shrink-0 overflow-y-auto">
      {/* Header */}
      <div className="p-6 border-b border-border space-y-4">
        <h2 className="text-2xl font-bold tracking-tight">Component Specifications</h2>
        
        {selectedComponent?.displayName && (
          <>
            <span className={`inline-block px-3 py-1 rounded-lg text-xs font-semibold uppercase tracking-wider ${
              selectedComponent.status === 'published' 
                ? 'bg-green-50 text-green-700 border border-green-200'
                : 'bg-yellow-50 text-yellow-800 border border-yellow-200'
            }`}>
              {selectedComponent.status}
            </span>
            
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <span 
                  key={tag}
                  className="px-2 py-1 rounded bg-muted text-sm"
                >
                  #{tag}
                </span>
              ))}
            </div>

            {selectedComponent.partNumber && (
              <p className="text-sm font-mono text-slate-500">
                Part #:{selectedComponent.partNumber}
              </p>
            )}
          </>
        )}

        <button 
          onClick={onClose}
          className="w-full mt-2 px-4 py-2 bg-destructive text-destructive-foreground rounded-md hover:bg-destructive/90 transition-colors"
        >
          Close Component Details
        </button>
      </div>

      {/* Body */}
      <div className="p-6 space-y-6">
        {description && (
          <section>
            <h3 className="text-lg font-semibold mb-2">Description</h3>
            <p className={`leading-relaxed ${!selectedComponent ? 'italic text-slate-500' : ''}`}>
              {description}
            </p>
            
            {!selectedComponent && (
              <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="text-sm font-medium mb-1 text-blue-800">Needs Review</h4>
                <p className="text-xs text-blue-700">
                  This component description requires admin review and publication before viewers.
                </p>
              </div>
            )}
          </section>
        )}

        {selectedComponent?.displayName && (
          <>
            {/* Dimensions */}
            {(dimensions as any)?.CAD || selectedComponent.category ? (
              <section className="space-y-4">
                {(dimensions as any)?.CAD && (
                  <div>
                    <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                      CAD-Derived Dimensions
                      
                    </h3>
                    <dl className={`grid grid-cols-3 gap-4 text-sm ${!dimensions ? 'opacity-50' : ''}`}>
                      {(dimensions as any)?.CAD?.boundingDimensions && (
                        <>
                          <div>
                            <dt className="text-slate-600 text-xs mb-1">Width</dt>
                            <dd className="font-mono font-medium">{(dimensions as any).CAD.boundingDimensions.width}mm</dd>
                          </div>
                          <div>
                            <dt className="text-slate-600 text-xs mb-1">Height</dt>
                            <dd className="font-mono font-medium">{(dimensions as any).CAD.boundingDimensions.height}mm</dd>
                          </div>
                          <div>
                            <dt className="text-slate-600 text-xs mb-1">Depth</dt>
                            <dd className="font-mono font-medium">{(dimensions as any).CAD.boundingDimensions.depth}mm</dd>
                          </div>
                        </>
                      )}
                    </dl>
                  </div>
                )}

                {selectedComponent.category && (
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Category</h3>
                    <span className={`inline-block px-3 py-1 rounded bg-muted text-sm ${!selectedComponent?.category ? 'opacity-50' : ''}`}>
                      {selectedComponent.category}
                    </span>
                  </div>
                )}

              
              </section>
            ) : (
              <section className="space-y-4">
                {(dimensions as any)?.CAD && (
                  <div>
                    <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                      CAD-Derived Dimensions
                    
