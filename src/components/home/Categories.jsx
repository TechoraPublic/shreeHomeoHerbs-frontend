import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { categories } from "../../data/products";
import ProductImage from "../ui/ProductImage";

const PLACEHOLDER_COLORS = ["#d2dbb2", "#e4d9c8", "#c8d4b2"];

export default function Categories() {
  return (
    <section className="py-20 lg:py-28 bg-white" data-reveal>
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Heading */}
        <div className="text-center mb-14">
          <span className="inline-block text-xs font-semibold text-brand-600 tracking-widest uppercase mb-3">
            Browse By
          </span>
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Shop by Category
          </h2>
          <div className="mt-5 flex justify-center">
            <div className="w-16 h-0.5 bg-brand-400 rounded-full" />
          </div>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 lg:gap-8">
          {categories.map((cat, i) => (
            <Link
              key={cat.id}
              to={cat.href}
              data-reveal
              style={{ "--reveal-delay": `${i * 100}ms` }}
              className="group relative overflow-hidden rounded-3xl aspect-[4/5] flex flex-col justify-end shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-1 category-card"
            >
              {/* Background image */}
              <ProductImage
                src={cat.image}
                alt={cat.name}
                loading="lazy"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              {/* Fallback color */}
              <div
                className="absolute inset-0 -z-10"
                style={{ backgroundColor: PLACEHOLDER_COLORS[i] }}
              />
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-brand-900/80 via-brand-900/20 to-transparent" />

              {/* Content */}
              <div className="relative z-10 p-6 lg:p-8">
                <h3 className="font-heading text-2xl font-bold text-white mb-2">{cat.name}</h3>
                <p className="text-brand-100 text-sm leading-relaxed mb-4 opacity-90">{cat.description}</p>
                <span className="inline-flex items-center gap-2 text-white text-sm font-semibold border border-white/40 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-full transition-colors duration-200 backdrop-blur-sm">
                  Explore
                  <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1" />
                </span>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}
