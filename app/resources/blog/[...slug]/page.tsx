import { notFound } from "next/navigation"
import { compileMDX } from "next-mdx-remote/rsc"
import remarkGfm from "remark-gfm"
import remarkMath from "remark-math"
import rehypeSlug from "rehype-slug"
import rehypePrettyCode from "rehype-pretty-code"
import rehypeKatex from "rehype-katex"
import rehypeExternalLinks from "rehype-external-links"
import type { Metadata } from "next"

import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Hash, FileText } from "lucide-react"

import { BlogBreadcrumbs } from "../_components/blog-breadcrumbs"
import { PostNavigation } from "../_components/post-navigation"
import { TOCSidebar, type TOCHeading } from "../_components/toc-sidebar"
import { TOCHeader } from "../_components/toc-header"
import { SubpostsSidebar } from "../_components/subposts-sidebar"
import { SubpostsHeader } from "../_components/subposts-header"
import { Callout } from "../_components/callout"

import { getRawContent, getAllBlogPosts } from "../_lib/content"
import {
  getAllPostsAndSubposts,
  getPostBySlug,
  getAdjacentPosts,
  getSubpostsForParent,
  getParentPost,
  getParentSlug,
  getSubpostCount,
  getPostReadingTime,
  getCombinedReadingTime,
  isSubpost,
  hasSubposts,
  parseAuthors,
  formatDate,
} from "../_lib/data-utils"
import { BLOG_CONFIG } from "../_lib/consts"
import Link from "next/link"

const mdxComponents = {
  Callout,
}

export async function generateStaticParams() {
  const posts = getAllPostsAndSubposts()
  return posts.map((post) => ({
    slug: post.slug.split("/"),
  }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string[] }>
}): Promise<Metadata> {
  const { slug } = await params
  const slugStr = slug.join("/")
  const post = getPostBySlug(slugStr)

  if (!post) return { title: "Not Found" }

  return {
    title: post.title,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      publishedTime: post.date.toISOString(),
      tags: post.tags,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
    },
  }
}

