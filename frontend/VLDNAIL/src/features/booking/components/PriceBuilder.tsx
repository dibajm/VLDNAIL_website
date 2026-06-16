import type { BookingState, DesignTier } from "../booking.types";
import { services, designTiers, extras as extrasData } from "../data/pricing";
import { calculateTotal } from "../utils/calculatePrice";
import Stepper from "../../../Components/ui/Stepper";
import Button from "../../../Components/ui/Button";

type Props = {
  booking: BookingState;
  onUpdate: (partial: Partial<BookingState>) => void;
  onNext: () => void;
  onBack: () => void;
};

const STEPS = [
  { label: "Choose a Service" },
  { label: "Select Date & Time" },
  { label: "Customize & Price" },
];

export default function PriceBuilder({ booking, onUpdate, onNext, onBack }: Props) {
  const { service, serviceType, designTier, extras } = booking;
  const def = services.find((s) => s.name === service);
  const basePrice =
    def
      ? serviceType === "newSet"
        ? def.newSetPrice
        : def.fillPrice
      : null;

  const total = calculateTotal(service, serviceType, designTier, extras);

  function toggleExtra(id: string) {
    const next = extras.includes(id)
      ? extras.filter((e) => e !== id)
      : [...extras, id];
    onUpdate({ extras: next });
  }

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-[#F5DDE1] px-6 py-14 md:px-16">
        <div className="mx-auto max-w-7xl">
          <p className="font-serif text-xs uppercase tracking-[0.35em] text-[#D37E90]">
            Book Your Appointment ✦
          </p>
          <h1 className="mt-2 font-serif text-5xl text-[#2f2024] md:text-6xl">
            Customize & Price
          </h1>
          <p className="mt-4 max-w-sm text-sm leading-6 text-[#6e565d]">
            Build your perfect set.
            <br />
            Select your options below to see the estimated price.
          </p>
        </div>
        <div className="pointer-events-none absolute -right-8 -top-4 h-48 w-48 rounded-full bg-[#D37E90]/10" />
      </section>

      <div className="mx-auto max-w-7xl space-y-6 px-6 py-10 md:px-16">
        {/* Selected service bar */}
        <div className="flex flex-col items-start justify-between gap-4 rounded-2xl border border-[#F5DDE1] bg-white/70 px-6 py-4 sm:flex-row sm:items-center">
          <div>
            <p className="text-xs text-[#7c6269]">Your Selected Service</p>
            <p className="mt-0.5 font-serif text-lg text-[#2f2024]">{service}</p>
            <div className="mt-1 flex items-center gap-4 text-xs text-[#7c6269]">
              {basePrice !== null && total ? (
                <span className="text-[#D37E90]">
                  ${basePrice}–${basePrice + (def?.newSetPrice ?? 0) - (def?.newSetPrice ?? 0) + (designTiers.find(t => t.tier === 4)?.priceMax ?? 0)}
                </span>
              ) : (
                basePrice !== null && <span className="text-[#D37E90]">${basePrice}</span>
              )}
              <span>◷ {def?.duration}</span>
            </div>
          </div>
          <button
            onClick={onBack}
            className="flex items-center gap-1 text-xs text-[#D37E90] hover:underline"
          >
            ↩ Change Service
          </button>
        </div>

        {/* Stepper */}
        <div className="rounded-2xl border border-[#F5DDE1] bg-white/60 px-6 py-4">
          <Stepper steps={STEPS} currentStep={3} />
        </div>

        <div className="rounded-2xl border border-[#F5DDE1] bg-white/60 p-6 md:p-8">
          {/* 1. Designs */}
          <div className="mb-8">
            <div className="mb-4 flex items-center gap-2">
              <h3 className="font-serif text-lg text-[#2f2024]">1. Designs</h3>
              <span className="text-[#D37E90]">✦</span>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {designTiers.map((tier) => {
                const isSelected = designTier === tier.tier;
                return (
                  <button
                    key={tier.tier}
                    onClick={() =>
                      onUpdate({
                        designTier: isSelected ? null : (tier.tier as DesignTier),
                      })
                    }
                    className={`rounded-xl border p-4 text-left transition ${
                      isSelected
                        ? "border-[#D37E90] bg-[#F5DDE1]"
                        : "border-[#F5DDE1] bg-white hover:border-[#D37E90]"
                    }`}
                  >
                    <div className="mb-1 flex items-center justify-between">
                      <span className="text-xs font-semibold uppercase tracking-wider text-[#D37E90]">
                        {tier.label}
                      </span>
                      {isSelected && (
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#D37E90] text-xs text-white">
                          ✓
                        </span>
                      )}
                    </div>
                    <p className="font-semibold text-[#2f2024]">{tier.range}</p>
                    <p className="mt-1 text-xs leading-4 text-[#7c6269]">
                      {tier.examples}
                    </p>
                  </button>
                );
              })}
            </div>

            <p className="mt-3 flex items-center gap-1 text-xs text-[#7c6269]">
              <span className="text-[#D37E90]">ℹ</span>
              Prices may vary based on design complexity.
            </p>
          </div>

          <div className="my-6 h-px bg-[#F5DDE1]" />

          {/* 2. Extras */}
          <div>
            <div className="mb-4 flex items-center gap-2">
              <h3 className="font-serif text-lg text-[#2f2024]">2. Extras</h3>
              <span className="text-[#D37E90]">✦</span>
            </div>

            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {extrasData.map((extra) => {
                const checked = extras.includes(extra.id);
                return (
                  <label
                    key={extra.id}
                    className={`flex cursor-pointer items-center justify-between rounded-xl border px-4 py-3 transition ${
                      checked
                        ? "border-[#D37E90] bg-[#F5DDE1]"
                        : "border-[#F5DDE1] bg-white hover:border-[#D37E90]"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleExtra(extra.id)}
                        className="h-4 w-4 accent-[#D37E90]"
                      />
                      <span className="text-sm text-[#2f2024]">{extra.label}</span>
                    </div>
                    <span className="text-sm font-medium text-[#D37E90]">
                      {extra.display}
                    </span>
                  </label>
                );
              })}
            </div>

            <p className="mt-3 flex items-center gap-1 text-xs text-[#7c6269]">
              <span className="text-[#D37E90]">ℹ</span>
              Extras are optional and can be added to your total.
            </p>
          </div>
        </div>

        {/* Estimated Total bar */}
        <div className="flex flex-col items-start justify-between gap-4 rounded-2xl border border-[#F5DDE1] bg-white/70 px-6 py-4 sm:flex-row sm:items-center">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-serif text-lg text-[#2f2024]">
                Estimated Total
              </h3>
              <span className="text-[#D37E90]">✦</span>
            </div>
            {total ? (
              <p className="mt-1 font-serif text-2xl font-semibold text-[#D37E90]">
                ${total.min}
                {total.min !== total.max && ` – $${total.max}`}
              </p>
            ) : (
              basePrice !== null && (
                <p className="mt-1 font-serif text-2xl font-semibold text-[#D37E90]">
                  ${basePrice}
                </p>
              )
            )}
            <p className="text-xs text-[#7c6269]">
              Final price may vary based on design complexity and nail condition.
            </p>
          </div>
          <Button onClick={onNext}>Continue →</Button>
        </div>

        {/* CTA banner */}
        <div className="rounded-2xl bg-[#F5DDE1] px-8 py-6">
          <div className="flex items-center gap-4">
            <span className="text-2xl text-[#D37E90]">✦</span>
            <div>
              <p className="font-serif text-base text-[#D37E90]">
                You're one step closer!
              </p>
              <p className="text-sm text-[#6e565d]">
                We can't wait to create something beautiful for you.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
