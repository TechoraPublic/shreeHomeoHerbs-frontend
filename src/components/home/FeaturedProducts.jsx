import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { products } from "../../data/products";
import ProductCard from "../products/ProductCard";

export default function FeaturedProducts() {
  const featured = products.filter((p) => p.featured);

  return (
    <section className="py-20 lg:py-28 bg-[#faf8f5]" data-reveal>
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Heading */}
        <div className="text-center mb-14">
          <span className="inline-block text-xs font-semibold text-brand-600 tracking-widest uppercase mb-3">
            Our Collection
          </span>
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Featured Products
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto leading-relaxed">
            Handpicked herbal formulations crafted with care for your skin and hair.
          </p>
          <div className="mt-5 flex justify-center">
            <div className="w-16 h-0.5 bg-brand-400 rounded-full" />
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featured.map((product, index) => (
            <div key={product.id} data-reveal style={{ "--reveal-delay": `${index * 80}ms` }}>
              <ProductCard product={product} />
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 border-2 border-brand-600 text-brand-700 hover:bg-brand-600 hover:text-white font-semibold px-8 py-3.5 rounded-full transition-all duration-300 group"
          >
            View All Products
            <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>

      </div>
    </section>
  );
}
