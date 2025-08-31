import { cn } from "@/lib/utils"

interface ConfidenceIndicatorProps {
  confidence: number
  size?: "sm" | "md" | "lg"
  showLabel?: boolean
  className?: string
}

export function ConfidenceIndicator({
  confidence,
  size = "md",
  showLabel = true,
  className,
}: ConfidenceIndicatorProps) {
  const percentage = Math.round(confidence * 100)

  const getConfidenceLevel = (conf: number) => {
    if (conf >= 0.8) return { level: "Alto", color: "text-primary" }
    if (conf >= 0.6) return { level: "Medio", color: "text-accent" }
    return { level: "Bajo", color: "text-secondary" }
  }

  const { level, color } = getConfidenceLevel(confidence)

  const sizeClasses = {
    sm: "w-12 h-12 text-xs",
    md: "w-16 h-16 text-sm",
    lg: "w-20 h-20 text-base",
  }

  return (
    <div className={cn("flex flex-col items-center gap-1", className)}>
      <div
        className={cn(
          "relative flex items-center justify-center rounded-full border-4",
          sizeClasses[size],
          color.replace("text-", "border-"),
        )}
      >
        <span className={cn("font-semibold", color)}>{percentage}%</span>
        <svg className="absolute inset-0 -rotate-90" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="8" className="opacity-20" />
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="currentColor"
            strokeWidth="8"
            strokeDasharray={`${confidence * 283} 283`}
            className={color}
          />
        </svg>
      </div>
      {showLabel && <span className={cn("text-xs font-medium", color)}>{level}</span>}
    </div>
  )
}
