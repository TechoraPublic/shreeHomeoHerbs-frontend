import { Leaf, Heart, Shield, Users, Award, Sprout } from "lucide-react";
import { Link } from "react-router-dom";

const VALUES = [
  { icon: Leaf, title: "100% Natural", desc: "Every ingredient is carefully sourced from nature — no harsh chemicals, no synthetic additives." },
  { icon: Shield, title: "Safe & Tested", desc: "All products are dermatologically tested and safe for everyday use on all skin types." },
  { icon: Heart, title: "Made with Love", desc: "Handcrafted in small batches to ensure quality, freshness, and care in every product." },
  { icon: Sprout, title: "Eco-Friendly", desc: "Sustainable sourcing and minimal packaging — because we care about the planet too." },
];

const TEAM = [
  { name: "Dr. Sneha Navadiya (B.H.M.S)", role: "Founder and Manager", initials: "SN" },
  { name: "Deep Navadiya (B.Sc Bio Tech, MBA)", role: "Co-Founder", initials: "DN" },
  { name: "Kartika Patel (M.Sc Bio Tech)", role: "Quality Reviewer", initials: "KP" },
];

const STATS = [
  { value: "5000+", label: "Happy Customers" },
  { value: "15+", label: "Herbal Products" },
  { value: "100%", label: "Natural Ingredients" },
  { value: "4.8★", label: "Average Rating" },
];

export default function About() {
  return (
    <main className="min-h-screen bg-[#faf8f5]">
      {/* Hero */}
      <section className="bg-white border-b border-brand-100 pt-28 pb-16">
        <div className="mx-auto w-full max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          
          <h1 className="font-heading text-4xl sm:text-5xl font-bold text-gray-900 mb-5 leading-tight">
            Nature's Wisdom, <br className="hidden sm:block" />
            <span className="text-brand-600">Bottled with Care</span>
          </h1>
          <p className="text-gray-500 text-lg leading-relaxed max-w-2xl mx-auto">
            HerboNature was born from a simple belief — that the best skincare comes from the earth. We blend ancient herbal traditions with modern formulation to bring you products that truly work.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-brand-600 py-12">
        <div className="mx-auto w-full max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
            {STATS.map(({ value, label }) => (
              <div key={label}>
                <p className="font-heading text-3xl font-bold text-white mb-1">{value}</p>
                <p className="text-brand-200 text-sm">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-16">
        <div className="mx-auto w-full max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-xs font-bold text-brand-600 uppercase tracking-widest">Our Mission</span>
              <h2 className="font-heading text-3xl font-bold text-gray-900 mt-2 mb-4">
                Bringing Traditional Herbal Wisdom to Modern Life
              </h2>
              <p className="text-gray-500 leading-relaxed mb-4">
                We started HerboNature with a mission to make authentic herbal skincare accessible to everyone. Inspired by generations of traditional Indian herbal knowledge, we craft each product with the finest natural ingredients.
              </p>
              <p className="text-gray-500 leading-relaxed mb-6">
                From our Berberis Soap to our Aamlica Hair Growth Serum, every product is a result of careful research, traditional wisdom, and a deep respect for nature.
              </p>
              <Link
                to="/shop"
                className="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white font-semibold px-6 py-3 rounded-full transition-colors"
              >
                <Leaf size={16} />
                Explore Our Products
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {VALUES.map(({ icon: Icon, title, desc }) => (
                <div key={title} className="bg-white rounded-2xl p-5 shadow-sm border border-brand-50">
                  <div className="w-10 h-10 rounded-xl bg-brand-100 flex items-center justify-center mb-3">
                    <Icon size={18} className="text-brand-600" />
                  </div>
                  <h3 className="font-heading font-semibold text-gray-800 text-sm mb-1">{title}</h3>
                  <p className="text-xs text-gray-500 leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-16 bg-white border-t border-brand-50">
        <div className="mx-auto w-full max-w-5xl px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-xs font-bold text-brand-600 uppercase tracking-widest">The People</span>
          <h2 className="font-heading text-3xl font-bold text-gray-900 mt-2 mb-10">Meet Our Team</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {TEAM.map(({ name, role, initials }) => (
              <div key={name} className="bg-[#faf8f5] rounded-2xl p-8 border border-brand-50">
                <div className="w-16 h-16 rounded-full bg-brand-600 flex items-center justify-center mx-auto mb-4">
                  <span className="font-heading text-xl font-bold text-white">{initials}</span>
                </div>
                <h3 className="font-heading font-semibold text-gray-800 mb-1">{name}</h3>
                <p className="text-sm text-brand-600 font-medium">{role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16">
        <div className="mx-auto w-full max-w-2xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-brand-600 rounded-3xl p-10">
            <Users size={36} className="text-brand-200 mx-auto mb-4" />
            <h2 className="font-heading text-2xl font-bold text-white mb-3">Join the HerboNature Family</h2>
            <p className="text-brand-200 mb-6 text-sm leading-relaxed">
              Over 5,000 customers trust HerboNature for their daily skincare. Experience the difference of truly natural products.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link to="/shop" className="bg-white text-brand-700 font-semibold px-6 py-3 rounded-full hover:bg-brand-50 transition-colors">
                Shop Now
              </Link>
              <Link to="/contact" className="border border-brand-400 text-white font-semibold px-6 py-3 rounded-full hover:bg-brand-700 transition-colors">
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
