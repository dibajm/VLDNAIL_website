import { useState } from "react";
import type { BookingState } from "../features/booking/booking.types";
import ServiceSelection from "../features/booking/components/ServiceSelection";
import DateTimeSelection from "../features/booking/components/DateTimeSelection";
import PriceBuilder from "../features/booking/components/PriceBuilder";
import ContactForm from "../features/booking/components/ContactForm";
import Navbar from "../Components/layout/Navbar";
import Footer from "../Components/layout/Footer";

const initial: BookingState = {
  step: 1,
  serviceType: "newSet",
  service: null,
  date: null,
  time: null,
  designTier: null,
  extras: [],
  contact: { firstName: "", lastName: "", email: "", phone: "", instagram: "" },
};

export default function Booking() {
  const [booking, setBooking] = useState<BookingState>(initial);

  function update(partial: Partial<BookingState>) {
    setBooking((prev) => ({ ...prev, ...partial }));
  }

  function goTo(step: BookingState["step"]) {
    update({ step });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <main className="min-h-screen bg-[#FAEDEF] text-[#2f2024]">
      <Navbar />

      {booking.step === 1 && (
        <ServiceSelection
          booking={booking}
          onUpdate={update}
          onNext={() => goTo(2)}
        />
      )}
      {booking.step === 2 && (
        <DateTimeSelection
          booking={booking}
          onUpdate={update}
          onNext={() => goTo(3)}
          onBack={() => goTo(1)}
        />
      )}
      {booking.step === 3 && (
        <PriceBuilder
          booking={booking}
          onUpdate={update}
          onNext={() => goTo(4)}
          onBack={() => goTo(2)}
        />
      )}
      {booking.step === 4 && (
        <ContactForm
          booking={booking}
          onUpdate={update}
          onBack={() => goTo(3)}
        />
      )}

      <Footer />
    </main>
  );
}