async function extractHeadings(source: string): Promise<TOCHeading[]> {
  const headings: TOCHeading[] = []
  const lines = source.split("\n")

  for (const line of lines) {
    const match = line.match(/^(#{2,6})\s+(.+)$/)
    if (match) {
      const depth = match[1].length
      const text = match[2].replace(/\*\*(.+?)\*\*/g, "$1").replace(/`(.+?)`/g, "$1").trim()
      const slug = text
        .toLowerCase()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .trim()
      headings.push({ slug, text, depth })
    }
  }

  return headings
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string[] }>
}) {
  const { slug } = await params
  const slugStr = slug.join("/")
  const post = getPostBySlug(slugStr)

  if (!post) notFound()

  const rawContent = getRawContent(slugStr)
  if (!rawContent) notFound()

  const { content } = await compileMDX({
    source: rawContent,
    components: mdxComponents,
    options: {
      parseFrontmatter: true,
      mdxOptions: {
        remarkPlugins: [remarkGfm, remarkMath],
        rehypePlugins: [
          rehypeSlug,
          [
            rehypeExternalLinks,
            { target: "_blank", rel: ["nofollow", "noreferrer", "noopener"] },
          ],
          rehypeKatex,
          [
            rehypePrettyCode,
            {
              theme: { light: "github-light", dark: "github-dark" },
            },
          ],
        ],
      },
    },
  })

  const headings = await extractHeadings(post.body)
  const authors = parseAuthors(post.authors ?? [])
  const isCurrentSubpost = isSubpost(slugStr)
  const navigation = getAdjacentPosts(slugStr)
  const parentPost = isCurrentSubpost ? getParentPost(slugStr) : null
  const hasChildPosts = hasSubposts(slugStr)
  const subpostCount = !isCurrentSubpost ? getSubpostCount(slugStr) : 0
  const postReadingTime = getPostReadingTime(post)
  const combinedReadingTime =
    hasChildPosts && !isCurrentSubpost ? getCombinedReadingTime(slugStr) : null

  const subpostsData =
    hasChildPosts || isCurrentSubpost
      ? (() => {
          const parentSlug = isCurrentSubpost
            ? getParentSlug(slugStr)
            : slugStr
          const parent = isCurrentSubpost
            ? getParentPost(slugStr)
            : post
          const subs = getSubpostsForParent(parentSlug)
          return {
            parentSlug,
            parent,
            subs,
            subsWithReadingTime: subs.map((s) => ({
              post: s,
              readingTime: getPostReadingTime(s),
            })),
          }
        })()
      : null

  const breadcrumbItems = isCurrentSubpost && parentPost
    ? [
        {
          href: `/resources/blog/${parentPost.slug}`,
          label: parentPost.title,
        },
        { label: post.title },
      ]
    : [{ label: post.title }]

  return (
    <>
      {subpostsData && subpostsData.parent && (
        <SubpostsHeader
          parentSlug={subpostsData.parentSlug}
          parentTitle={subpostsData.parent.title}
          parentReadingTime={getPostReadingTime(subpostsData.parent)}
          combinedReadingTime={
            subpostsData.subs.length > 0
              ? getCombinedReadingTime(subpostsData.parentSlug)
              : null
          }
          subposts={subpostsData.subs.map((s) => ({
            slug: s.slug,
            title: s.title,
            readingTime: getPostReadingTime(s),
          }))}
          currentSlug={slugStr}
        />
      )}

      {headings.length > 0 && <TOCHeader headings={headings} />}

      <section className="grid grid-cols-[minmax(0px,1fr)_min(calc(768px-2rem),100%)_minmax(0px,1fr)] gap-y-6">
        <div className="col-start-2">
          <BlogBreadcrumbs items={breadcrumbItems} />
        </div>

        <section className="col-start-2 flex flex-col gap-y-6 text-center">
          <div className="flex flex-col">
            <h1
              className="mb-2 scroll-mt-31 text-3xl leading-tight font-medium font-navbar-title sm:text-4xl"
              id="post-title"
            >
              {post.title}
            </h1>

            <div className="text-muted-foreground divide-border mb-4 flex flex-col items-center justify-center divide-y text-xs sm:flex-row sm:flex-wrap sm:divide-x sm:divide-y-0 sm:text-sm">
              {authors.length > 0 && (
                <div className="flex w-full items-center justify-center gap-x-2 py-2 sm:w-fit sm:px-2 sm:py-0 first:sm:pl-0 last:sm:pr-0">
                  {authors.map((author) => (
                    <div
                      key={author.id}
                      className="flex items-center gap-x-1.5"
                    >
                      {author.linkedin ? (
                        <Link
                          href={author.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-foreground underline decoration-muted-foreground underline-offset-[3px] hover:decoration-foreground"
                        >
                          {author.name}
                        </Link>
                      ) : (
                        <span>{author.name}</span>
                      )}
                    </div>
                  ))}
                </div>
              )}

              <div className="flex w-full items-center justify-center gap-2 py-2 sm:w-fit sm:px-2 sm:py-0 first:sm:pl-0 last:sm:pr-0">
                <span>{formatDate(post.date)}</span>
              </div>

              <div className="flex w-full items-center justify-center gap-2 py-2 sm:w-fit sm:px-2 sm:py-0 first:sm:pl-0 last:sm:pr-0">
                <span>
                  {postReadingTime}
                  {combinedReadingTime &&
                    combinedReadingTime !== postReadingTime && (
                      <span className="text-muted-foreground">
                        {" "}
                        ({combinedReadingTime} total)
                      </span>
                    )}
                </span>
              </div>

              {subpostCount > 0 && (
                <div className="flex w-full items-center justify-center gap-1 py-2 sm:w-fit sm:px-2 sm:py-0 first:sm:pl-0 last:sm:pr-0">
                  <FileText className="size-3" />
                  {subpostCount} subpost{subpostCount === 1 ? "" : "s"}
                </div>
              )}
            </div>

            <div className="flex flex-wrap justify-center gap-2">
              {post.tags?.map((tag) => (
                <Link
                  key={tag}
                  href={`/resources/blog/tags/${tag}`}
                  className="inline-flex"
                >
                  <Badge variant="outline" className="flex items-center gap-x-1">
                    <Hash className="size-3" />
                    {tag}
                  </Badge>
                </Link>
              ))}
            </div>
          </div>

          <PostNavigation
            newerPost={navigation.newer}
            olderPost={navigation.older}
            parentPost={isCurrentSubpost ? navigation.parent : undefined}
          />
        </section>

        {headings.length > 0 && <TOCSidebar headings={headings} />}

        <article className="prose col-start-2 max-w-none">{content}</article>

        {subpostsData && subpostsData.parent && (
          <SubpostsSidebar
            parentPost={subpostsData.parent}
            subposts={subpostsData.subsWithReadingTime}
            currentSlug={slugStr}
            parentReadingTime={getPostReadingTime(subpostsData.parent)}
            combinedReadingTime={
              subpostsData.subs.length > 0
                ? getCombinedReadingTime(subpostsData.parentSlug)
                : null
            }
          />
        )}

        <div className="col-start-2">
          <PostNavigation
            newerPost={navigation.newer}
            olderPost={navigation.older}
            parentPost={isCurrentSubpost ? navigation.parent : undefined}
          />
        </div>
      </section>
    </>
  )
}
