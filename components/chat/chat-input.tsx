"use client";

import * as React from "react";
import { Plane, Car, Bus, Ship } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import TypingText from "@/components/ui/typing-text";

const TRAVEL_ICONS = [
  { Icon: Plane, label: "Plane" },
  { Icon: Car, label: "Car" },
  { Icon: Bus, label: "Bus" },
  { Icon: Ship, label: "Ship" },
] as const;

const PLACEHOLDER_PROMPTS = [
  "Plan a 5-day solo trip to Tokyo in March",
  "Book a hotel for a company retreat in Barcelona",
  "Weekend road trip ideas from Chicago for 5th year anniversary",
  "Find flights from New York to London next month for girls trip",
  "Fun things to do in Vegas for bachelor party trip",
];

const SUGGESTION_PROMPTS = [
  "Weekend trips from Chicago",
  "Plan a 5-day Italy trip",
  "Find hotels in Kyoto",
];

export function ChatInput() {
  const [value, setValue] = React.useState("");
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);
  const [iconIndex, setIconIndex] = React.useState(0);
  const [isFocused, setIsFocused] = React.useState(false);
  const showPlaceholder = !value.trim() && !isFocused;

  React.useEffect(() => {
    const interval = setInterval(() => {
      setIconIndex((prev) => (prev + 1) % TRAVEL_ICONS.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!value.trim()) return;
    setValue("");
    resetHeight();
  }

  function handleSuggestion(prompt: string) {
    setValue(prompt);
    textareaRef.current?.focus();
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  }

  function handleInput() {
    const textarea = textareaRef.current;
    if (!textarea) return;
    textarea.style.height = "auto";
    textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`;
  }

  function resetHeight() {
    const textarea = textareaRef.current;
    if (!textarea) return;
    textarea.style.height = "auto";
  }

  const isEmpty = !value.trim();

  return (
    <div className="w-full max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="relative">
        <div className="flex items-end gap-2 rounded-xl border bg-background p-2 shadow-sm focus-within:ring-2 focus-within:ring-ring/50 focus-within:border-ring transition-all">
          <div className="relative flex-1 min-w-0 overflow-hidden">
            {showPlaceholder && (
              <div
                className="absolute inset-0 flex items-center px-2 py-1.5 pointer-events-none text-base text-muted-foreground md:text-sm overflow-hidden"
                aria-hidden
              >
                <div className="overflow-hidden min-w-0 flex-1">
                  <TypingText
                    text={PLACEHOLDER_PROMPTS}
                    as="span"
                    typingSpeed={60}
                    deletingSpeed={20}
                    pauseDuration={3000}
                    initialDelay={0}
                    loop
                    showCursor
                    className="text-muted-foreground"
                    cursorClassName="bg-muted-foreground"
                  />
                </div>
              </div>
            )}
            <textarea
              ref={textareaRef}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={handleKeyDown}
              onInput={handleInput}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder=""
              rows={1}
              className={cn(
                "relative w-full resize-none bg-transparent px-2 py-1.5 text-base outline-none md:text-sm",
                "min-h-[36px] max-h-[120px]"
              )}
            />
          </div>
          <Button
            type="submit"
            size="icon"
            disabled={isEmpty}
            className="shrink-0 rounded-lg overflow-hidden"
            aria-label="Send message"
          >
            <div className="relative size-4">
              <AnimatePresence mode="wait">
                <motion.div
                  key={iconIndex}
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  {React.createElement(TRAVEL_ICONS[iconIndex].Icon, {
                    className: "size-4",
                  })}
                </motion.div>
              </AnimatePresence>
            </div>
          </Button>
        </div>
      </form>

      <div className="flex flex-wrap items-center justify-center gap-2 mt-4">
        {SUGGESTION_PROMPTS.map((prompt) => (
          <Button
            key={prompt}
            variant="outline"
            size="sm"
            className="rounded-full text-xs font-normal"
            onClick={() => handleSuggestion(prompt)}
            type="button"
          >
            {prompt}
          </Button>
        ))}
      </div>
    </div>
  );
}
