"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { trueBlockAPI } from "@/lib/trueblock-api"
import {
  Download,
  Share2,
  ExternalLink,
  Clock,
  Users,
  Bot,
  Copy,
  Loader2,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Hash,
} from "lucide-react"

interface TaskDetailProps {
  taskId: string
}

export function TaskDetailSimple({ taskId }: TaskDetailProps) {
  const [validationStatus, setValidationStatus] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadValidationStatus = async () => {
    try {
      setLoading(true)
      console.log("[TrueBlock] Loading validation status for hash:", taskId)

      const response = await trueBlockAPI.getValidationStatus(taskId)

      if (response.success && response.data) {
        console.log("[TrueBlock] Validation status loaded:", response.data)
        setValidationStatus(response.data)
        setError(null)
      } else {
        setError(response.error || response.message || "No se pudo cargar el estado de la validación")
      }
    } catch (err) {
      console.error("[TrueBlock] Error loading validation status:", err)
      setError("Error al cargar el estado de la validación")
    } finally {
      setLoading(false)
    }
  }

  const refreshStatus = async () => {
    setRefreshing(true)
    await loadValidationStatus()
    setRefreshing(false)
  }

  useEffect(() => {
    loadValidationStatus()
  }, [taskId])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'validated':
        return 'bg-green-500'
      case 'validating':
        return 'bg-blue-500'
      case 'pending':
        return 'bg-yellow-500'
      case 'rejected':
        return 'bg-red-500'
      default:
        return 'bg-gray-500'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'validated':
        return 'Validado'
      case 'validating':
        return 'Validando'
      case 'pending':
        return 'Pendiente'
      case 'rejected':
        return 'Rechazado'
      default:
        return 'Desconocido'
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2 text-muted-foreground">Cargando detalles de validación...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {error}
          </AlertDescription>
        </Alert>
        <Button onClick={refreshStatus} variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" />
          Reintentar
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Detalles de Validación</h1>
          <p className="text-muted-foreground">Estado actual y progreso de la verificación</p>
        </div>
        <Button onClick={refreshStatus} disabled={refreshing} variant="outline">
          <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
          Actualizar
        </Button>
      </div>

      {/* Status Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Hash className="h-5 w-5" />
              Content Hash
            </CardTitle>
            <Badge className={getStatusColor(validationStatus?.status || '')}>
              {getStatusLabel(validationStatus?.status || '')}
            </Badge>
          </div>
          <CardDescription>Identificador único de esta validación</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between bg-muted p-3 rounded-lg">
            <code className="text-sm font-mono">{taskId}</code>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => copyToClipboard(taskId)}
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Validation Results */}
      {validationStatus && (
        <Card>
          <CardHeader>
            <CardTitle>Resultados de Validación</CardTitle>
            <CardDescription>Puntuaciones y análisis de la verificación</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-3 border rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{validationStatus.score || 0}</div>
                <div className="text-sm text-gray-600">Puntuación Total</div>
              </div>
              <div className="text-center p-3 border rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {validationStatus.validations?.ai_oracles || 0}
                </div>
                <div className="text-sm text-gray-600">Oráculos IA</div>
              </div>
              <div className="text-center p-3 border rounded-lg">
                <div className="text-2xl font-bold text-purple-600">
                  {validationStatus.validations?.community_validators || 0}
                </div>
                <div className="text-sm text-gray-600">Validadores</div>
              </div>
              <div className="text-center p-3 border rounded-lg">
                <div className="text-2xl font-bold text-yellow-600">
                  {validationStatus.validations?.total_votes || 0}
                </div>
                <div className="text-sm text-gray-600">Votos Totales</div>
              </div>
            </div>

            {/* Breakdown */}
            {validationStatus.breakdown && (
              <div className="space-y-3">
                <h4 className="font-medium">Desglose de Análisis</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="flex justify-between items-center p-2 border rounded">
                    <span>Fake News Score:</span>
                    <Badge variant="outline">{validationStatus.breakdown.fake_news_score}%</Badge>
                  </div>
                  <div className="flex justify-between items-center p-2 border rounded">
                    <span>Deepfake Score:</span>
                    <Badge variant="outline">{validationStatus.breakdown.deepfake_score}%</Badge>
                  </div>
                  <div className="flex justify-between items-center p-2 border rounded">
                    <span>Bias Score:</span>
                    <Badge variant="outline">{validationStatus.breakdown.bias_score}%</Badge>
                  </div>
                  <div className="flex justify-between items-center p-2 border rounded">
                    <span>Credibility Score:</span>
                    <Badge variant="outline">{validationStatus.breakdown.credibility_score}%</Badge>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Timeline */}
      <Card>
        <CardHeader>
          <CardTitle>Información Temporal</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Enviado:</span>
              <span>{validationStatus?.timestamp ? new Date(validationStatus.timestamp).toLocaleString() : 'No disponible'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Estado:</span>
              <span>{getStatusLabel(validationStatus?.status || '')}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex gap-2">
        <Button variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Descargar Reporte
        </Button>
        <Button variant="outline">
          <Share2 className="h-4 w-4 mr-2" />
          Compartir
        </Button>
        <Button variant="outline">
          <ExternalLink className="h-4 w-4 mr-2" />
          Ver en Blockchain
        </Button>
      </div>
    </div>
  )
}
