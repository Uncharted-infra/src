import type { Metadata } from "next"
import "./_styles/typography.css"
import { BlogFooter } from "./_components/blog-footer"

export const metadata: Metadata = {
  title: {
    default: "Blog | Uncharted",
    template: "%s | Uncharted Blog",
  },
  description:
    "Stories, guides, and insights from the team building your AI travel agent.",
}

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col gap-y-6 bg-background font-landing">
      <main className="mx-auto flex w-full max-w-5xl grow flex-col gap-y-6 px-4">
        {children}
      </main>
      <BlogFooter />
    </div>
  )
}
