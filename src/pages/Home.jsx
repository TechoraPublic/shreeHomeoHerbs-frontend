import Hero from "../components/home/Hero";
import FeaturedProducts from "../components/home/FeaturedProducts";
import Categories from "../components/home/Categories";
import BenefitsSection from "../components/home/BenefitsSection";
import AboutPreview from "../components/home/AboutPreview";
import PromoBanner from "../components/home/PromoBanner";
import FinalCTA from "../components/home/FinalCTA";

export default function Home() {
  return (
    <main>
      <Hero />
      <FeaturedProducts />
      {/* <Categories /> */}
      <BenefitsSection />
      <AboutPreview />
      <PromoBanner />
      <FinalCTA />
    </main>
  );
}
