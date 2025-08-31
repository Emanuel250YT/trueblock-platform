import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Activity, Target, TrendingUp, AlertTriangle, CheckCircle } from "lucide-react"

interface OracleMetricsProps {
  metrics: {
    totalOracles: number
    activeOracles: number
    avgAccuracy: number
    totalPredictions: number
    consensusRate: number
    networkHealth: "healthy" | "warning" | "critical"
  }
}

export function OracleMetrics({ metrics }: OracleMetricsProps) {
  const healthConfig = {
    healthy: { color: "text-true", bg: "bg-true/10", icon: CheckCircle },
    warning: { color: "text-doubtful", bg: "bg-doubtful/10", icon: AlertTriangle },
    critical: { color: "text-fake", bg: "bg-fake/10", icon: AlertTriangle },
  }

  const health = healthConfig[metrics.networkHealth]
  const HealthIcon = health.icon

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Red de Oráculos</CardTitle>
          <Activity className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {metrics.activeOracles}/{metrics.totalOracles}
          </div>
          <div className="flex items-center space-x-2 mt-2">
            <Progress value={(metrics.activeOracles / metrics.totalOracles) * 100} className="flex-1" />
            <Badge variant="outline">Activos</Badge>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Precisión Promedio</CardTitle>
          <Target className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{metrics.avgAccuracy}%</div>
          <p className="text-xs text-muted-foreground">{metrics.totalPredictions.toLocaleString()} predicciones</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Tasa de Consenso</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{metrics.consensusRate}%</div>
          <p className="text-xs text-muted-foreground">Acuerdo entre oráculos</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Estado de Red</CardTitle>
          <HealthIcon className={`h-4 w-4 ${health.color}`} />
        </CardHeader>
        <CardContent>
          <div
            className={`inline-flex items-center px-2 py-1 rounded-full text-sm font-medium ${health.bg} ${health.color}`}
          >
            {metrics.networkHealth === "healthy" && "Saludable"}
            {metrics.networkHealth === "warning" && "Advertencia"}
            {metrics.networkHealth === "critical" && "Crítico"}
          </div>
          <p className="text-xs text-muted-foreground mt-2">Monitoreo en tiempo real</p>
        </CardContent>
      </Card>
    </div>
  )
}
