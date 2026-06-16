import type { BookingState } from "../booking.types";
import { services, designTiers, extras as extrasData } from "../data/pricing";
import { calculateTotal, formatDateDisplay } from "../utils/calculatePrice";

type Props = { booking: BookingState };

export default function BookingSummary({ booking }: Props) {
  const { service, serviceType, date, time, designTier, extras } = booking;

  const def = services.find((s) => s.name === service);
  const basePrice = def
    ? serviceType === "newSet"
      ? def.newSetPrice
      : def.fillPrice
    : null;

  const tierDef = designTiers.find((t) => t.tier === designTier);
  const selectedExtras = extrasData.filter((e) => extras.includes(e.id));

  const total = calculateTotal(service, serviceType, designTier, extras);

  return (
    <div className="rounded-2xl border border-[#F5DDE1] bg-white/70 p-6">
      <div className="mb-4 flex items-center gap-2">
        <h3 className="font-serif text-lg text-[#2f2024]">2. Your Selections</h3>
        <span className="text-[#D37E90]">✦</span>
      </div>
      <p className="mb-4 text-xs text-[#7c6269]">
        Here's a summary of what you've selected.
      </p>

      {/* Service image placeholder + details */}
      <div className="mb-4 flex items-center gap-4">
        <div className="h-14 w-14 shrink-0 rounded-xl bg-gradient-to-br from-[#F5DDE1] to-[#ECC8CE]" />
        <div>
          <p className="font-medium text-[#2f2024]">{service}</p>
          <div className="mt-1 flex flex-wrap gap-3 text-xs text-[#7c6269]">
            {date && <span>▦ {formatDateDisplay(date)}</span>}
            {time && <span>◷ {time}</span>}
            {def && <span>◷ Est. {def.duration}</span>}
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {/* Base price */}
        {basePrice !== null && (
          <div className="flex justify-between text-sm">
            <span className="text-[#5f4a50]">Base ({serviceType === "newSet" ? "New Set" : "Fill"})</span>
            <span className="font-medium text-[#2f2024]">${basePrice}</span>
          </div>
        )}

        {/* Design tier */}
        {tierDef && (
          <>
            <div className="h-px bg-[#F5DDE1]" />
            <p className="text-xs font-semibold uppercase tracking-wider text-[#7c6269]">
              Design
            </p>
            <div className="flex justify-between text-sm">
              <span className="text-[#5f4a50]">{tierDef.label}</span>
              <span className="font-medium text-[#D37E90]">{tierDef.range}</span>
            </div>
          </>
        )}

        {/* Extras */}
        {selectedExtras.length > 0 && (
          <>
            <div className="h-px bg-[#F5DDE1]" />
            <p className="text-xs font-semibold uppercase tracking-wider text-[#7c6269]">
              Extras
            </p>
            {selectedExtras.map((e) => (
              <div key={e.id} className="flex justify-between text-sm">
                <span className="text-[#5f4a50]">{e.label}</span>
                <span className="font-medium text-[#D37E90]">{e.display}</span>
              </div>
            ))}
          </>
        )}

        {/* Total */}
        {total && (
          <>
            <div className="h-px bg-[#F5DDE1]" />
            <div className="flex justify-between">
              <span className="font-medium text-[#2f2024]">Estimated Total</span>
              <span className="font-semibold text-[#D37E90]">
                ${total.min}{total.min !== total.max && ` – $${total.max}`}
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
