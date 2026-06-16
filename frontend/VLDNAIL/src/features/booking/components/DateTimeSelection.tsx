import { useState } from "react";
import type { BookingState } from "../booking.types";
import { services } from "../data/pricing";
import { formatDateDisplay } from "../utils/calculatePrice";
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

const DAYS = ["SU", "MO", "TU", "WE", "TH", "FR", "SA"];
const MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];

function generateTimeSlots(dateStr: string | null): string[] {
  if (!dateStr) return [];
  const date = new Date(dateStr + "T12:00:00");
  const dayOfWeek = date.getDay();
  const isFriday = dayOfWeek === 5;
  const endMinutes = isFriday ? 14 * 60 : 15 * 60;
  const slots: string[] = [];
  for (let m = 10 * 60; m < endMinutes; m += 30) {
    const h = Math.floor(m / 60);
    const min = m % 60;
    const ampm = h < 12 ? "AM" : "PM";
    const displayH = h > 12 ? h - 12 : h;
    slots.push(`${displayH}:${min === 0 ? "00" : "30"} ${ampm}`);
  }
  return slots;
}

function Calendar({
  selected,
  onSelect,
}: {
  selected: string | null;
  onSelect: (d: string) => void;
}) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [current, setCurrent] = useState(
    () => new Date(today.getFullYear(), today.getMonth(), 1)
  );

  const year = current.getFullYear();
  const month = current.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();

  function isDisabled(day: number) {
    const date = new Date(year, month, day);
    const dow = date.getDay();
    return dow === 0 || dow === 1 || date < today;
  }

  function toISO(day: number) {
    return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  }

  return (
    <div>
      {/* Month nav */}
      <div className="mb-4 flex items-center justify-between">
        <button
          onClick={() => setCurrent(new Date(year, month - 1, 1))}
          className="px-2 text-[#D37E90] hover:text-[#b85f72]"
        >
          ‹
        </button>
        <span className="font-serif text-sm font-medium text-[#2f2024]">
          {MONTHS[month]} {year}
        </span>
        <button
          onClick={() => setCurrent(new Date(year, month + 1, 1))}
          className="px-2 text-[#D37E90] hover:text-[#b85f72]"
        >
          ›
        </button>
      </div>

      {/* Day headers */}
      <div className="mb-2 grid grid-cols-7 text-center">
        {DAYS.map((d) => (
          <span key={d} className="text-xs font-semibold text-[#7c6269]">
            {d}
          </span>
        ))}
      </div>

      {/* Date grid */}
      <div className="grid grid-cols-7 gap-y-1 text-center">
        {Array.from({ length: firstDay }).map((_, i) => (
          <span key={`empty-${i}`} />
        ))}
        {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => {
          const iso = toISO(day);
          const disabled = isDisabled(day);
          const isSelected = selected === iso;
          return (
            <button
              key={day}
              onClick={() => !disabled && onSelect(iso)}
              disabled={disabled}
              className={`mx-auto flex h-8 w-8 items-center justify-center rounded-full text-sm transition ${
                isSelected
                  ? "bg-[#D37E90] font-semibold text-white"
                  : disabled
                    ? "cursor-not-allowed text-[#cbb5bb]"
                    : "text-[#2f2024] hover:bg-[#F5DDE1]"
              }`}
            >
              {day}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function DateTimeSelection({ booking, onUpdate, onNext, onBack }: Props) {
  const { service, serviceType, date, time } = booking;
  const def = services.find((s) => s.name === service);
  const price = def
    ? serviceType === "newSet"
      ? def.newSetPrice
      : def.fillPrice
    : null;

  const timeSlots = generateTimeSlots(date);
  const canContinue = !!date && !!time;

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-[#F5DDE1] px-6 py-14 md:px-16">
        <div className="mx-auto max-w-7xl">
          <p className="font-serif text-xs uppercase tracking-[0.35em] text-[#D37E90]">
            Book Your Appointment ✦
          </p>
          <h1 className="mt-2 font-serif text-5xl text-[#2f2024] md:text-6xl">
            Select Date & Time
          </h1>
          <p className="mt-4 max-w-sm text-sm leading-6 text-[#6e565d]">
            Almost there! Choose your preferred
            <br />
            date and time for your appointment.
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
              {price !== null && <span className="text-[#D37E90]">${price}</span>}
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
          <Stepper steps={STEPS} currentStep={2} />
        </div>

        {/* Calendar + Time slots */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Calendar */}
          <div className="rounded-2xl border border-[#F5DDE1] bg-white/70 p-6">
            <div className="mb-4 flex items-center gap-2">
              <h3 className="font-serif text-lg text-[#2f2024]">Select a Date</h3>
              <span className="text-[#D37E90]">✦</span>
            </div>
            <Calendar selected={date} onSelect={(d) => onUpdate({ date: d, time: null })} />
            <div className="mt-4 flex items-center gap-2 rounded-lg bg-[#F5DDE1]/50 px-3 py-2 text-xs text-[#6e565d]">
              <span>▦</span>
              <span>We are open Tuesday – Saturday, 10:00 AM – 3:00 PM</span>
            </div>
          </div>

          {/* Time slots */}
          <div className="rounded-2xl border border-[#F5DDE1] bg-white/70 p-6">
            <div className="mb-1 flex items-center gap-2">
              <h3 className="font-serif text-lg text-[#2f2024]">Select a Time</h3>
              <span className="text-[#D37E90]">✦</span>
            </div>
            {date ? (
              <p className="mb-4 text-sm text-[#7c6269]">
                {formatDateDisplay(date)}
              </p>
            ) : (
              <p className="mb-4 text-sm text-[#7c6269]">
                Please select a date first.
              </p>
            )}

            {timeSlots.length > 0 ? (
              <div className="grid grid-cols-2 gap-2">
                {timeSlots.map((slot) => (
                  <button
                    key={slot}
                    onClick={() => onUpdate({ time: slot })}
                    className={`rounded-lg border px-4 py-2.5 text-sm font-medium transition ${
                      time === slot
                        ? "border-[#D37E90] bg-[#D37E90] text-white"
                        : "border-[#F5DDE1] bg-white text-[#2f2024] hover:border-[#D37E90]"
                    }`}
                  >
                    {slot}
                    {time === slot && <span className="ml-2">✓</span>}
                  </button>
                ))}
              </div>
            ) : (
              date && (
                <p className="text-sm text-[#D37E90]">
                  No available slots on this day.
                </p>
              )
            )}

            {date && timeSlots.length > 0 && (
              <div className="mt-4 flex items-start gap-2 rounded-lg bg-[#F5DDE1]/50 px-3 py-2 text-xs text-[#6e565d]">
                <span className="mt-0.5 shrink-0 text-[#D37E90]">ℹ</span>
                <span>
                  PLEASE NOTE: If you are more than 15 minutes late, a $20 late
                  fee will be applied.
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col items-start justify-between gap-4 rounded-2xl border border-[#F5DDE1] bg-white/70 px-6 py-4 sm:flex-row sm:items-center">
          <div className="flex items-center gap-3">
            <span className="text-xl text-[#D37E90]">▦</span>
            <div className="text-sm text-[#6e565d]">
              {canContinue ? (
                <span>
                  <strong className="text-[#2f2024]">{service}</strong>
                  {" · "}
                  {formatDateDisplay(date!)}
                  {" · "}
                  {time}
                  {" · "}
                  Est. {def?.duration}
                </span>
              ) : (
                <span>Select a date and time to continue.</span>
              )}
            </div>
          </div>
          <Button onClick={onNext} disabled={!canContinue}>
            Continue →
          </Button>
        </div>

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
