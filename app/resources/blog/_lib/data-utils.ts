import {
  getAllBlogPosts,
  getAllAuthors,
  type BlogPost,
  type Author,
} from "./content"
import type { SocialLink } from "./consts"

export function isSubpost(slug: string): boolean {
  return slug.includes("/")
}

export function getParentSlug(subpostSlug: string): string {
  return subpostSlug.split("/")[0]
}

export function getAllPosts(): BlogPost[] {
  return getAllBlogPosts().filter((post) => !isSubpost(post.slug))
}

export function getAllPostsAndSubposts(): BlogPost[] {
  return getAllBlogPosts()
}

export function getSubpostsForParent(parentSlug: string): BlogPost[] {
  return getAllBlogPosts()
    .filter(
      (post) => isSubpost(post.slug) && getParentSlug(post.slug) === parentSlug
    )
    .sort((a, b) => {
      const dateDiff = a.date.valueOf() - b.date.valueOf()
      if (dateDiff !== 0) return dateDiff
      return (a.order ?? 0) - (b.order ?? 0)
    })
}

export function hasSubposts(parentSlug: string): boolean {
  return getSubpostsForParent(parentSlug).length > 0
}

export function getSubpostCount(parentSlug: string): number {
  return getSubpostsForParent(parentSlug).length
}

export function getParentPost(subpostSlug: string): BlogPost | null {
  if (!isSubpost(subpostSlug)) return null
  const parentSlug = getParentSlug(subpostSlug)
  const allPosts = getAllPosts()
  return allPosts.find((post) => post.slug === parentSlug) ?? null
}

export function getPostBySlug(slug: string): BlogPost | null {
  const all = getAllPostsAndSubposts()
  return all.find((p) => p.slug === slug) ?? null
}

export function getAllTags(): Map<string, number> {
  const posts = getAllPosts()
  return posts.reduce((acc, post) => {
    post.tags?.forEach((tag) => {
      acc.set(tag, (acc.get(tag) || 0) + 1)
    })
    return acc
  }, new Map<string, number>())
}

export function getSortedTags(): { tag: string; count: number }[] {
  const tagCounts = getAllTags()
  return [...tagCounts.entries()]
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => {
      const countDiff = b.count - a.count
      return countDiff !== 0 ? countDiff : a.tag.localeCompare(b.tag)
    })
}

export function getPostsByTag(tag: string): BlogPost[] {
  const posts = getAllPosts()
  return posts.filter((post) => post.tags?.includes(tag))
}

export function getRecentPosts(count: number): BlogPost[] {
  return getAllPosts().slice(0, count)
}

export function getAdjacentPosts(currentSlug: string): {
  newer: BlogPost | null
  older: BlogPost | null
  parent: BlogPost | null
} {
  if (isSubpost(currentSlug)) {
    const parentSlug = getParentSlug(currentSlug)
    const parent = getParentPost(currentSlug)
    const subposts = getSubpostsForParent(parentSlug)
    const currentIndex = subposts.findIndex((p) => p.slug === currentSlug)

    if (currentIndex === -1) {
      return { newer: null, older: null, parent }
    }

    return {
      newer:
        currentIndex < subposts.length - 1
          ? subposts[currentIndex + 1]
          : null,
      older: currentIndex > 0 ? subposts[currentIndex - 1] : null,
      parent,
    }
  }

  const parentPosts = getAllPosts()
  const currentIndex = parentPosts.findIndex((p) => p.slug === currentSlug)

  if (currentIndex === -1) {
    return { newer: null, older: null, parent: null }
  }

  return {
    newer: currentIndex > 0 ? parentPosts[currentIndex - 1] : null,
    older:
      currentIndex < parentPosts.length - 1
        ? parentPosts[currentIndex + 1]
        : null,
    parent: null,
  }
}

export function groupPostsByYear(
  posts: BlogPost[]
): Record<string, BlogPost[]> {
  return posts.reduce(
    (acc: Record<string, BlogPost[]>, post) => {
      const year = post.date.getFullYear().toString()
      ;(acc[year] ??= []).push(post)
      return acc
    },
    {}
  )
}

export function parseAuthors(
  authorIds: string[]
): {
  id: string
  name: string
  avatar: string
  isRegistered: boolean
  linkedin?: string
}[] {
  if (!authorIds.length) return []

  const allAuthors = getAllAuthors()
  const authorMap = new Map(allAuthors.map((a) => [a.id, a]))

  return authorIds.map((id) => {
    const author = authorMap.get(id)
    return {
      id,
      name: author?.name ?? id,
      avatar: author?.avatar ?? "/logo.png",
      isRegistered: !!author,
      linkedin: author?.linkedin,
    }
  })
}

export function getAuthorSocialLinks(author: Author): SocialLink[] {
  return [
    author.website && { href: author.website, label: "Website" },
    author.github && { href: author.github, label: "GitHub" },
    author.twitter && { href: author.twitter, label: "Twitter" },
    author.linkedin && { href: author.linkedin, label: "LinkedIn" },
    author.mail && { href: `mailto:${author.mail}`, label: "Email" },
  ].filter(Boolean) as SocialLink[]
}

export function calculateWordCount(text: string): number {
  if (!text) return 0
  const textOnly = text.replace(/<[^>]+>/g, "")
  return textOnly.split(/\s+/).filter(Boolean).length
}

export function readingTime(wordCount: number): string {
  const minutes = Math.max(1, Math.round(wordCount / 200))
  return `${minutes} min read`
}

export function getPostReadingTime(post: BlogPost): string {
  return readingTime(calculateWordCount(post.body))
}

export function getCombinedReadingTime(slug: string): string {
  const post = getPostBySlug(slug)
  if (!post) return readingTime(0)

  let totalWords = calculateWordCount(post.body)

  if (!isSubpost(slug)) {
    const subposts = getSubpostsForParent(slug)
    for (const sub of subposts) {
      totalWords += calculateWordCount(sub.body)
    }
  }

  return readingTime(totalWords)
}

export function formatDate(date: Date): string {
  return Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date)
}

export function getHeadingMargin(depth: number): string {
  const margins: Record<number, string> = {
    3: "ml-4",
    4: "ml-8",
    5: "ml-12",
    6: "ml-16",
  }
  return margins[depth] || ""
}
