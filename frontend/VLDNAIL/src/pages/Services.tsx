import Navbar from "../Components/layout/Navbar";
import Footer from "../Components/layout/Footer";
import Button from "../Components/ui/Button";
import { services, designTiers, extras } from "../features/booking/data/pricing";

export default function Services() {
  return (
    <main className="min-h-screen bg-[#FAEDEF] text-[#2f2024]">
      <Navbar />

      {/* Header */}
      <section className="bg-[#F5DDE1] px-6 py-14 md:px-16">
        <div className="mx-auto max-w-7xl">
          <p className="font-serif text-xs uppercase tracking-[0.35em] text-[#D37E90]">
            What we offer ✦
          </p>
          <h1 className="mt-2 font-serif text-5xl text-[#2f2024] md:text-6xl">
            Services
          </h1>
          <p className="mt-4 max-w-sm text-sm leading-6 text-[#6e565d]">
            Every set is handcrafted with care. Browse our services and pricing
            below, then book your appointment.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl space-y-14 px-6 py-12 md:px-16">

        {/* Base Services */}
        <section>
          <div className="mb-6 flex items-center gap-2">
            <h2 className="font-serif text-2xl text-[#2f2024]">Base Services</h2>
            <span className="text-[#D37E90]">✦</span>
          </div>

          {/* Column headers — desktop only */}
          <div className="mb-3 hidden grid-cols-4 gap-4 px-4 text-xs font-semibold uppercase tracking-widest text-[#b99aa2] sm:grid">
            <span className="col-span-2">Service</span>
            <span className="text-center">New Set</span>
            <span className="text-center">Fill</span>
          </div>

          {/* Desktop table */}
          <div className="hidden divide-y divide-[#F5DDE1] rounded-2xl border border-[#F5DDE1] bg-white/60 sm:block">
            {services.map((svc) => (
              <div
                key={svc.name}
                className="grid grid-cols-4 items-center gap-4 px-5 py-4"
              >
                <div className="col-span-2">
                  <p className="font-medium text-[#2f2024]">{svc.name}</p>
                  <p className="text-xs text-[#7c6269]">{svc.description}</p>
                </div>
                <p className="text-center text-sm font-semibold text-[#2f2024]">
                  {svc.newSetPrice != null ? `$${svc.newSetPrice}` : "—"}
                </p>
                <p className="text-center text-sm font-semibold text-[#2f2024]">
                  {svc.fillPrice != null ? `$${svc.fillPrice}` : "—"}
                </p>
              </div>
            ))}
          </div>

          {/* Mobile cards */}
          <div className="space-y-3 sm:hidden">
            {services.map((svc) => (
              <div
                key={svc.name}
                className="rounded-2xl border border-[#F5DDE1] bg-white/60 px-5 py-4"
              >
                <p className="font-medium text-[#2f2024]">{svc.name}</p>
                <p className="mt-0.5 text-xs text-[#7c6269]">{svc.description}</p>
                <div className="mt-3 flex gap-6 text-sm">
                  <div>
                    <p className="text-xs text-[#b99aa2]">New Set</p>
                    <p className="font-semibold text-[#2f2024]">
                      {svc.newSetPrice != null ? `$${svc.newSetPrice}` : "—"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-[#b99aa2]">Fill</p>
                    <p className="font-semibold text-[#2f2024]">
                      {svc.fillPrice != null ? `$${svc.fillPrice}` : "—"}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <p className="mt-3 text-xs text-[#9c7580]">
            * Press-ons are custom handmade — contact us for pricing.
          </p>
        </section>

        {/* Design Tiers */}
        <section>
          <div className="mb-6 flex items-center gap-2">
            <h2 className="font-serif text-2xl text-[#2f2024]">Design Tiers</h2>
            <span className="text-[#D37E90]">✦</span>
          </div>
          <p className="mb-5 text-sm text-[#6e565d]">
            Add a design to any service. Prices are added on top of the base service price.
          </p>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {designTiers.map((tier) => (
              <div
                key={tier.tier}
                className="rounded-2xl border border-[#F5DDE1] bg-white/60 px-5 py-5"
              >
                <div className="mb-2 flex items-center justify-between">
                  <h3 className="font-serif text-base text-[#2f2024]">
                    {tier.label}
                  </h3>
                  <span className="rounded-full bg-[#D37E90] px-3 py-0.5 text-xs font-semibold text-white">
                    {tier.range}
                  </span>
                </div>
                <p className="text-xs leading-5 text-[#7c6269]">{tier.examples}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Extras */}
        <section>
          <div className="mb-6 flex items-center gap-2">
            <h2 className="font-serif text-2xl text-[#2f2024]">Add-Ons & Extras</h2>
            <span className="text-[#D37E90]">✦</span>
          </div>

          <div className="divide-y divide-[#F5DDE1] rounded-2xl border border-[#F5DDE1] bg-white/60">
            {extras.map((extra) => (
              <div
                key={extra.id}
                className="flex items-center justify-between px-5 py-4"
              >
                <p className="text-sm text-[#2f2024]">{extra.label}</p>
                <span className="rounded-full bg-[#F5DDE1] px-3 py-0.5 text-xs font-semibold text-[#D37E90]">
                  {extra.display}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="rounded-2xl bg-[#F5DDE1] px-8 py-8">
          <div className="flex flex-col items-center justify-between gap-5 md:flex-row">
            <div>
              <h3 className="font-serif text-xl text-[#2f2024]">
                Ready to book?
              </h3>
              <p className="mt-1 text-sm text-[#6e565d]">
                Choose your service, pick a date, and we'll handle the rest.
              </p>
            </div>
            <Button to="/booking">Book Now →</Button>
          </div>
        </section>
      </div>

      <Footer />
    </main>
  );
}
