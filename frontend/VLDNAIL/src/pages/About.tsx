import Navbar from "../Components/layout/Navbar";
import Footer from "../Components/layout/Footer";
import Button from "../Components/ui/Button";
import heroImg from "../assets/hero.png";

const policies = [
  {
    icon: "◎",
    title: "DEPOSIT REQUIRED",
    text: "A non-refundable deposit is required to secure your appointment. The remaining balance is due at the end of your service.",
  },
  {
    icon: "◎",
    title: "CANCELLATION POLICY",
    text: "Please provide at least 24 hours notice to cancel or reschedule. Cancellations with less than 24 hours notice will result in loss of deposit.",
  },
  {
    icon: "◎",
    title: "LATE POLICY",
    text: "A $20 late fee will be applied for arrivals more than 15 minutes late. If you are more than 20 minutes late, your appointment may be rescheduled.",
  },
  {
    icon: "◎",
    title: "SQUEEZE-IN FEE",
    text: "Squeeze-in appointments are subject to a $20 fee.",
  },
  {
    icon: "◎",
    title: "AFTER HOURS FEE",
    text: "Appointments outside regular hours (Tues – Sat, 10AM – 3PM) are subject to a $15 fee.",
  },
];

const quickInfo = [
  { icon: "◎", label: "Location", value: "Copperfield SE, Calgary, AB" },
  { icon: "◎", label: "Business Started", value: "2021" },
  { icon: "◎", label: "Languages", value: "English, Russian" },
  { icon: "◎", label: "Business Type", value: "Registered Business" },
  { icon: "◎", label: "License", value: "Certified Nail Technician" },
];

const badges = [
  { icon: "✦", label: "Registered\nBusiness" },
  { icon: "✦", label: "Licensed\nNail Technician" },
  { icon: "✦", label: "Quality Products\n& Sterilized Tools" },
];

