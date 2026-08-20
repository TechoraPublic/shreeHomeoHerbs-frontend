import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export default function FinalCTA() {
  return (
    <section className="py-20 lg:py-24 bg-white">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-brand-50 to-earth-50 rounded-3xl px-8 py-16 lg:px-16 lg:py-20 text-center border border-brand-100">

          <span className="inline-block text-xs font-semibold text-brand-600 tracking-widest uppercase mb-4">
            Start Today
          </span>
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-5 leading-tight">
            Begin Your Natural
            <span className="block text-brand-600 italic font-medium">Care Journey</span>
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto leading-relaxed mb-10">
            Explore our collection of herbal and natural products and find the perfect fit for your everyday self-care routine.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/shop"
              className="inline-flex items-center justify-center gap-2 bg-brand-600 hover:bg-brand-700 text-white font-semibold px-8 py-4 rounded-full transition-all duration-300 hover:shadow-lg hover:shadow-brand-200 group"
            >
              Shop Now
              <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center justify-center gap-2 border-2 border-brand-200 text-brand-700 hover:border-brand-600 hover:bg-brand-50 font-semibold px-8 py-4 rounded-full transition-all duration-300"
            >
              Get in Touch
            </Link>
          </div>

        </div>
      </div>
    </section>
  );
}
