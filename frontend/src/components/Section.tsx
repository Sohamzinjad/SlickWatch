import { motion } from "motion/react";
import type { ReactNode } from "react";
import { GlobeScene, type GlobeState } from "./GlobeScene";

export function SectionShell({
  id,
  index,
  eyebrow,
  title,
  description,
  globe,
  children,
}: {
  id: string;
  index?: string;
  eyebrow?: string;
  title: string;
  description?: string;
  globe?: GlobeState;
  children?: ReactNode;
}) {
  return (
    <section
      id={id}
      data-globe-section={id}
      className="flex min-h-screen flex-col justify-center py-24"
    >
      <motion.div
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-15%" }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
        {index && (
          <div className="mb-6 flex items-center gap-4">
            <span className="num-label">{index}</span>
            <span className="h-px w-16 bg-border" />
          </div>
        )}
        {eyebrow && <p className="eyebrow mb-4">{eyebrow}</p>}
        <h2 className="text-balance text-4xl font-semibold tracking-[-0.03em] md:text-5xl">
          {title}
        </h2>
        {description && (
          <p className="mt-4 max-w-lg text-pretty text-base leading-relaxed text-muted-foreground">
            {description}
          </p>
        )}
      </motion.div>
      {globe && (
        <div className="pointer-events-none mt-8 h-[52vh] min-h-[320px] overflow-hidden lg:hidden">
          <GlobeScene state={globe} />
        </div>
      )}
      {children && <div className="mt-10">{children}</div>}
    </section>
  );
}

export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
