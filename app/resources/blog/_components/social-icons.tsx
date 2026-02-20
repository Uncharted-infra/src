import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  Globe,
  Github,
  Linkedin,
  Twitter,
  Mail,
  Rss,
  MessageCircleQuestion,
} from "lucide-react"
import type { SocialLink } from "../_lib/consts"

const iconComponents: Record<string, React.ElementType> = {
  Website: Globe,
  GitHub: Github,
  LinkedIn: Linkedin,
  Twitter: Twitter,
  Email: Mail,
  RSS: Rss,
}

interface SocialIconsProps {
  links: SocialLink[]
}

export function SocialIcons({ links }: SocialIconsProps) {
  return (
    <ul className="flex flex-wrap gap-2" role="list">
      {links.map(({ href, label }) => {
        const IconComp = iconComponents[label] ?? MessageCircleQuestion
        return (
          <li key={label}>
            <Button variant="outline" size="icon" asChild>
              <Link
                href={href}
                aria-label={label}
                title={label}
                target="_blank"
                rel="noopener noreferrer"
              >
                <IconComp className="size-4" />
              </Link>
            </Button>
          </li>
        )
      })}
    </ul>
  )
}
