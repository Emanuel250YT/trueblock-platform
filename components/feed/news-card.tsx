"use client"

import type React from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { StatusBadge } from "@/components/ui/status-badge"
import { ConfidenceIndicator } from "@/components/ui/confidence-indicator"
import { ExternalLink, FileText, Shield, Users, Bot } from "lucide-react"

interface NewsCardProps {
  contentHash: string
  title: string
  summary: string
  url: string
  status: "verified" | "fake" | "doubtful" | "processing" | "pending"
  score: number
  category: string
  timestamp: string
  validations?: {
    ai_oracles: number
    community: number
    total: number
  }
}

export function NewsCard({
  contentHash,
  title,
  summary,
  url,
  status,
  score,
  category,
  timestamp,
  validations,
}: NewsCardProps) {
  const domain = new URL(url).hostname.replace("www.", "")
  const timeAgo = new Date(timestamp).toLocaleString("es-ES", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  })

  const handleCardClick = () => {
    window.location.href = `/tasks/${contentHash}`
  }

  const handleExternalLinkClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    window.open(url, "_blank", "noopener,noreferrer")
  }

  return (
    <Card className="hover:shadow-md transition-all duration-200 group cursor-pointer h-full" onClick={handleCardClick}>
      <CardHeader className="pb-3">
        <div className="space-y-3">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2 flex-wrap min-w-0">
              <Badge variant="outline" className="text-xs shrink-0 capitalize">
                {category}
              </Badge>
              <span className="text-xs text-muted-foreground truncate">{domain}</span>
            </div>
            <span className="text-xs text-muted-foreground whitespace-nowrap shrink-0">{timeAgo}</span>
          </div>

          <div className="flex items-start justify-between gap-3">
            <h3 className="font-semibold text-sm leading-tight line-clamp-2 group-hover:text-primary transition-colors flex-1 min-w-0">
              {title}
            </h3>
            <div className="shrink-0">
              <StatusBadge status={status} confidence={score} />
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground line-clamp-3">{summary}</p>

        <div className="space-y-3">
          <div className="flex items-center justify-center">
            <ConfidenceIndicator confidence={score} size="sm" showLabel={true} />
          </div>

          {validations && (
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  <Bot className="h-3 w-3" />
                  <span>{validations.ai_oracles} IA</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="h-3 w-3" />
                  <span>{validations.community} Comunidad</span>
                </div>
              </div>
              <div className="text-xs font-medium">Total: {validations.total}</div>
            </div>
          )}

          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 flex-wrap">
              <div className="flex items-center gap-1 px-2 py-1 bg-muted rounded text-xs">
                <FileText className="h-3 w-3" />
                <span>IPFS</span>
              </div>
              <div className="flex items-center gap-1 px-2 py-1 bg-muted rounded text-xs">
                <Shield className="h-3 w-3" />
                <span>ZK</span>
              </div>
            </div>

            <button
              onClick={handleExternalLinkClick}
              className="inline-flex items-center justify-center h-8 w-8 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors shrink-0"
              title="Ver fuente original"
            >
              <ExternalLink className="h-3 w-3" />
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
