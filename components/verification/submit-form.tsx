"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Upload, Link, FileText, Clock, Zap, AlertCircle, CheckCircle } from "lucide-react"
import { trueBlockAPI } from "@/lib/trueblock-api"

interface SubmitFormProps {
  onSubmit?: (data: any) => void
}

export function SubmitForm({ onSubmit }: SubmitFormProps) {
  const [inputType, setInputType] = useState<"url" | "text" | "file">("url")
  const [url, setUrl] = useState("")
  const [text, setText] = useState("")
  const [title, setTitle] = useState("")
  const [file, setFile] = useState<File | null>(null)
  const [priority, setPriority] = useState<"normal" | "high">("normal")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitResult, setSubmitResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const priorityConfig = {
    normal: {
      label: "Normal",
      cost: "Gratis",
      time: "2-4 horas",
      description: "Procesamiento estándar con todas las capas de validación",
    },
    high: {
      label: "Alta Prioridad",
      cost: "0.005 ETH",
      time: "30-60 min",
      description: "Procesamiento acelerado con validación prioritaria",
    },
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)
    setSubmitResult(null)

    try {
      let content = ""
      let submitUrl = ""

      if (inputType === "url") {
        submitUrl = url
      } else if (inputType === "text") {
        content = text
      } else if (inputType === "file" && file) {
        // Para archivos, convertir a texto (simplificado)
        content = `Archivo: ${file.name}`
      }

      console.log("[v0] Enviando noticia para validación:", { url: submitUrl, content, title })

      const response = await trueBlockAPI.submitValidation({
        url: submitUrl || undefined,
        content: content || undefined,
        title: title || undefined,
      })

      console.log("[v0] Respuesta de validación:", response)

      if (response.success) {
        setSubmitResult(response.data)
        onSubmit?.(response.data)
      } else {
        throw new Error(response.error || response.message || "Error al enviar validación")
      }
    } catch (error: any) {
      console.error("[v0] Error al enviar noticia:", error)
      setError(error.message || "Error al enviar la noticia para validación")
    } finally {
      setIsSubmitting(false)
    }
  }

  const isFormValid = () => {
    if (inputType === "url") return url.trim().length > 0
    if (inputType === "text") return text.trim().length > 0
    if (inputType === "file") return file !== null
    return false
  }

  // Si ya se envió exitosamente, mostrar resultado
  if (submitResult) {
    return (
      <div className="max-w-2xl mx-auto space-y-6 px-4">
        <Card className="border-true">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-true">
              <CheckCircle className="h-5 w-5" />
              ¡Noticia Enviada Exitosamente!
            </CardTitle>
            <CardDescription>
              Tu noticia ha sido enviada para validación y está siendo procesada por nuestro pipeline multicapa
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Content Hash:</Label>
              <code className="block p-2 bg-muted rounded text-sm font-mono break-all">{submitResult.contentHash}</code>
            </div>

            {submitResult.transactionHash && (
              <div className="space-y-2">
                <Label>Transaction Hash:</Label>
                <code className="block p-2 bg-muted rounded text-sm font-mono break-all">
                  {submitResult.transactionHash}
                </code>
              </div>
            )}

            {submitResult.processedContent && (
              <div className="space-y-2">
                <Label>Contenido Procesado:</Label>
                <div className="p-3 bg-muted/20 rounded">
                  <h4 className="font-medium">{submitResult.processedContent.title}</h4>
                  <p className="text-sm text-muted-foreground mt-1">{submitResult.processedContent.summary}</p>
                  <p className="text-xs text-muted-foreground mt-2">
                    Procesado: {new Date(submitResult.processedContent.timestamp).toLocaleString()}
                  </p>
                </div>
              </div>
            )}

            <Button
              onClick={() => {
                setSubmitResult(null)
                setUrl("")
                setText("")
                setTitle("")
                setFile(null)
              }}
              className="w-full"
            >
              Enviar Otra Noticia
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 px-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-primary" />
            Solicitar Verificación
          </CardTitle>
          <CardDescription>
            Envía una noticia para verificar su veracidad a través de nuestro pipeline multicapa
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Input Type Selection */}
            <div className="space-y-3">
              <Label>Tipo de contenido</Label>
              <Tabs value={inputType} onValueChange={(value) => setInputType(value as any)}>
                <TabsList className="grid w-full grid-cols-3 h-auto">
                  <TabsTrigger
                    value="url"
                    className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 py-2 px-2 text-xs sm:text-sm"
                  >
                    <Link className="h-4 w-4" />
                    <span>URL</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="text"
                    className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 py-2 px-2 text-xs sm:text-sm"
                  >
                    <FileText className="h-4 w-4" />
                    <span>Texto</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="file"
                    className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 py-2 px-2 text-xs sm:text-sm"
                  >
                    <Upload className="h-4 w-4" />
                    <span>Archivo</span>
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="url" className="space-y-3">
                  <Label htmlFor="url">URL de la noticia</Label>
                  <Input
                    id="url"
                    type="url"
                    placeholder="https://ejemplo.com/noticia"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    className="font-mono text-sm"
                  />
                  <p className="text-xs text-muted-foreground">
                    Ingresa la URL completa del artículo o noticia que deseas verificar
                  </p>
                </TabsContent>

                <TabsContent value="text" className="space-y-3">
                  <Label htmlFor="text">Texto de la noticia</Label>
                  <Textarea
                    id="text"
                    placeholder="Pega aquí el texto completo de la noticia..."
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    rows={6}
                  />
                  <p className="text-xs text-muted-foreground">
                    Pega el contenido completo de la noticia que deseas verificar
                  </p>
                </TabsContent>

                <TabsContent value="file" className="space-y-3">
                  <Label htmlFor="file">Subir archivo</Label>
                  <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-4 sm:p-6 text-center">
                    <input
                      id="file"
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png,.txt,.docx"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <label htmlFor="file" className="cursor-pointer">
                      <Upload className="h-6 w-6 sm:h-8 sm:w-8 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm font-medium">{file ? file.name : "Haz clic para subir un archivo"}</p>
                      <p className="text-xs text-muted-foreground mt-1">PDF, imagen o documento de texto (máx. 10MB)</p>
                    </label>
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            {/* Title (optional) */}
            <div className="space-y-3">
              <Label htmlFor="title">Título (opcional)</Label>
              <Input
                id="title"
                placeholder="Título de la noticia (se auto-genera si no se proporciona)"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">Si no proporcionas un título, se generará automáticamente</p>
            </div>

            <Separator />

            {/* Error Display */}
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Submit Button */}
            <Button type="submit" disabled={!isFormValid() || isSubmitting} className="w-full" size="lg">
              {isSubmitting ? (
                <>
                  <Clock className="h-4 w-4 mr-2 animate-spin" />
                  Enviando...
                </>
              ) : (
                <>
                  <Zap className="h-4 w-4 mr-2" />
                  Enviar para Verificación
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Help Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">¿Cómo funciona?</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-medium mb-1">1. Análisis IA</h4>
              <p className="text-muted-foreground">Múltiples oráculos analizan el contenido</p>
            </div>
            <div>
              <h4 className="font-medium mb-1">2. Revisión LLM</h4>
              <p className="text-muted-foreground">Verificación de coherencia y fuentes</p>
            </div>
            <div>
              <h4 className="font-medium mb-1">3. Validación Comunitaria</h4>
              <p className="text-muted-foreground">Expertos y comunidad votan</p>
            </div>
            <div>
              <h4 className="font-medium mb-1">4. Consenso Blockchain</h4>
              <p className="text-muted-foreground">Resultado inmutable con pruebas ZK</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
