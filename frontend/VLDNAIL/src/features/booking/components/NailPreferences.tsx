import type { BookingState } from "../booking.types";
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
  { label: "Nail Preferences" },
  { label: "Select Date & Time" },
  { label: "Customize & Price" },
];

const lengths = ["Short", "Medium", "Long", "XL"];
const shapes = ["Square", "Squoval", "Round", "Oval", "Almond", "Coffin", "Stiletto"];
const lengthServices = ["Short", "Medium", "Long", "XL"];

export default function NailPreferences({ booking, onUpdate, onNext, onBack }: Props) {
  const fixedLength = lengthServices.includes(booking.service ?? "")
    ? booking.service
    : null;
  const canContinue = Boolean((fixedLength || booking.nailLength) && booking.nailShape);

  return (
    <>
      <section className="bg-[#F5DDE1] px-6 py-14 md:px-16">
        <div className="mx-auto max-w-7xl">
          <p className="font-serif text-xs uppercase tracking-[0.35em] text-[#D37E90]">
            Book Your Appointment ✦
          </p>
          <h1 className="mt-2 font-serif text-5xl text-[#2f2024] md:text-6xl">
            Nail Preferences
          </h1>
          <p className="mt-4 max-w-md text-sm leading-6 text-[#6e565d]">
            Tell us your preferred length and shape before choosing your appointment time.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl space-y-6 px-6 py-10 md:px-16">
        <div className="rounded-2xl border border-[#F5DDE1] bg-white/60 px-6 py-4">
          <Stepper steps={STEPS} currentStep={2} />
        </div>

        <div className="rounded-2xl border border-[#F5DDE1] bg-white/70 p-6 md:p-8">
          <div className="mb-8">
            <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-[#D37E90]">
              Step 2 ✦
            </p>
            {fixedLength ? (
              <>
                <h2 className="font-serif text-3xl text-[#2f2024]">Length selected</h2>
                <p className="mt-4 text-sm text-[#6e565d]">
                  Your {fixedLength.toLowerCase()} service already includes {fixedLength.toLowerCase()} length.
                </p>
              </>
            ) : (
              <>
                <h2 className="font-serif text-3xl text-[#2f2024]">Choose your length</h2>
                <div className="mt-4 flex flex-wrap gap-2">
                  {lengths.map((length) => (
                    <button
                      key={length}
                      type="button"
                      onClick={() => onUpdate({ nailLength: length })}
                      className={`rounded-full px-5 py-2 text-sm font-medium transition ${
                        booking.nailLength === length
                          ? "bg-[#D37E90] text-white"
                          : "border border-[#D37E90] text-[#D37E90] hover:bg-[#F5DDE1]"
                      }`}
                    >
                      {length}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          <div>
            <h2 className="font-serif text-3xl text-[#2f2024]">Choose your shape</h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {shapes.map((shape) => (
                <button
                  key={shape}
                  type="button"
                  onClick={() => onUpdate({ nailShape: shape })}
                  className={`rounded-full px-5 py-2 text-sm font-medium transition ${
                    booking.nailShape === shape
                      ? "bg-[#D37E90] text-white"
                      : "border border-[#D37E90] text-[#D37E90] hover:bg-[#F5DDE1]"
                  }`}
                >
                  {shape}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col items-start justify-between gap-4 rounded-2xl border border-[#F5DDE1] bg-white/70 px-6 py-4 sm:flex-row sm:items-center">
          <button type="button" onClick={onBack} className="text-sm text-[#D37E90] hover:underline">
            ↩ Change Service
          </button>
          <Button onClick={onNext} disabled={!canContinue}>
            Continue to Date & Time →
          </Button>
        </div>
      </div>
    </>
  );
}
