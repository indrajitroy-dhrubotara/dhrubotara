import { Hero } from "@/components/Hero";
import { About } from "@/components/About";
import { ProductSection } from "@/components/ProductSection";
import { CustomHamper } from "@/components/CustomHamper";
import { Testimonials } from "@/components/Testimonials";
import { getProductsServer } from "@/lib/server-products";

export default async function Home() {
  const products = await getProductsServer();

  return (
    <>
      <Hero />
      <About />
      <ProductSection preloadedProducts={products} />
      <CustomHamper />
      <Testimonials />
    </>
  );
}
