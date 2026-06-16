import { useState } from "react";
import Navbar from "../Components/layout/Navbar";
import Footer from "../Components/layout/Footer";
import Button from "../Components/ui/Button";

// ─── Swap these imports with real images once added to src/assets/gallery/ ───
// import tier1_1 from "../assets/gallery/tier1-1.jpg"; etc.

const filterTabs = [
  "All",
  "Acrylic",
  "Gel / BIAB & Shellac",
  "Tier 1",
  "Tier 2",
  "Tier 3",
  "Tier 4",
  "Shapes",
];

const acrylicSubTabs = ["Short", "Medium", "Long"];

const designTiers = [
  {
    label: "Tier 1",
    range: "+$10–$15",
    desc: "French, Solid Colour, Chrome, Cateye, Simple Aura, Basic Nail Art",
    count: 6,
  },
  {
    label: "Tier 2",
    range: "+$20–$25",
    desc: "French Designs, Blooming Gel, Plaid, Rhinestone Accents, Medium Designs",
    count: 6,
  },
  {
    label: "Tier 3",
    range: "+$30–$35",
    desc: "Multi-Art, Layered Designs, Detailed Designs",
    count: 6,
  },
  {
    label: "Tier 4",
    range: "+$40–$50",
    desc: "Complex Nail Art, Full Bling, 3D Characters",
    count: 6,
  },
];

const nailShapes = [
  {
    name: "Square",
    svg: (
      <svg width="28" height="40" viewBox="0 0 28 40" fill="none">
        <rect x="4" y="4" width="20" height="32" rx="1.5" stroke="#D37E90" strokeWidth="1.5" fill="none" />
        <line x1="4" y1="10" x2="24" y2="10" stroke="#D37E90" strokeWidth="1" strokeDasharray="2 2" />
      </svg>
    ),
  },
  {
    name: "Squoval",
    svg: (
      <svg width="28" height="40" viewBox="0 0 28 40" fill="none">
        <path d="M4 6 Q4 4 6 4 L22 4 Q24 4 24 6 L24 34 Q24 36 22 36 L6 36 Q4 36 4 34 Z" stroke="#D37E90" strokeWidth="1.5" fill="none" />
        <line x1="4" y1="11" x2="24" y2="11" stroke="#D37E90" strokeWidth="1" strokeDasharray="2 2" />
      </svg>
    ),
  },
  {
    name: "Round",
    svg: (
      <svg width="28" height="40" viewBox="0 0 28 40" fill="none">
        <path d="M4 10 L4 34 Q4 36 6 36 L22 36 Q24 36 24 34 L24 10 Q24 4 14 4 Q4 4 4 10 Z" stroke="#D37E90" strokeWidth="1.5" fill="none" />
        <line x1="4" y1="14" x2="24" y2="14" stroke="#D37E90" strokeWidth="1" strokeDasharray="2 2" />
      </svg>
    ),
  },
  {
    name: "Oval",
    svg: (
      <svg width="28" height="40" viewBox="0 0 28 40" fill="none">
        <path d="M4 20 Q4 4 14 4 Q24 4 24 20 L24 30 Q24 36 14 36 Q4 36 4 30 Z" stroke="#D37E90" strokeWidth="1.5" fill="none" />
        <line x1="4" y1="18" x2="24" y2="18" stroke="#D37E90" strokeWidth="1" strokeDasharray="2 2" />
      </svg>
    ),
  },
  {
    name: "Almond",
    svg: (
      <svg width="28" height="40" viewBox="0 0 28 40" fill="none">
        <path d="M4 22 Q4 4 14 4 Q24 4 24 22 Q24 34 14 36 Q4 34 4 22 Z" stroke="#D37E90" strokeWidth="1.5" fill="none" />
        <line x1="4" y1="19" x2="24" y2="19" stroke="#D37E90" strokeWidth="1" strokeDasharray="2 2" />
      </svg>
    ),
  },
  {
    name: "Coffin",
    svg: (
      <svg width="28" height="40" viewBox="0 0 28 40" fill="none">
        <path d="M4 4 L24 4 L20 32 L8 32 Z" stroke="#D37E90" strokeWidth="1.5" fill="none" strokeLinejoin="round" />
        <line x1="4" y1="10" x2="24" y2="10" stroke="#D37E90" strokeWidth="1" strokeDasharray="2 2" />
      </svg>
    ),
  },
  {
    name: "Stiletto",
    svg: (
      <svg width="28" height="40" viewBox="0 0 28 40" fill="none">
        <path d="M4 4 L24 4 L14 36 Z" stroke="#D37E90" strokeWidth="1.5" fill="none" strokeLinejoin="round" />
        <line x1="4" y1="10" x2="24" y2="10" stroke="#D37E90" strokeWidth="1" strokeDasharray="2 2" />
      </svg>
    ),
  },
];

function PlaceholderImg({ className = "" }: { className?: string }) {
  return (
    <div className={`rounded-xl bg-gradient-to-br from-[#F5DDE1] to-[#ECC8CE] ${className}`} />
  );
}

