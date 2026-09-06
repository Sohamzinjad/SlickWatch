import { motion, AnimatePresence } from "motion/react";
import { AlertTriangle, MapPin, Satellite, Ship } from "lucide-react";

/* ---------------------------------------------------------------------------
 * Flat 2D vector globe. Continents are rough equirectangular outlines that get
 * projected onto a repeating strip and clipped to the sphere, which keeps the
 * whole thing lightweight SVG while still reading as a rotating earth.
 * ------------------------------------------------------------------------- */

const SIZE = 620;
const CX = SIZE / 2;
const CY = SIZE / 2;
const R = 232;
const STRIP_W = R * 2 * 1.9;
const STRIP_H = R * 2;

type Coord = [number, number];

const CONTINENTS: Coord[][] = [
  // Africa
  [
    [-17, 15],
    [0, 25],
    [10, 37],
    [32, 31],
    [43, 12],
    [51, 12],
    [42, -2],
    [40, -15],
    [32, -26],
    [25, -34],
    [18, -35],
    [12, -18],
    [8, 4],
    [-8, 4],
  ],
  // Eurasia
  [
    [-10, 36],
    [0, 44],
    [10, 44],
    [25, 40],
    [36, 36],
    [45, 42],
    [60, 45],
    [70, 42],
    [76, 32],
    [80, 22],
    [88, 20],
    [92, 22],
    [98, 14],
    [105, 10],
    [110, 20],
    [120, 32],
    [127, 35],
    [130, 43],
    [142, 45],
    [140, 52],
    [160, 60],
    [178, 66],
    [178, 73],
    [140, 76],
    [100, 77],
    [60, 72],
    [35, 70],
    [28, 71],
    [10, 64],
    [5, 58],
    [-5, 50],
    [-10, 43],
  ],
  // North America
  [
    [-168, 66],
    [-150, 60],
    [-130, 54],
    [-124, 40],
    [-117, 32],
    [-105, 22],
    [-97, 18],
    [-90, 21],
    [-82, 23],
    [-80, 26],
    [-75, 35],
    [-70, 44],
    [-60, 47],
    [-55, 52],
    [-65, 60],
    [-80, 70],
    [-100, 72],
    [-125, 70],
    [-140, 70],
  ],
  // South America
  [
    [-80, 8],
    [-70, 11],
    [-60, 10],
    [-50, 0],
    [-35, -6],
    [-38, -15],
    [-48, -25],
    [-58, -35],
    [-65, -45],
    [-72, -52],
    [-75, -45],
    [-72, -35],
    [-70, -20],
    [-78, -5],
  ],
  // Australia
  [
    [113, -22],
    [122, -18],
    [130, -12],
    [142, -11],
    [146, -19],
    [153, -27],
    [150, -37],
    [140, -38],
    [130, -32],
    [115, -34],
  ],
  // Greenland
  [
    [-45, 60],
    [-20, 70],
    [-25, 82],
    [-50, 83],
    [-58, 75],
  ],
  // Madagascar
  [
    [43, -12],
    [50, -16],
    [48, -25],
    [44, -20],
  ],
  // Japan
  [
    [130, 32],
    [140, 37],
    [145, 44],
    [138, 36],
    [132, 31],
  ],
  // Indonesia / Borneo
  [
    [95, 5],
    [118, 6],
    [130, -1],
    [140, -3],
    [128, -8],
    [110, -8],
    [98, -2],
  ],
];

function toStrip([lon, lat]: Coord) {
  const x = ((lon + 180) / 360) * STRIP_W;
  const y = ((90 - lat) / 180) * STRIP_H;
  return `${x.toFixed(1)},${y.toFixed(1)}`;
}

const LAND_PATHS = CONTINENTS.map((poly) => `M${poly.map(toStrip).join("L")}Z`);

function WorldStrip({ offset }: { offset: number }) {
  return (
    <g transform={`translate(${offset}, ${CY - STRIP_H / 2})`}>
      {LAND_PATHS.map((d, i) => (
        <path key={i} d={d} fill="var(--land)" />
      ))}
    </g>
  );
}

export type GlobeState = "hero" | "inputs" | "detection" | "fusion" | "action";

