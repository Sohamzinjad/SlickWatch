import { ArrowRight, Globe2 } from "lucide-react";

const LINKS = [
  { label: "Home", href: "#hero" },
  { label: "Technology", href: "#inputs" },
  { label: "SAR Detection", href: "#detection" },
  { label: "Physics Fusion", href: "#fusion" },
  { label: "Live C2 Console", href: "/c2" },
];

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-background/80 backdrop-blur-xl">
      <nav className="mx-auto flex h-16 max-w-[1400px] items-center justify-between px-6 lg:px-10">
        <a href="#hero" className="flex items-center gap-2.5">
          <Globe2 className="size-6 text-primary" strokeWidth={1.5} />
          <span className="text-lg font-bold tracking-tight">seaLens</span>
        </a>
        <ul className="hidden items-center gap-8 md:flex">
          {LINKS.map((l) => (
            <li key={l.label}>
              <a
                href={l.href}
                className={`text-sm font-medium transition-colors ${
                  l.href === "/c2"
                    ? "font-bold text-primary hover:text-primary/80"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>
        <a
          href="/c2"
          className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition-transform hover:scale-[1.03]"
        >
          Launch C2 Platform <ArrowRight className="size-4" />
        </a>
      </nav>
    </header>
  );
}
