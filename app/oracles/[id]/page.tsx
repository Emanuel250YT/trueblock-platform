"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { motion } from "framer-motion"
import { ArrowLeft, Activity, Settings, AlertTriangle, CheckCircle, XCircle, RefreshCw, BarChart3 } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"

interface OracleDetail {
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
  description: string
  capabilities: string[]
  recentPredictions: Array<{
    id: string
    query: string
    prediction: string
    confidence: number
    timestamp: string
    result: "correct" | "incorrect" | "pending"
  }>
  performanceHistory: Array<{
    date: string
    accuracy: number
    predictions: number
    avgLatency: number
  }>
  configuration: {
    temperature: number
    maxTokens: number
    timeout: number
    retries: number
  }
}

// Mock data
const mockOracle: OracleDetail = {
  id: "1",
  name: "GPT-4 Oracle",
  model: "GPT-4",
  provider: "OpenAI",
  status: "active",
  accuracy: 96.8,
  predictions: 3247,
  latency: 850,
  weight: 1.5,
  lastActive: "hace 2 min",
  rewardsEarned: "0.234",
  version: "1.2.1",
  description:
    "Oráculo de alta precisión basado en GPT-4 para validación de noticias y análisis de contenido. Especializado en detección de desinformación y verificación de hechos.",
  capabilities: [
    "Análisis de sentimientos",
    "Detección de sesgos",
    "Verificación de hechos",
    "Análisis de fuentes",
    "Detección de deepfakes",
    "Clasificación de contenido",
  ],
  recentPredictions: [
    {
      id: "1",
      query: "¿Es verdadera la noticia sobre el nuevo presupuesto gubernamental?",
      prediction: "Verdadero con alta confianza. Las fuentes oficiales confirman los datos presentados.",
      confidence: 94,
      timestamp: "2024-01-15T10:30:00Z",
      result: "correct",
    },
    {
      id: "2",
      query: "Verificar información sobre cambios en política económica",
      prediction: "Parcialmente verdadero. Algunos datos son correctos pero faltan contexto importante.",
      confidence: 78,
      timestamp: "2024-01-15T09:15:00Z",
      result: "correct",
    },
    {
      id: "3",
      query: "Análisis de credibilidad de fuente periodística",
      prediction: "Fuente confiable con historial verificado de precisión en reportes económicos.",
      confidence: 89,
      timestamp: "2024-01-15T08:45:00Z",
      result: "pending",
    },
  ],
  performanceHistory: [
    { date: "2024-01-15", accuracy: 96.8, predictions: 45, avgLatency: 850 },
    { date: "2024-01-14", accuracy: 95.2, predictions: 52, avgLatency: 920 },
    { date: "2024-01-13", accuracy: 97.1, predictions: 38, avgLatency: 780 },
    { date: "2024-01-12", accuracy: 94.8, predictions: 61, avgLatency: 890 },
    { date: "2024-01-11", accuracy: 96.3, predictions: 47, avgLatency: 810 },
  ],
  configuration: {
    temperature: 0.3,
    maxTokens: 2048,
    timeout: 30,
    retries: 3,
  },
}

