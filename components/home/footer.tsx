import { MapPin } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export function Footer() {
  return (
    <footer className="px-4 py-12">
      <Separator className="mb-8" />
      <div className="mx-auto max-w-5xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <MapPin className="size-4 text-muted-foreground" />
          <span className="text-sm font-medium text-muted-foreground">
            Uncharted
          </span>
        </div>
        <p className="text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} Uncharted. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
