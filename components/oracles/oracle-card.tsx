"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Bot, Settings, Activity, Zap, Clock, TrendingUp, AlertCircle, CheckCircle, Pause, Eye } from "lucide-react"
import Link from "next/link"

interface OracleCardProps {
  oracle: {
    id: string
    name: string
    model: string
    provider: string
    status: "active" | "inactive" | "error"
    accuracy: number
    predictions: number
    latency: number
    weight: number
    lastActive: string
    rewardsEarned: string
    version: string
  }
  onToggle: (id: string, enabled: boolean) => void
  onConfigure: (id: string) => void
}

export function OracleCard({ oracle, onToggle, onConfigure }: OracleCardProps) {
  const [isEnabled, setIsEnabled] = useState(oracle.status === "active")

  const statusConfig = {
    active: { color: "text-true", bg: "bg-true/10", icon: CheckCircle, label: "Activo" },
    inactive: { color: "text-muted-foreground", bg: "bg-muted/20", icon: Pause, label: "Inactivo" },
    error: { color: "text-fake", bg: "bg-fake/10", icon: AlertCircle, label: "Error" },
  }

  const status = statusConfig[oracle.status]
  const StatusIcon = status.icon

  const handleToggle = (enabled: boolean) => {
    setIsEnabled(enabled)
    onToggle(oracle.id, enabled)
  }

  return (
    <Card className="w-full">
      <CardHeader className="pb-4">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
          <div className="flex items-center space-x-3 min-w-0 flex-1">
            <div className={`p-2 rounded-lg ${status.bg} flex-shrink-0`}>
              <Bot className={`h-5 w-5 ${status.color}`} />
            </div>
            <div className="min-w-0 flex-1">
              <CardTitle className="text-lg truncate">{oracle.name}</CardTitle>
              <CardDescription className="flex flex-wrap items-center gap-2 mt-1">
                <span className="truncate">{oracle.model}</span>
                <Badge variant="outline" className="text-xs">
                  {oracle.provider}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  v{oracle.version}
                </Badge>
              </CardDescription>
            </div>
          </div>
          <div className="flex items-center justify-end space-x-3 flex-shrink-0">
            <Switch
              checked={isEnabled}
              onCheckedChange={handleToggle}
              className="data-[state=unchecked]:bg-gray-600 data-[state=unchecked]:border-gray-500"
            />
            <Button variant="outline" size="sm" onClick={() => onConfigure(oracle.id)} className="px-2">
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4 pt-0">
        {/* Status */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <StatusIcon className={`h-4 w-4 ${status.color}`} />
            <span className="text-sm font-medium">{status.label}</span>
          </div>
          <span className="text-xs text-muted-foreground truncate ml-2">Última actividad: {oracle.lastActive}</span>
        </div>

        <Separator />

        {/* Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Precisión</span>
              <span className="text-sm font-medium">{oracle.accuracy}%</span>
            </div>
            <Progress value={oracle.accuracy} className="h-2" />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Peso</span>
              <span className="text-sm font-medium">{oracle.weight}x</span>
            </div>
            <Progress value={(oracle.weight / 2) * 100} className="h-2" />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="min-w-0">
            <div className="flex items-center justify-center space-x-1 text-muted-foreground mb-1">
              <Activity className="h-3 w-3 flex-shrink-0" />
              <span className="text-xs truncate">Predicciones</span>
            </div>
            <div className="text-sm font-medium truncate">{oracle.predictions.toLocaleString()}</div>
          </div>

          <div className="min-w-0">
            <div className="flex items-center justify-center space-x-1 text-muted-foreground mb-1">
              <Clock className="h-3 w-3 flex-shrink-0" />
              <span className="text-xs truncate">Latencia</span>
            </div>
            <div className="text-sm font-medium">{oracle.latency}ms</div>
          </div>

          <div className="min-w-0">
            <div className="flex items-center justify-center space-x-1 text-muted-foreground mb-1">
              <TrendingUp className="h-3 w-3 flex-shrink-0" />
              <span className="text-xs truncate">Recompensas</span>
            </div>
            <div className="text-sm font-medium truncate">{oracle.rewardsEarned} ETH</div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
          <Button variant="outline" size="sm" className="flex-1 bg-transparent">
            <Activity className="h-3 w-3 mr-1" />
            Ver Logs
          </Button>
          <Button variant="outline" size="sm" className="flex-1 bg-transparent" asChild>
            <Link href="/oracles/validacion">
              <Eye className="h-3 w-3 mr-1" />
              Validar
            </Link>
          </Button>
          <Button variant="outline" size="sm" className="flex-1 bg-transparent">
            <Zap className="h-3 w-3 mr-1" />
            Probar
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
