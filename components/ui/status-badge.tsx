import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"

interface StatusBadgeProps {
  status: "true" | "fake" | "doubtful" | "pending" | "processing"
  confidence?: number
  className?: string
}

export function StatusBadge({ status, confidence, className }: StatusBadgeProps) {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case "true":
        return {
          label: "Verdadero",
          className: "bg-primary text-primary-foreground border-primary",
        }
      case "fake":
        return {
          label: "Falso",
          className: "bg-secondary text-secondary-foreground border-secondary",
        }
      case "doubtful":
        return {
          label: "Dudoso",
          className: "bg-accent text-accent-foreground border-accent",
        }
      case "pending":
        return {
          label: "Pendiente",
          className: "bg-muted text-muted-foreground border-muted",
        }
      case "processing":
        return {
          label: "Procesando",
          className: "bg-info text-info-foreground border-info animate-pulse",
        }
      default:
        return {
          label: "Desconocido",
          className: "bg-muted text-muted-foreground border-muted",
        }
    }
  }

  const config = getStatusConfig(status)

  return (
    <Badge variant="outline" className={cn(config.className, className)}>
      {config.label}
      {confidence && <span className="ml-1 text-xs opacity-80">{Math.round(confidence * 100)}%</span>}
    </Badge>
  )
}
