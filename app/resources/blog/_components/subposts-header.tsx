"use client"

import { useState } from "react"
import Link from "next/link"
import {
  BookOpenText,
  BookOpen,
  FileText,
  File,
  ChevronDown,
} from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"

interface SubpostData {
  slug: string
  title: string
  readingTime: string
}

interface SubpostsHeaderProps {
  parentSlug: string
  parentTitle: string
  parentReadingTime: string
  combinedReadingTime: string | null
  subposts: SubpostData[]
  currentSlug: string
}

export function SubpostsHeader({
  parentSlug,
  parentTitle,
  parentReadingTime,
  combinedReadingTime,
  subposts,
  currentSlug,
}: SubpostsHeaderProps) {
  const [isOpen, setIsOpen] = useState(false)
  const isActivePost = parentSlug === currentSlug
  const currentSubpost = subposts.find((s) => s.slug === currentSlug)

  return (
    <div className="w-full xl:hidden">
      <details
        className="group"
        open={isOpen}
        onToggle={(e) => setIsOpen((e.target as HTMLDetailsElement).open)}
      >
        <summary className="flex w-full cursor-pointer items-center justify-between">
          <div className="mx-auto flex w-full max-w-3xl items-center px-4 py-3">
            <div className="relative mr-2 size-4">
              {currentSubpost ? (
                <FileText className="size-4 shrink-0" />
              ) : isActivePost ? (
                <BookOpenText className="size-4 shrink-0" />
              ) : (
                <BookOpen className="size-4 shrink-0" />
              )}
            </div>
            <div className="flex flex-grow flex-col truncate text-sm">
              <span className="text-muted-foreground truncate">
                {currentSubpost ? currentSubpost.title : parentTitle}
              </span>
            </div>
            <span className="text-muted-foreground ml-2">
              <ChevronDown className="h-4 w-4 transition-transform duration-200 group-open:rotate-180" />
            </span>
          </div>
        </summary>

        <ScrollArea className="mx-auto max-w-3xl">
          <div className="max-h-[30vh]">
            <ul className="flex list-none flex-col gap-y-1 px-4 pb-4">
              <li>
                {isActivePost ? (
                  <div className="text-foreground bg-muted flex items-center gap-2 rounded-md px-2 py-1.5 text-sm font-medium">
                    <BookOpenText className="size-4 shrink-0" />
                    <div className="flex flex-col">
                      <span className="line-clamp-2">{parentTitle}</span>
                      <span className="text-muted-foreground/80 text-xs">
                        {parentReadingTime}
                        {combinedReadingTime &&
                          combinedReadingTime !== parentReadingTime && (
                            <span> ({combinedReadingTime} total)</span>
                          )}
                      </span>
                    </div>
                  </div>
                ) : (
                  <Link
                    href={`/resources/blog/${parentSlug}`}
                    onClick={() => setIsOpen(false)}
                    className="hover:text-foreground text-muted-foreground hover:bg-muted/50 flex items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors"
                  >
                    <BookOpen className="size-4 shrink-0" />
                    <div className="flex flex-col">
                      <span className="line-clamp-2">{parentTitle}</span>
                      <span className="text-muted-foreground/80 text-xs">
                        {parentReadingTime}
                        {combinedReadingTime &&
                          combinedReadingTime !== parentReadingTime && (
                            <span> ({combinedReadingTime} total)</span>
                          )}
                      </span>
                    </div>
                  </Link>
                )}
              </li>

              {subposts.length > 0 && (
                <div className="ml-4 space-y-1">
                  {subposts.map((subpost) =>
                    currentSlug === subpost.slug ? (
                      <div
                        key={subpost.slug}
                        className="text-foreground bg-muted flex items-center gap-2 rounded-md px-2 py-1.5 text-sm font-medium"
                      >
                        <FileText className="size-4 shrink-0" />
                        <div className="flex flex-col">
                          <span className="line-clamp-2">
                            {subpost.title}
                          </span>
                          <span className="text-muted-foreground/80 text-xs">
                            {subpost.readingTime}
                          </span>
                        </div>
                      </div>
                    ) : (
                      <Link
                        key={subpost.slug}
                        href={`/resources/blog/${subpost.slug}`}
                        onClick={() => setIsOpen(false)}
                        className="hover:text-foreground text-muted-foreground hover:bg-muted/50 flex items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors"
                      >
                        <File className="size-4 shrink-0" />
                        <div className="flex flex-col">
                          <span className="line-clamp-2">
                            {subpost.title}
                          </span>
                          <span className="text-muted-foreground/80 text-xs">
                            {subpost.readingTime}
                          </span>
                        </div>
                      </Link>
                    )
                  )}
                </div>
              )}
            </ul>
          </div>
        </ScrollArea>
      </details>
    </div>
  )
}
