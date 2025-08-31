"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { MainNav } from "@/components/navigation/main-nav"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Zap, Link, FileText, Upload, Clock, CheckCircle, AlertCircle, ArrowRight, Copy } from "lucide-react"
import { apiClient } from "@/lib/api"
import { useWallet } from "@/contexts/wallet-context"

export default function VerificarPage() {
  const router = useRouter()
  const { isConnected, address } = useWallet()

  // Form state
  const [inputType, setInputType] = useState<"url" | "text" | "file">("url")
  const [url, setUrl] = useState("")
  const [text, setText] = useState("")
  const [title, setTitle] = useState("")
  const [file, setFile] = useState<File | null>(null)

  // Submission state
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitResult, setSubmitResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!isConnected) {
      setError("Debes conectar tu wallet para enviar una verificación")
      return
    }

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
        content = `Archivo: ${file.name}`
      }

      console.log("[v0] Enviando noticia para validación:", { url: submitUrl, content, title })

      const response = await apiClient.validation.submit({
        url: submitUrl || undefined,
        content: content || undefined,
        title: title || undefined,
      })

      console.log("[v0] Respuesta de validación:", response)

      if (response.success && response.data) {
        setSubmitResult(response.data)
      } else {
        throw new Error(response.error?.message || "Error al enviar la noticia")
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

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const goToTaskDetail = () => {
    if (submitResult?.contentHash) {
      router.push(`/tasks/${submitResult.contentHash}`)
    }
  }

  // Success state
  if (submitResult) {
    return (
      <div className="min-h-screen bg-background">
        <MainNav />
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <Card className="border-primary/20 bg-primary/5">
              <CardHeader className="text-center">
                <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-2xl">¡Verificación Enviada!</CardTitle>
                <CardDescription>
                  Tu noticia ha sido enviada exitosamente y está siendo procesada por nuestro pipeline multicapa
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Content Hash */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Content Hash (Task ID)</Label>
                  <div className="flex items-center gap-2 p-3 bg-background rounded-lg border">
                    <code className="flex-1 text-sm font-mono break-all">{submitResult.contentHash}</code>
                    <Button variant="ghost" size="sm" onClick={() => copyToClipboard(submitResult.contentHash)}>
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Usa este hash para hacer seguimiento de tu verificación
                  </p>
                </div>

                {/* Transaction Hash */}
                {submitResult.transactionHash && (
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Transaction Hash</Label>
                    <div className="flex items-center gap-2 p-3 bg-background rounded-lg border">
                      <code className="flex-1 text-sm font-mono break-all">{submitResult.transactionHash}</code>
                      <Button variant="ghost" size="sm" onClick={() => copyToClipboard(submitResult.transactionHash)}>
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}

                {/* Processed Content */}
                {submitResult.processedContent && (
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Contenido Procesado</Label>
                    <div className="p-4 bg-background rounded-lg border">
                      <h4 className="font-medium mb-2">{submitResult.processedContent.title}</h4>
                      <p className="text-sm text-muted-foreground mb-3">{submitResult.processedContent.summary}</p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>Procesado: {new Date(submitResult.processedContent.timestamp).toLocaleString()}</span>
                        <Badge variant="outline" className="text-xs">
                          {submitResult.processedContent.category || "General"}
                        </Badge>
                      </div>
                    </div>
                  </div>
                )}

                <Separator />

                {/* Action Buttons */}
                <div className="space-y-3">
                  <Button onClick={goToTaskDetail} className="w-full" size="lg">
                    <ArrowRight className="h-4 w-4 mr-2" />
                    Ver Estado de Verificación
                  </Button>

                  <Button
                    variant="outline"
                    onClick={() => {
                      setSubmitResult(null)
                      setUrl("")
                      setText("")
                      setTitle("")
                      setFile(null)
                      setError(null)
                    }}
                    className="w-full"
                  >
                    Enviar Otra Noticia
                  </Button>
                </div>

                {/* Info */}
                <div className="text-center text-sm text-muted-foreground">
                  <p>El proceso de verificación puede tomar entre 30 minutos y 4 horas</p>
                  <p>Recibirás notificaciones sobre el progreso en tu dashboard</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <MainNav />

      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Verificar Noticia</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Envía cualquier noticia para verificar su veracidad a través de nuestro pipeline multicapa
          </p>
        </div>

        <div className="max-w-2xl mx-auto space-y-6">
          {/* Main Form */}
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
                {/* Wallet Connection Check */}
                {!isConnected && (
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      Debes conectar tu wallet para enviar una verificación.
                      <Button variant="link" className="p-0 h-auto ml-1">
                        Conectar Wallet
                      </Button>
                    </AlertDescription>
                  </Alert>
                )}

                {/* Input Type Selection */}
                <div className="space-y-3">
                  <Label>Tipo de contenido</Label>
                  <Tabs value={inputType} onValueChange={(value) => setInputType(value as any)}>
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="url" className="flex items-center gap-2">
                        <Link className="h-4 w-4" />
                        URL
                      </TabsTrigger>
                      <TabsTrigger value="text" className="flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        Texto
                      </TabsTrigger>
                      <TabsTrigger value="file" className="flex items-center gap-2">
                        <Upload className="h-4 w-4" />
                        Archivo
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
                      <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                        <input
                          id="file"
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png,.txt,.docx"
                          onChange={handleFileChange}
                          className="hidden"
                        />
                        <label htmlFor="file" className="cursor-pointer">
                          <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                          <p className="text-sm font-medium">{file ? file.name : "Haz clic para subir un archivo"}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            PDF, imagen o documento de texto (máx. 10MB)
                          </p>
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
                  <p className="text-xs text-muted-foreground">
                    Si no proporcionas un título, se generará automáticamente
                  </p>
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
                <Button
                  type="submit"
                  disabled={!isFormValid() || isSubmitting || !isConnected}
                  className="w-full"
                  size="lg"
                >
                  {isSubmitting ? (
                    <>
                      <Clock className="h-4 w-4 mr-2 animate-spin" />
                      Enviando para Verificación...
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

          {/* How it Works */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">¿Cómo funciona?</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div className="space-y-1">
                  <h4 className="font-medium">1. Análisis IA</h4>
                  <p className="text-muted-foreground">Múltiples oráculos analizan el contenido</p>
                </div>
                <div className="space-y-1">
                  <h4 className="font-medium">2. Revisión LLM</h4>
                  <p className="text-muted-foreground">Verificación de coherencia y fuentes</p>
                </div>
                <div className="space-y-1">
                  <h4 className="font-medium">3. Validación Comunitaria</h4>
                  <p className="text-muted-foreground">Expertos y comunidad votan</p>
                </div>
                <div className="space-y-1">
                  <h4 className="font-medium">4. Consenso Blockchain</h4>
                  <p className="text-muted-foreground">Resultado inmutable con pruebas ZK</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
