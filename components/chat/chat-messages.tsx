"use client";

import { MapPin } from "lucide-react";

export function ChatMessages() {
  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col items-center justify-center py-8 text-center">
      <div className="flex items-center justify-center size-12 rounded-full bg-primary/10 mb-4">
        <MapPin className="size-6 text-primary" />
      </div>
      <p className="font-semibold text-foreground text-sm">Go somewhere uncharted today</p>
      <p className="text-muted-foreground text-sm leading-relaxed max-w-md mt-1">
        An AI travel agent to explore, plan, or book trips
      </p>
    </div>
  );
}
