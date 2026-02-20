import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { BlogCard } from "../../_components/blog-card"
import { BlogBreadcrumbs } from "../../_components/blog-breadcrumbs"
import { getAllTags, getPostsByTag } from "../../_lib/data-utils"

export function generateStaticParams() {
  const tagMap = getAllTags()
  return Array.from(tagMap.keys()).map((tag) => ({ tag }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ tag: string }>
}): Promise<Metadata> {
  const { tag } = await params
  return {
    title: `Posts tagged "${tag}"`,
    description: `A collection of posts tagged with ${tag}.`,
  }
}

export default async function TagFilterPage({
  params,
}: {
  params: Promise<{ tag: string }>
}) {
  const { tag } = await params
  const decodedTag = decodeURIComponent(tag)
  const posts = getPostsByTag(decodedTag)

  if (posts.length === 0) notFound()

  return (
    <div className="mx-auto w-full max-w-3xl">
      <BlogBreadcrumbs
        items={[
          { href: "/resources/blog/tags", label: "Tags" },
          { label: decodedTag },
        ]}
      />

      <div className="mt-6 flex flex-col gap-y-4">
        <h1 className="text-2xl font-medium font-navbar-title">
          Posts tagged &ldquo;{decodedTag}&rdquo;
        </h1>
        <ul className="flex flex-col gap-y-4">
          {posts.map((post) => (
            <li key={post.slug}>
              <BlogCard entry={post} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
