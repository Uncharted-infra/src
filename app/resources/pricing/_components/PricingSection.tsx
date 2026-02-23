"use client";

/**
 * Pricing section for /resources/pricing
 * Renders Adventurer, Nomad, Wanderlust, Enterprise with Monthly/Yearly toggle
 */

import NumberFlow from "@number-flow/react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ArrowRight, BadgeCheck } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PRICING_PLANS } from "./plans";

export function PricingSection() {
  const [frequency, setFrequency] = useState<string>("monthly");
  const router = useRouter();

  const handlePlanClick = (plan: (typeof PRICING_PLANS)[number]) => {
    if (plan.href) {
      router.push(plan.href);
    }
  };

  return (
    <div className="not-prose flex flex-col gap-8 sm:gap-12 md:gap-16 px-4 sm:px-6 md:px-8 py-12 sm:py-16 md:py-24 text-center">
      <div className="flex flex-col items-center justify-center gap-4 sm:gap-6 md:gap-8">
        <h1 className="mb-0 text-balance font-medium text-3xl sm:text-4xl md:text-5xl tracking-tighter!">
          Simple, transparent pricing
        </h1>
        <div className="mx-auto mt-0 mb-0 max-w-2xl text-balance text-base sm:text-lg md:text-lg text-muted-foreground px-2 sm:px-0">
          Start free. Upgrade when Uncharted becomes the travel partner you
          can&rsquo;t travel without.
        </div>
        <Tabs
          defaultValue={frequency}
          onValueChange={setFrequency}
          className="w-full sm:w-auto"
        >
          <TabsList className="w-full sm:w-auto">
            <TabsTrigger value="monthly" className="flex-1 sm:flex-initial">
              Monthly
            </TabsTrigger>
            <TabsTrigger value="yearly" className="flex-1 sm:flex-initial">
              Yearly
            </TabsTrigger>
          </TabsList>
        </Tabs>
        <div className="mt-4 sm:mt-6 md:mt-8 grid w-full max-w-6xl gap-4 sm:gap-4 md:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {PRICING_PLANS.map((plan) => (
            <Card
              className={cn(
                "relative w-full text-left",
                plan.popular && "ring-2 ring-primary"
              )}
              key={plan.id}
            >
              {plan.popular && (
                <Badge className="-translate-x-1/2 -translate-y-1/2 absolute top-0 left-1/2 rounded-full bg-white text-black dark:bg-white dark:text-black">
                  Popular
                </Badge>
              )}
              <CardHeader className="pb-3 sm:pb-4">
                <CardTitle className="font-navbar-title font-medium text-lg sm:text-xl">
                  {plan.name}
                </CardTitle>
                <CardDescription className="text-sm sm:text-base">
                  <p className="text-left mb-2">{plan.description}</p>
                  <div className="text-left">
                    {plan.price !== null ? (
                      <NumberFlow
                        className="font-medium text-foreground text-lg sm:text-xl md:text-2xl"
                        format={{
                          style: "currency",
                          currency: "USD",
                          maximumFractionDigits: 0,
                        }}
                        suffix={
                          frequency === "yearly" ? "/year" : "/month"
                        }
                        value={
                          plan.price[
                            frequency as keyof typeof plan.price
                          ] as number
                        }
                      />
                    ) : (
                      <span className="font-medium text-foreground text-lg sm:text-xl md:text-2xl">
                        Custom
                      </span>
                    )}
                  </div>
                  {plan.id === "Adventurer" ? (
                    <p className="mt-2 text-xs sm:text-sm text-muted-foreground font-medium">
                      Includes
                    </p>
                  ) : (
                    <p className="mt-2 text-xs sm:text-sm text-muted-foreground font-medium">
                      Everything in{" "}
                      {plan.id === "Nomad"
                        ? "Adventurer"
                        : plan.id === "Wanderlust"
                          ? "Nomad"
                          : "Wanderlust"}{" "}
                      plan &
                    </p>
                  )}
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-2 sm:gap-2 pb-3 sm:pb-4">
                {plan.features.map((feature, index) => (
                  <div
                    className="flex items-center gap-2 text-muted-foreground text-xs sm:text-sm"
                    key={index}
                  >
                    <BadgeCheck className="h-3 w-3 sm:h-4 sm:w-4 text-green-500 shrink-0" />
                    <span className="text-left">{feature}</span>
                  </div>
                ))}
              </CardContent>
              <CardFooter className="pt-2 sm:pt-4">
                <Button
                  className={cn(
                    "w-full text-sm sm:text-base touch-manipulation",
                    plan.buttonVariant === "default" &&
                      "bg-white text-black hover:bg-white/90 dark:bg-white dark:text-black dark:hover:bg-white/90",
                    plan.buttonVariant === "secondary" &&
                      "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                  )}
                  variant={plan.buttonVariant}
                  onClick={() => handlePlanClick(plan)}
                  onTouchStart={(e: React.TouchEvent) => e.stopPropagation()}
                >
                  {plan.cta}
                  <ArrowRight className="ml-2 h-3 w-3 sm:h-4 sm:w-4" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
