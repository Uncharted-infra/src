import { BLOG_CONFIG } from "../_lib/consts"
import { getAllPosts } from "../_lib/data-utils"

export async function GET() {
  const posts = getAllPosts()

  const items = posts
    .map(
      (post) => `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <description><![CDATA[${post.description}]]></description>
      <pubDate>${post.date.toUTCString()}</pubDate>
      <link>${BLOG_CONFIG.href}/resources/blog/${post.slug}</link>
      <guid isPermaLink="true">${BLOG_CONFIG.href}/resources/blog/${post.slug}</guid>
    </item>`
    )
    .join("")

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${BLOG_CONFIG.title} Blog</title>
    <description>${BLOG_CONFIG.description}</description>
    <link>${BLOG_CONFIG.href}/resources/blog</link>
    <atom:link href="${BLOG_CONFIG.href}/resources/blog/rss.xml" rel="self" type="application/rss+xml"/>
    <language>${BLOG_CONFIG.locale}</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>${items}
  </channel>
</rss>`

  return new Response(rss, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
    },
  })
}
