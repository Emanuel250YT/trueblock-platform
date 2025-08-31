"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { ArrowLeft, Send, CheckCircle, XCircle, Clock, AlertTriangle, Zap } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useWallet } from "@/contexts/wallet-context"

interface ValidationRequest {
  id: string
  content: string
  type: "text" | "image" | "video" | "url"
  submittedAt: string
  status: "pending" | "processing" | "completed" | "failed"
  results: OracleResult[]
  consensus?: {
    verdict: "TRUE" | "FALSE" | "UNCERTAIN"
    confidence: number
    agreement: number
  }
}

interface OracleResult {
  oracleId: string
  oracleName: string
  verdict: "TRUE" | "FALSE" | "UNCERTAIN"
  confidence: number
  reasoning: string
  processingTime: number
  timestamp: string
}

// Mock data
const mockValidations: ValidationRequest[] = [
  {
    id: "1",
    content: "El gobierno anunció nuevas medidas económicas que incluyen reducción de impuestos del 25% al 20%",
    type: "text",
    submittedAt: "2024-01-15T10:30:00Z",
    status: "completed",
    results: [
      {
        oracleId: "gpt4",
        oracleName: "GPT-4 Oracle",
        verdict: "TRUE",
        confidence: 94,
        reasoning: "La información coincide con fuentes oficiales del gobierno. Los datos son verificables.",
        processingTime: 850,
        timestamp: "2024-01-15T10:31:00Z",
      },
      {
        oracleId: "claude",
        oracleName: "Claude Oracle",
        verdict: "TRUE",
        confidence: 89,
        reasoning: "Confirmado por múltiples fuentes gubernamentales oficiales.",
        processingTime: 920,
        timestamp: "2024-01-15T10:31:15Z",
      },
      {
        oracleId: "gemini",
        oracleName: "Gemini Oracle",
        verdict: "TRUE",
        confidence: 91,
        reasoning: "Datos consistentes con anuncios oficiales previos.",
        processingTime: 780,
        timestamp: "2024-01-15T10:31:30Z",
      },
    ],
    consensus: {
      verdict: "TRUE",
      confidence: 91,
      agreement: 100,
    },
  },
  {
    id: "2",
    content: "Imagen viral muestra supuesto meteorito cayendo en la ciudad",
    type: "image",
    submittedAt: "2024-01-15T09:15:00Z",
    status: "processing",
    results: [
      {
        oracleId: "gpt4",
        oracleName: "GPT-4 Oracle",
        verdict: "FALSE",
        confidence: 87,
        reasoning: "La imagen presenta inconsistencias en la iluminación y sombras que sugieren manipulación digital.",
        processingTime: 1200,
        timestamp: "2024-01-15T09:16:00Z",
      },
    ],
  },
]

