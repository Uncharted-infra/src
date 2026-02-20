import fs from "fs"
import path from "path"
import matter from "gray-matter"

const CONTENT_DIR = path.join(process.cwd(), "content")
const BLOG_DIR = path.join(CONTENT_DIR, "blog")
const AUTHORS_DIR = path.join(CONTENT_DIR, "authors")

export type BlogFrontmatter = {
  title: string
  description: string
  date: Date
  order?: number
  image?: string
  tags?: string[]
  authors?: string[]
  draft?: boolean
}

export type BlogPost = BlogFrontmatter & {
  slug: string
  rawContent: string
  body: string
}

export type AuthorFrontmatter = {
  name: string
  pronouns?: string
  avatar: string
  bio?: string
  mail?: string
  website?: string
  twitter?: string
  github?: string
  linkedin?: string
  discord?: string
}

export type Author = AuthorFrontmatter & {
  id: string
}

function findMdxFiles(dir: string, basePath = ""): string[] {
  if (!fs.existsSync(dir)) return []
  const results: string[] = []
  const entries = fs.readdirSync(dir, { withFileTypes: true })

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name)
    const relativePath = basePath ? `${basePath}/${entry.name}` : entry.name

    if (entry.isDirectory()) {
      results.push(...findMdxFiles(fullPath, relativePath))
    } else if (/\.(mdx?|md)$/.test(entry.name)) {
      results.push(relativePath)
    }
  }
  return results
}

function parseSlugFromFilePath(filePath: string): string {
  // content/blog/my-post/index.mdx => my-post
  // content/blog/my-post/sub/index.mdx => my-post/sub
  const withoutExt = filePath.replace(/\.(mdx?|md)$/, "")
  const parts = withoutExt.split("/")

  if (parts[parts.length - 1] === "index") {
    parts.pop()
  }
  return parts.join("/")
}

export function getAllBlogPosts(): BlogPost[] {
  if (!fs.existsSync(BLOG_DIR)) return []

  const files = findMdxFiles(BLOG_DIR)

  return files
    .map((filePath) => {
      const fullPath = path.join(BLOG_DIR, filePath)
      const fileContent = fs.readFileSync(fullPath, "utf-8")
      const { data, content } = matter(fileContent)
      const slug = parseSlugFromFilePath(filePath)

      return {
        slug,
        title: data.title ?? "Untitled",
        description: data.description ?? "",
        date: new Date(data.date),
        order: data.order,
        image: data.image,
        tags: data.tags,
        authors: data.authors,
        draft: data.draft,
        rawContent: fileContent,
        body: content,
      } satisfies BlogPost
    })
    .filter((post) => !post.draft)
    .sort((a, b) => b.date.valueOf() - a.date.valueOf())
}

export function getPostBySlug(slug: string): BlogPost | null {
  const posts = getAllBlogPosts()
  return posts.find((p) => p.slug === slug) ?? null
}

export function getAllAuthors(): Author[] {
  if (!fs.existsSync(AUTHORS_DIR)) return []

  const files = fs.readdirSync(AUTHORS_DIR).filter((f) => /\.(md|mdx?)$/.test(f))

  return files.map((file) => {
    const fullPath = path.join(AUTHORS_DIR, file)
    const fileContent = fs.readFileSync(fullPath, "utf-8")
    const { data } = matter(fileContent)
    const id = file.replace(/\.(mdx?|md)$/, "")

    return {
      id,
      name: data.name ?? id,
      pronouns: data.pronouns,
      avatar: data.avatar ?? "/logo.png",
      bio: data.bio,
      mail: data.mail,
      website: data.website,
      twitter: data.twitter,
      github: data.github,
      linkedin: data.linkedin,
      discord: data.discord,
    } satisfies Author
  })
}

export function getAuthorById(id: string): Author | null {
  const authors = getAllAuthors()
  return authors.find((a) => a.id === id) ?? null
}

export function getRawContent(slug: string): string | null {
  const possiblePaths = [
    path.join(BLOG_DIR, slug, "index.mdx"),
    path.join(BLOG_DIR, slug, "index.md"),
    path.join(BLOG_DIR, `${slug}.mdx`),
    path.join(BLOG_DIR, `${slug}.md`),
  ]

  for (const p of possiblePaths) {
    if (fs.existsSync(p)) {
      return fs.readFileSync(p, "utf-8")
    }
  }
  return null
}
