import { Link } from "react-router-dom";
import { Leaf, Share2, Globe, MessageCircle, Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-brand-900 text-brand-100" data-reveal>
      {/* Main footer */}
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Brand */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-full bg-brand-500 flex items-center justify-center">
                <Leaf size={18} className="text-white" />
              </div>
              <div className="leading-tight">
                <span className="block font-heading text-lg font-bold text-white">HerboNature</span>
                <span className="block text-[10px] tracking-widest uppercase text-brand-300 -mt-0.5">Natural &amp; Herbal</span>
              </div>
            </Link>
            <p className="text-sm text-brand-300 leading-relaxed mb-5">
              Crafting pure herbal and natural products inspired by traditional wisdom for your everyday self-care.
            </p>
            <div className="flex gap-3">
              {/* TODO: Replace # with actual social URLs */}
              <a href="#" aria-label="Instagram" className="w-9 h-9 rounded-full bg-brand-700 hover:bg-brand-500 flex items-center justify-center transition-colors duration-200">
                <MessageCircle size={16} />
              </a>
              <a href="#" aria-label="Facebook" className="w-9 h-9 rounded-full bg-brand-700 hover:bg-brand-500 flex items-center justify-center transition-colors duration-200">
                <Globe size={16} />
              </a>
              <a href="#" aria-label="Share" className="w-9 h-9 rounded-full bg-brand-700 hover:bg-brand-500 flex items-center justify-center transition-colors duration-200">
                <Share2 size={16} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-heading text-white font-semibold text-base mb-5 tracking-wide">Quick Links</h4>
            <ul className="space-y-3">
              {[
                { label: "Home", href: "/" },
                { label: "Shop", href: "/shop" },
                { label: "About Us", href: "/about" },
                { label: "Benefits", href: "/benefits" },
                { label: "Contact", href: "/contact" },
              ].map(({ label, href }) => (
                <li key={href}>
                  <Link to={href} className="text-sm text-brand-300 hover:text-white transition-colors duration-200">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-heading text-white font-semibold text-base mb-5 tracking-wide">Categories</h4>
            <ul className="space-y-3">
              {[
                { label: "Herbal Soaps", href: "/soaps" },
                { label: "Hair Care", href: "/hair-care" },
                { label: "All Products", href: "/shop" },
              ].map(({ label, href }) => (
                <li key={href}>
                  <Link to={href} className="text-sm text-brand-300 hover:text-white transition-colors duration-200">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-heading text-white font-semibold text-base mb-5 tracking-wide">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-sm text-brand-300">
                <MapPin size={15} className="mt-0.5 shrink-0 text-brand-400" />
                {/* TODO: Replace with actual address */}
                <span>Your Address, City, State — PIN</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-brand-300">
                <Phone size={15} className="shrink-0 text-brand-400" />
                {/* TODO: Replace with actual phone */}
                <a href="tel:+910000000000" className="hover:text-white transition-colors">+91 00000 00000</a>
              </li>
              <li className="flex items-center gap-3 text-sm text-brand-300">
                <Mail size={15} className="shrink-0 text-brand-400" />
                {/* TODO: Replace with actual email */}
                <a href="mailto:hello@herbonature.com" className="hover:text-white transition-colors">hello@herbonature.com</a>
              </li>
            </ul>
          </div>

        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-brand-800">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-brand-400">
            © {new Date().getFullYear()} HerboNature. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <Link to="/privacy-policy" className="text-xs text-brand-500 hover:text-brand-300 transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="text-xs text-brand-500 hover:text-brand-300 transition-colors">Terms &amp; Conditions</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
