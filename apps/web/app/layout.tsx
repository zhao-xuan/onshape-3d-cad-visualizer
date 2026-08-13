import './globals.css';
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Onshape CAD Visualizer',
  description: 'Web platform for managing and presenting Onshape 3D CAD assemblies with interactive viewer, spec database, and admin CMS.',
};

// UI components - minimal button styles via Tailwind
const Button = ({ children, variant = 'primary', className = '', ...props }: any) => {
  const base = 'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50';
  
  const variants = {
    primary: 'bg-primary text-primary-foreground hover:bg-muted',
    outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
    ghost: 'hover:bg-muted hover:text-accent-foreground',
    link: 'text-primary underline-offset-4 hover:underline'
  };

  const size = 'h-10 px-4 py-2';
  
  return (
    <Link href={props.href || '#'} className={`${base} ${variants[variant as keyof typeof variants]} ${size} ${className}`} {...props}>
      {children}
    </Link>
  );
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-background text-foreground antialiased">
        <header className="border-b border-border px-6 py-4 flex items-center justify-between sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="flex items-center gap-8">
            <Link href="/" className="text-lg font-semibold tracking-tight">
              Onshape Visualizer
            </Link>
            <nav className="hidden md:block text-sm">
              {['Home', 'Models', 'Admin'].map((item, i) => (
                <Link 
                  key={item}
                  href={`/${item.toLowerCase()}`}
                  className={`ml-6 ${i === 0 ? '' : 'text-muted-foreground'} hover:text-foreground transition-colors`}
                >
                  {item}
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" href="/admin">Admin</Button>
            <Button href="/models">View Models</Button>
          </div>
        </header>
        {children}
      </body>
    </html>
  );
}
