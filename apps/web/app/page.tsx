export default function Home() {
  return (
    <main className="max-w-7xl mx-auto px-6 py-12 md:py-20">
      <div className="text-center space-y-8 max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl text-balance">
          Onshape 3D CAD Visualizer
        </h1>
        <p className="mx-auto max-w-[700px] text-lg md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed text-muted-foreground">
          A professional platform for managing and presenting interactive Onshape 3D CAD assemblies with specification databases, change tracking, and an intuitive admin interface.
        </p>

        {/* Feature grid */}
        <div className="grid gap-8 mt-16 md:grid-cols-3">
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-balance leading-tight sm:text-xl lg:text-2xl">Interactive Viewer</h3>
            <p className="text-sm/relaxed text-muted-foreground">
              Real-time WebGL rendering of CAD assemblies with part selection, search, and detailed specifications. Built on Three.js for professional quality visualization.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-bold text-balance leading-tight sm:text-xl lg:text-2xl">Component Database</h3>
            <p className="text-sm/relaxed text-muted-foreground">
              Comprehensive component metadata management with human-authored descriptions, dimensions, and custom specifications independent of CAD structure changes.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-bold text-balance leading-tight sm:text-xl lg:text-2xl">Change Tracking</h3>
            <p className="text-sm/relaxed text-muted-foreground">
              Version comparison for CAD revisions with automatic detection of new, changed, and removed components. Review workflow keeps human content separate from geometry updates.
            </p>
          </div>

        </div>

        <div className="flex flex-col sm:flex-row gap-4 pt-8 justify-center">
          <a 
            href="/models/product-alpha"
            className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-6 text-sm font-semibold text-primary-foreground shadow transition-colors hover:bg-muted/90"
          >
            View Demo Model
          </a>
          
          <a 
            href="/admin"
            className="inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-4 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            Admin CMS Preview
          </a>
        </div>
      </div>
    </main>
  );
}
