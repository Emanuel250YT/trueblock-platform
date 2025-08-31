"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { useWallet } from "@/contexts/wallet-context"
import { useValidation } from "@/hooks/use-trueblock-api"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, CheckCircle, AlertCircle, Globe, FileText, PlusCircle } from "lucide-react"

export default function SubmitValidation() {
  const { isConnected, address } = useWallet()
  const { submitValidation, loading, error } = useValidation()

  const [formData, setFormData] = useState({
    url: "",
    content: "",
    title: ""
  })
  const [submissionResult, setSubmissionResult] = useState<any>(null)
  const [submissionType, setSubmissionType] = useState<"url" | "content">("url")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!isConnected) {
      alert("Por favor conecta tu wallet primero")
      return
    }

    try {
      const result = await submitValidation(formData)
      setSubmissionResult(result)

      // Limpiar formulario
      setFormData({ url: "", content: "", title: "" })
    } catch (err) {
      console.error("Error submitting validation:", err)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  if (!isConnected) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-md mx-auto">
          <CardContent className="text-center py-8">
            <AlertCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Conecta tu Wallet</h2>
            <p className="text-gray-600 mb-4">
              Para enviar noticias a validación, necesitas conectar tu wallet primero.
            </p>
            <Button className="w-full">
              Conectar Wallet
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Enviar Noticia para Validación
          </h1>
          <p className="text-gray-600">
            Somete una noticia a validación descentralizada por la comunidad TrueBlock
          </p>
        </div>

        {submissionResult && (
          <Alert className="mb-6 border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              <div className="space-y-2">
                <p className="font-medium">¡Noticia enviada exitosamente!</p>
                <div className="text-sm space-y-1">
                  <p><strong>Hash de Contenido:</strong> {submissionResult.contentHash}</p>
                  <p><strong>Transaction Hash:</strong> {submissionResult.transactionHash}</p>
                  <p><strong>Título:</strong> {submissionResult.processedContent?.title}</p>
                </div>
              </div>
            </AlertDescription>
          </Alert>
        )}

        {error && (
          <Alert className="mb-6 border-red-200 bg-red-50">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              Error: {error}
            </AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Formulario Principal */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <PlusCircle className="h-5 w-5 text-blue-600" />
                  <span>Información de la Noticia</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Tipo de Envío */}
                  <div className="space-y-3">
                    <Label className="text-base font-medium">Método de Envío</Label>
                    <div className="flex space-x-4">
                      <Button
                        type="button"
                        variant={submissionType === "url" ? "default" : "outline"}
                        onClick={() => setSubmissionType("url")}
                        className="flex items-center space-x-2"
                      >
                        <Globe className="h-4 w-4" />
                        <span>URL de Noticia</span>
                      </Button>
                      <Button
                        type="button"
                        variant={submissionType === "content" ? "default" : "outline"}
                        onClick={() => setSubmissionType("content")}
                        className="flex items-center space-x-2"
                      >
                        <FileText className="h-4 w-4" />
                        <span>Texto Completo</span>
                      </Button>
                    </div>
                  </div>

                  {/* URL Input */}
                  {submissionType === "url" && (
                    <div className="space-y-2">
                      <Label htmlFor="url">URL de la Noticia *</Label>
                      <Input
                        id="url"
                        type="url"
                        placeholder="https://ejemplo.com/noticia"
                        value={formData.url}
                        onChange={(e) => handleInputChange("url", e.target.value)}
                        required={submissionType === "url"}
                      />
                      <p className="text-sm text-gray-500">
                        Proporciona el enlace directo a la noticia que quieres validar
                      </p>
                    </div>
                  )}

                  {/* Content Input */}
                  {submissionType === "content" && (
                    <div className="space-y-2">
                      <Label htmlFor="content">Contenido de la Noticia *</Label>
                      <Textarea
                        id="content"
                        placeholder="Pega aquí el texto completo de la noticia..."
                        value={formData.content}
                        onChange={(e) => handleInputChange("content", e.target.value)}
                        className="min-h-[200px]"
                        required={submissionType === "content"}
                      />
                      <p className="text-sm text-gray-500">
                        Pega el contenido completo de la noticia que quieres validar
                      </p>
                    </div>
                  )}

                  {/* Title Input */}
                  <div className="space-y-2">
                    <Label htmlFor="title">Título (Opcional)</Label>
                    <Input
                      id="title"
                      placeholder="Título de la noticia"
                      value={formData.title}
                      onChange={(e) => handleInputChange("title", e.target.value)}
                    />
                    <p className="text-sm text-gray-500">
                      Si no se proporciona, se auto-generará desde el contenido
                    </p>
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    disabled={loading || (!formData.url && !formData.content)}
                    className="w-full bg-blue-600 hover:bg-blue-700"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Enviando a Validación...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Enviar para Validación
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Panel de Información */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">¿Cómo Funciona?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
                    1
                  </div>
                  <div>
                    <p className="font-medium text-sm">Envío</p>
                    <p className="text-xs text-gray-600">Tu noticia se almacena en IPFS</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
                    2
                  </div>
                  <div>
                    <p className="font-medium text-sm">Análisis IA</p>
                    <p className="text-xs text-gray-600">Oráculos IA analizan el contenido</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
                    3
                  </div>
                  <div>
                    <p className="font-medium text-sm">Validación</p>
                    <p className="text-xs text-gray-600">La comunidad vota sobre la veracidad</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
                    4
                  </div>
                  <div>
                    <p className="font-medium text-sm">Resultado</p>
                    <p className="text-xs text-gray-600">Obtienes un score de veracidad</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Costos y Recompensas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Costo de Envío:</span>
                  <span className="text-sm font-medium">~0.001 ETH</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Tiempo Promedio:</span>
                  <span className="text-sm font-medium">2-4 horas</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Validadores:</span>
                  <span className="text-sm font-medium">3-15 personas</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Mejores Prácticas</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Usa fuentes originales y confiables</li>
                  <li>• Incluye títulos descriptivos</li>
                  <li>• Evita contenido duplicado</li>
                  <li>• Proporciona contexto completo</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
