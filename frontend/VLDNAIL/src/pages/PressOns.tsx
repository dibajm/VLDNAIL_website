import { useState, useRef } from "react";
import Navbar from "../Components/layout/Navbar";
import Footer from "../Components/layout/Footer";
import Button from "../Components/ui/Button";
import Input from "../Components/ui/Input";
import { API_BASE_URL } from "../services/constants";

const lengths = ["Short", "Medium", "Long", "XL", "Extra XL"];
const shapes = ["Square", "Squoval", "Round", "Oval", "Almond", "Coffin", "Stiletto"];
const occasions = ["Everyday Wear", "Special Event", "Wedding", "Birthday", "Holiday", "Other"];

type Form = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  instagram: string;
  length: string;
  shape: string;
  occasion: string;
  details: string;
};

const empty: Form = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  instagram: "",
  length: "",
  shape: "",
  occasion: "",
  details: "",
};

export default function PressOns() {
  const [form, setForm] = useState<Form>(empty);
  const [photos, setPhotos] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function set(field: keyof Form, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function addPhotos(files: FileList | null) {
    if (!files) return;
    const newFiles = Array.from(files).slice(0, 5 - photos.length);
    const newPreviews = newFiles.map((f) => URL.createObjectURL(f));
    setPhotos((prev) => [...prev, ...newFiles]);
    setPreviews((prev) => [...prev, ...newPreviews]);
  }

  function removePhoto(index: number) {
    URL.revokeObjectURL(previews[index]);
    setPhotos((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const data = new FormData();
      Object.entries(form).forEach(([k, v]) => data.append(k, v));
      photos.forEach((f) => data.append("photos", f));
      const res = await fetch(`${API_BASE_URL}/api/press-on-inquiry`, {
        method: "POST",
        body: data,
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
      <main className="min-h-screen bg-[#FAEDEF] text-[#2f2024]">
        <Navbar />
        <div className="flex min-h-[70vh] flex-col items-center justify-center px-6 py-20 text-center">
          <div className="mb-4 text-5xl text-[#D37E90]">♡</div>
          <h2 className="font-serif text-3xl text-[#2f2024]">Inquiry Sent!</h2>
          <p className="mt-3 max-w-sm text-sm leading-7 text-[#6e565d]">
            Thank you for your interest in custom press-ons! I'll review your
            request and reach out to{" "}
            <strong>{form.email}</strong> within 1–2 business days.
          </p>
          <Button to="/" className="mt-8">
            Back to Home
          </Button>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#FAEDEF] text-[#2f2024]">
      <Navbar />

      {/* Header */}
      <section className="bg-[#F5DDE1] px-6 py-14 md:px-16">
        <div className="mx-auto max-w-7xl">
          <p className="font-serif text-xs uppercase tracking-[0.35em] text-[#D37E90]">
            Custom Handmade ✦
          </p>
          <h1 className="mt-2 font-serif text-5xl text-[#2f2024] md:text-6xl">
            Press-Ons
          </h1>
          <p className="mt-4 max-w-md text-sm leading-7 text-[#6e565d]">
            Every set is made to order — your shape, your length, your design.
            Fill out the inquiry form below and I'll reach out with pricing and
            availability.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-4xl px-6 py-12 md:px-16">

        {/* How it works */}
        <div className="mb-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {[
            { step: "1", title: "Send Inquiry", desc: "Fill out the form with your details and inspo." },
            { step: "2", title: "Get a Quote", desc: "I'll reach out within 1–2 days with pricing." },
            { step: "3", title: "Receive Your Set", desc: "Custom press-ons crafted just for you." },
          ].map((s) => (
            <div
              key={s.step}
              className="flex flex-col items-center rounded-2xl border border-[#F5DDE1] bg-white/60 px-5 py-6 text-center"
            >
              <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-full bg-[#D37E90] text-sm font-semibold text-white">
                {s.step}
              </div>
              <p className="font-serif text-base text-[#2f2024]">{s.title}</p>
              <p className="mt-1 text-xs leading-5 text-[#7c6269]">{s.desc}</p>
            </div>
          ))}
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="space-y-6 rounded-2xl border border-[#F5DDE1] bg-white/60 p-7"
        >
          <div className="mb-2 flex items-center gap-2">
            <h2 className="font-serif text-xl text-[#2f2024]">Inquiry Form</h2>
            <span className="text-[#D37E90]">✦</span>
          </div>

          {/* Contact */}
          <fieldset className="space-y-4">
            <legend className="mb-3 text-xs font-semibold uppercase tracking-widest text-[#b99aa2]">
              Your Information
            </legend>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Input
                label="First Name *"
                placeholder="First Name"
                required
                value={form.firstName}
                onChange={(e) => set("firstName", e.target.value)}
              />
              <Input
                label="Last Name *"
                placeholder="Last Name"
                required
                value={form.lastName}
                onChange={(e) => set("lastName", e.target.value)}
              />
            </div>
            <Input
              label="Email *"
              type="email"
              placeholder="Email Address"
              required
              value={form.email}
              onChange={(e) => set("email", e.target.value)}
            />
            <Input
              label="Phone Number"
              type="tel"
              placeholder="(123) 456-7890"
              value={form.phone}
              onChange={(e) => set("phone", e.target.value)}
            />
            <div>
              <span className="mb-2 block text-sm font-medium text-[#2f2024]">
                Instagram (optional)
              </span>
              <div className="flex items-center rounded-md border border-[#F5DDE1] bg-white/80 px-4 py-3 focus-within:border-[#D37E90] focus-within:ring-2 focus-within:ring-[#F5DDE1]">
                <span className="mr-2 text-sm text-[#b99aa2]">◎</span>
                <input
                  placeholder="@yourusername"
                  value={form.instagram}
                  onChange={(e) => set("instagram", e.target.value)}
                  className="w-full bg-transparent text-sm text-[#2f2024] outline-none placeholder:text-[#b99aa2]"
                />
              </div>
            </div>
          </fieldset>

          <hr className="border-[#F5DDE1]" />

          {/* Nail Preferences */}
          <fieldset className="space-y-5">
            <legend className="mb-1 text-xs font-semibold uppercase tracking-widest text-[#b99aa2]">
              Nail Preferences
            </legend>

            {/* Length */}
            <div>
              <p className="mb-2 text-sm font-medium text-[#2f2024]">Length *</p>
              <div className="flex flex-wrap gap-2">
                {lengths.map((l) => (
                  <button
                    key={l}
                    type="button"
                    onClick={() => set("length", l)}
                    className={`rounded-full px-4 py-1.5 text-xs font-medium transition ${
                      form.length === l
                        ? "bg-[#D37E90] text-white"
                        : "border border-[#D37E90] text-[#D37E90] hover:bg-[#F5DDE1]"
                    }`}
                  >
                    {l}
                  </button>
                ))}
              </div>
            </div>

            {/* Shape */}
            <div>
              <p className="mb-2 text-sm font-medium text-[#2f2024]">Shape *</p>
              <div className="flex flex-wrap gap-2">
                {shapes.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => set("shape", s)}
                    className={`rounded-full px-4 py-1.5 text-xs font-medium transition ${
                      form.shape === s
                        ? "bg-[#D37E90] text-white"
                        : "border border-[#D37E90] text-[#D37E90] hover:bg-[#F5DDE1]"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Occasion */}
            <div>
              <p className="mb-2 text-sm font-medium text-[#2f2024]">Occasion</p>
              <div className="flex flex-wrap gap-2">
                {occasions.map((o) => (
                  <button
                    key={o}
                    type="button"
                    onClick={() => set("occasion", o)}
                    className={`rounded-full px-4 py-1.5 text-xs font-medium transition ${
                      form.occasion === o
                        ? "bg-[#D37E90] text-white"
                        : "border border-[#D37E90] text-[#D37E90] hover:bg-[#F5DDE1]"
                    }`}
                  >
                    {o}
                  </button>
                ))}
              </div>
            </div>

            {/* Photo upload */}
            <div>
              <p className="mb-2 text-sm font-medium text-[#2f2024]">
                Inspo / Reference Photos
                <span className="ml-2 text-xs font-normal text-[#9c7580]">up to 5 photos</span>
              </p>

              {/* Drop zone */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => { e.preventDefault(); addPhotos(e.dataTransfer.files); }}
                disabled={photos.length >= 5}
                className="flex w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-[#D37E90]/40 bg-[#FAEDEF] py-8 text-center transition hover:border-[#D37E90] hover:bg-[#F5DDE1] disabled:cursor-not-allowed disabled:opacity-50"
              >
                <span className="text-2xl text-[#D37E90]">✦</span>
                <span className="text-sm font-medium text-[#D37E90]">
                  Click to upload or drag &amp; drop
                </span>
                <span className="text-xs text-[#9c7580]">
                  JPG, PNG, HEIC — max 5 photos
                </span>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={(e) => addPhotos(e.target.files)}
              />

              {/* Previews */}
              {previews.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-3">
                  {previews.map((src, i) => (
                    <div key={i} className="relative">
                      <img
                        src={src}
                        alt={`inspo ${i + 1}`}
                        className="h-20 w-20 rounded-xl object-cover border border-[#F5DDE1]"
                      />
                      <button
                        type="button"
                        onClick={() => removePhoto(i)}
                        className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-[#D37E90] text-xs text-white shadow"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Additional details */}
            <div>
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-[#2f2024]">
                  Additional Details
                </span>
                <textarea
                  rows={4}
                  placeholder="Any other details — budget range, deadline, special requests..."
                  value={form.details}
                  onChange={(e) => set("details", e.target.value)}
                  className="w-full rounded-md border border-[#F5DDE1] bg-white/80 px-4 py-3 text-sm text-[#2f2024] outline-none transition placeholder:text-[#b99aa2] focus:border-[#D37E90] focus:ring-2 focus:ring-[#F5DDE1] resize-none"
                />
              </label>
            </div>
          </fieldset>

          {/* Submit */}
          <div className="flex flex-col items-start gap-3 pt-2">
            {error && <p className="text-xs text-red-500">{error}</p>}
            <div className="flex w-full items-center justify-between gap-4">
              <p className="text-xs text-[#9c7580]">
                ◇ I'll get back to you within 1–2 business days.
              </p>
              <Button type="submit" disabled={loading || !form.length || !form.shape}>
                {loading ? "Sending…" : "Send Inquiry →"}
              </Button>
            </div>
          </div>
        </form>
      </div>

      {/* Footer banner */}
      <section className="mx-6 mb-10 rounded-2xl bg-[#F5DDE1] px-8 py-7 md:mx-16">
        <div className="mx-auto flex max-w-7xl items-center gap-4">
          <span className="text-2xl text-[#D37E90]">✦</span>
          <div>
            <p className="font-serif text-base text-[#2f2024]">
              Every set is one of a kind, just like you.
            </p>
            <p className="text-sm text-[#6e565d]">
              Handcrafted with care, designed around your style.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
