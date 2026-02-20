import Hero from "@/app/components/sections/Hero";
import Social from "@/app/components/sections/Social";
import About from "@/app/components/sections/About";
import Categories from "@/app/components/sections/Categories";
import Products from "@/app/components/sections/Products";
import HowItWorks from "@/app/components/sections/HowItWorks";
import WhyUs from "@/app/components/sections/WhyUs";
import Packaging from "@/app/components/sections/Packaging";
import Price from "@/app/components/sections/Price";
import Testimonials from "@/app/components/sections/Testimonials";
import Blog from "@/app/components/sections/Blog";

export default function Home() {
  return (
    <main className="min-h-screen font-sans text-slate-800">
      <Hero />
      <Social />
      <About />
      <Categories />
      <HowItWorks />
      <Products />
      <WhyUs />
      <Packaging />
      <Price />
      <Testimonials />
      <Blog />
    </main>
  );
}
