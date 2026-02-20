import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Hash, FileText } from "lucide-react"
import {
  getCombinedReadingTime,
  getSubpostCount,
  isSubpost,
  parseAuthors,
  formatDate,
} from "../_lib/data-utils"
import type { BlogPost } from "../_lib/content"

interface BlogCardProps {
  entry: BlogPost
}

export function BlogCard({ entry }: BlogCardProps) {
  const formattedDate = formatDate(entry.date)
  const readTime = getCombinedReadingTime(entry.slug)
  const authors = parseAuthors(entry.authors ?? [])
  const subpostCount = !isSubpost(entry.slug)
    ? getSubpostCount(entry.slug)
    : 0

  return (
    <div className="hover:bg-muted/50 rounded-xl border p-4 transition-colors duration-300 ease-in-out">
      <Link
        href={`/resources/blog/${entry.slug}`}
        className="flex flex-col gap-4 sm:flex-row"
      >
        <div className="grow">
          <h3 className="mb-1 text-lg font-medium font-navbar-title">
            {entry.title}
          </h3>
          <p className="text-muted-foreground mb-2 text-sm">
            {entry.description}
          </p>

          <div className="text-muted-foreground mb-2 flex flex-wrap items-center gap-x-2 text-xs">
            {authors.length > 0 && (
              <>
                {authors.map((author) => (
                  <div key={author.id} className="flex items-center gap-x-1.5">
                    <span>{author.name}</span>
                  </div>
                ))}
                <Separator orientation="vertical" className="h-4!" />
              </>
            )}
            <span>{formattedDate}</span>
            <Separator orientation="vertical" className="h-4!" />
            <span>{readTime}</span>
            {subpostCount > 0 && (
              <>
                <Separator orientation="vertical" className="h-4!" />
                <span className="flex items-center gap-1">
                  <FileText className="size-3" />
                  {subpostCount} subpost{subpostCount === 1 ? "" : "s"}
                </span>
              </>
            )}
          </div>

          {entry.tags && (
            <div className="flex flex-wrap gap-2">
              {entry.tags.map((tag) => (
                <Badge
                  key={tag}
                  variant="outline"
                  className="flex items-center gap-x-1"
                >
                  <Hash className="size-3" />
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </Link>
    </div>
  )
}
