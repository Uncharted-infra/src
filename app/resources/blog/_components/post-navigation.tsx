import Link from "next/link"
import { cn } from "@/lib/utils"
import { ArrowLeft, ArrowRight, CornerLeftUp } from "lucide-react"
import type { BlogPost } from "../_lib/content"

interface PostNavigationProps {
  newerPost: BlogPost | null
  olderPost: BlogPost | null
  parentPost?: BlogPost | null
}

export function PostNavigation({
  newerPost,
  olderPost,
  parentPost,
}: PostNavigationProps) {
  const isSubpost = !!parentPost

  return (
    <nav
      className={cn(
        "grid grid-cols-1 gap-4",
        isSubpost ? "sm:grid-cols-3" : "sm:grid-cols-2"
      )}
    >
      {olderPost ? (
        <Link
          href={`/resources/blog/${olderPost.slug}`}
          className="group flex size-full items-center justify-start rounded-lg border px-4 py-3 transition-colors hover:bg-muted"
        >
          <ArrowLeft className="mr-2 size-4 shrink-0 transition-transform group-hover:-translate-x-1" />
          <div className="flex flex-col items-start overflow-hidden text-wrap">
            <span className="text-muted-foreground text-left text-xs">
              {isSubpost ? "Previous Subpost" : "Previous Post"}
            </span>
            <span className="w-full text-left text-sm text-balance text-ellipsis">
              {olderPost.title}
            </span>
          </div>
        </Link>
      ) : (
        <div className="flex size-full items-center justify-start rounded-lg border px-4 py-3 opacity-50">
          <ArrowLeft className="mr-2 size-4 shrink-0" />
          <div className="flex flex-col items-start">
            <span className="text-muted-foreground text-xs">
              {isSubpost ? "Previous Subpost" : "Previous Post"}
            </span>
            <span className="text-sm">
              {isSubpost
                ? "No older subpost"
                : "You're at the oldest post!"}
            </span>
          </div>
        </div>
      )}

      {isSubpost && (
        parentPost ? (
          <Link
            href={`/resources/blog/${parentPost.slug}`}
            className="group flex size-full items-center justify-center rounded-lg border px-4 py-3 transition-colors hover:bg-muted"
          >
            <CornerLeftUp className="mr-2 size-4 shrink-0 transition-transform group-hover:-translate-y-1" />
            <div className="flex flex-col items-center overflow-hidden text-wrap">
              <span className="text-muted-foreground text-center text-xs">
                Parent Post
              </span>
              <span className="w-full text-center text-sm text-balance text-ellipsis">
                {parentPost.title}
              </span>
            </div>
          </Link>
        ) : (
          <div className="flex size-full items-center justify-center rounded-lg border px-4 py-3 opacity-50">
            <CornerLeftUp className="mr-2 size-4 shrink-0" />
            <div className="flex flex-col items-center">
              <span className="text-muted-foreground text-xs">Parent Post</span>
              <span className="text-sm">No parent post</span>
            </div>
          </div>
        )
      )}

      {newerPost ? (
        <Link
          href={`/resources/blog/${newerPost.slug}`}
          className="group flex size-full items-center justify-end rounded-lg border px-4 py-3 transition-colors hover:bg-muted"
        >
          <div className="flex flex-col items-end overflow-hidden text-wrap">
            <span className="text-muted-foreground text-right text-xs">
              {isSubpost ? "Next Subpost" : "Next Post"}
            </span>
            <span className="w-full text-right text-sm text-balance text-ellipsis">
              {newerPost.title}
            </span>
          </div>
          <ArrowRight className="ml-2 size-4 shrink-0 transition-transform group-hover:translate-x-1" />
        </Link>
      ) : (
        <div className="flex size-full items-center justify-end rounded-lg border px-4 py-3 opacity-50">
          <div className="flex flex-col items-end">
            <span className="text-muted-foreground text-xs">
              {isSubpost ? "Next Subpost" : "Next Post"}
            </span>
            <span className="text-sm">
              {isSubpost
                ? "No newer subpost"
                : "You're at the newest post!"}
            </span>
          </div>
          <ArrowRight className="ml-2 size-4 shrink-0" />
        </div>
      )}
    </nav>
  )
}
