"use client"

import { useEffect, useState, useCallback, useRef } from "react"
import { cn } from "@/lib/utils"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ChevronDown } from "lucide-react"

export type TOCHeading = {
  slug: string
  text: string
  depth: number
}

interface TOCHeaderProps {
  headings: TOCHeading[]
}

const HEADER_OFFSET = 138
const PROGRESS_RADIUS = 10
const PROGRESS_CIRCUMFERENCE = 2 * Math.PI * PROGRESS_RADIUS

function getHeadingMargin(depth: number): string {
  const margins: Record<number, string> = {
    3: "ml-4",
    4: "ml-8",
    5: "ml-12",
    6: "ml-16",
  }
  return margins[depth] || ""
}

export function TOCHeader({ headings }: TOCHeaderProps) {
  const [activeIds, setActiveIds] = useState<string[]>([])
  const [progress, setProgress] = useState(0)
  const [isOpen, setIsOpen] = useState(false)
  const detailsRef = useRef<HTMLDetailsElement>(null)

  const getVisibleIds = useCallback(() => {
    const headingElements = headings
      .map((h) => document.getElementById(h.slug))
      .filter(Boolean) as HTMLElement[]

    if (headingElements.length === 0) return []

    const viewportTop = window.scrollY + HEADER_OFFSET
    const viewportBottom = window.scrollY + window.innerHeight
    const visibleIds = new Set<string>()

    headingElements.forEach((heading, index) => {
      const nextHeading = headingElements[index + 1]
      const regionEnd = nextHeading
        ? nextHeading.offsetTop
        : document.body.scrollHeight

      if (heading.offsetTop <= viewportBottom && regionEnd >= viewportTop) {
        visibleIds.add(heading.id)
      }
    })

    return Array.from(visibleIds)
  }, [headings])

  useEffect(() => {
    const handleScroll = () => {
      const newActiveIds = getVisibleIds()
      setActiveIds((prev) => {
        if (JSON.stringify(prev) !== JSON.stringify(newActiveIds)) {
          return newActiveIds
        }
        return prev
      })

      const scrollableDistance =
        document.documentElement.scrollHeight - window.innerHeight
      const scrollProgress =
        scrollableDistance > 0
          ? Math.min(Math.max(window.scrollY / scrollableDistance, 0), 1)
          : 0
      setProgress(scrollProgress)
    }

    handleScroll()
    window.addEventListener("scroll", handleScroll, { passive: true })
    window.addEventListener("resize", handleScroll, { passive: true })
    return () => {
      window.removeEventListener("scroll", handleScroll)
      window.removeEventListener("resize", handleScroll)
    }
  }, [getVisibleIds])

  const currentSectionText = (() => {
    if (activeIds.length === 0) return "Overview"
    const activeTexts = headings
      .filter((h) => activeIds.includes(h.slug))
      .map((h) => h.text)
    return activeTexts.length > 0 ? activeTexts.join(", ") : "Overview"
  })()

  if (!headings.length) return null

  return (
    <div className="w-full xl:hidden">
      <details
        ref={detailsRef}
        className="group"
        open={isOpen}
        onToggle={(e) => setIsOpen((e.target as HTMLDetailsElement).open)}
      >
        <summary className="flex w-full cursor-pointer items-center justify-between">
          <div className="mx-auto flex w-full max-w-3xl items-center px-4 py-3">
            <div className="relative mr-2 size-4">
              <svg className="h-4 w-4" viewBox="0 0 24 24">
                <circle
                  className="text-primary/20"
                  cx="12"
                  cy="12"
                  r="10"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                />
                <circle
                  className="text-primary"
                  cx="12"
                  cy="12"
                  r="10"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeDasharray={PROGRESS_CIRCUMFERENCE}
                  strokeDashoffset={
                    PROGRESS_CIRCUMFERENCE * (1 - progress)
                  }
                  transform="rotate(-90 12 12)"
                />
              </svg>
            </div>
            <span className="text-muted-foreground flex-grow truncate text-sm">
              {currentSectionText}
            </span>
            <span className="text-muted-foreground ml-2">
              <ChevronDown className="h-4 w-4 transition-transform duration-200 group-open:rotate-180" />
            </span>
          </div>
        </summary>

        <ScrollArea className="mx-auto max-w-3xl">
          <div className="max-h-[30vh]">
            <ul className="flex list-none flex-col gap-y-2 px-4 pb-4">
              {headings.map((heading) => (
                <li
                  key={heading.slug}
                  className={cn(
                    "px-4 text-sm",
                    getHeadingMargin(heading.depth),
                    activeIds.includes(heading.slug)
                      ? "text-foreground"
                      : "text-foreground/60"
                  )}
                >
                  <a
                    href={`#${heading.slug}`}
                    onClick={() => setIsOpen(false)}
                    className="underline decoration-transparent underline-offset-[3px] transition-colors duration-200 hover:decoration-inherit"
                  >
                    {heading.text}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </ScrollArea>
      </details>
    </div>
  )
}
