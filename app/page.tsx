import { Hero } from "@/components/home/hero";
import { ValueProps } from "@/components/home/value-props";
import { Trust } from "@/components/home/trust";
import { Cta } from "@/components/home/cta";
import { Footer } from "@/components/home/footer";

export default function Home() {
  return (
    <>
      <main>
        <Hero />
        <ValueProps />
        <Trust />
        <Cta />
      </main>
      <Footer />
    </>
  );
}
