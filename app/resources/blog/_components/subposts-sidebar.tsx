import Link from "next/link"
import { BookOpenText, BookOpen, FileText, File } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import type { BlogPost } from "../_lib/content"

interface SubpostsSidebarProps {
  parentPost: BlogPost
  subposts: { post: BlogPost; readingTime: string }[]
  currentSlug: string
  parentReadingTime: string
  combinedReadingTime: string | null
}

export function SubpostsSidebar({
  parentPost,
  subposts,
  currentSlug,
  parentReadingTime,
  combinedReadingTime,
}: SubpostsSidebarProps) {
  const isActivePost = parentPost.slug === currentSlug

  return (
    <div className="sticky top-20 col-start-3 row-span-1 mr-auto ml-8 hidden h-[calc(100vh-5rem)] max-w-md xl:block">
      <ScrollArea className="flex max-h-[calc(100vh-8rem)] flex-col overflow-y-auto">
        <div className="px-4">
          <ul className="space-y-1">
            <li>
              {isActivePost ? (
                <div className="text-foreground bg-muted flex items-center gap-2 rounded-md py-1.5 pr-3 pl-2 text-sm font-medium text-pretty">
                  <BookOpenText className="size-4 shrink-0" />
                  <div className="flex flex-col">
                    <span className="line-clamp-2 text-pretty">
                      {parentPost.title}
                    </span>
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
                  href={`/resources/blog/${parentPost.slug}`}
                  className="hover:text-foreground text-muted-foreground hover:bg-muted/50 flex items-center gap-2 rounded-md px-2 py-1.5 text-sm text-pretty transition-colors"
                >
                  <BookOpen className="size-4 shrink-0" />
                  <div className="flex flex-col">
                    <span className="line-clamp-2 text-pretty">
                      {parentPost.title}
                    </span>
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
              <li className="ml-4 space-y-1">
                {subposts.map(({ post: subpost, readingTime }) =>
                  currentSlug === subpost.slug ? (
                    <div
                      key={subpost.slug}
                      className="text-foreground bg-muted flex items-center gap-2 rounded-md px-2 py-1.5 text-sm font-medium text-pretty"
                    >
                      <FileText className="size-4 shrink-0" />
                      <div className="flex flex-col">
                        <span className="line-clamp-2 text-pretty">
                          {subpost.title}
                        </span>
                        <span className="text-muted-foreground/80 text-xs">
                          {readingTime}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <Link
                      key={subpost.slug}
                      href={`/resources/blog/${subpost.slug}`}
                      className="hover:text-foreground text-muted-foreground hover:bg-muted/50 flex items-center gap-2 rounded-md px-2 py-1.5 text-sm text-pretty transition-colors"
                    >
                      <File className="size-4 shrink-0" />
                      <div className="flex flex-col">
                        <span className="line-clamp-2 text-pretty">
                          {subpost.title}
                        </span>
                        <span className="text-muted-foreground/80 text-xs">
                          {readingTime}
                        </span>
                      </div>
                    </Link>
                  )
                )}
              </li>
            )}
          </ul>
        </div>
      </ScrollArea>
    </div>
  )
}
