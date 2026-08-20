import { Link } from "react-router-dom";
import { ArrowRight, Leaf } from "lucide-react";
import ProductImage from "../ui/ProductImage";

const PROMO_BANNER = "https://thefarsal.com/cdn/shop/files/Brown_and_Olive_Neutral_Minimalist_Soap_Instagram_Post_2000_x_1000_px.png?v=1763018194&width=2000";

export default function PromoBanner() {
  return (
    <section className="relative py-24 lg:py-36 overflow-hidden bg-brand-800">
      {/* Background texture / decorative elements */}
      <div className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: "radial-gradient(circle at 20% 50%, #b5c480 0%, transparent 50%), radial-gradient(circle at 80% 20%, #96aa52 0%, transparent 40%)",
        }}
      />
      <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-brand-600/20 blur-3xl" />
      <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-brand-500/20 blur-3xl" />

      {/* TODO: Replace with actual promo banner image as background */}
      <ProductImage
        src={PROMO_BANNER}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 w-full h-full object-cover opacity-20 mix-blend-luminosity"
      />

      <div className="relative z-10 mx-auto w-full max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
        <div className="inline-flex items-center gap-2 bg-brand-600/40 border border-brand-400/30 text-brand-200 text-xs font-semibold px-4 py-2 rounded-full mb-6 tracking-widest uppercase backdrop-blur-sm">
          <Leaf size={12} />
          Pure · Natural · Herbal
        </div>

        <h2 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
          Discover Your
          <span className="block text-brand-300 italic font-medium mt-1">
            Natural Care Routine
          </span>
        </h2>

        <p className="text-brand-200 text-lg leading-relaxed max-w-2xl mx-auto mb-10">
          Explore our complete collection of herbal soaps, hair care, and wellness products — all crafted with nature's finest ingredients.
        </p>

        <Link
          to="/shop"
          className="inline-flex items-center gap-3 bg-white text-brand-800 hover:bg-brand-50 font-bold px-10 py-4 rounded-full transition-all duration-300 hover:shadow-2xl hover:shadow-brand-900/30 group text-base"
        >
          Shop the Collection
          <ArrowRight size={18} className="transition-transform duration-300 group-hover:translate-x-1" />
        </Link>
      </div>
    </section>
  );
}
