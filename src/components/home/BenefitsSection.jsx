import { Link } from "react-router-dom";
import {
  ArrowRight,
  Check,
  Droplets,
  Heart,
  Leaf,
  Sparkles,
  Sprout,
  Sun,
} from "lucide-react";

const BENEFITS_IMAGE = "https://thefarsal.com/cdn/shop/files/Brown_and_Olive_Neutral_Minimalist_Soap_Instagram_Post_2000_x_1000_px.png?v=1763018194&width=2000";

const benefits = [
  {
    icon: Leaf,
    title: "Natural Ingredients",
    description: "Made with carefully selected natural and herbal ingredients inspired by traditional wellness practices.",
  },
  {
    icon: Droplets,
    title: "Gentle on Skin",
    description: "Thoughtfully formulated for everyday care with a gentle approach to your skin and hair.",
  },
  {
    icon: Sprout,
    title: "Herbal Goodness",
    description: "Experience the nourishing power of herbs traditionally valued for their natural properties.",
  },
  {
    icon: Heart,
    title: "Everyday Self-Care",
    description: "Simple, effective products designed to make your daily self-care routine more enjoyable.",
  },
  {
    icon: Sparkle,
    title: "Thoughtfully Crafted",
    description: "Every product is created with attention to ingredients, quality, and the little details that matter.",
  },
  {
    icon: Sun,
    title: "Nature-Inspired Wellness",
    description: "Bring the calming and nourishing essence of nature into your everyday personal-care routine.",
  },
];

const highlights = [
  "100% Nature Inspired",
  "Herbal Ingredients",
  "Everyday Care",
  "Made with Purpose",
];

const differencePoints = [
  "Carefully selected ingredients",
  "Designed for everyday routines",
  "Inspired by traditional herbal wisdom",
];

export default function BenefitsSection() {
  return (
    <div className="overflow-hidden bg-earth-50 text-gray-800">
      <section className="relative isolate bg-brand-50 px-4 pb-20 pt-28 sm:px-6 lg:px-8 lg:pb-28 lg:pt-40">
        <div className="benefit-leaf benefit-leaf-one" />
        <div className="benefit-leaf benefit-leaf-two" />
        <div className="relative mx-auto max-w-4xl text-center benefit-fade-up">
          <span className="mb-5 inline-block text-xs font-semibold tracking-[0.24em] text-brand-600">
            WHY HERBONATURE
          </span>
          <h1 className="font-heading text-4xl font-semibold leading-tight text-brand-900 sm:text-5xl lg:text-7xl">
            Nature&apos;s Benefits,
            <span className="block text-brand-600 italic">Made for You</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-gray-600 sm:text-lg">
            Discover the natural goodness behind every HerboNature product, thoughtfully created to support healthier skin, hair, and everyday self-care.
          </p>
          <Link
            to="/shop"
            className="mt-9 inline-flex items-center gap-2 rounded-full bg-brand-700 px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-brand-900/10 transition-all duration-300 hover:-translate-y-0.5 hover:bg-brand-800 hover:shadow-xl group"
          >
            Explore Our Products
            <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>
      </section>

      <section className="px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 max-w-2xl">
            <span className="text-xs font-semibold tracking-[0.2em] text-brand-600">THE HERBONATURE PROMISE</span>
            <h2 className="mt-3 font-heading text-3xl font-semibold text-brand-900 sm:text-4xl">
              Care that keeps nature close.
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {benefits.map(({ icon: Icon, title, description }, index) => (
              <article
                key={title}
                className="benefit-card group rounded-2xl border border-brand-100/70 bg-white p-7 shadow-sm transition-all duration-500 hover:-translate-y-2 hover:border-brand-300 hover:shadow-[0_18px_40px_rgba(95,114,40,0.12)]"
                style={{ animationDelay: `${index * 80}ms` }}
              >
                <div className="mb-8 flex items-start justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-100 text-brand-600 transition-transform duration-500 group-hover:scale-110 group-hover:bg-brand-600 group-hover:text-white">
                    <Icon size={21} strokeWidth={1.7} />
                  </div>
                  <span className="font-heading text-lg text-brand-300">0{index + 1}</span>
                </div>
                <h3 className="font-heading text-xl font-semibold text-brand-900">{title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-gray-500">{description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-earth-200 bg-white px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="mx-auto max-w-7xl lg:flex lg:items-center lg:justify-between lg:gap-10">
          <h2 className="font-heading text-3xl font-semibold text-brand-900 sm:text-4xl">
            Natural care. <span className="text-brand-600 italic">Thoughtfully created.</span>
          </h2>
          <div className="mt-10 grid grid-cols-2 gap-x-8 gap-y-8 sm:grid-cols-4 lg:mt-0 lg:flex-1 lg:justify-end lg:gap-12">
            {highlights.map((highlight) => (
              <div key={highlight} className="max-w-[130px]">
                <div className="mb-3 h-1 w-8 bg-brand-400" />
                <p className="font-heading text-lg leading-tight text-brand-800">{highlight}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
          <div className="benefit-image-wrap relative mx-auto w-full max-w-lg">
            <div className="absolute -left-5 -top-5 h-24 w-24 rounded-full border border-brand-300/60" />
            <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] bg-brand-100 shadow-xl">
              <img src={BENEFITS_IMAGE} alt="Natural herbal care products" className="h-full w-full object-cover" />
            </div>
            <div className="absolute -bottom-5 -right-4 rounded-2xl bg-white px-5 py-4 shadow-xl sm:-right-8">
              <Leaf size={19} className="mb-2 text-brand-600" />
              <p className="font-heading text-lg text-brand-800">Rooted in nature</p>
            </div>
          </div>
          <div>
            <span className="text-xs font-semibold tracking-[0.2em] text-brand-600">THE HERBONATURE DIFFERENCE</span>
            <h2 className="mt-4 font-heading text-3xl font-semibold leading-tight text-brand-900 sm:text-5xl">
              Simple care, inspired by nature.
            </h2>
            <p className="mt-6 max-w-xl leading-relaxed text-gray-500">
              At HerboNature, we believe everyday self-care should feel simple, mindful, and connected to nature. Our products bring together herbal inspiration and modern everyday routines.
            </p>
            <ul className="mt-8 space-y-4">
              {differencePoints.map((point) => (
                <li key={point} className="flex items-center gap-3 text-sm text-gray-600">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-100 text-brand-600"><Check size={14} /></span>
                  {point}
                </li>
              ))}
            </ul>
            <Link to="/about" className="mt-9 inline-flex items-center gap-2 rounded-full border-2 border-brand-200 px-7 py-3.5 text-sm font-semibold text-brand-700 transition-all duration-300 hover:border-brand-600 hover:bg-brand-50 group">
              Discover HerboNature
              <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </section>

     
    </div>
  );
}
