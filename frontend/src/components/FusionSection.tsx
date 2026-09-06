import {
  Cloud,
  Database,
  Fingerprint,
  GitBranch,
  Link2,
  Radar,
  Ship,
  ShieldAlert,
  Cpu,
} from "lucide-react";
import { Reveal, SectionShell } from "./Section";

const INPUTS = [
  { icon: Radar, label: "Detection Data" },
  { icon: Ship, label: "AIS History" },
  { icon: Cloud, label: "Weather Data" },
  { icon: Database, label: "Ship History" },
];

const OUTPUTS = [
  { icon: Fingerprint, label: "Identity Probability" },
  { icon: GitBranch, label: "Drift Backtracking" },
  { icon: ShieldAlert, label: "Risk Assessment" },
  { icon: Link2, label: "Track Association" },
];

export function FusionSection() {
  return (
    <SectionShell
      id="fusion"
      globe="fusion"
      index="04"
      title="AI Fusion & Analytics"
      description="Correlating every signal to understand the bigger operational picture."
    >
      <div className="grid items-center gap-4 md:grid-cols-[1fr_auto_1fr]">
        <div className="space-y-2.5">
          {INPUTS.map((c, i) => (
            <Reveal key={c.label} delay={i * 0.06}>
              <div className="glass-card flex items-center gap-3 px-4 py-3 text-sm">
                <c.icon className="size-4 text-muted-foreground" strokeWidth={1.6} />
                {c.label}
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.2}>
          <div className="glass-card flex flex-col items-center gap-2 px-6 py-7 text-center">
            <Cpu className="size-7 text-accent" strokeWidth={1.4} />
            <p className="text-sm font-semibold leading-tight">
              AI Fusion
              <br />
              Engine
            </p>
          </div>
        </Reveal>

        <div className="space-y-2.5">
          {OUTPUTS.map((c, i) => (
            <Reveal key={c.label} delay={0.26 + i * 0.06}>
              <div className="glass-card flex items-center gap-3 px-4 py-3 text-sm">
                <c.icon className="size-4 text-accent" strokeWidth={1.6} />
                {c.label}
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </SectionShell>
  );
}
