import { SocialIcons } from "./social-icons"
import type { SocialLink } from "../_lib/consts"

const SOCIAL_LINKS: SocialLink[] = [
  { href: "mailto:hello@uncharted.sh", label: "Email" },
]

export function BlogFooter() {
  return (
    <footer className="mx-auto mb-8 flex w-full max-w-3xl flex-col items-center justify-center gap-y-2 px-4 sm:mb-4 sm:flex-row sm:justify-between">
      <SocialIcons links={SOCIAL_LINKS} />
    </footer>
  )
}
