import { Github, Globe2, Linkedin, Twitter } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border bg-background/80">
      <div className="mx-auto flex max-w-[1400px] flex-col items-center gap-6 px-6 py-10 md:flex-row md:justify-between lg:px-10">
        <div className="flex items-center gap-2.5">
          <Globe2 className="size-5" strokeWidth={1.5} />
          <span className="font-semibold tracking-tight">Sealens</span>
        </div>
        <ul className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
          {["Home", "Technology", "Data", "Impact", "About"].map((l) => (
            <li key={l}>
              <a href="#hero" className="transition-colors hover:text-foreground">
                {l}
              </a>
            </li>
          ))}
        </ul>
        <div className="flex items-center gap-4 text-muted-foreground">
          <a href="#hero" aria-label="GitHub" className="transition-colors hover:text-foreground">
            <Github className="size-4.5" />
          </a>
          <a href="#hero" aria-label="LinkedIn" className="transition-colors hover:text-foreground">
            <Linkedin className="size-4.5" />
          </a>
          <a href="#hero" aria-label="X" className="transition-colors hover:text-foreground">
            <Twitter className="size-4.5" />
          </a>
        </div>
      </div>
    </footer>
  );
}
