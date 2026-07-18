import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import logo from "../../assets/logo.png";

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/services", label: "Services" },
  { to: "/gallery", label: "Gallery" },
  { to: "/press-ons", label: "Press-Ons" },
];

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 10);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

  return (
    <header
      className={`sticky top-0 z-50 border-b border-[#F5DDE1] bg-[#FAEDEF] transition-shadow duration-300 ${
        scrolled ? "shadow-md" : "shadow-none"
      }`}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 md:px-16">
        {/* Left — desktop nav */}
        <div className="hidden flex-1 items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="text-sm text-[#D37E90] transition hover:text-[#b85f72]"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Logo — always centered */}
        <Link to="/" className="flex items-center justify-center">
          <img
            src={logo}
            alt="VLDNAIL Logo"
            className="h-14 w-auto object-contain"
          />
        </Link>

        {/* Right — desktop CTA + mobile hamburger */}
        <div className="flex flex-1 items-center justify-end gap-4">
          <Link
            to="/booking"
            className="hidden rounded-md bg-[#D37E90] px-5 py-2 text-sm font-medium text-white transition hover:bg-[#c86f82] md:inline-flex"
          >
            Book Now
          </Link>

          {/* Hamburger — mobile only */}
          <button
            onClick={() => setMenuOpen((o) => !o)}
            className="flex flex-col items-center justify-center gap-1.5 md:hidden"
            aria-label="Toggle menu"
          >
            <span
              className={`block h-0.5 w-6 bg-[#D37E90] transition-all duration-300 ${
                menuOpen ? "translate-y-2 rotate-45" : ""
              }`}
            />
            <span
              className={`block h-0.5 w-6 bg-[#D37E90] transition-all duration-300 ${
                menuOpen ? "opacity-0" : ""
              }`}
            />
            <span
              className={`block h-0.5 w-6 bg-[#D37E90] transition-all duration-300 ${
                menuOpen ? "-translate-y-2 -rotate-45" : ""
              }`}
            />
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <div
        className={`overflow-hidden transition-all duration-300 md:hidden ${
          menuOpen ? "max-h-96" : "max-h-0"
        }`}
      >
        <div className="flex flex-col border-t border-[#F5DDE1] px-6 py-4 gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="rounded-lg px-3 py-3 text-sm text-[#D37E90] transition hover:bg-[#F5DDE1]"
            >
              {link.label}
            </Link>
          ))}
          <Link
            to="/booking"
            className="mt-3 rounded-md bg-[#D37E90] px-5 py-3 text-center text-sm font-medium text-white transition hover:bg-[#c86f82]"
          >
            Book Now
          </Link>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
