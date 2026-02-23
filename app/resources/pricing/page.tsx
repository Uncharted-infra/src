import { PricingSection } from "./_components/PricingSection";

export const metadata = {
  title: "Pricing | Uncharted",
  description:
    "Simple, honest pricing. Start free. Upgrade when Uncharted becomes the travel partner you can't travel without.",
};

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-background">
      <PricingSection />
    </div>
  );
}
