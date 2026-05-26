import { Link } from "react-router-dom";
import logo from "../../assets/logo.png";

function Navbar() {
  return (
    <header className="border-b border-[#F5DDE1] bg-[#FAEDEF]">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-8 py-4">
        {/* Left Navigation */}
        <div className="hidden items-center gap-8 md:flex">
          <Link
            to="/"
            className="text-sm text-[#D37E90] transition hover:text-[#b85f72]"
          >
            Home
          </Link>

          <Link
            to="/about"
            className="text-sm text-[#D37E90] transition hover:text-[#b85f72]"
          >
            About
          </Link>

          <Link
            to="/services"
            className="text-sm text-[#D37E90] transition hover:text-[#b85f72]"
          >
            Services
          </Link>

          <Link
            to="/gallery"
            className="text-sm text-[#D37E90] transition hover:text-[#b85f72]"
          >
            Gallery
          </Link>
        </div>

        {/* Logo */}
        <Link to="/" className="flex items-center justify-center">
          <img
            src={logo}
            alt="VLDNAIL Logo"
            className="h-14 w-auto object-contain"
          />
        </Link>

        {/* Right Side */}
        <div className="flex items-center gap-5">
          <button className="text-[#D37E90] transition hover:text-[#b85f72]">
            ⌕
          </button>

          <button className="text-[#D37E90] transition hover:text-[#b85f72]">
            ♡
          </button>

          <Link
            to="/booking"
            className="rounded-md bg-[#D37E90] px-5 py-2 text-sm font-medium text-white transition hover:bg-[#c86f82]"
          >
            Book Now
          </Link>
        </div>
      </nav>
    </header>
  );
}

export default Navbar;