import { ArrowRight, Check } from "lucide-react";
import { Reveal, SectionShell } from "./Section";

const STEPS = ["Raw SAR Image", "Noise Reduction", "Vessel Extraction", "Dark Vessel Detection"];

const BULLETS = [
  "Speckle noise reduction on raw SAR tiles",
  "Vessel extraction with CFAR + deep detection",
  "Coastline masking to suppress false positives",
  "Dark vessel flagging where AIS is absent",
];

function Tile({ variant }: { variant: number }) {
  return (
    <div className="relative aspect-[4/3] w-full overflow-hidden rounded-md border border-border bg-[oklch(0.22_0_0)]">
      <svg viewBox="0 0 80 60" className="h-full w-full" aria-hidden="true">
        {Array.from({ length: variant < 2 ? 220 : 40 }).map((_, i) => {
          const x = (i * 37.7) % 80;
          const y = (i * 21.3) % 60;
          return (
            <circle
              key={i}
              cx={x}
              cy={y}
              r={variant === 0 ? 0.7 : 0.5}
              fill="white"
              opacity={variant === 0 ? 0.5 : 0.25}
            />
          );
        })}
        {variant >= 2 &&
          [
            [22, 20],
            [48, 34],
            [60, 16],
          ].map(([x, y], i) => (
            <rect
              key={i}
              x={x}
              y={y}
              width={9}
              height={7}
              fill="none"
              stroke="var(--alert)"
              strokeWidth={0.8}
            />
          ))}
        {variant === 3 && (
          <g fill="white">
            <rect x={26} y={30} width={30} height={5} rx={1.5} />
            <rect x={36} y={24} width={10} height={6} rx={1} />
          </g>
        )}
      </svg>
    </div>
  );
}

export function DetectionSection() {
  return (
    <SectionShell
      id="detection"
      globe="detection"
      index="03"
      title="AI Processing & Detection"
      description="Transforming raw satellite returns into meaningful, verifiable vessel insight."
    >
      <Reveal>
        <div className="glass-card p-5">
          <div className="flex items-end gap-2">
            {STEPS.map((s, i) => (
              <div key={s} className="flex flex-1 items-end gap-2">
                <div className="min-w-0 flex-1">
                  <Tile variant={i} />
                  <p className="mt-2 truncate text-[11px] text-muted-foreground">{s}</p>
                </div>
                {i < STEPS.length - 1 && (
                  <ArrowRight className="mb-6 size-4 shrink-0 text-muted-foreground" />
                )}
              </div>
            ))}
          </div>
        </div>
      </Reveal>

      <ul className="mt-6 grid gap-2.5 sm:grid-cols-2">
        {BULLETS.map((b, i) => (
          <Reveal key={b} delay={0.1 + i * 0.05}>
            <li className="flex items-start gap-2.5 text-sm text-muted-foreground">
              <Check className="mt-0.5 size-4 shrink-0 text-accent" />
              {b}
            </li>
          </Reveal>
        ))}
      </ul>
    </SectionShell>
  );
}
