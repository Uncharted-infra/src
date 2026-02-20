import { SectionPricing } from "@/components/home/section-pricing";

export const metadata = {
  title: "Pricing | Uncharted",
  description:
    "Simple, honest pricing. Start free. Upgrade when Uncharted becomes the travel partner you can't travel without.",
};

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-background">
      <SectionPricing />
    </div>
  );
}
