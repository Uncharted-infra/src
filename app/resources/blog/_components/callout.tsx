import { cn } from "@/lib/utils"
import {
  Info,
  Lightbulb,
  AlertTriangle,
  ShieldAlert,
  MessageSquareWarning,
  BookOpen,
  CheckCircle,
  Puzzle,
  CheckSquare,
  GitBranch,
  FileText,
  Anchor,
  HelpCircle,
  PenTool,
  MessageCircle,
  RotateCcw,
  Code,
  Dumbbell,
  AlertCircle,
  Check,
  CheckCircle2,
  List,
  ChevronDown,
  type LucideIcon,
} from "lucide-react"

const calloutConfig: Record<
  string,
  { style: string; textColor: string; Icon: LucideIcon }
> = {
  note: { style: "border-blue-500 dark:bg-blue-950/5", textColor: "text-blue-700 dark:text-blue-300", Icon: Info },
  tip: { style: "border-green-500 dark:bg-green-950/5", textColor: "text-green-700 dark:text-green-300", Icon: Lightbulb },
  warning: { style: "border-amber-500 dark:bg-amber-950/5", textColor: "text-amber-700 dark:text-amber-300", Icon: AlertTriangle },
  danger: { style: "border-red-500 dark:bg-red-950/5", textColor: "text-red-700 dark:text-red-300", Icon: ShieldAlert },
  important: { style: "border-purple-500 dark:bg-purple-950/5", textColor: "text-purple-700 dark:text-purple-300", Icon: MessageSquareWarning },
  definition: { style: "border-purple-500 dark:bg-purple-950/5", textColor: "text-purple-700 dark:text-purple-300", Icon: BookOpen },
  theorem: { style: "border-teal-500 dark:bg-teal-950/5", textColor: "text-teal-700 dark:text-teal-300", Icon: CheckCircle },
  lemma: { style: "border-sky-400 dark:bg-sky-950/5", textColor: "text-sky-700 dark:text-sky-300", Icon: Puzzle },
  proof: { style: "border-gray-500 dark:bg-gray-950/5", textColor: "text-gray-700 dark:text-gray-300", Icon: CheckSquare },
  corollary: { style: "border-cyan-500 dark:bg-cyan-950/5", textColor: "text-cyan-700 dark:text-cyan-300", Icon: GitBranch },
  proposition: { style: "border-slate-500 dark:bg-slate-950/5", textColor: "text-slate-700 dark:text-slate-300", Icon: FileText },
  axiom: { style: "border-violet-600 dark:bg-violet-950/5", textColor: "text-violet-700 dark:text-violet-300", Icon: Anchor },
  conjecture: { style: "border-pink-500 dark:bg-pink-950/5", textColor: "text-pink-700 dark:text-pink-300", Icon: HelpCircle },
  notation: { style: "border-slate-400 dark:bg-slate-950/5", textColor: "text-slate-700 dark:text-slate-300", Icon: PenTool },
  remark: { style: "border-gray-400 dark:bg-gray-950/5", textColor: "text-gray-700 dark:text-gray-300", Icon: MessageCircle },
  intuition: { style: "border-yellow-500 dark:bg-yellow-950/5", textColor: "text-yellow-700 dark:text-yellow-300", Icon: Lightbulb },
  recall: { style: "border-blue-300 dark:bg-blue-950/5", textColor: "text-blue-600 dark:text-blue-300", Icon: RotateCcw },
  explanation: { style: "border-lime-500 dark:bg-lime-950/5", textColor: "text-lime-700 dark:text-lime-300", Icon: HelpCircle },
  example: { style: "border-emerald-500 dark:bg-emerald-950/5", textColor: "text-emerald-700 dark:text-emerald-300", Icon: Code },
  exercise: { style: "border-indigo-500 dark:bg-indigo-950/5", textColor: "text-indigo-700 dark:text-indigo-300", Icon: Dumbbell },
  problem: { style: "border-orange-600 dark:bg-orange-950/5", textColor: "text-orange-700 dark:text-orange-300", Icon: AlertCircle },
  answer: { style: "border-teal-500 dark:bg-teal-950/5", textColor: "text-teal-700 dark:text-teal-300", Icon: Check },
  solution: { style: "border-emerald-600 dark:bg-emerald-950/5", textColor: "text-emerald-700 dark:text-emerald-300", Icon: CheckCircle2 },
  summary: { style: "border-sky-500 dark:bg-sky-950/5", textColor: "text-sky-700 dark:text-sky-300", Icon: List },
}

interface CalloutProps {
  variant?: keyof typeof calloutConfig
  title?: string
  children: React.ReactNode
  defaultOpen?: boolean
  className?: string
}

export function Callout({
  variant = "note",
  title,
  children,
  defaultOpen = true,
  className,
}: CalloutProps) {
  const config = calloutConfig[variant] ?? calloutConfig.note
  const { Icon } = config
  const label = variant.charAt(0).toUpperCase() + variant.slice(1)

  return (
    <details
      className={cn(
        "relative my-6 border-l-4 px-4 py-3 text-sm",
        config.style,
        "[&[open]>summary_svg:last-child]:rotate-180 [&[open]>summary]:mb-3",
        className
      )}
      open={defaultOpen}
    >
      <summary className="flex cursor-pointer items-center font-medium [&::-webkit-details-marker]:hidden">
        <Icon className={cn("mr-2 size-4 shrink-0", config.textColor)} />
        <span className={cn("mr-2 font-medium", config.textColor)}>
          {label}
          {title && (
            <span className="font-normal opacity-70"> ({title})</span>
          )}
        </span>
        <ChevronDown
          className={cn(
            "ml-auto h-4 w-4 shrink-0 transition-transform duration-200",
            config.textColor
          )}
        />
      </summary>
      <div>{children}</div>
    </details>
  )
}
