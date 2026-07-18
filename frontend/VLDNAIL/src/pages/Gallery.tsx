import { useState } from "react";
import Navbar from "../Components/layout/Navbar";
import Footer from "../Components/layout/Footer";
import Button from "../Components/ui/Button";

import shapeSquare   from "../assets/gallery/shapes/Square.png";
import shapeSquoval  from "../assets/gallery/shapes/Squoval.png";
import shapeRound    from "../assets/gallery/shapes/Round.png";
import shapeOval     from "../assets/gallery/shapes/Oval.png";
import shapeAlmond   from "../assets/gallery/shapes/Almond.png";
import shapeCoffin   from "../assets/gallery/shapes/Coffin.png";
import shapeStiletto from "../assets/gallery/shapes/Stilleto.png";

import t1_1 from "../assets/gallery/tier1-1.jpg";
import t1_2 from "../assets/gallery/tier1-2.jpg";
import t1_3 from "../assets/gallery/tier1-3.jpg";
import t1_4 from "../assets/gallery/tier1-4.jpg";
import t1_5 from "../assets/gallery/tier1-5.jpg";
import t1_6 from "../assets/gallery/tier1-6.jpg";

import t2_1 from "../assets/gallery/tier2-1.jpg";
import t2_2 from "../assets/gallery/tier2-2.jpg";
import t2_3 from "../assets/gallery/tier2-3.jpg";
import t2_4 from "../assets/gallery/tier2-4.jpg";
import t2_5 from "../assets/gallery/tier2-5.jpg";
import t2_6 from "../assets/gallery/tier2-6.jpg";

import t3_1 from "../assets/gallery/tier3-1.jpg";
import t3_2 from "../assets/gallery/tier3-2.jpg";
import t3_3 from "../assets/gallery/tier3-3.jpg";
import t3_4 from "../assets/gallery/tier3-4.jpg";
import t3_5 from "../assets/gallery/tier3-5.jpg";
import t3_6 from "../assets/gallery/tier3-6.jpg";

import t4_1 from "../assets/gallery/tier4-1.jpg";
import t4_2 from "../assets/gallery/tier4-2.jpg";
import t4_3 from "../assets/gallery/tier4-3.jpg";
import t4_4 from "../assets/gallery/tier4-4.jpg";
import t4_5 from "../assets/gallery/tier4-5.jpg";
import t4_6 from "../assets/gallery/tier4-6.jpg";

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
    photos: [t1_1, t1_2, t1_3, t1_4, t1_5, t1_6],
  },
  {
    label: "Tier 2",
    range: "+$20–$25",
    desc: "French Designs, Blooming Gel, Plaid, Rhinestone Accents, Medium Designs",
    photos: [t2_1, t2_2, t2_3, t2_4, t2_5, t2_6],
  },
  {
    label: "Tier 3",
    range: "+$30–$35",
    desc: "Multi-Art, Layered Designs, Detailed Designs",
    photos: [t3_1, t3_2, t3_3, t3_4, t3_5, t3_6],
  },
  {
    label: "Tier 4",
    range: "+$40–$50",
    desc: "Complex Nail Art, Full Bling, 3D Characters",
    photos: [t4_1, t4_2, t4_3, t4_4, t4_5, t4_6],
  },
];

const nailShapes = [
  { name: "Square",   img: shapeSquare },
  { name: "Squoval",  img: shapeSquoval },
  { name: "Round",    img: shapeRound },
  { name: "Oval",     img: shapeOval },
  { name: "Almond",   img: shapeAlmond },
  { name: "Coffin",   img: shapeCoffin },
  { name: "Stiletto", img: shapeStiletto },
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

const tabToId: Record<string, string> = {
  "All": "",
  "Acrylic": "section-acrylic",
  "Gel / BIAB & Shellac": "section-gel-shellac",
  "Tier 1": "section-tier-1",
  "Tier 2": "section-tier-2",
  "Tier 3": "section-tier-3",
  "Tier 4": "section-tier-4",
  "Shapes": "section-shapes",
};

export default function Gallery() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [acrylicSubTab, setAcrylicSubTab] = useState("Short");

  function handleTabClick(tab: string) {
    setActiveFilter(tab);
    if (tab === "All") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      document.getElementById(tabToId[tab])?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

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
              onClick={() => handleTabClick(tab)}
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
        <section id="section-acrylic">
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
        <section id="section-gel-shellac">
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
              <div key={tier.label} id={`section-tier-${tier.label.split(" ")[1]}`}>
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

                <div className="grid grid-cols-3 gap-3">
                  {tier.photos.map((src, i) => (
                    <img
                      key={i}
                      src={src}
                      alt={`${tier.label} example ${i + 1}`}
                      className="aspect-square w-full rounded-xl object-cover"
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Nail Shapes — horizontal scroll */}
        <section id="section-shapes">
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
                <img
                  src={shape.img}
                  alt={shape.name}
                  className="w-full rounded-xl object-cover"
                  style={{ height: 170 }}
                />
                <p className="text-sm font-medium text-[#2f2024]">{shape.name}</p>
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
