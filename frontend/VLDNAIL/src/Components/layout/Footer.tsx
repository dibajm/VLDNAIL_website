import { Link } from "react-router-dom";
import logo from "../../assets/logo.png";

function Footer() {
  return (
    <footer className="border-t border-[#F5DDE1] bg-[#FAEDEF]">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-8 py-12 text-sm text-[#6f5a60] md:grid-cols-[1.5fr_1fr_1fr_1.4fr] md:px-16">

        {/* Brand */}
        <div>
          <img src={logo} alt="VLDNAIL Logo" className="h-16 w-auto" />
          <p className="mt-4 max-w-[200px] text-xs leading-6 text-[#9c7580]">
            Handcrafted nails with care, passion, and precision.
          </p>
          <div className="mt-6 flex items-center gap-4">
            <a
              href="https://instagram.com/VLdnail"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="flex h-8 w-8 items-center justify-center rounded-full border border-[#D37E90]/30 bg-white/60 text-sm text-[#D37E90] transition hover:bg-[#F5DDE1]"
            >
              ◎
            </a>
            <a
              href="mailto:valeriya.lazar.nails@gmail.com"
              aria-label="Email"
              className="flex h-8 w-8 items-center justify-center rounded-full border border-[#D37E90]/30 bg-white/60 text-sm text-[#D37E90] transition hover:bg-[#F5DDE1]"
            >
              ✉
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="mb-5 font-serif text-base text-[#2f2024]">Quick Links</h3>
          <div className="flex flex-col gap-3 text-xs">
            <Link to="/" className="transition hover:text-[#D37E90]">Home</Link>
            <Link to="/about" className="transition hover:text-[#D37E90]">About</Link>
            <Link to="/services" className="transition hover:text-[#D37E90]">Services</Link>
            <Link to="/gallery" className="transition hover:text-[#D37E90]">Gallery</Link>
            <Link to="/press-ons" className="transition hover:text-[#D37E90]">Press-Ons</Link>
            <Link to="/booking" className="transition hover:text-[#D37E90]">Book Now</Link>
          </div>
        </div>

        {/* Services */}
        <div>
          <h3 className="mb-5 font-serif text-base text-[#2f2024]">Services</h3>
          <div className="flex flex-col gap-3 text-xs">
            <Link to="/services" className="transition hover:text-[#D37E90]">Acrylic Nails</Link>
            <Link to="/services" className="transition hover:text-[#D37E90]">Gel / BIAB</Link>
            <Link to="/services" className="transition hover:text-[#D37E90]">Shellac</Link>
            <Link to="/services" className="transition hover:text-[#D37E90]">Nail Art</Link>
            <Link to="/press-ons" className="transition hover:text-[#D37E90]">Press-Ons</Link>
          </div>
        </div>

        {/* Contact */}
        <div>
          <h3 className="mb-5 font-serif text-base text-[#2f2024]">Contact</h3>
          <div className="flex flex-col gap-4 text-xs">
            <a
              href="mailto:valeriya.lazar.nails@gmail.com"
              className="flex items-start gap-3 transition hover:text-[#D37E90]"
            >
              <span className="mt-0.5 text-base text-[#D37E90]">✉</span>
              valeriya.lazar.nails@gmail.com
            </a>

            <a
              href="https://instagram.com/VLdnail"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 transition hover:text-[#D37E90]"
            >
              <span className="text-base text-[#D37E90]">◎</span>
              @VLdnail
            </a>

            <p className="flex items-start gap-3">
              <span className="mt-0.5 text-base text-[#D37E90]">⌖</span>
              Copperfield, Calgary, AB
            </p>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-[#F5DDE1]">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-3 px-8 py-4 text-xs text-[#9c7580] md:flex-row md:px-16">
          <p>© {new Date().getFullYear()} VLDNAIL. All rights reserved.</p>
          <p className="font-serif italic text-[#D37E90]">made with ♡</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
