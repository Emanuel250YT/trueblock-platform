"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Search, Download, RefreshCw } from "lucide-react"

interface LogEntry {
  id: string
  timestamp: string
  oracle: string
  level: "info" | "warning" | "error" | "success"
  message: string
  details?: string
}

const sampleLogs: LogEntry[] = [
  {
    id: "1",
    timestamp: "2024-01-15 14:32:15",
    oracle: "GPT-4 Oracle",
    level: "success",
    message: "Predicción completada para noticia #1234",
    details: "Resultado: FAKE (confianza: 0.89)",
  },
  {
    id: "2",
    timestamp: "2024-01-15 14:31:45",
    oracle: "Claude Oracle",
    level: "info",
    message: "Iniciando análisis de contenido",
    details: "URL: https://example.com/news/article",
  },
  {
    id: "3",
    timestamp: "2024-01-15 14:30:22",
    oracle: "Gemini Oracle",
    level: "warning",
    message: "Latencia alta detectada",
    details: "Tiempo de respuesta: 3.2s (límite: 2s)",
  },
  {
    id: "4",
    timestamp: "2024-01-15 14:29:18",
    oracle: "GPT-4 Oracle",
    level: "error",
    message: "Error de conexión con API",
    details: "Reintentando en 30 segundos...",
  },
  {
    id: "5",
    timestamp: "2024-01-15 14:28:55",
    oracle: "Claude Oracle",
    level: "success",
    message: "Consenso alcanzado",
    details: "3/3 oráculos coinciden: TRUE",
  },
]

export function OracleLogs() {
  const [logs, setLogs] = useState(sampleLogs)
  const [searchQuery, setSearchQuery] = useState("")
  const [levelFilter, setLevelFilter] = useState("all")
  const [oracleFilter, setOracleFilter] = useState("all")
  const [isRefreshing, setIsRefreshing] = useState(false)

  const levelConfig = {
    info: { color: "text-info", bg: "bg-info/10" },
    success: { color: "text-true", bg: "bg-true/10" },
    warning: { color: "text-doubtful", bg: "bg-doubtful/10" },
    error: { color: "text-fake", bg: "bg-fake/10" },
  }

  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      log.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.oracle.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesLevel = levelFilter === "all" || log.level === levelFilter
    const matchesOracle = oracleFilter === "all" || log.oracle === oracleFilter

    return matchesSearch && matchesLevel && matchesOracle
  })

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsRefreshing(false)
  }

  const uniqueOracles = Array.from(new Set(logs.map((log) => log.oracle)))

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Logs del Sistema</CardTitle>
            <CardDescription>Actividad en tiempo real de todos los oráculos</CardDescription>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isRefreshing}>
              <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
              Actualizar
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Exportar
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar en logs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <Select value={levelFilter} onValueChange={setLevelFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Nivel" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los niveles</SelectItem>
              <SelectItem value="info">Info</SelectItem>
              <SelectItem value="success">Éxito</SelectItem>
              <SelectItem value="warning">Advertencia</SelectItem>
              <SelectItem value="error">Error</SelectItem>
            </SelectContent>
          </Select>

          <Select value={oracleFilter} onValueChange={setOracleFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Oráculo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los oráculos</SelectItem>
              {uniqueOracles.map((oracle) => (
                <SelectItem key={oracle} value={oracle}>
                  {oracle}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Logs */}
        <ScrollArea className="h-96 w-full border rounded-lg">
          <div className="p-4 space-y-2">
            {filteredLogs.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No se encontraron logs que coincidan con los filtros
              </div>
            ) : (
              filteredLogs.map((log) => {
                const config = levelConfig[log.level]
                return (
                  <div key={log.id} className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-muted/20">
                    <div className="flex-shrink-0">
                      <Badge className={`${config.bg} ${config.color} border-0`}>{log.level.toUpperCase()}</Badge>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium">{log.message}</p>
                        <span className="text-xs text-muted-foreground">{log.timestamp}</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">{log.oracle}</p>
                      {log.details && (
                        <p className="text-xs text-muted-foreground mt-2 font-mono bg-muted/30 p-2 rounded">
                          {log.details}
                        </p>
                      )}
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
