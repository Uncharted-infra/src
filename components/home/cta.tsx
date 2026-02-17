import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function Cta() {
  return (
    <section id="pricing" className="px-4 py-16 md:py-24">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
          Ready to plan your next trip?
        </h2>
        <p className="mt-3 text-muted-foreground max-w-md mx-auto">
          Uncharted is free to explore. Sign up to unlock your full AI travel
          agent and start planning for real.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-8">
          <Button size="lg" className="rounded-full px-8">
            Get started free
            <ArrowRight className="size-4" data-icon="inline-end" />
          </Button>
          <Button variant="outline" size="lg" className="rounded-full px-8">
            See pricing
          </Button>
        </div>
      </div>
    </section>
  );
}
