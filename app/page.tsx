import { Hero } from "@/components/home/hero";
import { SectionExplore } from "@/components/home/section-explore";
import { SectionPlan } from "@/components/home/section-plan";
import { SectionBook } from "@/components/home/section-book";
import { SectionHowItWorks } from "@/components/home/section-how-it-works";
import { SectionDemoCta } from "@/components/home/section-demo-cta";
import { SectionClosing } from "@/components/home/section-closing";
import { Footer } from "@/components/home/footer";

export default function Home() {
  return (
    <>
      <main>
        <Hero />
        <SectionExplore />
        <SectionPlan />
        <SectionBook />
        <SectionHowItWorks />
        <SectionDemoCta />
        <SectionClosing />
      </main>
      <Footer />
    </>
  );
}
