import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Hash } from "lucide-react"
import { BlogBreadcrumbs } from "../_components/blog-breadcrumbs"
import { getSortedTags } from "../_lib/data-utils"

export const metadata = {
  title: "Tags",
}

export default function TagsPage() {
  const sortedTags = getSortedTags()

  return (
    <div className="mx-auto w-full max-w-3xl">
      <BlogBreadcrumbs items={[{ label: "Tags" }]} />

      <div className="mt-6 flex flex-col gap-4">
        <h1 className="text-2xl font-medium font-navbar-title">Tags</h1>
        <div className="flex flex-wrap gap-2">
          {sortedTags.map(({ tag, count }) => (
            <Link key={tag} href={`/resources/blog/tags/${tag}`}>
              <Badge
                variant="outline"
                className="flex items-center gap-x-1 transition-colors hover:bg-muted"
              >
                <Hash className="size-3" />
                {tag}
                <span className="text-muted-foreground ml-1.5">({count})</span>
              </Badge>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
