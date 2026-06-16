import type { BookingState, ServiceName, ServiceType } from "../booking.types";
import { services } from "../data/pricing";
import { hours, bookingPolicies } from "../data/policies";
import Button from "../../../Components/ui/Button";

type Props = {
  booking: BookingState;
  onUpdate: (partial: Partial<BookingState>) => void;
  onNext: () => void;
};

function NailIcon({ name }: { name: ServiceName }) {
  const svgs: Record<ServiceName, JSX.Element> = {
    Shellac: (
      <svg width="28" height="36" viewBox="0 0 28 36" fill="none">
        <rect x="10" y="2" width="8" height="10" rx="2" stroke="#D37E90" strokeWidth="1.5" />
        <path d="M8 12 Q8 10 14 10 Q20 10 20 12 L22 30 Q22 34 14 34 Q6 34 6 30 Z" stroke="#D37E90" strokeWidth="1.5" fill="none" />
      </svg>
    ),
    Overlay: (
      <svg width="22" height="36" viewBox="0 0 22 36" fill="none">
        <path d="M3 4 Q3 2 11 2 Q19 2 19 4 L19 28 Q19 34 11 34 Q3 34 3 28 Z" stroke="#D37E90" strokeWidth="1.5" fill="none" />
        <path d="M7 10 Q11 8 15 10" stroke="#D37E90" strokeWidth="1" strokeLinecap="round" />
      </svg>
    ),
    Short: (
      <svg width="22" height="30" viewBox="0 0 22 30" fill="none">
        <path d="M3 4 L19 4 L19 22 Q19 28 11 28 Q3 28 3 22 Z" stroke="#D37E90" strokeWidth="1.5" fill="none" strokeLinejoin="round" />
      </svg>
    ),
    Medium: (
      <svg width="22" height="36" viewBox="0 0 22 36" fill="none">
        <path d="M3 4 L19 4 L19 26 Q19 34 11 34 Q3 34 3 26 Z" stroke="#D37E90" strokeWidth="1.5" fill="none" strokeLinejoin="round" />
      </svg>
    ),
    Long: (
      <svg width="22" height="42" viewBox="0 0 22 42" fill="none">
        <path d="M3 4 L19 4 L19 32 Q19 40 11 40 Q3 40 3 32 Z" stroke="#D37E90" strokeWidth="1.5" fill="none" strokeLinejoin="round" />
      </svg>
    ),
    XL: (
      <svg width="22" height="48" viewBox="0 0 22 48" fill="none">
        <path d="M3 4 L19 4 L19 38 Q19 46 11 46 Q3 46 3 38 Z" stroke="#D37E90" strokeWidth="1.5" fill="none" strokeLinejoin="round" />
      </svg>
    ),
    "Press-ons": (
      <svg width="32" height="36" viewBox="0 0 32 36" fill="none">
        <path d="M2 8 L30 8 L30 10 Q30 12 16 12 Q2 12 2 10 Z" stroke="#D37E90" strokeWidth="1.5" fill="none" />
        <path d="M6 12 L8 30 Q8 34 16 34 Q24 34 24 30 L26 12" stroke="#D37E90" strokeWidth="1.5" fill="none" />
      </svg>
    ),
  };
  return svgs[name];
}

