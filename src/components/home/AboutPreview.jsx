import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle } from "lucide-react";
import ProductImage from "../ui/ProductImage";

const ABOUT_IMG = "https://thefarsal.com/cdn/shop/files/Brown_and_Olive_Neutral_Minimalist_Soap_Instagram_Post_2000_x_1000_px.png?v=1763018194&width=2000";

const highlights = [
  "Rooted in traditional herbal knowledge",
  "Carefully selected natural ingredients",
  "Crafted for everyday self-care",
  "Gentle formulations for all skin types",
];

export default function AboutPreview() {
  return (
    <section className="py-20 lg:py-28 bg-[#faf8f5]">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          {/* Image side */}
          <div className="relative">
            <div className="relative rounded-3xl overflow-hidden aspect-[4/5] bg-brand-100 shadow-xl">
              <ProductImage
                src={ABOUT_IMG}
                alt="HerboNature brand story — natural herbal ingredients"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Floating stat card */}
            <div className="absolute -right-4 lg:-right-8 bottom-8 bg-white rounded-2xl shadow-xl p-5 max-w-[160px]">
              <div className="font-heading text-3xl font-bold text-brand-700 mb-1">10+</div>
              <div className="text-xs text-gray-500 leading-snug">Years of Herbal Expertise</div>
            </div>

            {/* Decorative dot grid */}
            <div className="absolute -left-4 -top-4 w-24 h-24 opacity-30"
              style={{
                backgroundImage: "radial-gradient(circle, #7a9035 1px, transparent 1px)",
                backgroundSize: "8px 8px",
              }}
            />
          </div>

          {/* Text side */}
          <div>
            <span className="inline-block text-xs font-semibold text-brand-600 tracking-widest uppercase mb-4">
              Our Story
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight mb-6">
              Rooted in Nature,
              <span className="block text-brand-600 italic font-medium">Crafted with Care</span>
            </h2>
            <p className="text-gray-500 leading-relaxed mb-5">
              At HerboNature, we believe that the best care comes from nature itself. Our products are inspired by traditional herbal wisdom and crafted to bring the goodness of natural ingredients into your daily routine.
            </p>
            <p className="text-gray-500 leading-relaxed mb-8">
              Every formulation is thoughtfully made with carefully selected herbs and natural extracts, keeping your skin and hair's well-being at the heart of everything we do.
            </p>

            <ul className="space-y-3 mb-10">
              {highlights.map((item) => (
                <li key={item} className="flex items-center gap-3 text-sm text-gray-600">
                  <CheckCircle size={16} className="text-brand-500 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>

            <Link
              to="/about"
              className="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white font-semibold px-8 py-4 rounded-full transition-all duration-300 hover:shadow-lg hover:shadow-brand-200 group"
            >
              Discover Our Story
              <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>

        </div>
      </div>
    </section>
  );
}
