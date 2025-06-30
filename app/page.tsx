import NavBar from "./ui/home/NavBar";
import BenefitsSection from "./ui/home/BenefitsSection";
import Footer from "./ui/Footer";
import CharacterSection from "./ui/home/CharacterSection";
import FeatureSection from "./ui/home/FeatureSection";
import HeroSection from "./ui/home/HeroSection";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col max-w-full overflow-x-hidden">
      <NavBar />
      {/* Hero Section */}
      <HeroSection></HeroSection>

      {/* Beneficios Concretos */}
      <section id="benefits">
        <BenefitsSection></BenefitsSection>
      </section>

      {/* Features Section */}
      <FeatureSection></FeatureSection>

      {/* Character Class Section */}
      <CharacterSection></CharacterSection>

      {/* Footer */}
      <Footer></Footer>
    </main>
  );
}
