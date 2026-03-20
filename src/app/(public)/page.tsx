import { Hero } from "@/components/Hero";
import { About } from "@/components/About";
import { CategorizedProductSection } from "@/components/CategorizedProductSection";
import { CustomHamper } from "@/components/CustomHamper";
import { Testimonials } from "@/components/Testimonials";
import { CategoryShowcase } from "@/components/CategoryShowcase";
import { getProductsServer } from "@/lib/server-products";

export default async function Home() {
  const products = await getProductsServer();

  return (
    <>
      <Hero />
      <CategoryShowcase />
      <CategorizedProductSection preloadedProducts={products} />
      <CustomHamper />
      <Testimonials />
      <About />
    </>
  );
}
