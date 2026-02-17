import { Compass, CalendarCheck, Heart } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const VALUE_PROPS = [
  {
    icon: Compass,
    title: "Explore",
    description:
      "Discover destinations and get ideas for your next adventure. Just tell me where you want to go or what kind of trip you're looking for.",
    label: "Before your trip",
  },
  {
    icon: CalendarCheck,
    title: "Plan",
    description:
      "Build itineraries, compare hotels, and handle logistics. I'll organize everything so you can focus on the trip itself.",
    label: "During planning",
  },
  {
    icon: Heart,
    title: "Book",
    description:
      "Find and book flights, hotels, and activities. I'll help you lock in the best options so nothing falls through the cracks.",
    label: "Ready to go",
  },
] as const;

export function ValueProps() {
  return (
    <section id="features" className="px-4 py-16 md:py-24">
      <div className="mx-auto max-w-5xl">
        <div className="text-center mb-12">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Works before, during, and after your trip
          </h2>
          <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
            Uncharted helps at every stage — from the first spark of an idea to
            your plane touching down.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {VALUE_PROPS.map((prop) => (
            <Card key={prop.title} className="relative">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center size-10 rounded-lg bg-primary/10">
                    <prop.icon className="size-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      {prop.label}
                    </p>
                    <CardTitle className="text-lg">{prop.title}</CardTitle>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm leading-relaxed">
                  {prop.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
