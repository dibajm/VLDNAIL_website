import type { ServiceName } from "../booking.types";

export type ServiceDef = {
  name: ServiceName;
  newSetPrice: number | null;
  fillPrice: number | null;
  duration: string;
  description: string;
};

export const services: ServiceDef[] = [
  {
    name: "Shellac",
    newSetPrice: 40,
    fillPrice: null,
    duration: "1.5 hrs",
    description: "Classic gel polish finish",
  },
  {
    name: "Overlay",
    newSetPrice: 55,
    fillPrice: 45,
    duration: "2.0 hrs",
    description: "Strength & shine, no extensions",
  },
  {
    name: "Short",
    newSetPrice: 60,
    fillPrice: 50,
    duration: "2.5 hrs",
    description: "Acrylic / Polygel / Hard Gel",
  },
  {
    name: "Medium",
    newSetPrice: 70,
    fillPrice: 60,
    duration: "3.0 hrs",
    description: "Acrylic / Polygel / Hard Gel",
  },
  {
    name: "Long",
    newSetPrice: 80,
    fillPrice: 70,
    duration: "3.5 hrs",
    description: "Acrylic / Polygel / Hard Gel",
  },
  {
    name: "XL",
    newSetPrice: 90,
    fillPrice: 80,
    duration: "4.0 hrs",
    description: "Acrylic / Polygel / Hard Gel",
  },
  {
    name: "Press-ons",
    newSetPrice: null,
    fillPrice: null,
    duration: "1–2 weeks",
    description: "Custom handmade — contact for pricing",
  },
];

export const designTiers = [
  {
    tier: 1 as const,
    label: "Tier 1",
    range: "+$10–$15",
    priceMin: 10,
    priceMax: 15,
    examples: "French, Solid Colour, Chrome, Cateye, Simple Aura, Basic Nail Art",
  },
  {
    tier: 2 as const,
    label: "Tier 2",
    range: "+$20–$25",
    priceMin: 20,
    priceMax: 25,
    examples: "French Designs, Blooming Gel, Plaid, Rhinestone Accents, Medium Designs",
  },
  {
    tier: 3 as const,
    label: "Tier 3",
    range: "+$30–$35",
    priceMin: 30,
    priceMax: 35,
    examples: "Multi-Art, Layered Designs, Detailed Designs",
  },
  {
    tier: 4 as const,
    label: "Tier 4",
    range: "+$40–$50",
    priceMin: 40,
    priceMax: 50,
    examples: "Complex Nail Art, Full Bling, 3D Characters",
  },
];

export const extras = [
  { id: "fills_past_4", label: "Fills past 4 weeks", priceMin: 7, priceMax: 7, display: "+$7" },
  { id: "broken_nails", label: "2 Broken Nails", priceMin: 5, priceMax: 5, display: "+$5" },
  { id: "acrylic_removal", label: "Acrylic Removal", priceMin: 15, priceMax: 20, display: "+$15–$20" },
  { id: "shellac_removal", label: "Shellac Removal", priceMin: 10, priceMax: 10, display: "+$10" },
  { id: "acrylic_ombre", label: "Acrylic Ombre", priceMin: 17.5, priceMax: 17.5, display: "+$17.5" },
  { id: "encapsulation", label: "Encapsulation", priceMin: 15, priceMax: 15, display: "+$15" },
];
