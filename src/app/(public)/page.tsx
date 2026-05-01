import { Hero } from "@/components/Hero";
import { About } from "@/components/About";
import { CategorizedProductSection } from "@/components/CategorizedProductSection";
import { CustomHamper } from "@/components/CustomHamper";
import { Testimonials } from "@/components/Testimonials";
import { CategoryShowcase } from "@/components/CategoryShowcase";

export default function Home() {
  return (
    <>
      <Hero />
      <CategoryShowcase />
      <CategorizedProductSection />
      <CustomHamper />
      <Testimonials />
      <About />
    </>
  );
}