export default function OracleDetailPage() {
  const params = useParams()
  const [oracle, setOracle] = useState<OracleDetail | null>(null)
  const [isRefreshing, setIsRefreshing] = useState(false)

  useEffect(() => {
    // Simular carga de datos del oráculo
    setOracle(mockOracle)
  }, [params.id])

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setIsRefreshing(false)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "inactive":
        return "bg-yellow-100 text-yellow-800"
      case "error":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <CheckCircle className="h-4 w-4" />
      case "inactive":
        return <AlertTriangle className="h-4 w-4" />
      case "error":
        return <XCircle className="h-4 w-4" />
      default:
        return <Activity className="h-4 w-4" />
    }
  }

  const getResultIcon = (result: string) => {
    switch (result) {
      case "correct":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "incorrect":
        return <XCircle className="h-4 w-4 text-red-600" />
      default:
        return <Activity className="h-4 w-4 text-yellow-600" />
    }
  }

  if (!oracle) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/oracles" className="flex items-center gap-2 text-gray-600 hover:text-blue-600">
              <ArrowLeft className="h-5 w-5" />
              <span>Volver a oráculos</span>
            </Link>
            <Button onClick={handleRefresh} disabled={isRefreshing}>
              <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
              Actualizar
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header del oráculo */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-sm p-8 mb-8"
        >
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <h1 className="text-3xl font-bold text-gray-900">{oracle.name}</h1>
                <Badge className={getStatusColor(oracle.status)}>
                  {getStatusIcon(oracle.status)}
                  <span className="ml-1 capitalize">{oracle.status}</span>
                </Badge>
              </div>

              <div className="flex items-center gap-4 mb-4 text-sm text-gray-600">
                <span>
                  <strong>Modelo:</strong> {oracle.model}
                </span>
                <span>
                  <strong>Proveedor:</strong> {oracle.provider}
                </span>
                <span>
                  <strong>Versión:</strong> {oracle.version}
                </span>
              </div>

              <p className="text-gray-600 mb-6">{oracle.description}</p>

              {/* Métricas principales */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{oracle.accuracy}%</div>
                  <div className="text-sm text-gray-500">Precisión</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{oracle.predictions.toLocaleString()}</div>
                  <div className="text-sm text-gray-500">Predicciones</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">{oracle.latency}ms</div>
                  <div className="text-sm text-gray-500">Latencia</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-yellow-600">{oracle.rewardsEarned}</div>
                  <div className="text-sm text-gray-500">ETH ganados</div>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Button className="min-w-[120px]">
                <Settings className="h-4 w-4 mr-2" />
                Configurar
              </Button>
              <Button variant="outline" className="min-w-[120px] bg-transparent">
                <BarChart3 className="h-4 w-4 mr-2" />
                Analíticas
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Contenido con tabs */}
        <Tabs defaultValue="predictions" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="predictions">Predicciones</TabsTrigger>
            <TabsTrigger value="performance">Rendimiento</TabsTrigger>
            <TabsTrigger value="capabilities">Capacidades</TabsTrigger>
            <TabsTrigger value="config">Configuración</TabsTrigger>
          </TabsList>

          <TabsContent value="predictions" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Predicciones recientes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {oracle.recentPredictions.map((prediction) => (
                    <div key={prediction.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <p className="font-medium text-gray-900 mb-1">{prediction.query}</p>
                          <p className="text-gray-600 text-sm">{prediction.prediction}</p>
                        </div>
                        <div className="flex items-center gap-2 ml-4">
                          {getResultIcon(prediction.result)}
                          <Badge variant="outline">{prediction.confidence}% confianza</Badge>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <time dateTime={prediction.timestamp}>
                          {new Date(prediction.timestamp).toLocaleString("es-ES")}
                        </time>
                        <span className="capitalize">{prediction.result}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="performance" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Historial de precisión</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {oracle.performanceHistory.map((day) => (
                      <div key={day.date} className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">{day.date}</span>
                        <div className="flex items-center gap-4">
                          <span className="text-sm font-medium">{day.accuracy}%</span>
                          <Progress value={day.accuracy} className="w-20" />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Métricas de rendimiento</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Precisión promedio</span>
                      <span className="font-medium">96.0%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Latencia promedio</span>
                      <span className="font-medium">850ms</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Predicciones/día</span>
                      <span className="font-medium">48.6</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Tiempo activo</span>
                      <span className="font-medium">99.2%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="capabilities" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Capacidades del oráculo</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {oracle.capabilities.map((capability) => (
                    <div key={capability} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <span className="font-medium">{capability}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="config" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Configuración del oráculo</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">Temperatura</label>
                      <p className="text-xs text-gray-500 mb-2">Controla la creatividad de las respuestas</p>
                      <div className="flex items-center space-x-2">
                        <span className="text-lg font-bold">{oracle.configuration.temperature}</span>
                        <Button variant="outline" size="sm">
                          Ajustar
                        </Button>
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium">Tokens máximos</label>
                      <p className="text-xs text-gray-500 mb-2">Longitud máxima de respuesta</p>
                      <div className="flex items-center space-x-2">
                        <span className="text-lg font-bold">{oracle.configuration.maxTokens}</span>
                        <Button variant="outline" size="sm">
                          Ajustar
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">Timeout</label>
                      <p className="text-xs text-gray-500 mb-2">Tiempo máximo de espera (segundos)</p>
                      <div className="flex items-center space-x-2">
                        <span className="text-lg font-bold">{oracle.configuration.timeout}s</span>
                        <Button variant="outline" size="sm">
                          Ajustar
                        </Button>
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium">Reintentos</label>
                      <p className="text-xs text-gray-500 mb-2">Número de reintentos en caso de error</p>
                      <div className="flex items-center space-x-2">
                        <span className="text-lg font-bold">{oracle.configuration.retries}</span>
                        <Button variant="outline" size="sm">
                          Ajustar
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
