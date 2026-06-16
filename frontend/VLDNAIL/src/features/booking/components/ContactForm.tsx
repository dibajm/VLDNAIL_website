import { useState } from "react";
import type { BookingState } from "../booking.types";
import BookingSummary from "./BookingSummary";
import Stepper from "../../../Components/ui/Stepper";
import Input from "../../../Components/ui/Input";
import Button from "../../../Components/ui/Button";
import { API_BASE_URL } from "../../../services/constants";

type Props = {
  booking: BookingState;
  onUpdate: (partial: Partial<BookingState>) => void;
  onBack: () => void;
};

const STEPS = [
  { label: "Choose a Service" },
  { label: "Select Date & Time" },
  { label: "Customize & Price" },
  { label: "Your Information" },
];

export default function ContactForm({ booking, onUpdate, onBack }: Props) {
  const { contact } = booking;
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function updateField(field: keyof typeof contact, value: string) {
    onUpdate({ contact: { ...contact, [field]: value } });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE_URL}/api/booking`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(booking),
      });
      if (!res.ok) throw new Error("Something went wrong. Please try again.");
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unexpected error.");
    } finally {
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-6 py-20 text-center">
        <div className="mb-4 text-4xl text-[#D37E90]">♡</div>
        <h2 className="font-serif text-3xl text-[#2f2024]">
          Booking Request Sent!
        </h2>
        <p className="mt-3 max-w-sm text-sm leading-6 text-[#6e565d]">
          Thank you! We'll review your request and send a confirmation email to{" "}
          <strong>{contact.email}</strong> shortly.
        </p>
        <Button to="/" className="mt-8">
          Back to Home
        </Button>
      </div>
    );
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
            Almost Done!
          </h1>
          <p className="mt-4 max-w-sm text-sm leading-6 text-[#6e565d]">
            Please fill in your details below.
            <br />
            We'll use this information to confirm your appointment.
          </p>
        </div>
        <div className="pointer-events-none absolute -right-8 -top-4 h-48 w-48 rounded-full bg-[#D37E90]/10" />
      </section>

      <div className="mx-auto max-w-7xl space-y-6 px-6 py-10 md:px-16">
        {/* Stepper */}
        <div className="rounded-2xl border border-[#F5DDE1] bg-white/60 px-6 py-4">
          <Stepper steps={STEPS} currentStep={4} />
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Left: Contact form */}
            <div className="rounded-2xl border border-[#F5DDE1] bg-white/70 p-6">
              <div className="mb-5 flex items-center gap-2">
                <h3 className="font-serif text-lg text-[#2f2024]">
                  1. Your Information
                </h3>
                <span className="text-[#D37E90]">✦</span>
              </div>
              <p className="mb-5 text-xs text-[#7c6269]">
                Fields marked with * are required.
              </p>

              <div className="space-y-4">
                <Input
                  label="First Name *"
                  placeholder="First Name"
                  required
                  value={contact.firstName}
                  onChange={(e) => updateField("firstName", e.target.value)}
                />
                <Input
                  label="Last Name *"
                  placeholder="Last Name"
                  required
                  value={contact.lastName}
                  onChange={(e) => updateField("lastName", e.target.value)}
                />
                <Input
                  label="Email *"
                  type="email"
                  placeholder="Email Address"
                  required
                  value={contact.email}
                  onChange={(e) => updateField("email", e.target.value)}
                />
                <Input
                  label="Phone Number"
                  type="tel"
                  placeholder="(123) 456-7890"
                  value={contact.phone}
                  onChange={(e) => updateField("phone", e.target.value)}
                />
                <div>
                  <label className="block">
                    <span className="mb-2 block text-sm font-medium text-[#2f2024]">
                      Instagram (optional)
                    </span>
                    <div className="flex items-center rounded-md border border-[#F5DDE1] bg-white/80 px-4 py-3 focus-within:border-[#D37E90] focus-within:ring-2 focus-within:ring-[#F5DDE1]">
                      <span className="mr-2 text-sm text-[#b99aa2]">◎</span>
                      <input
                        placeholder="@yourusername"
                        value={contact.instagram}
                        onChange={(e) =>
                          updateField("instagram", e.target.value)
                        }
                        className="w-full bg-transparent text-sm text-[#2f2024] outline-none placeholder:text-[#b99aa2]"
                      />
                    </div>
                  </label>
                </div>
              </div>

              <div className="mt-5 flex items-start gap-2 rounded-lg bg-[#F5DDE1]/50 px-3 py-2 text-xs text-[#6e565d]">
                <span className="mt-0.5 shrink-0 text-[#D37E90]">ℹ</span>
                <span>
                  We'll use your email to send you a confirmation and any
                  important updates about your appointment.
                </span>
              </div>
            </div>

            {/* Right: Summary */}
            <BookingSummary booking={booking} />
          </div>

          {/* What Happens Next + Submit */}
          <div className="mt-6 flex flex-col items-start justify-between gap-6 rounded-2xl border border-[#F5DDE1] bg-white/70 px-6 py-5 sm:flex-row sm:items-center">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-[#F5DDE1] bg-[#F5DDE1] text-xl text-[#D37E90]">
                ✉
              </div>
              <div>
                <p className="font-medium text-[#2f2024]">What Happens Next?</p>
                <p className="mt-1 max-w-xs text-xs leading-5 text-[#6e565d]">
                  Once you submit, you'll receive a confirmation email with your
                  appointment details and estimated price. We can't wait to
                  pamper you!
                </p>
              </div>
            </div>
            <div className="flex flex-col items-end gap-2">
              {error && (
                <p className="text-xs text-red-500">{error}</p>
              )}
              <Button type="submit" disabled={loading}>
                {loading ? "Sending…" : "Send Booking Request →"}
              </Button>
              <p className="text-xs text-[#7c6269]">
                ◇ Your information is safe and never shared.
              </p>
            </div>
          </div>
        </form>

        {/* CTA banner */}
        <div className="rounded-2xl bg-[#F5DDE1] px-8 py-6">
          <div className="flex items-center gap-4">
            <span className="text-2xl text-[#D37E90]">✦</span>
            <div>
              <p className="font-serif text-base text-[#D37E90]">
                Thank you for choosing VLDNAIL
              </p>
              <p className="text-sm text-[#6e565d]">
                Every set is created with love, care, and attention to detail.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
