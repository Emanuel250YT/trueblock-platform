"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { StatusBadge } from "@/components/ui/status-badge"
import { ConfidenceIndicator } from "@/components/ui/confidence-indicator"
import { PipelineTimeline } from "@/components/validation/pipeline-timeline"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { trueBlockAPI } from "@/lib/trueblock-api"
import {
  Download,
  Share2,
  ExternalLink,
  FileText,
  Shield,
  Clock,
  Users,
  Bot,
  Brain,
  BrainIcon as ChainIcon,
  Copy,
  Eye,
  Loader2,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Hash,
} from "lucide-react"
import { apiClient } from "@/lib/api"

interface TaskDetailProps {
  taskId: string
}

export function TaskDetail({ taskId }: TaskDetailProps) {
  const [activeTab, setActiveTab] = useState("timeline")
  const [taskData, setTaskData] = useState<any>(null)
  const [validationStatus, setValidationStatus] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadValidationStatus = async (contentHash: string) => {
    try {
      console.log("[v0] Loading validation status for hash:", contentHash)
      const response = await trueBlockAPI.getValidationStatus(contentHash)

      if (response.success && response.data) {
        setValidationStatus(response.data)
        console.log("[v0] Validation status loaded:", response.data)
      }
    } catch (err) {
      console.error("[v0] Error loading validation status:", err)
    }
  }

  useEffect(() => {
    const loadTaskData = async () => {
      try {
        console.log("[v0] Loading task detail for:", taskId)
        setLoading(true)
        setError(null)

        await loadValidationStatus(taskId)

        // Try to load news detail (fallback for existing data)
        const response = await apiClient.news.getNewsDetail(taskId)
        console.log("[v0] Task detail loaded:", response)

        if (response.success && response.data) {
          setTaskData(response.data)
        } else {
          if (validationStatus) {
            setTaskData({
              contentHash: taskId,
              title: validationStatus.title || "Verificación en Proceso",
              summary:
                validationStatus.summary || "Esta verificación está siendo procesada por nuestro pipeline multicapa.",
              url: validationStatus.url || "#",
              category: validationStatus.category || "General",
              status: validationStatus.status || "processing",
              score: validationStatus.score || 0,
              timestamp: validationStatus.timestamp || new Date().toISOString(),
              validations: validationStatus.breakdown || {},
            })
          } else {
            throw new Error("No se encontraron datos de la verificación")
          }
        }
      } catch (err) {
        console.error("[v0] Error loading task detail:", err)
        setError("No se pudo cargar la información de la verificación")
      } finally {
        setLoading(false)
      }
    }

    if (taskId) {
      loadTaskData()
    }
  }, [taskId])

  const refreshStatus = async () => {
    if (!taskId) return

    setRefreshing(true)
    try {
      await loadValidationStatus(taskId)

      // Update task data if we have validation status
      if (validationStatus) {
        setTaskData((prev: any) => ({
          ...prev,
          status: validationStatus.status,
          score: validationStatus.score,
          validations: validationStatus.breakdown,
        }))
      }
    } catch (err) {
      console.error("[v0] Error refreshing status:", err)
    } finally {
      setRefreshing(false)
    }
  }

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleString("es-ES", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    } catch {
      return "Fecha no disponible"
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const downloadCertificate = () => {
    if (taskData?.contentHash) {
      console.log("Descargando certificado para hash:", taskData.contentHash)
      // TODO: Implement actual certificate download
    }
  }

  const generateBadge = () => {
    console.log("Generando badge...")
  }

  const shareResult = () => {
    const shareUrl = `${window.location.origin}/tasks/${taskId}`
    copyToClipboard(shareUrl)
    console.log("URL copiada:", shareUrl)
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto flex items-center justify-center py-12">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Cargando detalles de la verificación...</p>
        </div>
      </div>
    )
  }

  if (error || !taskData) {
    return (
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardContent className="py-12 text-center space-y-4">
            <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto" />
            <div>
              <h3 className="text-lg font-medium mb-2">Verificación no encontrada</h3>
              <p className="text-muted-foreground mb-4">{error || "No se encontró la verificación con este hash"}</p>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Hash buscado:</p>
                <code className="text-xs bg-muted px-2 py-1 rounded">{taskId}</code>
              </div>
            </div>
            <div className="flex gap-2 justify-center">
              <Button variant="outline" onClick={() => window.history.back()}>
                Volver
              </Button>
              <Button onClick={refreshStatus} disabled={refreshing}>
                {refreshing ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <RefreshCw className="h-4 w-4 mr-2" />
                )}
                Reintentar
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const getStepStatus = (stepId: string): "pending" | "completed" | "processing" | "failed" => {
    if (!validationStatus) return "pending"

    switch (stepId) {
      case "oracles":
        return validationStatus.breakdown?.ai_oracles > 0 ? "completed" : "pending"
      case "llm":
        return validationStatus.breakdown?.llm_review ? "completed" : "pending"
      case "community":
        return validationStatus.breakdown?.community > 0 ? "completed" : "pending"
      case "blockchain":
        return validationStatus.status === "verified" ? "completed" : "pending"
      default:
        return "pending"
    }
  }

  const steps = [
    {
      id: "oracles",
      name: "Oráculos de IA",
      icon: Bot,
      status: getStepStatus("oracles"),
      result: `${validationStatus?.breakdown?.ai_oracles || taskData.validations?.ai_oracles || 0} oráculos completados`,
      confidence: taskData.score ? taskData.score / 100 : 0,
      details: [
        { oracle: "Oráculo A", result: "Completado", confidence: 0.92 },
        { oracle: "Oráculo B", result: "Completado", confidence: 0.81 },
        { oracle: "Oráculo C", result: "Completado", confidence: 0.83 },
      ],
    },
    {
      id: "llm",
      name: "Revisión LLM",
      icon: Brain,
      status: getStepStatus("llm"),
      result: "Coherencia verificada",
      confidence: 0.78,
      details: [
        { aspect: "Coherencia interna", score: 0.85 },
        { aspect: "Verificación de fuentes", score: 0.72 },
        { aspect: "Consistencia temporal", score: 0.76 },
      ],
    },
    {
      id: "community",
      name: "Validación Comunitaria",
      icon: Users,
      status: getStepStatus("community"),
      result: `${validationStatus?.breakdown?.community || taskData.validations?.community || 0} validaciones comunitarias`,
      confidence: 0.88,
      details: [
        {
          category: "Total validaciones",
          count: validationStatus?.breakdown?.total || taskData.validations?.total || 0,
        },
        {
          category: "Comunidad",
          count: validationStatus?.breakdown?.community || taskData.validations?.community || 0,
        },
        { category: "IA", count: validationStatus?.breakdown?.ai_oracles || taskData.validations?.ai_oracles || 0 },
      ],
    },
    {
      id: "blockchain",
      name: "Consenso On-chain",
      icon: ChainIcon,
      status: getStepStatus("blockchain"),
      result: taskData.status === "verified" ? "Consenso alcanzado" : "Procesando...",
      confidence: taskData.score ? taskData.score / 100 : 0,
      details: [
        { type: "Content Hash", value: taskData.contentHash?.slice(0, 20) + "..." },
        { type: "Estado", value: taskData.status },
        { type: "Score", value: `${taskData.score}%` },
      ],
    },
  ]

  const evidence = [
    {
      type: "IPFS Snapshot",
      hash: taskData.contentHash || taskId,
      description: "Captura completa del contenido original",
      size: "2.3 MB",
    },
    {
      type: "Metadata",
      hash: "QmA1B2C3D4E5F6G7H8I9J0K1L2M3N4O5P6Q7R8S9T0U1V2W",
      description: "Metadatos extraídos y análisis de fuentes",
      size: "156 KB",
    },
    {
      type: "Analysis Results",
      hash: "QmZ9Y8X7W6V5U4T3S2R1Q0P9O8N7M6L5K4J3I2H1G0F9E8D",
      description: "Resultados completos del análisis multicapa",
      size: "892 KB",
    },
  ]

  const activity = [
    { timestamp: taskData.timestamp, event: "Verificación creada", type: "created" },
    { timestamp: taskData.timestamp, event: "Asignada a oráculos", type: "assigned" },
    { timestamp: taskData.timestamp, event: "Análisis completado", type: "completed" },
  ]

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="outline">{taskData.category}</Badge>
                {taskData.url && taskData.url !== "#" && (
                  <span className="text-sm text-muted-foreground">{new URL(taskData.url).hostname}</span>
                )}
                <Button variant="ghost" size="sm" onClick={refreshStatus} disabled={refreshing} className="ml-auto">
                  {refreshing ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
                </Button>
              </div>
              <h1 className="text-2xl font-bold text-balance mb-2">{taskData.title}</h1>
              <p className="text-muted-foreground mb-4">{taskData.summary}</p>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Hash className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Content Hash:</span>
                  <code className="bg-muted px-2 py-1 rounded text-xs font-mono">
                    {taskData.contentHash?.slice(0, 20)}...
                  </code>
                  <Button variant="ghost" size="sm" onClick={() => copyToClipboard(taskData.contentHash || taskId)}>
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span>Creado: {formatDate(taskData.timestamp)}</span>
                  {validationStatus?.lastUpdated && (
                    <span>Actualizado: {formatDate(validationStatus.lastUpdated)}</span>
                  )}
                </div>
              </div>
            </div>
            <div className="flex flex-col items-end gap-3">
              <StatusBadge status={taskData.status} confidence={taskData.score / 100} />
              <ConfidenceIndicator confidence={taskData.score / 100} size="sm" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            {taskData.url && taskData.url !== "#" && (
              <Button variant="outline" size="sm" asChild>
                <a href={taskData.url} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Ver Original
                </a>
              </Button>
            )}
            <Button variant="outline" size="sm" onClick={() => copyToClipboard(taskData.url || window.location.href)}>
              <Copy className="h-4 w-4 mr-2" />
              Copiar URL
            </Button>
          </div>
        </CardContent>
      </Card>

      {taskData.status === "processing" && (
        <Alert>
          <Clock className="h-4 w-4" />
          <AlertDescription>
            Esta verificación está siendo procesada. El proceso puede tomar entre 30 minutos y 4 horas.
            <Button variant="link" className="p-0 h-auto ml-1" onClick={refreshStatus}>
              Actualizar estado
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {taskData.status === "verified" && (
        <Alert className="border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            Esta verificación ha sido completada exitosamente y está disponible en blockchain.
          </AlertDescription>
        </Alert>
      )}

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="timeline">Pipeline</TabsTrigger>
          <TabsTrigger value="evidence">Evidencias</TabsTrigger>
          <TabsTrigger value="activity">Actividad</TabsTrigger>
          <TabsTrigger value="actions">Acciones</TabsTrigger>
        </TabsList>

        <TabsContent value="timeline" className="space-y-6">
          <PipelineTimeline steps={steps} />

          {/* Detailed Results */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {steps.map((step) => (
              <Card key={step.id}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <step.icon className="h-4 w-4" />
                    {step.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {step.details?.map((detail, index) => (
                      <div key={index} className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">
                          {"oracle" in detail ? detail.oracle : "aspect" in detail ? detail.aspect : "category" in detail ? detail.category : detail.type}
                        </span>
                        <span className="font-medium">
                          {"result" in detail ? detail.result : "score" in detail ? detail.score : "count" in detail ? detail.count : detail.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="evidence" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Evidencias IPFS
              </CardTitle>
              <CardDescription>
                Todos los artefactos y evidencias están almacenados de forma inmutable en IPFS
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {evidence.map((evidenceItem, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium">{evidenceItem.type}</h4>
                      <p className="text-sm text-muted-foreground mb-2">{evidenceItem.description}</p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>Hash: {evidenceItem.hash.slice(0, 20)}...</span>
                        <span>Tamaño: {evidenceItem.size}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm" onClick={() => copyToClipboard(evidenceItem.hash)}>
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" asChild>
                        <a href={`https://ipfs.io/ipfs/${evidenceItem.hash}`} target="_blank" rel="noopener noreferrer">
                          <Eye className="h-4 w-4 mr-2" />
                          Ver
                        </a>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Historial de Actividad
              </CardTitle>
              <CardDescription>Timeline completo de eventos y cambios de estado</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activity.map((activityItem, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{activityItem.event}</p>
                      <p className="text-xs text-muted-foreground">{formatDate(activityItem.timestamp)}</p>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {activityItem.type}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="actions" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Certificado de Verificación</CardTitle>
                <CardDescription>Descarga un certificado PDF con el veredicto y pruebas</CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={downloadCertificate} className="w-full" disabled={taskData.status !== "verified"}>
                  <Download className="h-4 w-4 mr-2" />
                  Descargar Certificado
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Badge Embebible</CardTitle>
                <CardDescription>Genera un badge para mostrar en tu sitio web</CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  onClick={generateBadge}
                  variant="outline"
                  className="w-full bg-transparent"
                  disabled={taskData.status !== "verified"}
                >
                  <Shield className="h-4 w-4 mr-2" />
                  Generar Badge
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Compartir Resultado</CardTitle>
                <CardDescription>Comparte un enlace público de solo lectura</CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={shareResult} variant="outline" className="w-full bg-transparent">
                  <Share2 className="h-4 w-4 mr-2" />
                  Compartir
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Prueba Blockchain</CardTitle>
                <CardDescription>Ver la prueba ZK y transacción on-chain</CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  variant="outline"
                  className="w-full bg-transparent"
                  asChild
                  disabled={taskData.status !== "verified"}
                >
                  <a href={`https://basescan.org/tx/${taskData.contentHash}`} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Ver en Explorer
                  </a>
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
