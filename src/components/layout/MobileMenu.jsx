import { Link, useLocation } from "react-router-dom";
import { X } from "lucide-react";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/shop" },
  { label: "Benefits", href: "/benefits" },
  { label: "About Us", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export default function MobileMenu({ isOpen, onClose }) {
  const { pathname } = useLocation();

  return (
    <div
      className={`fixed inset-0 z-50 transition-all duration-300 ${isOpen ? "visible" : "invisible"}`}
    >
      {/* Backdrop */}
      <div
        className={`absolute inset-0 bg-black/40 transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0"}`}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className={`absolute top-0 right-0 h-full w-72 bg-[#faf8f5] shadow-2xl transition-transform duration-300 ease-out flex flex-col ${isOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-brand-100">
          <span className="font-heading text-xl font-semibold text-brand-700">Menu</span>
          <button
            onClick={onClose}
            aria-label="Close menu"
            className="p-2 rounded-full hover:bg-brand-50 text-gray-600 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex flex-col px-6 py-6 gap-1">
          {navLinks.map(({ label, href }) => (
            <Link
              key={href}
              to={href}
              onClick={onClose}
              className={`py-3 px-4 rounded-xl font-medium text-base transition-colors duration-200 ${
                pathname === href
                  ? "bg-brand-100 text-brand-700"
                  : "text-gray-700 hover:bg-brand-50 hover:text-brand-700"
              }`}
            >
              {label}
            </Link>
          ))}
        </nav>

        <div className="mt-auto px-6 pb-8">
          <Link
            to="/shop"
            onClick={onClose}
            className="block w-full text-center bg-brand-600 hover:bg-brand-700 text-white font-medium py-3 rounded-full transition-colors duration-200"
          >
            Shop Now
          </Link>
        </div>
      </div>
    </div>
  );
}
