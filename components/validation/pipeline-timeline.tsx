import type React from "react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Clock, AlertCircle } from "lucide-react"

interface PipelineStep {
  id: string
  name: string
  icon: React.ComponentType<{ className?: string }>
  status: "pending" | "processing" | "completed" | "failed"
  result?: string
  confidence?: number
}

interface PipelineTimelineProps {
  steps: PipelineStep[]
  className?: string
}

export function PipelineTimeline({ steps, className }: PipelineTimelineProps) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-primary" />
      case "processing":
        return <Clock className="h-4 w-4 text-info animate-spin" />
      case "failed":
        return <AlertCircle className="h-4 w-4 text-secondary" />
      default:
        return <Clock className="h-4 w-4 text-muted-foreground" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "border-primary bg-primary/5"
      case "processing":
        return "border-info bg-info/5"
      case "failed":
        return "border-secondary bg-secondary/5"
      default:
        return "border-muted bg-muted/5"
    }
  }

  return (
    <div className={cn("space-y-4", className)}>
      <h3 className="text-lg font-semibold">Pipeline de Validación</h3>

      <div className="space-y-3">
        {steps.map((step, index) => {
          const Icon = step.icon
          const isLast = index === steps.length - 1

          return (
            <div key={step.id} className="relative">
              {/* Connector line */}
              {!isLast && <div className="absolute left-6 top-12 w-0.5 h-8 bg-border" />}

              {/* Step content */}
              <div className={cn("flex items-start space-x-4 p-4 rounded-lg border", getStatusColor(step.status))}>
                {/* Icon */}
                <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-full bg-background border">
                  <Icon className="h-5 w-5" />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium">{step.name}</h4>
                    {getStatusIcon(step.status)}
                  </div>

                  {step.result && <p className="mt-1 text-sm text-muted-foreground">{step.result}</p>}

                  {step.confidence && (
                    <Badge variant="outline" className="mt-2">
                      Confianza: {Math.round(step.confidence * 100)}%
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
