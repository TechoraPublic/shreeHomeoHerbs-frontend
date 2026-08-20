import { Leaf, Droplets, Shield, Heart, Sprout, Star } from "lucide-react";

const benefits = [
  {
    icon: Leaf,
    title: "100% Natural",
    description: "Every product is formulated with natural and herbal ingredients, free from harsh synthetic chemicals.",
  },
  {
    icon: Sprout,
    title: "Herbal Wisdom",
    description: "Inspired by time-tested traditional herbal knowledge passed down through generations.",
  },
  {
    icon: Shield,
    title: "Gentle & Safe",
    description: "Carefully crafted to be gentle on your skin and hair, suitable for everyday use.",
  },
  {
    icon: Droplets,
    title: "Deep Nourishment",
    description: "Rich herbal formulations that nourish from within for lasting results.",
  },
  {
    icon: Heart,
    title: "Made with Care",
    description: "Each product is crafted with attention to quality and your well-being in mind.",
  },
  {
    icon: Star,
    title: "Trusted Quality",
    description: "Consistent quality you can rely on for your daily self-care routine.",
  },
];

export default function BenefitsSection() {
  return (
    <section className="py-20 lg:py-28 bg-brand-50">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Heading */}
        <div className="text-center mb-14">
          <span className="inline-block text-xs font-semibold text-brand-600 tracking-widest uppercase mb-3">
            Why Us
          </span>
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Why Choose HerboNature?
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto leading-relaxed">
            We believe in the power of nature to care for your skin and hair the way it was always meant to be.
          </p>
          <div className="mt-5 flex justify-center">
            <div className="w-16 h-0.5 bg-brand-400 rounded-full" />
          </div>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {benefits.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="bg-white rounded-2xl p-7 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 group"
            >
              <div className="w-12 h-12 rounded-xl bg-brand-100 flex items-center justify-center mb-5 group-hover:bg-brand-600 transition-colors duration-300">
                <Icon size={22} className="text-brand-600 group-hover:text-white transition-colors duration-300" />
              </div>
              <h3 className="font-heading text-lg font-semibold text-gray-800 mb-2">{title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{description}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