const VIEW: Record<GlobeState, { scale: number; x: number; y: number }> = {
  hero: { scale: 1, x: 0, y: 0 },
  inputs: { scale: 1.06, x: -10, y: 0 },
  detection: { scale: 1.35, x: -30, y: -30 },
  fusion: { scale: 1.5, x: -45, y: -55 },
  action: { scale: 1.8, x: -60, y: -80 },
};

function OrbitAndSatellite({ active }: { active: boolean }) {
  return (
    <g opacity={active ? 1 : 0.25} style={{ transition: "opacity .6s" }}>
      <ellipse
        cx={CX}
        cy={CY}
        rx={R + 46}
        ry={R * 0.62}
        fill="none"
        stroke="var(--land-deep)"
        strokeWidth={1}
        strokeDasharray="4 7"
        opacity={0.5}
        transform={`rotate(-22 ${CX} ${CY})`}
      />
      <g>
        <animateMotion dur="18s" repeatCount="indefinite" rotate="auto">
          <mpath href="#sealens-orbit" />
        </animateMotion>
        <g transform="translate(-11,-7)">
          <rect x={7} y={2} width={9} height={10} rx={1.5} fill="var(--foreground)" />
          <rect x={0} y={4} width={6} height={6} rx={1} fill="var(--land-deep)" />
          <rect x={17} y={4} width={6} height={6} rx={1} fill="var(--land-deep)" />
        </g>
      </g>
      <path
        id="sealens-orbit"
        d={`M ${CX - (R + 46)} ${CY} a ${R + 46} ${R * 0.62} 0 1 1 ${(R + 46) * 2} 0 a ${R + 46} ${R * 0.62} 0 1 1 -${(R + 46) * 2} 0`}
        fill="none"
        stroke="none"
        transform={`rotate(-22 ${CX} ${CY})`}
      />
    </g>
  );
}

function Marker({
  x,
  y,
  tone = "neutral",
  pulse = false,
}: {
  x: number;
  y: number;
  tone?: "neutral" | "alert" | "accent";
  pulse?: boolean;
}) {
  const color =
    tone === "alert" ? "var(--alert)" : tone === "accent" ? "var(--accent)" : "var(--foreground)";
  return (
    <g transform={`translate(${x},${y})`}>
      {pulse && (
        <circle
          r={9}
          fill="none"
          stroke={color}
          strokeWidth={1.4}
          style={{
            transformOrigin: "center",
            animation: "sealens-pulse-ring 2.2s ease-out infinite",
          }}
        />
      )}
      <circle r={4.5} fill={color} />
      <circle r={8} fill="none" stroke={color} strokeWidth={1} opacity={0.4} />
    </g>
  );
}

