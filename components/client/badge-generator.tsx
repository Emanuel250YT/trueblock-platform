"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Shield, Copy, Eye, Code, Palette, Settings } from "lucide-react"

interface BadgeConfig {
  verificationId: string
  style: "minimal" | "detailed" | "compact"
  theme: "light" | "dark" | "auto"
  showConfidence: boolean
  showTimestamp: boolean
  customColors: {
    true: string
    fake: string
    doubtful: string
  }
}

export function BadgeGenerator() {
  const [config, setConfig] = useState<BadgeConfig>({
    verificationId: "",
    style: "detailed",
    theme: "light",
    showConfidence: true,
    showTimestamp: true,
    customColors: {
      true: "#22c55e",
      fake: "#ef4444",
      doubtful: "#f59e0b",
    },
  })

  const [previewData] = useState({
    status: "true" as const,
    confidence: 0.94,
    timestamp: "2024-01-15T10:30:00Z",
    title: "Ejemplo de noticia verificada",
    domain: "ejemplo.com",
  })

  const generateEmbedCode = () => {
    const baseUrl = "https://trueblock.com/badge"
    const params = new URLSearchParams({
      id: config.verificationId,
      style: config.style,
      theme: config.theme,
      confidence: config.showConfidence.toString(),
      timestamp: config.showTimestamp.toString(),
    })

    return `<iframe src="${baseUrl}?${params}" width="300" height="120" frameborder="0"></iframe>`
  }

  const generateScriptCode = () => {
    return `<script src="https://trueblock.com/widget.js"></script>
<div class="trueblock-badge" 
     data-verification-id="${config.verificationId}"
     data-style="${config.style}"
     data-theme="${config.theme}"
     data-show-confidence="${config.showConfidence}"
     data-show-timestamp="${config.showTimestamp}">
</div>`
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const BadgePreview = () => {
    const statusConfig = {
      true: { label: "Verificado", color: config.customColors.true },
      fake: { label: "Falso", color: config.customColors.fake },
      doubtful: { label: "Dudoso", color: config.customColors.doubtful },
    }

    const status = statusConfig[previewData.status]

    if (config.style === "minimal") {
      return (
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border bg-background">
          <Shield className="h-4 w-4" style={{ color: status.color }} />
          <span className="text-sm font-medium" style={{ color: status.color }}>
            {status.label}
          </span>
          <span className="text-xs text-muted-foreground">TrueBlock</span>
        </div>
      )
    }

    if (config.style === "compact") {
      return (
        <div className="inline-flex items-center gap-2 px-2 py-1 rounded border bg-background">
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: status.color }}></div>
          <span className="text-xs font-medium">{status.label}</span>
          {config.showConfidence && (
            <span className="text-xs text-muted-foreground">{Math.round(previewData.confidence * 100)}%</span>
          )}
        </div>
      )
    }

    return (
      <div className="max-w-sm border rounded-lg p-4 bg-background">
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5" style={{ color: status.color }} />
            <span className="font-medium" style={{ color: status.color }}>
              {status.label}
            </span>
          </div>
          {config.showConfidence && (
            <Badge variant="outline">{Math.round(previewData.confidence * 100)}% confianza</Badge>
          )}
        </div>
        <h4 className="text-sm font-medium line-clamp-2 mb-2">{previewData.title}</h4>
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>{previewData.domain}</span>
          {config.showTimestamp && <span>Verificado hoy</span>}
        </div>
        <div className="mt-3 pt-2 border-t">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Verificado por TrueBlock</span>
            <Button variant="ghost" size="sm" className="h-6 text-xs">
              Ver detalles
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Configuration */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Configuración del Badge
            </CardTitle>
            <CardDescription>Personaliza la apariencia y comportamiento del badge</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="verificationId">ID de Verificación</Label>
              <Input
                id="verificationId"
                placeholder="ej. tb_verify_1234567890"
                value={config.verificationId}
                onChange={(e) => setConfig((prev) => ({ ...prev, verificationId: e.target.value }))}
              />
              <p className="text-xs text-muted-foreground mt-1">ID único de la verificación que quieres mostrar</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Estilo</Label>
                <Select
                  value={config.style}
                  onValueChange={(value: any) => setConfig((prev) => ({ ...prev, style: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="minimal">Mínimo</SelectItem>
                    <SelectItem value="compact">Compacto</SelectItem>
                    <SelectItem value="detailed">Detallado</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Tema</Label>
                <Select
                  value={config.theme}
                  onValueChange={(value: any) => setConfig((prev) => ({ ...prev, theme: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Claro</SelectItem>
                    <SelectItem value="dark">Oscuro</SelectItem>
                    <SelectItem value="auto">Automático</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>Mostrar confianza</Label>
                <input
                  type="checkbox"
                  checked={config.showConfidence}
                  onChange={(e) => setConfig((prev) => ({ ...prev, showConfidence: e.target.checked }))}
                  className="rounded"
                />
              </div>

              <div className="flex items-center justify-between">
                <Label>Mostrar timestamp</Label>
                <input
                  type="checkbox"
                  checked={config.showTimestamp}
                  onChange={(e) => setConfig((prev) => ({ ...prev, showTimestamp: e.target.checked }))}
                  className="rounded"
                />
              </div>
            </div>

            <div>
              <Label className="flex items-center gap-2">
                <Palette className="h-4 w-4" />
                Colores Personalizados
              </Label>
              <div className="grid grid-cols-3 gap-2 mt-2">
                <div>
                  <Label className="text-xs">Verdadero</Label>
                  <input
                    type="color"
                    value={config.customColors.true}
                    onChange={(e) =>
                      setConfig((prev) => ({
                        ...prev,
                        customColors: { ...prev.customColors, true: e.target.value },
                      }))
                    }
                    className="w-full h-8 rounded border"
                  />
                </div>
                <div>
                  <Label className="text-xs">Falso</Label>
                  <input
                    type="color"
                    value={config.customColors.fake}
                    onChange={(e) =>
                      setConfig((prev) => ({
                        ...prev,
                        customColors: { ...prev.customColors, fake: e.target.value },
                      }))
                    }
                    className="w-full h-8 rounded border"
                  />
                </div>
                <div>
                  <Label className="text-xs">Dudoso</Label>
                  <input
                    type="color"
                    value={config.customColors.doubtful}
                    onChange={(e) =>
                      setConfig((prev) => ({
                        ...prev,
                        customColors: { ...prev.customColors, doubtful: e.target.value },
                      }))
                    }
                    className="w-full h-8 rounded border"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Preview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Vista Previa
            </CardTitle>
            <CardDescription>Cómo se verá tu badge en el sitio web</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center p-8 border-2 border-dashed border-muted-foreground/25 rounded-lg bg-muted/10">
              <BadgePreview />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Code Generation */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Code className="h-5 w-5" />
            Código de Integración
          </CardTitle>
          <CardDescription>Copia y pega este código en tu sitio web</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="iframe" className="space-y-4">
            <TabsList>
              <TabsTrigger value="iframe">iFrame</TabsTrigger>
              <TabsTrigger value="script">JavaScript</TabsTrigger>
            </TabsList>

            <TabsContent value="iframe" className="space-y-4">
              <div>
                <Label>Código iFrame</Label>
                <div className="relative">
                  <Textarea value={generateEmbedCode()} readOnly className="font-mono text-sm" rows={3} />
                  <Button
                    variant="outline"
                    size="sm"
                    className="absolute top-2 right-2 bg-transparent"
                    onClick={() => copyToClipboard(generateEmbedCode())}
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-1">Método más simple, funciona en cualquier sitio web</p>
              </div>
            </TabsContent>

            <TabsContent value="script" className="space-y-4">
              <div>
                <Label>Código JavaScript</Label>
                <div className="relative">
                  <Textarea value={generateScriptCode()} readOnly className="font-mono text-sm" rows={6} />
                  <Button
                    variant="outline"
                    size="sm"
                    className="absolute top-2 right-2 bg-transparent"
                    onClick={() => copyToClipboard(generateScriptCode())}
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-1">Más flexible, permite mayor personalización</p>
              </div>
            </TabsContent>
          </Tabs>

          <Alert>
            <Shield className="h-4 w-4" />
            <AlertDescription>
              Los badges se actualizan automáticamente cuando cambia el estado de verificación. No necesitas actualizar
              el código una vez implementado.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  )
}
