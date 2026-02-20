import { BlogCard } from "./_components/blog-card"
import { BLOG_CONFIG } from "./_lib/consts"
import { getAllPosts, groupPostsByYear } from "./_lib/data-utils"

export default function BlogPage() {
  const posts = getAllPosts()
  const grouped = groupPostsByYear(posts)
  const years = Object.keys(grouped).sort((a, b) => Number(b) - Number(a))

  return (
    <div className="mx-auto w-full max-w-3xl">
      <section className="mb-8 rounded-lg border p-6">
        <h1 className="mb-1 text-3xl font-medium font-navbar-title leading-none">
          {BLOG_CONFIG.title}
        </h1>
        <p className="text-muted-foreground text-sm">
          {BLOG_CONFIG.description}
        </p>
      </section>

      {posts.length === 0 ? (
        <p className="text-muted-foreground text-center">
          No posts yet. Check back soon.
        </p>
      ) : (
        years.map((year) => (
          <section key={year} className="mb-8 flex flex-col gap-y-4">
            <h2 className="text-2xl font-medium font-navbar-title">{year}</h2>
            <ul className="flex flex-col gap-y-4">
              {grouped[year].map((post) => (
                <li key={post.slug}>
                  <BlogCard entry={post} />
                </li>
              ))}
            </ul>
          </section>
        ))
      )}
    </div>
  )
}
