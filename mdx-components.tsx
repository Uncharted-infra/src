import React from "react"
import defaultMdxComponents from "fumadocs-ui/mdx"
import type { MDXComponents } from "mdx/types"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { cn } from "@/lib/utils"

export function getMDXComponents(components?: MDXComponents): MDXComponents {
  const defaultComponents = defaultMdxComponents

  return {
    ...defaultComponents,
    p: ({ children, ...props }: React.ComponentProps<"p">) => {
      const childrenArray = React.Children.toArray(children)

      const isFigureOrImage = (child: React.ReactNode): boolean => {
        if (!React.isValidElement(child)) return false

        const childType = child.type
        const childProps = (child.props || {}) as Record<string, unknown>

        if (
          childProps["data-mdx-image"] === true ||
          childProps["data-mdx-image"] === "true"
        ) {
          return true
        }

        if (childType === "figure" || childType === "img") {
          return true
        }

        if (
          typeof childProps.className === "string" &&
          childProps.className.includes("my-4")
        ) {
          return true
        }

        return false
      }

      const nonWhitespaceChildren = childrenArray.filter((child) => {
        if (typeof child === "string") {
          return child.trim().length > 0
        }
        return true
      })

      if (
        nonWhitespaceChildren.length === 1 &&
        isFigureOrImage(nonWhitespaceChildren[0])
      ) {
        return <>{nonWhitespaceChildren[0]}</>
      }

      if (
        nonWhitespaceChildren.length > 0 &&
        nonWhitespaceChildren.every(isFigureOrImage)
      ) {
        return <>{children}</>
      }

      const hasFigure = nonWhitespaceChildren.some(isFigureOrImage)
      if (hasFigure && nonWhitespaceChildren.every(isFigureOrImage)) {
        return <>{children}</>
      }

      return <p {...props}>{children}</p>
    },
    img: ({ className, src, alt, ...props }: React.ComponentProps<"img">) => {
      const imageSrc = typeof src === "string" ? src : String(src || "")

      return (
        <figure
          className="my-4 w-full"
          style={{
            display: "block",
            marginBlockStart: "1rem",
            marginBlockEnd: "1rem",
          }}
          data-mdx-image="true"
        >
          <img
            src={imageSrc}
            alt={alt || ""}
            className={cn(
              "rounded-md border w-full h-auto block max-w-full",
              className
            )}
            loading="lazy"
            style={{ display: "block", maxWidth: "100%", height: "auto" }}
            {...props}
          />
        </figure>
      )
    },
    Video: ({ className, ...props }: React.ComponentProps<"video">) => (
      <video
        className={cn("rounded-md border", className)}
        controls
        loop
        {...props}
      />
    ),
    Accordion,
    AccordionItem,
    AccordionTrigger,
    AccordionContent,
    ...components,
  }
}

export const useMDXComponents = getMDXComponents