function SectionHeader({
  title,
  badge,
  subTabs,
  activeSubTab,
  onSubTabChange,
  showViewAll = true,
}: {
  title: string;
  badge?: string;
  subTabs?: string[];
  activeSubTab?: string;
  onSubTabChange?: (t: string) => void;
  showViewAll?: boolean;
}) {
  return (
    <div className="mb-4 flex items-center justify-between">
      <div className="flex flex-wrap items-center gap-3">
        <h2 className="font-serif text-xl text-[#2f2024]">{title}</h2>
        {badge && (
          <span className="rounded-full bg-[#F5DDE1] px-3 py-0.5 text-xs font-semibold text-[#D37E90]">
            {badge}
          </span>
        )}
        {subTabs && (
          <div className="flex gap-3">
            {subTabs.map((t) => (
              <button
                key={t}
                onClick={() => onSubTabChange?.(t)}
                className={`text-xs transition ${
                  activeSubTab === t
                    ? "text-[#D37E90] underline underline-offset-4"
                    : "text-[#6e565d] hover:text-[#D37E90]"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        )}
      </div>
      {showViewAll && (
        <button className="shrink-0 text-xs text-[#D37E90] hover:underline">
          View all →
        </button>
      )}
    </div>
  );
}

export default function Gallery() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [acrylicSubTab, setAcrylicSubTab] = useState("Short");

  return (
    <main className="min-h-screen bg-[#FAEDEF] text-[#2f2024]">
      <Navbar />

      {/* Page Header */}
      <section className="bg-[#F5DDE1] px-6 py-10 md:px-16">
        <div className="mx-auto max-w-7xl">
          <p className="font-serif text-xs uppercase tracking-[0.3em] text-[#D37E90]">
            My work
          </p>
          <h1 className="mt-1 font-serif text-5xl text-[#2f2024]">Gallery</h1>
          <p className="mt-3 max-w-xs text-sm leading-6 text-[#6e565d]">
            Explore our designs, styles, and finishes created with passion and
            precision.
          </p>
        </div>
      </section>

      {/* Filter Tabs */}
      <div className="sticky top-0 z-10 border-b border-[#F5DDE1] bg-[#FAEDEF] px-6 md:px-16">
        <div className="mx-auto flex max-w-7xl gap-1 overflow-x-auto py-3 [scrollbar-width:none]">
          {filterTabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveFilter(tab)}
              className={`whitespace-nowrap rounded-full px-4 py-1.5 text-xs font-medium transition ${
                activeFilter === tab
                  ? "bg-[#D37E90] text-white"
                  : "text-[#D37E90] hover:bg-[#F5DDE1]"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="mx-auto max-w-7xl space-y-14 px-6 py-10 md:px-16">
        {/* Acrylic Nails */}
        <section>
          <SectionHeader
            title="Acrylic Nails"
            subTabs={acrylicSubTabs}
            activeSubTab={acrylicSubTab}
            onSubTabChange={setAcrylicSubTab}
          />
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
            {Array.from({ length: 5 }).map((_, i) => (
              <PlaceholderImg key={i} className="aspect-square" />
            ))}
          </div>
        </section>

        {/* Gel / BIAB & Shellac — combined */}
        <section>
          <SectionHeader title="Gel / BIAB & Shellac" />
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <PlaceholderImg key={i} className="aspect-square" />
            ))}
          </div>
        </section>

        {/* Designs — Tier 1–4 */}
        <section>
          <div className="mb-6 flex items-center gap-2">
            <h2 className="font-serif text-2xl text-[#2f2024]">Designs</h2>
            <span className="text-[#D37E90]">✦</span>
          </div>

          <div className="space-y-10">
            {designTiers.map((tier) => (
              <div key={tier.label}>
                {/* Tier header */}
                <div className="mb-4 flex flex-col gap-0.5 sm:flex-row sm:items-center sm:gap-4">
                  <div className="flex items-center gap-3">
                    <h3 className="font-serif text-lg text-[#2f2024]">
                      {tier.label}
                    </h3>
                    <span className="rounded-full bg-[#D37E90] px-3 py-0.5 text-xs font-semibold text-white">
                      {tier.range}
                    </span>
                  </div>
                  <p className="text-xs text-[#7c6269]">{tier.desc}</p>
                </div>

                {/* 3×2 photo grid — replace PlaceholderImg with <img> once photos are added */}
                <div className="grid grid-cols-3 gap-3">
                  {Array.from({ length: tier.count }).map((_, i) => (
                    <PlaceholderImg key={i} className="aspect-square" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Nail Shapes — horizontal scroll */}
        <section>
          <div className="mb-6 flex items-center gap-2">
            <h2 className="font-serif text-2xl text-[#2f2024]">Nail Shapes</h2>
            <span className="text-[#D37E90]">✦</span>
          </div>

          {/* Horizontal scrollable strip */}
          <div className="flex gap-4 overflow-x-auto pb-2 [scrollbar-width:none]">
            {nailShapes.map((shape) => (
              <div
                key={shape.name}
                className="flex shrink-0 flex-col items-center gap-3 rounded-2xl border border-[#F5DDE1] bg-white/70 p-4"
                style={{ width: 130 }}
              >
                {/* Nail photo placeholder — swap for <img> once photos are added */}
                <div className="w-full overflow-hidden rounded-xl bg-gradient-to-b from-[#F5DDE1] to-[#ECC8CE]" style={{ height: 170 }} />
                <p className="text-sm font-medium text-[#2f2024]">{shape.name}</p>
                {shape.svg}
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* CTA Banner */}
      <section className="mx-6 mb-10 rounded-2xl bg-[#F5DDE1] px-8 py-7 md:mx-16">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-5 md:flex-row">
          <div className="flex items-center gap-5">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-[#D37E90]/30 bg-white/60 text-xl text-[#D37E90]">
              ◎
            </div>
            <div>
              <h3 className="font-serif text-lg text-[#2f2024]">
                Ready for your next design?
              </h3>
              <p className="text-xs text-[#6e565d]">
                Book your appointment today and let's create something beautiful
                together.
              </p>
            </div>
          </div>
          <Button to="/booking">Book Now →</Button>
        </div>
      </section>

      <Footer />
    </main>
  );
}