export default function ServiceSelection({ booking, onUpdate, onNext }: Props) {
  const { serviceType, service } = booking;

  function selectService(name: ServiceName) {
    onUpdate({ service: name });
    onNext();
  }

  function setType(type: ServiceType) {
    onUpdate({ serviceType: type, service: null });
  }

  const visibleServices = services.filter((s) => {
    if (serviceType === "fill") {
      return s.fillPrice !== null;
    }
    return true;
  });

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-[#F5DDE1] px-6 py-14 md:px-16">
        <div className="mx-auto max-w-7xl">
          <p className="font-serif text-xs uppercase tracking-[0.35em] text-[#D37E90]">
            Book Your Appointment ✦
          </p>
          <h1 className="mt-2 font-serif text-5xl text-[#2f2024] md:text-6xl">
            Book a Service
          </h1>
          <p className="mt-4 max-w-sm text-sm leading-6 text-[#6e565d]">
            Choose your service to get started.
            <br />
            Next, you'll select your preferred date and time.
          </p>
        </div>
        <div className="pointer-events-none absolute -right-8 -top-4 h-48 w-48 rounded-full bg-[#D37E90]/10" />
        <div className="pointer-events-none absolute right-16 top-10 h-24 w-24 rounded-full bg-[#D37E90]/10" />
      </section>

      <div className="mx-auto max-w-7xl space-y-10 px-6 py-10 md:px-16">
        {/* Hours & Policies */}
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {/* Hours */}
          <div className="rounded-2xl border border-[#F5DDE1] bg-white/60 p-6">
            <div className="mb-4 flex items-center gap-2">
              <span className="text-lg text-[#D37E90]">◷</span>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-[#2f2024]">
                Hours
              </h3>
              <span className="text-[#D37E90]">+</span>
            </div>
            <div className="space-y-2">
              {hours.map((h) => (
                <div key={h.day} className="flex justify-between text-sm">
                  <span className="text-[#5f4a50]">{h.day}</span>
                  <span className="text-[#2f2024]">{h.time}</span>
                </div>
              ))}
              <div className="flex justify-between text-sm">
                <span className="text-[#5f4a50]">Sunday & Monday</span>
                <span className="font-medium text-[#D37E90]">Closed</span>
              </div>
            </div>
            <p className="mt-4 text-xs leading-5 text-[#7c6269]">
              Appointments outside of our regular hours may be subject to an
              additional fee.
            </p>
          </div>

          {/* Booking Policies */}
          <div className="rounded-2xl border border-[#F5DDE1] bg-white/60 p-6">
            <div className="mb-4 flex items-center gap-2">
              <span className="text-lg text-[#D37E90]">◎</span>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-[#2f2024]">
                Booking Policies
              </h3>
              <span className="text-[#D37E90]">+</span>
            </div>
            <div className="space-y-4">
              {bookingPolicies.map((p) => (
                <div key={p.title} className="flex gap-3">
                  <span className="mt-0.5 text-[#D37E90]">◇</span>
                  <div>
                    <p className="text-xs font-semibold text-[#2f2024]">
                      {p.title}
                    </p>
                    <p className="mt-0.5 text-xs leading-5 text-[#7c6269]">
                      {p.text}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-4 text-xs text-[#D37E90]">
              By booking an appointment, you agree to our policies.
            </p>
          </div>
        </div>

        {/* Step label */}
        <div>
          <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-[#D37E90]">
            Step 1 ✦
          </p>
          <h2 className="font-serif text-3xl text-[#2f2024]">
            Choose a Service
          </h2>
          <p className="mt-1 text-sm text-[#6e565d]">
            Select the service you'd like to book.
          </p>
        </div>

        {/* New Set / Fill toggle */}
        <div className="inline-flex rounded-full border border-[#F5DDE1] bg-white/60 p-1">
          {(["newSet", "fill"] as ServiceType[]).map((t) => (
            <button
              key={t}
              onClick={() => setType(t)}
              className={`rounded-full px-6 py-2 text-sm font-medium transition ${
                serviceType === t
                  ? "bg-[#D37E90] text-white shadow-sm"
                  : "text-[#D37E90] hover:bg-[#F5DDE1]"
              }`}
            >
              {t === "newSet" ? "New Set" : "3-Week Fill"}
            </button>
          ))}
        </div>

        {serviceType === "fill" && (
          <p className="text-xs text-[#D37E90]">
            Gel-x starting $55 for short, +$5 per next length. +5% GST on all
            cash and debit services.
          </p>
        )}

        {/* Service cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {visibleServices.map((s) => {
            const price =
              serviceType === "newSet" ? s.newSetPrice : s.fillPrice;
            const isContact = price === null;
            const isSelected = service === s.name;

            return (
              <button
                key={s.name}
                onClick={() => !isContact && selectService(s.name)}
                disabled={isContact}
                className={`flex items-center gap-4 rounded-2xl border p-5 text-left transition ${
                  isSelected
                    ? "border-[#D37E90] bg-[#F5DDE1]"
                    : isContact
                      ? "cursor-default border-[#F5DDE1] bg-white/40 opacity-70"
                      : "border-[#F5DDE1] bg-white/70 hover:border-[#D37E90] hover:bg-[#FAEDEF]"
                }`}
              >
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-[#F5DDE1]">
                  <NailIcon name={s.name} />
                </div>

                <div className="flex-1">
                  <p className="font-medium text-[#2f2024]">{s.name}</p>
                  {isContact ? (
                    <p className="mt-0.5 text-sm font-semibold text-[#D37E90]">
                      Contact for pricing
                    </p>
                  ) : (
                    <p className="mt-0.5 text-sm font-semibold text-[#D37E90]">
                      ${price}
                    </p>
                  )}
                  <div className="mt-1 flex items-center gap-1 text-xs text-[#7c6269]">
                    <span>◷</span>
                    <span>{s.duration}</span>
                  </div>
                </div>

                {!isContact && (
                  <span className="shrink-0 text-[#D37E90]">›</span>
                )}
              </button>
            );
          })}
        </div>

        <p className="text-center text-sm text-[#7c6269]">
          Not sure what to choose?{" "}
          <a href="mailto:hello@vldnail.com" className="text-[#D37E90] underline">
            Contact us
          </a>{" "}
          and we'll help you pick the perfect service.
        </p>

        {/* CTA banner */}
        <div className="rounded-2xl bg-[#F5DDE1] px-8 py-6">
          <div className="flex items-center gap-4">
            <span className="text-2xl text-[#D37E90]">✦</span>
            <div>
              <p className="font-serif text-base text-[#D37E90]">
                Thank you for supporting our small business.
              </p>
              <p className="text-sm text-[#6e565d]">
                We can't wait to help you look and feel your best.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
