import Hero from "@/components/home/hero";
import CategoryGrid from "@/components/home/CategoryGrid";
import ApplicationPossibilities from "@/components/home/ApplicationPossibilities";
import TopSellingTiles from "@/components/home/TopSellingTiles";
import AboutSection from "@/components/home/AboutSection";
import SampleRequest from "@/components/home/SampleRequest";
import ContactSection from "@/components/home/ContactSection";
import InstagramReels from "@/components/home/InstagramReels";
import ProductDirectory from "@/components/home/ProductDirectory";

export default function Home() {
  return (
    <main>
      <Hero />
      <CategoryGrid />
      <ApplicationPossibilities />
      <AboutSection />
      <TopSellingTiles />
      <SampleRequest />
      <ContactSection />
      <InstagramReels />
      <ProductDirectory />
    </main>
  );
}
