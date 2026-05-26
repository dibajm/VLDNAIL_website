import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import SectionTitle from "../components/ui/SectionTitle";

import heroImg from "../assets/hero.png";
import pressOnImg from "../assets/presson.png";

function Home() {
  const features = [
    {
      icon: "◇",
      title: "Premium Quality",
      text: "Delivering high-end products for beautiful, lasting results.",
    },
    {
      icon: "✦",
      title: "Trendy Designs",
      text: "From timeless classics to the latest nail trends.",
    },
    {
      icon: "♡",
      title: "Hygiene and Safety",
      text: "Your health, comfort, and safety are always a priority.",
    },
    {
      icon: "▣",
      title: "Easy Booking",
      text: "Request your appointment online in just a few steps.",
    },
  ];

  return (
    <main className="min-h-screen bg-[#FAEDEF] text-[#2f2024]">
      <Navbar />

      <section className="bg-[#F5DDE1]">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-10 px-6 py-14 md:flex-row md:px-10 lg:px-16">
          <div className="max-w-xl text-center md:text-left">
            <p className="mb-4 font-serif text-sm uppercase tracking-[0.35em] text-[#D37E90]">
              Elevate Your Style
            </p>

            <h1 className="mb-4 font-serif text-6xl tracking-widest text-white drop-shadow-md md:text-7xl">
              VLDNAIL
            </h1>

            <div className="mx-auto mb-5 h-[2px] w-56 bg-[#D37E90] md:mx-0" />

            <h2 className="mb-3 text-2xl font-medium">
              Beauty in every detail
            </h2>

            <p className="mx-auto max-w-md text-sm leading-7 text-[#5f4a50] md:mx-0">
              Premium nail services offering acrylic and gel extensions,
              detailed nail art, and custom press-on nails made to fit your
              unique style.
            </p>

            <Button to="/booking" className="mt-8">
              Book your appointment now →
            </Button>
          </div>

          <div className="flex justify-center">
            <img
              src={heroImg}
              alt="Luxury nail design"
              className="w-full max-w-md object-contain md:max-w-lg"
            />
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl grid-cols-1 gap-5 px-6 py-6 md:grid-cols-4 md:px-10 lg:px-16">
        {features.map((item) => (
          <Card key={item.title} className="text-center">
            <div className="mb-3 text-3xl text-[#D37E90]">{item.icon}</div>
            <h3 className="mb-2 text-sm font-semibold">{item.title}</h3>
            <p className="text-xs leading-5 text-[#6e565d]">{item.text}</p>
          </Card>
        ))}
      </section>

      <section className="mx-auto my-10 max-w-6xl px-6 md:px-10">
        <Card variant="light" className="rounded-2xl p-8">
          <SectionTitle
            eyebrow="Custom handmade nails"
            title="Press-On Nails"
            align="left"
          />

          <div className="mt-6 grid grid-cols-1 gap-10 md:grid-cols-3">
            <img
              src={pressOnImg}
              alt="Custom press-on nails"
              className="h-56 w-full rounded-xl object-cover"
            />

            <div className="flex flex-col justify-center">
              <p className="text-sm leading-7 text-[#5f4a50]">
                Custom handmade press-ons, made to fit you perfectly. Reusable,
                durable, and designed to match your style for any occasion.
              </p>

              <div className="mt-6 grid grid-cols-2 gap-4 text-sm text-[#6b555c]">
                <p>♡ Custom Sizes</p>
                <p>♡ Reusable</p>
                <p>♡ High Quality</p>
                <p>♡ Fast Turnaround</p>
              </div>
            </div>

            <div className="flex flex-col items-center justify-center gap-5">
              <Button to="/press-ons" fullWidth>
                Order Press-Ons →
              </Button>

              <div className="h-28 w-full rounded-xl bg-[#F5DDE1]" />
            </div>
          </div>
        </Card>
      </section>

      <Footer />
    </main>
  );
}

export default Home;