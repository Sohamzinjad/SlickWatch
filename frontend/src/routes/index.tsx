import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { HeroSection } from "@/components/HeroSection";
import { InputSection } from "@/components/InputSection";
import { DetectionSection } from "@/components/DetectionSection";
import { FusionSection } from "@/components/FusionSection";
import { IntelligenceSection } from "@/components/IntelligenceSection";
import { GlobeScene, type GlobeState } from "@/components/GlobeScene";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Sealens — AI-Powered Maritime Domain Awareness" },
      {
        name: "description",
        content:
          "Sealens fuses Sentinel-1 SAR, AIS feeds and environmental data to detect dark vessels, assess risk and deliver actionable maritime intelligence.",
      },
      { property: "og:title", content: "Sealens — AI-Powered Maritime Domain Awareness" },
      {
        property: "og:description",
        content:
          "Detect suspicious maritime activity, identify dark vessels and generate actionable intelligence from satellite and AIS data.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const STATES: GlobeState[] = ["hero", "inputs", "detection", "fusion", "action"];
const LABELS: Record<GlobeState, string> = {
  hero: "Global Overview",
  inputs: "Ingest",
  detection: "Detection",
  fusion: "Analysis",
  action: "Action",
};

function Index() {
  const [state, setState] = useState<GlobeState>("hero");

  useEffect(() => {
    const sections = Array.from(
      document.querySelectorAll<HTMLElement>("[data-globe-section]"),
    ).filter((el) => STATES.includes(el.dataset['globeSection'] as GlobeState));

    const onScroll = () => {
      const mid = window.innerHeight / 2;
      let current: GlobeState = "hero";
      for (const el of sections) {
        const rect = el.getBoundingClientRect();
        if (rect.top <= mid) current = el.dataset['globeSection'] as GlobeState;
      }
      setState(current);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const activeIndex = STATES.indexOf(state);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="mx-auto grid max-w-[1400px] grid-cols-1 gap-10 px-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:px-10">
        <div>
          <HeroSection />
          <InputSection />
          <DetectionSection />
          <FusionSection />
          <IntelligenceSection />
        </div>

        {/* Sticky globe: the storytelling column */}
        <div className="pointer-events-none sticky top-16 hidden h-[calc(100vh-4rem)] lg:block">
          <div className="relative h-full">
            <div className="absolute inset-0 overflow-hidden">
              <GlobeScene state={state} />
            </div>

            {/* progress rail */}
            <div className="absolute right-0 top-1/2 flex -translate-y-1/2 flex-col items-center gap-3">

              <span className="num-label">{String(activeIndex + 1).padStart(2, "0")}</span>
              {STATES.map((s, i) => (
                <span
                  key={s}
                  className="rounded-full transition-all duration-500"
                  style={{
                    width: i === activeIndex ? 8 : 5,
                    height: i === activeIndex ? 8 : 5,
                    backgroundColor:
                      i === activeIndex ? "var(--foreground)" : "var(--color-border)",
                  }}
                />
              ))}
              <span className="num-label mt-1 max-w-[4.5rem] text-center leading-tight">
                {LABELS[state]}
              </span>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
