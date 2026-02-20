"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { cn } from "@/lib/utils"
import { ScrollArea } from "@/components/ui/scroll-area"

export type TOCHeading = {
  slug: string
  text: string
  depth: number
}

interface TOCSidebarProps {
  headings: TOCHeading[]
}

const HEADER_OFFSET = 150

function getHeadingMargin(depth: number): string {
  const margins: Record<number, string> = {
    3: "ml-4",
    4: "ml-8",
    5: "ml-12",
    6: "ml-16",
  }
  return margins[depth] || ""
}

export function TOCSidebar({ headings }: TOCSidebarProps) {
  const [activeIds, setActiveIds] = useState<string[]>([])
  const scrollAreaRef = useRef<HTMLDivElement>(null)

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
    }

    handleScroll()
    window.addEventListener("scroll", handleScroll, { passive: true })
    window.addEventListener("resize", handleScroll, { passive: true })
    return () => {
      window.removeEventListener("scroll", handleScroll)
      window.removeEventListener("resize", handleScroll)
    }
  }, [getVisibleIds])

  useEffect(() => {
    if (!activeIds.length || !scrollAreaRef.current) return
    const viewport = scrollAreaRef.current.querySelector(
      "[data-radix-scroll-area-viewport]"
    )
    if (!viewport) return

    const activeLink = viewport.querySelector(
      `[data-heading-link="${activeIds[0]}"]`
    )
    if (!activeLink) return

    const { top: areaTop, height: areaHeight } =
      viewport.getBoundingClientRect()
    const { top: linkTop, height: linkHeight } =
      activeLink.getBoundingClientRect()

    const currentLinkTop =
      linkTop - areaTop + (viewport as HTMLElement).scrollTop
    const targetScroll = Math.max(
      0,
      Math.min(
        currentLinkTop - (areaHeight - linkHeight) / 2,
        (viewport as HTMLElement).scrollHeight -
          (viewport as HTMLElement).clientHeight
      )
    )

    if (
      Math.abs(targetScroll - (viewport as HTMLElement).scrollTop) > 5
    ) {
      ;(viewport as HTMLElement).scrollTop = targetScroll
    }
  }, [activeIds])

  if (!headings.length) return null

  return (
    <div className="sticky top-20 col-start-1 row-span-1 mr-8 ml-auto hidden h-[calc(100vh-5rem)] max-w-md xl:block">
      <ScrollArea
        ref={scrollAreaRef}
        className="flex max-h-[calc(100vh-8rem)] flex-col overflow-y-auto"
      >
        <div className="flex flex-col gap-2 px-4">
          <span className="text-lg font-medium font-navbar-title">
            Table of Contents
          </span>
          <ul className="flex list-none flex-col gap-y-2">
            {headings.map((heading) => (
              <li
                key={heading.slug}
                className={cn(
                  "text-sm",
                  getHeadingMargin(heading.depth),
                  activeIds.includes(heading.slug)
                    ? "text-foreground"
                    : "text-foreground/60"
                )}
              >
                <a
                  href={`#${heading.slug}`}
                  data-heading-link={heading.slug}
                  className="list-none underline decoration-transparent underline-offset-[3px] transition-colors duration-200 hover:decoration-inherit"
                >
                  {heading.text}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </ScrollArea>
    </div>
  )
}
