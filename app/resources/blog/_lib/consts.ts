export const BLOG_CONFIG = {
  title: "Uncharted",
  description:
    "Stories, guides, and insights from the team building your AI travel agent.",
  href: "https://uncharted.sh",
  author: "Uncharted Team",
  locale: "en-US",
  featuredPostCount: 2,
  postsPerPage: 6,
} as const

export type SocialLink = {
  href: string
  label: string
}

export const ICON_MAP: Record<string, string> = {
  Website: "globe",
  GitHub: "github",
  LinkedIn: "linkedin",
  Twitter: "twitter",
  Email: "mail",
  RSS: "rss",
}
