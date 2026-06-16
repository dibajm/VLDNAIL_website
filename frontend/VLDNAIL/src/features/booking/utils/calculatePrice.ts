import type { ServiceName, ServiceType, DesignTier } from "../booking.types";
import { services, designTiers, extras as extrasData } from "../data/pricing";

export function calculateTotal(
  service: ServiceName | null,
  serviceType: ServiceType,
  designTier: DesignTier | null,
  selectedExtras: string[]
): { min: number; max: number } | null {
  if (!service) return null;

  const def = services.find((s) => s.name === service);
  if (!def) return null;

  const base = serviceType === "newSet" ? def.newSetPrice : def.fillPrice;
  if (base === null) return null;

  let min = base;
  let max = base;

  if (designTier !== null) {
    const tier = designTiers.find((t) => t.tier === designTier);
    if (tier) {
      min += tier.priceMin;
      max += tier.priceMax;
    }
  }

  for (const id of selectedExtras) {
    const extra = extrasData.find((e) => e.id === id);
    if (extra) {
      min += extra.priceMin;
      max += extra.priceMax;
    }
  }

  return { min, max };
}

export function formatDateDisplay(dateStr: string): string {
  const date = new Date(dateStr + "T12:00:00");
  return date.toLocaleDateString("en-CA", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
