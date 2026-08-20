import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { ShoppingCart, Menu, Leaf, Heart, User } from "lucide-react";
import MobileMenu from "./MobileMenu";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import { useAuth } from "../../context/AuthContext";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/shop" },
  { label: "Benefits", href: "/benefits" },
  { label: "About Us", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { pathname } = useLocation();
  const { cartCount } = useCart();
  const { wishlistCount } = useWishlist();
  const { isLoggedIn } = useAuth();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => { setMenuOpen(false); }, [pathname]);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          scrolled
            ? "bg-white/95 backdrop-blur-md shadow-sm border-b border-brand-100"
            : "bg-white/90 backdrop-blur-sm"
        }`}
      >
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">

            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-full bg-brand-600 flex items-center justify-center shadow-sm group-hover:bg-brand-700 transition-colors">
                <Leaf size={18} className="text-white" />
              </div>
              <div className="leading-tight">
                <span className="block font-heading text-lg font-bold text-brand-800 tracking-tight">
                  HerboNature
                </span>
                <span className="block text-[10px] font-medium text-brand-500 tracking-widest uppercase -mt-0.5">
                  Natural &amp; Herbal
                </span>
              </div>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-1">
              {navLinks.map(({ label, href }) => (
                <Link
                  key={href}
                  to={href}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${
                    pathname === href
                      ? "bg-brand-100 text-brand-700"
                      : "text-gray-600 hover:text-brand-700 hover:bg-brand-50"
                  }`}
                >
                  {label}
                </Link>
              ))}
            </nav>

            {/* Right actions */}
            <div className="flex items-center gap-1">
              {/* Wishlist */}
              <Link
                to="/wishlist"
                aria-label={`Wishlist (${wishlistCount} items)`}
                className="relative p-2.5 rounded-full text-gray-600 hover:text-rose-500 hover:bg-rose-50 transition-colors duration-200"
              >
                <Heart size={20} />
                {wishlistCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center leading-none">
                    {wishlistCount > 9 ? "9+" : wishlistCount}
                  </span>
                )}
              </Link>

              {/* Profile */}
              <Link
                to="/profile"
                aria-label="My Account"
                className={`relative p-2.5 rounded-full transition-colors duration-200 ${
                  pathname === "/profile" ? "bg-brand-100 text-brand-700" : "text-gray-600 hover:text-brand-700 hover:bg-brand-50"
                }`}
              >
                <User size={20} />
                {isLoggedIn && <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-brand-500 rounded-full" />}
              </Link>

              {/* Cart */}
              <Link
                to="/cart"
                aria-label={`Cart (${cartCount} items)`}
                className="relative p-2.5 rounded-full text-gray-600 hover:text-brand-700 hover:bg-brand-50 transition-colors duration-200"
              >
                <ShoppingCart size={20} />
                {cartCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-brand-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center leading-none">
                    {cartCount > 9 ? "9+" : cartCount}
                  </span>
                )}
              </Link>

              {/* Mobile menu button */}
              <button
                onClick={() => setMenuOpen(true)}
                aria-label="Open menu"
                className="lg:hidden p-2.5 rounded-full text-gray-600 hover:text-brand-700 hover:bg-brand-50 transition-colors duration-200"
              >
                <Menu size={22} />
              </button>
            </div>

          </div>
        </div>
      </header>

      <MobileMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}