export function GlobeScene({ state }: { state: GlobeState }) {
  const view = VIEW[state];
  const zoomed = state === "detection" || state === "fusion" || state === "action";

  return (
    <div className="relative h-full w-full select-none">
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        animate={{ scale: view.scale, x: view.x, y: view.y }}
        transition={{ type: "spring", stiffness: 42, damping: 18, mass: 1.1 }}
      >
        <svg
          viewBox={`0 0 ${SIZE} ${SIZE}`}
          className="h-full w-full max-h-[78vh]"
          role="img"
          aria-label="Animated vector globe showing maritime monitoring"
        >
          <defs>
            <clipPath id="sealens-sphere">
              <circle cx={CX} cy={CY} r={R} />
            </clipPath>
            <radialGradient id="sealens-shade" cx="35%" cy="30%" r="80%">
              <stop offset="0%" stopColor="white" stopOpacity="0.6" />
              <stop offset="55%" stopColor="white" stopOpacity="0.05" />
              <stop offset="100%" stopColor="oklch(0.35 0 0)" stopOpacity="0.28" />
            </radialGradient>
            <linearGradient id="sealens-beam" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.35" />
              <stop offset="100%" stopColor="var(--accent)" stopOpacity="0.02" />
            </linearGradient>
          </defs>

          {/* soft ground shadow */}
          <ellipse cx={CX} cy={CY + R + 26} rx={R * 0.72} ry={12} fill="oklch(0 0 0 / 0.08)" />

          <circle cx={CX} cy={CY} r={R} fill="var(--ocean)" />

          <g clipPath="url(#sealens-sphere)">
            <g
              style={{
                animation: "sealens-globe-rot 90s linear infinite",
              }}
            >
              <animateTransform
                attributeName="transform"
                type="translate"
                from={`${-STRIP_W} 0`}
                to="0 0"
                dur="90s"
                repeatCount="indefinite"
              />
              <WorldStrip offset={CX - STRIP_W / 2} />
              <WorldStrip offset={CX - STRIP_W / 2 + STRIP_W} />
            </g>

            {/* graticule */}
            {[0.35, 0.62, 0.85].map((k) => (
              <g key={k}>
                <ellipse
                  cx={CX}
                  cy={CY}
                  rx={R}
                  ry={R * k}
                  fill="none"
                  stroke="white"
                  strokeWidth={0.8}
                  opacity={0.35}
                />
              </g>
            ))}
            <line
              x1={CX - R}
              y1={CY}
              x2={CX + R}
              y2={CY}
              stroke="white"
              strokeWidth={0.9}
              opacity={0.4}
            />
            {[0.4, 0.75].map((k) => (
              <g key={k}>
                <ellipse
                  cx={CX}
                  cy={CY}
                  rx={R * k}
                  ry={R}
                  fill="none"
                  stroke="white"
                  strokeWidth={0.8}
                  opacity={0.3}
                />
              </g>
            ))}

            <circle cx={CX} cy={CY} r={R} fill="url(#sealens-shade)" />

            {/* AIS shipping routes */}
            {state === "hero" && (
              <g opacity={0.85}>
                {[
                  `M${CX - 190} ${CY + 60} Q ${CX - 40} ${CY - 20} ${CX + 150} ${CY + 40}`,
                  `M${CX - 120} ${CY - 90} Q ${CX + 20} ${CY - 40} ${CX + 190} ${CY - 70}`,
                  `M${CX - 60} ${CY + 140} Q ${CX + 60} ${CY + 90} ${CX + 170} ${CY + 130}`,
                ].map((d, i) => (
                  <path
                    key={i}
                    d={d}
                    fill="none"
                    stroke="var(--accent)"
                    strokeWidth={1.4}
                    strokeDasharray="7 9"
                    opacity={0.65}
                    style={{ animation: `sealens-dash ${16 + i * 4}s linear infinite` }}
                  />
                ))}
              </g>
            )}

            {/* scanning cone */}
            {state === "inputs" && (
              <motion.g
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                style={{ transformOrigin: `${CX}px ${CY - R - 20}px` }}
              >
                <motion.g
                  animate={{ rotate: [-14, 14, -14] }}
                  transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
                  style={{ transformOrigin: `${CX + 20}px ${CY - R - 40}px` }}
                >
                  <path
                    d={`M${CX + 20} ${CY - R - 40} L ${CX - 90} ${CY + 130} L ${CX + 120} ${CY + 130} Z`}
                    fill="url(#sealens-beam)"
                    stroke="var(--accent)"
                    strokeWidth={0.8}
                    strokeOpacity={0.35}
                  />
                </motion.g>
              </motion.g>
            )}

            {/* vessels */}
            {(state === "inputs" || state === "detection" || state === "fusion") && (
              <g>
                <Marker x={CX - 70} y={CY + 50} />
                <Marker x={CX + 30} y={CY + 96} />
                <Marker x={CX + 92} y={CY - 6} />
              </g>
            )}

            {state === "detection" && (
              <g>
                <rect
                  x={CX - 18}
                  y={CY - 8}
                  width={54}
                  height={44}
                  fill="none"
                  stroke="var(--alert)"
                  strokeWidth={1.6}
                />
                <Marker x={CX + 9} y={CY + 14} tone="alert" pulse />
              </g>
            )}

            {state === "fusion" && (
              <g>
                <path
                  d={`M${CX - 120} ${CY + 90} Q ${CX - 30} ${CY + 20} ${CX + 10} ${CY + 12}`}
                  fill="none"
                  stroke="var(--land-deep)"
                  strokeWidth={1.6}
                  strokeDasharray="6 6"
                />
                <path
                  d={`M${CX + 10} ${CY + 12} Q ${CX + 80} ${CY - 30} ${CX + 140} ${CY - 80}`}
                  fill="none"
                  stroke="var(--alert)"
                  strokeWidth={1.6}
                  strokeDasharray="8 6"
                  style={{ animation: "sealens-dash 9s linear infinite" }}
                />
                {[0, 1, 2, 3].map((i) => (
                  <path
                    key={i}
                    d={`M${CX - 90 + i * 60} ${CY + 130} q 22 -14 44 0`}
                    fill="none"
                    stroke="var(--accent)"
                    strokeWidth={1}
                    opacity={0.5}
                  />
                ))}
                <Marker x={CX + 10} y={CY + 12} tone="alert" pulse />
              </g>
            )}

            {state === "action" && (
              <g>
                <path
                  d={`M${CX - 90} ${CY + 110} Q ${CX - 20} ${CY + 40} ${CX + 40} ${CY - 10}`}
                  fill="none"
                  stroke="var(--accent)"
                  strokeWidth={1.8}
                  strokeDasharray="9 7"
                  style={{ animation: "sealens-dash 6s linear infinite" }}
                />
                <Marker x={CX - 90} y={CY + 110} tone="accent" />
                <Marker x={CX + 40} y={CY - 10} tone="alert" pulse />
              </g>
            )}
          </g>

          {/* sphere rim */}
          <circle
            cx={CX}
            cy={CY}
            r={R}
            fill="none"
            stroke="var(--land-deep)"
            strokeWidth={1}
            opacity={0.45}
          />
          <circle
            cx={CX}
            cy={CY}
            r={R + 14}
            fill="none"
            stroke="var(--land-deep)"
            strokeWidth={0.6}
            opacity={0.2}
          />

          {!zoomed && <OrbitAndSatellite active={state === "inputs"} />}
        </svg>
      </motion.div>

      {/* Floating data cards, rendered as HTML for crisp type */}
      <AnimatePresence mode="wait">
        {state === "inputs" && (
          <FloatCard key="inputs" className="right-16 top-[28%]">
            <Satellite className="size-4 text-accent" />
            <div>
              <p className="text-sm font-semibold">Scanning</p>
              <p className="text-xs text-muted-foreground">Sentinel-1 SAR · swath 250 km</p>
            </div>
          </FloatCard>
        )}
        {state === "detection" && (
          <FloatCard key="detection" className="right-16 top-[36%]">
            <AlertTriangle className="size-4 text-destructive" />
            <div>
              <p className="text-sm font-semibold">Potential Dark Vessel</p>
              <p className="num-label">12.346° N, 72.118° E</p>
              <p className="text-xs text-muted-foreground">Confidence: 92%</p>
            </div>
          </FloatCard>
        )}
        {state === "fusion" && (
          <FloatCard key="fusion" className="right-16 top-[40%]">
            <AlertTriangle className="size-4 text-destructive" />
            <div>
              <p className="text-sm font-semibold">Risk Score: 87%</p>
              <p className="text-xs text-muted-foreground">Unknown vessel · likely drifting</p>
              <p className="text-xs text-muted-foreground">Possible illegal activity</p>
            </div>
          </FloatCard>
        )}
        {state === "action" && (
          <FloatCard key="action" className="right-16 top-[44%]">
            <MapPin className="size-4 text-accent" />
            <div>
              <p className="text-sm font-semibold">Intercept Coordinates</p>
              <p className="num-label">14.982° N, 73.421° E</p>
              <p className="text-xs text-muted-foreground">ETA: 2h 14m</p>
            </div>
          </FloatCard>
        )}
      </AnimatePresence>

      {/* legends */}
      <AnimatePresence>
        {(state === "fusion" || state === "action") && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="absolute bottom-6 right-16 space-y-1.5 text-xs text-muted-foreground"
          >
            {(state === "fusion"
              ? [
                  ["Predicted path", "var(--alert)"],
                  ["Historical track", "var(--land-deep)"],
                ]
              : [
                  ["Intercept route", "var(--accent)"],
                  ["Patrol vessel", "var(--foreground)"],
                ]
            ).map(([label, color]) => (
              <div key={label} className="flex items-center gap-2">
                <span
                  className="h-px w-6"
                  style={{ backgroundColor: color, boxShadow: `0 0 0 1px ${color}` }}
                />
                {label}
              </div>
            ))}
            <div className="flex items-center gap-2">
              <Ship className="size-3.5" /> Detected vessel
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function FloatCard({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.97 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className={`glass-float absolute flex max-w-[16rem] items-start gap-3 px-4 py-3 ${className ?? ""}`}
    >
      {children}
    </motion.div>
  );
}
