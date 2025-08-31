import type React from "react"
import NextLink from "next/link"
import { forwardRef } from "react"
import { cn } from "@/lib/utils"

export interface LinkProps extends React.ComponentPropsWithoutRef<typeof NextLink> {
  className?: string
  children: React.ReactNode
}

export const Link = forwardRef<React.ElementRef<typeof NextLink>, LinkProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <NextLink
        ref={ref}
        className={cn("text-blue-600 hover:text-blue-800 underline transition-colors duration-200", className)}
        {...props}
      >
        {children}
      </NextLink>
    )
  },
)

Link.displayName = "Link"
