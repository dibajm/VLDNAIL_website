import { Link } from "react-router-dom";
import logo from "../../assets/logo.png";

function Footer() {
  return (
    <footer className="border-t border-[#F5DDE1] bg-[#FAEDEF]">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 px-8 py-9 text-sm text-[#6f5a60] md:grid-cols-[1.5fr_1fr_1fr_1.4fr]">
        <div>
          <img src={logo} alt="VLDNAIL Logo" className="h-16 w-auto" />

          <div className="mt-8 flex items-center gap-5 text-[#D37E90]">
            <a href="#" aria-label="Instagram" className="text-xl">
              ◎
            </a>
            <a href="#" aria-label="TikTok" className="text-xl">
              ♪
            </a>
            <a href="#" aria-label="Facebook" className="text-xl">
              f
            </a>
          </div>
        </div>

        <div>
          <h3 className="mb-5 font-serif text-lg text-[#2f2024]">
            Quick Links
          </h3>

          <div className="flex flex-col gap-3 text-xs">
            <Link to="/">Home</Link>
            <Link to="/about">About</Link>
            <Link to="/services">Services</Link>
            <Link to="/gallery">Gallery</Link>
            <Link to="/contact">Contact</Link>
          </div>
        </div>

        <div>
          <h3 className="mb-5 font-serif text-lg text-[#2f2024]">Services</h3>

          <div className="flex flex-col gap-3 text-xs">
            <Link to="/services">Acrylic Nails</Link>
            <Link to="/services">Gel / BIAB</Link>
            <Link to="/services">Shellac</Link>
            <Link to="/services">Nail Art</Link>
            <Link to="/press-ons">3D Designs</Link>
          </div>
        </div>

        <div>
          <h3 className="mb-5 font-serif text-lg text-[#2f2024]">
            Contact Us
          </h3>

          <div className="flex flex-col gap-4 text-xs">
            <p className="flex gap-3">
              <span className="text-lg text-[#D37E90]">♡</span>
              <span>+44 1234 567890</span>
            </p>

            <p className="flex gap-3">
              <span className="text-lg text-[#D37E90]">✉</span>
              <span>hello@vldnail.com</span>
            </p>

            <p className="flex gap-3">
              <span className="text-lg text-[#D37E90]">⌖</span>
              <span>
                123 Beauty Street,
                <br />
                London, UK
              </span>
            </p>
          </div>
        </div>
      </div>

      <div className="border-t border-[#F5DDE1]">
        <div className="mx-auto flex max-w-6xl flex-col justify-between gap-4 px-8 py-4 text-xs text-[#7d686e] md:flex-row">
          <p>© 2024 VLDNAIL. All rights reserved.</p>

          <div className="flex gap-10">
            <Link to="/privacy-policy">Privacy Policy</Link>
            <Link to="/terms">Terms & Conditions</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;