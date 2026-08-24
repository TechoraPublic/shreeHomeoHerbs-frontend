import { useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Leaf } from "lucide-react";
import ProductImage from "../ui/ProductImage";

const HERO_BANNER = "https://thefarsal.com/cdn/shop/files/Brown_and_Olive_Neutral_Minimalist_Soap_Instagram_Post_2000_x_1000_px.png?v=1763018194&width=2000";

export default function Hero() {
  const imageRef = useRef(null);

  function handlePointerMove(event) {
    if (!imageRef.current || event.pointerType === "touch") return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - 0.5;
    const y = (event.clientY - bounds.top) / bounds.height - 0.5;
    imageRef.current.style.setProperty("--hero-x", `${x * 12}px`);
    imageRef.current.style.setProperty("--hero-y", `${y * 12}px`);
  }

  function resetPointer() {
    imageRef.current?.style.setProperty("--hero-x", "0px");
    imageRef.current?.style.setProperty("--hero-y", "0px");
  }

  return (
    <section className="hero-section relative min-h-screen flex items-center overflow-hidden bg-[#f5f7f0]" onPointerMove={handlePointerMove} onPointerLeave={resetPointer}>
      {/* Decorative background blobs */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-brand-50 rounded-bl-[80px] lg:rounded-bl-[120px] -z-0" />
      <div className="absolute bottom-10 left-10 w-32 h-32 rounded-full bg-brand-100/60 blur-3xl" />
      <div className="absolute top-20 right-20 w-48 h-48 rounded-full bg-earth-100/40 blur-3xl" />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 pt-24 pb-16 lg:pt-32 lg:pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">

          {/* Text side */}
          <div className="order-2 lg:order-1 text-center lg:text-left">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-brand-100 text-brand-700 text-xs font-semibold px-4 py-2 rounded-full mb-6 tracking-widest uppercase">
              <Leaf size={12} />
              100% Natural &amp; Herbal
            </div>

            <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-gray-900 leading-[1.1] mb-6">
              Nature's Best
              <span className="block text-brand-600 italic font-medium mt-1">
                For Your Skin
              </span>
              <span className="block text-3xl sm:text-4xl lg:text-5xl font-normal text-gray-600 mt-2">
                &amp; Hair
              </span>
            </h1>

            <p className="text-base sm:text-lg text-gray-500 leading-relaxed max-w-md mx-auto lg:mx-0 mb-8">
              Discover our range of pure herbal and natural products crafted with traditional wisdom for your everyday self-care routine.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link
                to="/shop"
                className="inline-flex items-center justify-center gap-2 bg-brand-600 hover:bg-brand-700 text-white font-semibold px-8 py-4 rounded-full transition-all duration-300 hover:shadow-lg hover:shadow-brand-200 group"
              >
                Shop Now
                <ArrowRight size={18} className="transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
              <Link
                to="/about"
                className="inline-flex items-center justify-center gap-2 border-2 border-brand-200 text-brand-700 hover:border-brand-600 hover:bg-brand-50 font-semibold px-8 py-4 rounded-full transition-all duration-300"
              >
                Our Story
              </Link>
            </div>

            {/* Trust badges */}
            <div className="flex items-center gap-6 mt-10 justify-center lg:justify-start">
              {[
                { value: "100%", label: "Natural" },
                { value: "No", label: "Chemicals" },
                { value: "Pure", label: "Herbal" },
              ].map(({ value, label }) => (
                <div key={label} className="text-center">
                  <div className="font-heading text-xl font-bold text-brand-700">{value}</div>
                  <div className="text-xs text-gray-500 tracking-wide">{label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Image side */}
          <div className="order-1 lg:order-2 flex justify-center lg:justify-end" data-reveal>
            <div className="relative hero-image-wrap" ref={imageRef}>
              {/* Decorative ring */}
              <div className="absolute inset-0 rounded-full border-2 border-dashed border-brand-200 scale-110 animate-[spin_30s_linear_infinite]" />
              {/* Image container */}
              <div className="relative w-72 h-72 sm:w-96 sm:h-96 lg:w-[480px] lg:h-[480px] rounded-full overflow-hidden border-8 border-white shadow-2xl shadow-brand-200/50">
                <ProductImage
                  src={HERO_BANNER}
                  alt="Natural herbal products by HerboNature"
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Floating badge */}
              <div className="absolute -bottom-4 -left-4 bg-white rounded-2xl shadow-lg px-4 py-3 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-brand-100 flex items-center justify-center">
                  <Leaf size={18} className="text-brand-600" />
                </div>
                <div>
                  <div className="text-xs text-gray-500">Trusted by</div>
                  <div className="font-heading font-bold text-gray-800 text-sm">1000+ Customers</div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
          <path d="M0 60L1440 60L1440 20C1200 60 960 0 720 20C480 40 240 0 0 20L0 60Z" fill="#faf8f5" />
        </svg>
      </div>
    </section>
  );
}
