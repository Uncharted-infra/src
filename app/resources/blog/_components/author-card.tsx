import Link from "next/link"
import { cn } from "@/lib/utils"
import type { Author } from "../_lib/content"
import { getAuthorSocialLinks } from "../_lib/data-utils"
import { SocialIcons } from "./social-icons"

interface AuthorCardProps {
  author: Author
}

export function AuthorCard({ author }: AuthorCardProps) {
  const { name, avatar, bio, pronouns } = author
  const socialLinks = getAuthorSocialLinks(author)

  return (
    <div className="has-[a:hover]:bg-muted/50 overflow-hidden rounded-xl border p-4 transition-colors duration-300 ease-in-out">
      <div className="flex flex-wrap gap-4">
        <div className="size-20 shrink-0 overflow-hidden rounded-md">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={avatar}
            alt={`Avatar of ${name}`}
            className="size-full object-cover"
          />
        </div>
        <div className="flex grow flex-col justify-between gap-y-4">
          <div>
            <div className="flex flex-wrap items-center gap-x-2">
              <h3 className="text-lg font-medium font-navbar-title">{name}</h3>
              {pronouns && (
                <span className="text-muted-foreground text-sm">
                  ({pronouns})
                </span>
              )}
            </div>
            {bio && (
              <p className="text-muted-foreground text-sm">{bio}</p>
            )}
          </div>
          {socialLinks.length > 0 && <SocialIcons links={socialLinks} />}
        </div>
      </div>
    </div>
  )
}