export default function ValidationPage() {
  const { isConnected } = useWallet()
  const [validations, setValidations] = useState<ValidationRequest[]>(mockValidations)
  const [newContent, setNewContent] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [activeTab, setActiveTab] = useState("nueva")

  const handleSubmitValidation = async () => {
    if (!newContent.trim() || !isConnected) return

    setIsSubmitting(true)

    // Simular envío
    const newValidation: ValidationRequest = {
      id: Date.now().toString(),
      content: newContent,
      type: "text",
      submittedAt: new Date().toISOString(),
      status: "pending",
      results: [],
    }

    setValidations((prev) => [newValidation, ...prev])
    setNewContent("")

    // Simular procesamiento
    setTimeout(() => {
      setValidations((prev) =>
        prev.map((v) => (v.id === newValidation.id ? { ...v, status: "processing" as const } : v)),
      )
    }, 1000)

    setIsSubmitting(false)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800"
      case "processing":
        return "bg-blue-100 text-blue-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "failed":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4" />
      case "processing":
        return <Zap className="h-4 w-4" />
      case "pending":
        return <Clock className="h-4 w-4" />
      case "failed":
        return <XCircle className="h-4 w-4" />
      default:
        return <AlertTriangle className="h-4 w-4" />
    }
  }

  const getVerdictColor = (verdict: string) => {
    switch (verdict) {
      case "TRUE":
        return "text-green-600 bg-green-100"
      case "FALSE":
        return "text-red-600 bg-red-100"
      case "UNCERTAIN":
        return "text-yellow-600 bg-yellow-100"
      default:
        return "text-gray-600 bg-gray-100"
    }
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
            <h1 className="text-xl font-semibold">Validación Externa</h1>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="nueva">Nueva Validación</TabsTrigger>
            <TabsTrigger value="historial">Historial</TabsTrigger>
          </TabsList>

          <TabsContent value="nueva" className="space-y-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <Card>
                <CardHeader>
                  <CardTitle>Solicitar Validación de Contenido</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Contenido a validar</label>
                    <Textarea
                      value={newContent}
                      onChange={(e) => setNewContent(e.target.value)}
                      placeholder="Ingresa el texto, URL o descripción del contenido que deseas validar..."
                      rows={4}
                      className="resize-none"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-500">
                      {!isConnected
                        ? "Conecta tu wallet para enviar validaciones"
                        : "Los oráculos analizarán el contenido"}
                    </div>
                    <Button
                      onClick={handleSubmitValidation}
                      disabled={!newContent.trim() || !isConnected || isSubmitting}
                    >
                      {isSubmitting ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      ) : (
                        <Send className="h-4 w-4 mr-2" />
                      )}
                      Enviar para validación
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Información sobre el proceso */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">¿Cómo funciona la validación?</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Send className="h-6 w-6 text-blue-600" />
                      </div>
                      <h3 className="font-semibold mb-2">1. Envío</h3>
                      <p className="text-sm text-gray-600">Envías el contenido que deseas validar</p>
                    </div>
                    <div className="text-center">
                      <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Zap className="h-6 w-6 text-purple-600" />
                      </div>
                      <h3 className="font-semibold mb-2">2. Análisis</h3>
                      <p className="text-sm text-gray-600">Múltiples oráculos IA analizan el contenido</p>
                    </div>
                    <div className="text-center">
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <CheckCircle className="h-6 w-6 text-green-600" />
                      </div>
                      <h3 className="font-semibold mb-2">3. Consenso</h3>
                      <p className="text-sm text-gray-600">Se genera un veredicto basado en consenso</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          <TabsContent value="historial" className="space-y-6">
            <div className="space-y-4">
              {validations.map((validation) => (
                <motion.div
                  key={validation.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-lg shadow-sm border"
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className={getStatusColor(validation.status)}>
                            {getStatusIcon(validation.status)}
                            <span className="ml-1 capitalize">{validation.status}</span>
                          </Badge>
                          <Badge variant="outline">{validation.type}</Badge>
                        </div>
                        <p className="text-gray-900 mb-2">{validation.content}</p>
                        <p className="text-sm text-gray-500">
                          Enviado el {new Date(validation.submittedAt).toLocaleString("es-ES")}
                        </p>
                      </div>
                      {validation.consensus && (
                        <div className="text-right">
                          <Badge className={getVerdictColor(validation.consensus.verdict)} variant="outline">
                            {validation.consensus.verdict}
                          </Badge>
                          <div className="text-sm text-gray-500 mt-1">{validation.consensus.confidence}% confianza</div>
                          <div className="text-sm text-gray-500">{validation.consensus.agreement}% acuerdo</div>
                        </div>
                      )}
                    </div>

                    {validation.results.length > 0 && (
                      <div className="space-y-3">
                        <h4 className="font-medium text-gray-900">Resultados de oráculos:</h4>
                        {validation.results.map((result) => (
                          <div key={result.oracleId} className="border rounded-lg p-4 bg-gray-50">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <span className="font-medium">{result.oracleName}</span>
                                <Badge className={getVerdictColor(result.verdict)} variant="outline">
                                  {result.verdict}
                                </Badge>
                              </div>
                              <div className="text-sm text-gray-500">
                                {result.confidence}% confianza • {result.processingTime}ms
                              </div>
                            </div>
                            <p className="text-sm text-gray-600">{result.reasoning}</p>
                            <div className="mt-2">
                              <Progress value={result.confidence} className="h-2" />
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {validation.status === "processing" && (
                      <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                        <div className="flex items-center gap-2 text-blue-800">
                          <Zap className="h-4 w-4 animate-pulse" />
                          <span className="text-sm font-medium">Procesando con oráculos...</span>
                        </div>
                        <div className="mt-2">
                          <Progress value={65} className="h-2" />
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
