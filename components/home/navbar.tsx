"use client";

import React, { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { MapPin } from "lucide-react";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "motion/react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { DayNightSwitch } from "@/components/ui/DayNightSwitch";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

const smoothScrollTo = (elementId: string) => {
  const element = document.getElementById(elementId);
  if (element) {
    element.scrollIntoView({ behavior: "smooth", block: "start" });
  }
};

const hasSections = (pathname: string) =>
  pathname === "/" || pathname === "/features";

const navigateToHomeSection = (
  elementId: string,
  router: ReturnType<typeof useRouter>,
  pathname: string
) => {
  if (pathname === "/") {
    smoothScrollTo(elementId);
  } else {
    router.push(`/#${elementId}`);
  }
};

const NAV_ITEMS: Array<
  | { name: string; link: string }
  | { name: string; link: string; isDropdown: true }
> = [
  { name: "Features", link: "/#features" },
  { name: "Pricing", link: "/resources/pricing" },
  { name: "Resources", link: "/resources", isDropdown: true },
];

const RESOURCES_ITEMS = [
  { name: "Blog", href: "/resources/blog" },
  { name: "Changelog", href: "/resources/changelog" },
  { name: "Docs", href: "https://docs.uncharted.sh/" },
  { name: "Roadmap", href: "/resources/roadmap" },
];

interface NavbarProps {
  children: React.ReactNode;
  className?: string;
}

interface NavBodyProps {
  children: React.ReactNode;
  className?: string;
  visible?: boolean;
}

interface NavItemsProps {
  onItemClick?: () => void;
}

interface MobileNavProps {
  children: React.ReactNode;
  className?: string;
  visible?: boolean;
}

interface MobileNavMenuProps {
  children: React.ReactNode;
  className?: string;
  isOpen: boolean;
  onClose: () => void;
}

export function Navbar({ children, className }: NavbarProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const [visible, setVisible] = useState(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    setVisible(latest > 100);
  });

  return (
    <motion.div
      ref={ref}
      className={cn("fixed inset-x-0 top-0 z-40 w-full", className)}
    >
      {React.Children.map(children, (child) =>
        React.isValidElement(child)
          ? React.cloneElement(
              child as React.ReactElement<{ visible?: boolean }>,
              { visible }
            )
          : child
      )}
    </motion.div>
  );
}

export function NavBody({
  children,
  className,
  visible = false,
}: NavBodyProps) {
  return (
    <motion.header
      animate={{
        backdropFilter: visible ? "blur(10px)" : "blur(0px)",
        boxShadow: visible ? "0 0 24px rgba(34, 42, 53, 0.06)" : "none",
        y: visible ? 4 : 0,
      }}
      transition={{ type: "spring", stiffness: 200, damping: 50 }}
      className={cn(
        "relative z-50 mx-auto hidden w-full max-w-5xl border-0 bg-background/80 px-4 lg:flex",
        visible && "rounded-xl bg-background/95 dark:bg-background/95",
        className
      )}
    >
      <div className="flex h-14 w-full items-center justify-between">
        {children}
      </div>
    </motion.header>
  );
}

