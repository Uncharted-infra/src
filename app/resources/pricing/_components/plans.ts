/**
 * Pricing plans data - single source of truth for /resources/pricing
 * Adventurer, Nomad, Wanderlust, Enterprise
 */

export const PRICING_PLANS = [
  {
    id: "Adventurer",
    name: "Adventurer",
    popular: false,
    price: {
      monthly: 0,
      yearly: 0,
    },
    description: "Learn, browse, and try the agent.",
    features: [
      "5 free maps a day",
      "Unlimited travel chat & questions",
      "Destination discovery & comparisons",
      "High-level itinerary suggestions",
      "Save 1 active trip",
    ],
    cta: "Get started free",
    buttonVariant: "secondary" as const,
    href: "/signup",
  },
  {
    id: "Nomad",
    name: "Nomad",
    price: {
      monthly: 15,
      yearly: 144,
    },
    description: "For actively planning trips.",
    features: [
      "120 maps per month",
      "Live flight & hotel searches",
      "Personalized day-by-day itineraries",
      "Save multiple trips",
      "Traveler profiles & preferences",
    ],
    cta: "Start planning",
    popular: true,
    buttonVariant: "default" as const,
    href: "/signup",
  },
  {
    id: "Wanderlust",
    name: "Wanderlust",
    price: {
      monthly: 30,
      yearly: 288,
    },
    description: "A travel companion you rely on.",
    features: [
      "300 maps per month",
      "Booking & reservation management",
      "Modify reservations on the fly",
      "In-trip help & live problem solving",
      "Smart itinerary re-optimization",
    ],
    cta: "Go Wanderlust",
    popular: false,
    buttonVariant: "secondary" as const,
    href: "/signup",
  },
  {
    id: "Enterprise",
    name: "Enterprise",
    popular: false,
    price: null,
    description: "For teams and companies.",
    features: [
      "Everything in Wanderlust",
      "Multi-traveler coordination",
      "Admin dashboard & reporting",
      "Spend controls & budgets",
      "Dedicated support",
    ],
    cta: "Talk to us",
    buttonVariant: "secondary" as const,
    href: "/resources/demo",
  },
] as const;
