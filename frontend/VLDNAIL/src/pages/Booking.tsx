import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import type { BookingState } from "../features/booking/booking.types";
import ServiceSelection from "../features/booking/components/ServiceSelection";
import NailPreferences from "../features/booking/components/NailPreferences";
import DateTimeSelection from "../features/booking/components/DateTimeSelection";
import PriceBuilder from "../features/booking/components/PriceBuilder";
import ContactForm from "../features/booking/components/ContactForm";
import Navbar from "../Components/layout/Navbar";
import Footer from "../Components/layout/Footer";

const initial: BookingState = {
  step: 1,
  serviceType: "newSet",
  service: null,
  nailLength: null,
  nailShape: null,
  date: null,
  time: null,
  designTier: null,
  extras: [],
  contact: { firstName: "", lastName: "", email: "", phone: "", instagram: "" },
};

export default function Booking() {
  const [booking, setBooking] = useState<BookingState>(initial);
  const [params, setParams] = useSearchParams();

  // The step lives in the URL (?step=2) so the browser's back button
  // returns to the previous step instead of leaving the booking page.
  const urlStep = Number(params.get("step"));
  const step = (urlStep >= 1 && urlStep <= 5 && booking.service ? urlStep : 1) as BookingState["step"];

  useEffect(() => {
    if (step === 1 && params.has("step")) setParams({}, { replace: true });
  }, [step, params, setParams]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [step]);

  function update(partial: Partial<BookingState>) {
    setBooking((prev) => ({ ...prev, ...partial }));
  }

  function goTo(next: BookingState["step"]) {
    update({ step: next });
    setParams(next === 1 ? {} : { step: String(next) });
  }

  return (
    <main className="min-h-screen bg-[#FAEDEF] text-[#2f2024]">
      <Navbar />

      {step === 1 && (
        <ServiceSelection
          booking={booking}
          onUpdate={update}
          onNext={() => goTo(2)}
        />
      )}
      {step === 2 && (
        <NailPreferences
          booking={booking}
          onUpdate={update}
          onNext={() => goTo(3)}
          onBack={() => goTo(1)}
        />
      )}
      {step === 3 && (
        <PriceBuilder
          booking={booking}
          onUpdate={update}
          onNext={() => goTo(4)}
          onBack={() => goTo(2)}
        />
      )}
      {step === 4 && (
        <DateTimeSelection
          booking={booking}
          onUpdate={update}
          onNext={() => goTo(5)}
          onBack={() => goTo(3)}
        />
      )}
      {step === 5 && (
        <ContactForm
          booking={booking}
          onUpdate={update}
          onBack={() => goTo(4)}
        />
      )}

      <Footer />
    </main>
  );
}