export function NavItems({ onItemClick }: NavItemsProps) {
  const [hovered, setHovered] = useState<number | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  const handleClick = (
    e: React.MouseEvent,
    item: { name: string; link: string }
  ) => {
    const isExternal = item.link.startsWith("http");
    const isHashLink = item.link.startsWith("/#");

    if (!isExternal && isHashLink) {
      e.preventDefault();
      const elementId = item.link.replace("/#", "");
      navigateToHomeSection(elementId, router, pathname);
    } else if (!isExternal) {
      e.preventDefault();
      router.push(item.link);
    }
    (e.currentTarget as HTMLElement).blur();
    onItemClick?.();
  };

  return (
    <nav
      onMouseLeave={() => setHovered(null)}
      className="flex flex-1 items-center justify-center gap-1 text-sm font-medium"
    >
      {NAV_ITEMS.map((item, idx) => {
        if ("isDropdown" in item && item.isDropdown) {
          return (
            <NavigationMenu key={item.name}>
              <NavigationMenuList className="gap-0">
                <NavigationMenuItem>
                  <NavigationMenuTrigger
                    onMouseEnter={() => setHovered(idx)}
                    className={cn(
                      "font-navbar-title relative rounded-md bg-transparent hover:bg-accent",
                      hovered === idx && "bg-accent/50"
                    )}
                  >
                    {item.name}
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[200px] gap-1 p-2">
                      {RESOURCES_ITEMS.map((resource) => (
                        <li key={resource.name}>
                          <NavigationMenuLink asChild>
                            <Link
                              href={resource.href}
                              className="font-navbar-title block rounded-md px-3 py-2 text-sm hover:bg-accent"
                              onClick={(e) => {
                                (e.currentTarget as HTMLElement).blur();
                                onItemClick?.();
                              }}
                            >
                              {resource.name}
                            </Link>
                          </NavigationMenuLink>
                        </li>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          );
        }

        return (
          <a
            key={item.name}
            href={item.link}
            onMouseEnter={() => setHovered(idx)}
            onClick={(e) => handleClick(e, item)}
            className="font-navbar-title relative rounded-md px-4 py-2 text-black transition-colors hover:text-black/80 dark:text-foreground dark:hover:text-foreground/80"
          >
            {hovered === idx && (
              <motion.div
                layoutId="hovered"
                className="absolute inset-0 rounded-md bg-accent/50"
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            )}
            <span className="relative z-10">{item.name}</span>
          </a>
        );
      })}
    </nav>
  );
}

export function MobileNav({
  children,
  className,
  visible = false,
}: MobileNavProps) {
  return (
    <motion.header
      animate={{
        backdropFilter: visible ? "blur(10px)" : "blur(0px)",
        boxShadow: visible ? "0 0 24px rgba(34, 42, 53, 0.06)" : "none",
        y: visible ? 4 : 0,
      }}
      transition={{ type: "spring", stiffness: 200, damping: 50 }}
      className={cn(
        "relative z-50 mx-auto flex w-full max-w-5xl border-0 bg-background/80 px-4 lg:hidden",
        visible && "rounded-xl bg-background/95 dark:bg-background/95",
        className
      )}
    >
      <div className="flex h-14 w-full items-center justify-between">
        {children}
      </div>
    </motion.header>
  );
}

export function MobileNavMenu({
  children,
  className,
  isOpen,
  onClose,
}: MobileNavMenuProps) {
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      const target = e.target as HTMLElement;
      if (
        !target.closest('[role="dialog"]') &&
        !target.closest('button[aria-expanded]')
      ) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"
            onClick={onClose}
            onTouchEnd={onClose}
          />
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className={cn(
              "fixed left-4 right-4 top-16 z-50 flex max-h-[80vh] w-auto flex-col gap-1 overflow-y-auto rounded-xl border bg-background/95 px-4 py-4 shadow-lg backdrop-blur-md",
              className
            )}
            role="dialog"
            aria-modal="true"
            onClick={(e) => e.stopPropagation()}
            onTouchStart={(e) => e.stopPropagation()}
          >
            {children}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function HamburgerIcon({
  className,
  isOpen,
  ...props
}: React.SVGAttributes<SVGElement> & { isOpen?: boolean }) {
  return (
    <svg
      className={cn("pointer-events-none", className)}
      width={16}
      height={16}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M4 12L20 12"
        className={cn(
          "origin-center -translate-y-[7px] transition-all duration-300",
          isOpen && "translate-x-0 translate-y-0 rotate-315"
        )}
      />
      <path
        d="M4 12H20"
        className={cn(
          "origin-center transition-all duration-300",
          isOpen && "rotate-45"
        )}
      />
      <path
        d="M4 12H20"
        className={cn(
          "origin-center translate-y-[7px] transition-all duration-300",
          isOpen && "translate-y-0 rotate-135"
        )}
      />
    </svg>
  );
}

export function MobileNavToggle({
  isOpen,
  onClick,
}: {
  isOpen: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      onTouchStart={(e) => {
        e.stopPropagation();
        onClick();
      }}
      className="rounded-lg p-2 transition-colors hover:bg-accent active:bg-accent/80"
      aria-label={isOpen ? "Close menu" : "Open menu"}
      aria-expanded={isOpen}
    >
      <HamburgerIcon isOpen={isOpen} className="size-6" />
    </button>
  );
}

export function NavbarLogo() {
  const router = useRouter();
  return (
    <a
      href="/"
      className="relative z-20 flex items-center gap-2 bg-transparent transition-opacity hover:opacity-80"
      onClick={(e) => {
        e.preventDefault();
        router.push("/");
        (e.currentTarget as HTMLElement).blur();
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/logo.png"
        alt=""
        width={32}
        height={32}
        className="block"
      />
      <span className="font-navbar-title text-lg font-medium tracking-tight">
        Uncharted
      </span>
    </a>
  );
}

export function NavbarButton({
  href,
  children,
  variant = "ghost",
  className,
  ...props
}: {
  href?: string;
  children: React.ReactNode;
  variant?: "default" | "ghost" | "outline";
  className?: string;
} & React.AnchorHTMLAttributes<HTMLAnchorElement> &
  React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const router = useRouter();

  if (href) {
    const isExternal = href.startsWith("http");
    return (
      <Button variant={variant} size="sm" asChild>
        <a
          href={href}
          className={className}
          onTouchStart={(e) => e.stopPropagation()}
          onClick={(e) => {
            if (!isExternal) {
              e.preventDefault();
              router.push(href);
            }
            (e.currentTarget as HTMLElement).blur();
          }}
          {...(props as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
        >
          {children}
        </a>
      </Button>
    );
  }

  return (
    <Button
      variant={variant}
      size="sm"
      type="button"
      className={className}
      onTouchStart={(e) => e.stopPropagation()}
      {...(props as React.ButtonHTMLAttributes<HTMLButtonElement>)}
    >
      {children}
    </Button>
  );
}

export function Header() {
  const [open, setOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const checkWidth = () => setIsMobile(window.innerWidth < 768);
    checkWidth();
    window.addEventListener("resize", checkWidth);
    window.addEventListener("orientationchange", checkWidth);
    return () => {
      window.removeEventListener("resize", checkWidth);
      window.removeEventListener("orientationchange", checkWidth);
    };
  }, []);

  const handleMobileNavClick = (
    e: React.MouseEvent | React.TouchEvent,
    link: string
  ) => {
    e.preventDefault();
    const target = e.currentTarget as HTMLElement;
    const isHashLink = link.startsWith("/#");
    if (isHashLink) {
      const elementId = link.replace("/#", "");
      navigateToHomeSection(elementId, router, pathname);
    } else if (link.startsWith("http")) {
      window.location.href = link;
    } else {
      router.push(link);
    }
    target.blur();
    setOpen(false);
  };

  return (
    <Navbar>
      <NavBody>
        <NavbarLogo />
        <NavItems />
        <div className="flex items-center gap-2">
          <NavbarButton href="/login" variant="ghost" className="font-navbar-title">
            Sign in
          </NavbarButton>
          <NavbarButton href="/signup" variant="default" className="font-navbar-title rounded-full">
            Get started for free
          </NavbarButton>
          <DayNightSwitch className="ml-[15px]" />
        </div>
      </NavBody>

      <MobileNav>
        <NavbarLogo />
        <div className="flex items-center gap-2">
          {isMobile && (
            <MobileNavToggle isOpen={open} onClick={() => setOpen((v) => !v)} />
          )}
          <DayNightSwitch />
        </div>
      </MobileNav>

      <MobileNavMenu isOpen={open} onClose={() => setOpen(false)}>
        <div className="flex flex-col gap-1">
          {NAV_ITEMS.filter((item) => !("isDropdown" in item)).map((item) => (
            <button
              key={item.name}
              type="button"
              onClick={(e) => handleMobileNavClick(e, item.link)}
              onTouchEnd={(e) => handleMobileNavClick(e, item.link)}
              className="font-navbar-title flex w-full items-center rounded-md px-3 py-2.5 text-sm font-medium text-black transition-colors hover:bg-accent dark:text-foreground"
            >
              {item.name}
            </button>
          ))}
          <div className="border-t pt-2">
            <div className="font-navbar-title px-3 py-2 text-xs font-semibold text-muted-foreground">
              Resources
            </div>
            {RESOURCES_ITEMS.map((resource) => (
              <button
                key={resource.name}
                type="button"
                onClick={(e) => handleMobileNavClick(e, resource.href)}
                onTouchEnd={(e) => handleMobileNavClick(e, resource.href)}
                className="font-navbar-title flex w-full items-center rounded-md px-3 py-2.5 text-sm font-medium transition-colors hover:bg-accent"
              >
                {resource.name}
              </button>
            ))}
          </div>
        </div>
        <div className="mt-4 flex flex-col gap-3 border-t pt-4">
          <Button
            variant="outline"
            className="font-navbar-title w-full"
            onClick={(e) => {
              (e.currentTarget as HTMLElement).blur();
              router.push("/login");
              setOpen(false);
            }}
          >
            Sign in
          </Button>
          <Button
            className="font-navbar-title w-full rounded-full"
            onClick={(e) => {
              (e.currentTarget as HTMLElement).blur();
              router.push("/signup");
              setOpen(false);
            }}
          >
            Get started
          </Button>
        </div>
      </MobileNavMenu>
    </Navbar>
  );
}