export default function About() {
  return (
    <main className="min-h-screen bg-[#FAEDEF] text-[#2f2024]">
      <Navbar />

      {/* ── Hero / Bio ─────────────────────────────────────────── */}
      <section className="bg-[#F5DDE1] px-6 py-14 md:px-16">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-16">
          {/* Left: text */}
          <div className="flex flex-col justify-center">
            <p className="font-serif text-xs uppercase tracking-[0.35em] text-[#D37E90]">
              About VLDNAIL ✦
            </p>

            <h1 className="mt-3 font-serif text-5xl leading-tight text-[#2f2024] md:text-6xl">
              Hi, I'm{" "}
              <em className="not-italic font-serif text-[#D37E90]">Valeriya</em>
            </h1>

            <p className="mt-2 text-sm font-medium tracking-wide text-[#7c6269]">
              Nail artist. Perfectionist. Detail lover.
            </p>

            <div className="mt-6 space-y-4 text-sm leading-7 text-[#5c4248]">
              <p>
                I'm a nail tech based in Calgary, Alberta. I've been passionate
                about nails for as long as I can remember, and turned that
                passion into my career.
              </p>
              <p>
                I'm 22 years old, and my passion for nails started when I was
                15. Growing up, I watched my mom do nails, and seeing her
                creativity and dedication inspired me to follow in her footsteps.
              </p>
              <p>
                What began as a hobby quickly turned into a passion and
                eventually a career. Today, I love creating beautiful, customized
                nail sets that help my clients feel confident and express their
                personal style.
              </p>
              <p>
                My goal is to provide more than just a nail appointment. I strive
                to create a comfortable, welcoming, and exclusive environment
                where you can relax, unwind, and enjoy some time for yourself.
                Whether you're celebrating something exciting, having a rough
                week, or simply need a break from your busy life, I want my chair
                to be a safe space where you feel heard, comfortable, and cared
                for.
              </p>
              <p>
                Thank you for supporting my small business and trusting me with
                your nails. I can't wait to meet you and bring your vision to
                life!
              </p>
            </div>

            {/* Trust badges */}
            <div className="mt-8 flex flex-wrap gap-6">
              {badges.map((b) => (
                <div key={b.label} className="flex flex-col items-center gap-1.5 text-center">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[#D37E90]/30 bg-white/60 text-lg text-[#D37E90]">
                    {b.icon}
                  </div>
                  <p className="whitespace-pre-line text-xs font-medium leading-4 text-[#5c4248]">
                    {b.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Right: photo */}
          <div className="flex items-stretch">
            <div className="w-full overflow-hidden rounded-3xl shadow-lg">
              <img
                src={heroImg}
                alt="Valeriya's nail studio"
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── Policies + Quick Info ──────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-6 py-14 md:px-16">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">

          {/* Policies (2/3 width) */}
          <div className="lg:col-span-2">
            <div className="mb-6 flex items-center gap-2">
              <h2 className="font-serif text-2xl text-[#2f2024]">
                Policies &amp; Important Information
              </h2>
              <span className="text-[#D37E90]">✦</span>
            </div>

            <div className="space-y-4">
              {policies.map((p) => (
                <div
                  key={p.title}
                  className="flex gap-4 rounded-2xl border border-[#F5DDE1] bg-white/60 px-5 py-4"
                >
                  <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#D37E90]/30 bg-[#F5DDE1] text-sm text-[#D37E90]">
                    {p.icon}
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-[#D37E90]">
                      {p.title}
                    </p>
                    <p className="mt-1 text-sm leading-6 text-[#5c4248]">
                      {p.text}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Info (1/3 width) */}
          <div>
            <div className="rounded-2xl border border-[#F5DDE1] bg-white/60 p-6">
              <h3 className="mb-5 font-serif text-lg text-[#2f2024]">
                Quick Info
              </h3>
              <div className="space-y-4">
                {quickInfo.map((item) => (
                  <div key={item.label} className="flex items-start gap-3">
                    <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[#D37E90]/30 bg-[#F5DDE1] text-xs text-[#D37E90]">
                      {item.icon}
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-[#b99aa2]">
                        {item.label}
                      </p>
                      <p className="text-sm text-[#2f2024]">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Let's Connect + Visit Me ───────────────────────────── */}
      <section className="mx-auto max-w-7xl px-6 pb-14 md:px-16">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">

          {/* Let's Connect */}
          <div className="rounded-2xl border border-[#F5DDE1] bg-white/60 p-7">
            <div className="mb-5 flex items-center gap-2">
              <h3 className="font-serif text-xl text-[#2f2024]">Let's Connect</h3>
              <span className="text-[#D37E90]">✦</span>
            </div>
            <p className="mb-5 text-sm text-[#6e565d]">
              Follow me on Instagram for nail inspo, new arts, updates &amp; more!
            </p>

            <div className="space-y-3">
              <a
                href="https://instagram.com/VLdnail"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between rounded-xl border border-[#F5DDE1] bg-[#FAEDEF] px-4 py-3 transition hover:border-[#D37E90]"
              >
                <div className="flex items-center gap-3">
                  <span className="text-[#D37E90]">◎</span>
                  <span className="text-sm text-[#2f2024]">@VLdnail</span>
                </div>
                <span className="text-xs text-[#D37E90]">›</span>
              </a>

              <a
                href="mailto:valeriya.lazar.nails@gmail.com"
                className="flex items-center justify-between rounded-xl border border-[#F5DDE1] bg-[#FAEDEF] px-4 py-3 transition hover:border-[#D37E90]"
              >
                <div className="flex items-center gap-3">
                  <span className="text-[#D37E90]">✉</span>
                  <span className="text-sm text-[#2f2024]">valeriya.lazar.nails@gmail.com</span>
                </div>
                <span className="text-xs text-[#D37E90]">›</span>
              </a>
            </div>

            <p className="mt-6 font-serif text-xl italic text-[#D37E90]">
              thank you! ♡
            </p>
          </div>

          {/* Visit Me */}
          <div className="rounded-2xl border border-[#F5DDE1] bg-white/60 p-7">
            <div className="mb-5 flex items-center gap-2">
              <h3 className="font-serif text-xl text-[#2f2024]">Visit Me</h3>
              <span className="text-[#D37E90]">✦</span>
            </div>
            <p className="mb-5 text-sm text-[#6e565d]">
              Cozy private studio located in the Copperfield area of Calgary.
            </p>

            {/* Map placeholder — swap with Google Maps embed once address is confirmed */}
            <div className="flex h-44 items-center justify-center overflow-hidden rounded-xl bg-[#F5DDE1]">
              <div className="text-center">
                <span className="text-3xl text-[#D37E90]">◎</span>
                <p className="mt-2 text-xs text-[#7c6269]">Map coming soon</p>
              </div>
            </div>

            <div className="mt-4 flex items-center gap-2 text-sm text-[#5c4248]">
              <span className="text-[#D37E90]">◎</span>
              Copperfield SE, Calgary, AB
            </div>
          </div>
        </div>
      </section>

      {/* ── Thank you banner ───────────────────────────────────── */}
      <section className="mx-6 mb-10 rounded-2xl bg-[#F5DDE1] px-8 py-7 md:mx-16">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-5 md:flex-row">
          <div className="flex items-center gap-4">
            <span className="text-2xl text-[#D37E90]">✦</span>
            <div>
              <p className="font-serif text-base text-[#2f2024]">
                Thank you for supporting my small business.
              </p>
              <p className="text-sm text-[#6e565d]">
                Your support means the world to me. I can't wait to make you feel your best!
              </p>
            </div>
          </div>
          <Button to="/booking">Book Now →</Button>
        </div>
      </section>

      <Footer />
    </main>
  );
}
