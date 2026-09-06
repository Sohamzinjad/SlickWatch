import { Activity, BarChart3, Clock, Radar, Ship, Waves, Maximize } from "lucide-react";
import { Reveal, SectionShell } from "./Section";

const CARDS = [
  { icon: Radar, title: "Sentinel-1 SAR", body: "High-resolution radar imagery, all weather" },
  { icon: Ship, title: "AIS Vessel Feeds", body: "Live vessel identity and tracking data" },
  { icon: Waves, title: "Wind & Current Data", body: "Environmental drift modelling (MetOcean)" },
  { icon: BarChart3, title: "Environmental Data", body: "Additional open ocean data sources" },
];

const STATS = [
  { icon: Activity, value: "12M+", label: "AIS messages / day" },
  { icon: Maximize, value: "500K km²", label: "Area scanned" },
  { icon: Clock, value: "24/7", label: "Global monitoring" },
];

export function InputSection() {
  return (
    <SectionShell
      id="inputs"
      globe="inputs"
      index="02"
      title="Multi-Source Inputs"
      description="Combining diverse maritime datasets into a single unified operational picture."
    >
      <div className="grid gap-3 sm:grid-cols-2">
        {CARDS.map((c, i) => (
          <Reveal key={c.title} delay={i * 0.06}>
            <div className="glass-card h-full px-5 py-4 transition-transform hover:-translate-y-1">
              <c.icon className="size-5 text-accent" strokeWidth={1.6} />
              <p className="mt-3 text-sm font-semibold">{c.title}</p>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{c.body}</p>
            </div>
          </Reveal>
        ))}
      </div>

      <div className="mt-3 grid gap-3 sm:grid-cols-3">
        {STATS.map((s, i) => (
          <Reveal key={s.label} delay={0.24 + i * 0.06}>
            <div className="glass-card flex items-center gap-3 px-5 py-4">
              <s.icon className="size-4.5 text-muted-foreground" strokeWidth={1.6} />
              <div>
                <p className="text-base font-semibold tracking-tight">{s.value}</p>
                <p className="text-xs text-muted-foreground">{s.label}</p>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </SectionShell>
  );
}
