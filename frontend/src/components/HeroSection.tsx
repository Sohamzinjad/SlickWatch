import { motion } from "motion/react";
import { ArrowRight, Play } from "lucide-react";
import { GlobeScene } from "./GlobeScene";

const METRICS = [
  { value: "200M+", label: "km² Ocean Coverage" },
  { value: "Real-time", label: "Vessel Tracking" },
  { value: "AI-Powered", label: "Actionable Analytics" },
];

export function HeroSection() {
  return (
    <section
      id="hero"
      data-globe-section="hero"
      className="flex min-h-screen flex-col justify-center py-28"
    >
      <motion.p
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="eyebrow"
      >
        AI-Powered Maritime Domain Awareness
      </motion.p>

      <motion.h1
        initial={{ opacity: 0, y: 26 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
        className="mt-5 text-balance text-5xl font-semibold leading-[0.98] tracking-[-0.04em] md:text-6xl lg:text-7xl"
      >
        See a Safer
        <br />
        Ocean World
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.16 }}
        className="mt-6 max-w-xl text-pretty text-base leading-relaxed text-muted-foreground md:text-lg"
      >
        Sealens integrates Sentinel-1 SAR imagery, AIS feeds and environmental intelligence to
        detect suspicious maritime activity, identify dark vessels, assess risk and generate
        actionable maritime insight.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.24 }}
        className="mt-9 flex flex-wrap items-center gap-3"
      >
        <a
          href="#inputs"
          className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3.5 text-sm font-medium text-primary-foreground transition-transform hover:scale-[1.03]"
        >
          Explore Platform <ArrowRight className="size-4" />
        </a>
        <a
          href="#detection"
          className="glass-card inline-flex items-center gap-2.5 rounded-full px-6 py-3.5 text-sm font-medium transition-transform hover:scale-[1.03]"
        >
          <Play className="size-4" /> Watch Demo
        </a>
      </motion.div>

      <motion.dl
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.32 }}
        className="mt-14 grid max-w-xl grid-cols-3 divide-x divide-border border-t border-border pt-6"
      >
        {METRICS.map((m) => (
          <div key={m.value} className="px-4 first:pl-0">
            <dt className="text-xl font-semibold tracking-tight md:text-2xl">{m.value}</dt>
            <dd className="mt-1 text-xs text-muted-foreground">{m.label}</dd>
          </div>
        ))}
      </motion.dl>

      <div className="pointer-events-none mt-12 h-[52vh] min-h-[320px] overflow-hidden lg:hidden">
        <GlobeScene state="hero" />
      </div>
    </section>
  );
}
