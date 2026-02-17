import { MessageSquareText } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const EXAMPLE_QUERIES = [
  "Plan a 10-day Japan trip with a mix of culture and nature",
  "Find family-friendly resorts in Cancun under $200/night",
  "Weekend road trip ideas from San Francisco",
  "Best time to visit Patagonia and what to pack",
  "Compare flights from NYC to London for next month",
  "Build a honeymoon itinerary in the Amalfi Coast",
];

export function Trust() {
  return (
    <section className="px-4 py-16 md:py-24 bg-muted/50">
      <div className="mx-auto max-w-4xl text-center">
        <div className="flex items-center justify-center size-12 rounded-full bg-primary/10 mx-auto mb-4">
          <MessageSquareText className="size-6 text-primary" />
        </div>
        <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
          Ask anything about travel
        </h2>
        <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
          Uncharted handles real travel questions — not just small talk. Here are
          a few things people ask:
        </p>

        <div className="flex flex-wrap items-center justify-center gap-2 mt-8">
          {EXAMPLE_QUERIES.map((query) => (
            <Badge
              key={query}
              variant="secondary"
              className="px-3 py-1.5 text-sm font-normal cursor-default"
            >
              {query}
            </Badge>
          ))}
        </div>
      </div>
    </section>
  );
}
