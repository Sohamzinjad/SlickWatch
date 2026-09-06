import { ArrowRight, FileText, MapPinned } from "lucide-react";
import { Reveal, SectionShell } from "./Section";

const CARDS = [
  {
    icon: FileText,
    title: "MARPOL Forensic Dossier",
    items: ["Vessel identity", "Detection timeline", "Evidence package", "Violation assessment"],
  },
  {
    icon: MapPinned,
    title: "C2 Intercept Map",
    items: ["Intercept coordinates", "Tactical route", "Command network", "Real-time vectoring"],
  },
];

export function IntelligenceSection() {
  return (
    <SectionShell
      id="action"
      globe="action"
      index="05"
      title="Actionable Intelligence"
      description="Turning fused insight into real-world enforcement outcomes."
    >
      <div className="grid gap-3 sm:grid-cols-2">
        {CARDS.map((c, i) => (
          <Reveal key={c.title} delay={i * 0.08}>
            <div className="glass-card h-full px-5 py-5 transition-transform hover:-translate-y-1">
              <c.icon className="size-5 text-accent" strokeWidth={1.6} />
              <p className="mt-3 text-sm font-semibold">{c.title}</p>
              <ul className="mt-3 space-y-1.5">
                {c.items.map((it) => (
                  <li key={it} className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span className="size-1 rounded-full bg-muted-foreground" />
                    {it}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        ))}
      </div>

      <Reveal delay={0.2}>
        <a
          href="#hero"
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3.5 text-sm font-medium text-primary-foreground transition-transform hover:scale-[1.03]"
        >
          See It In Action <ArrowRight className="size-4" />
        </a>
      </Reveal>
    </SectionShell>
  );
}
