"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { Key, Copy, Eye, EyeOff, Plus, Trash2, AlertCircle } from "lucide-react"

interface ApiKey {
  id: string
  name: string
  key: string
  created: string
  lastUsed: string
  permissions: string[]
  status: "active" | "revoked"
}

const sampleApiKeys: ApiKey[] = [
  {
    id: "1",
    name: "Producción - Web App",
    key: "tb_live_1234567890abcdef1234567890abcdef",
    created: "2024-01-10",
    lastUsed: "hace 2 horas",
    permissions: ["read", "write", "verify"],
    status: "active",
  },
  {
    id: "2",
    name: "Desarrollo - Testing",
    key: "tb_test_abcdef1234567890abcdef1234567890",
    created: "2024-01-05",
    lastUsed: "hace 1 día",
    permissions: ["read", "verify"],
    status: "active",
  },
  {
    id: "3",
    name: "Integración Legacy",
    key: "tb_live_fedcba0987654321fedcba0987654321",
    created: "2023-12-15",
    lastUsed: "hace 2 semanas",
    permissions: ["read"],
    status: "revoked",
  },
]

export function ApiKeys() {
  const [apiKeys, setApiKeys] = useState(sampleApiKeys)
  const [showKeys, setShowKeys] = useState<{ [key: string]: boolean }>({})
  const [newKeyName, setNewKeyName] = useState("")
  const [isCreating, setIsCreating] = useState(false)

  const toggleKeyVisibility = (keyId: string) => {
    setShowKeys((prev) => ({ ...prev, [keyId]: !prev[keyId] }))
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    // Aquí podrías mostrar un toast de confirmación
  }

  const createNewKey = async () => {
    if (!newKeyName.trim()) return

    setIsCreating(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const newKey: ApiKey = {
      id: Date.now().toString(),
      name: newKeyName,
      key: `tb_live_${Math.random().toString(36).substring(2, 34)}`,
      created: new Date().toISOString().split("T")[0],
      lastUsed: "nunca",
      permissions: ["read", "verify"],
      status: "active",
    }

    setApiKeys((prev) => [newKey, ...prev])
    setNewKeyName("")
    setIsCreating(false)
  }

  const revokeKey = (keyId: string) => {
    setApiKeys((prev) => prev.map((key) => (key.id === keyId ? { ...key, status: "revoked" as const } : key)))
  }

  const maskKey = (key: string) => {
    return key.substring(0, 12) + "..." + key.substring(key.length - 4)
  }

  return (
    <div className="space-y-6">
      {/* Create New Key */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Crear Nueva Clave API
          </CardTitle>
          <CardDescription>Genera una nueva clave para acceder a la API de TrueBlock</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <Label htmlFor="keyName">Nombre de la clave</Label>
              <Input
                id="keyName"
                placeholder="ej. Producción - Mi App"
                value={newKeyName}
                onChange={(e) => setNewKeyName(e.target.value)}
              />
            </div>
            <div className="flex items-end">
              <Button onClick={createNewKey} disabled={!newKeyName.trim() || isCreating}>
                {isCreating ? "Creando..." : "Crear Clave"}
              </Button>
            </div>
          </div>

          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Las claves API proporcionan acceso completo a tu cuenta. Manténlas seguras y no las compartas
              públicamente.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Existing Keys */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            Claves API Existentes
          </CardTitle>
          <CardDescription>Gestiona tus claves API activas y revocadas</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {apiKeys.map((apiKey) => (
              <div key={apiKey.id} className="border rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-medium">{apiKey.name}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant={apiKey.status === "active" ? "default" : "secondary"}>
                        {apiKey.status === "active" ? "Activa" : "Revocada"}
                      </Badge>
                      <span className="text-xs text-muted-foreground">Creada: {apiKey.created}</span>
                      <span className="text-xs text-muted-foreground">Último uso: {apiKey.lastUsed}</span>
                    </div>
                  </div>
                  {apiKey.status === "active" && (
                    <Button variant="outline" size="sm" onClick={() => revokeKey(apiKey.id)}>
                      <Trash2 className="h-3 w-3 mr-1" />
                      Revocar
                    </Button>
                  )}
                </div>

                <div className="space-y-3">
                  <div>
                    <Label className="text-xs">Clave API</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <Input
                        value={showKeys[apiKey.id] ? apiKey.key : maskKey(apiKey.key)}
                        readOnly
                        className="font-mono text-sm"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleKeyVisibility(apiKey.id)}
                        className="flex-shrink-0"
                      >
                        {showKeys[apiKey.id] ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard(apiKey.key)}
                        className="flex-shrink-0"
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>

                  <div>
                    <Label className="text-xs">Permisos</Label>
                    <div className="flex gap-1 mt-1">
                      {apiKey.permissions.map((permission) => (
                        <Badge key={permission} variant="outline" className="text-xs">
                          {permission}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* API Documentation */}
      <Card>
        <CardHeader>
          <CardTitle>Documentación de API</CardTitle>
          <CardDescription>Ejemplos de uso y endpoints disponibles</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Verificar una noticia</h4>
              <div className="bg-muted/20 p-3 rounded-lg font-mono text-sm">
                <div className="text-muted-foreground mb-2">POST /api/v1/verify</div>
                <div>
                  {`curl -X POST https://api.trueblock.com/v1/verify \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"url": "https://example.com/news"}'`}
                </div>
              </div>
            </div>

            <Separator />

            <div>
              <h4 className="font-medium mb-2">Obtener estado de verificación</h4>
              <div className="bg-muted/20 p-3 rounded-lg font-mono text-sm">
                <div className="text-muted-foreground mb-2">GET /api/v1/verify/:id</div>
                <div>
                  {`curl -H "Authorization: Bearer YOUR_API_KEY" \\
  https://api.trueblock.com/v1/verify/12345`}
                </div>
              </div>
            </div>

            <div className="flex justify-center">
              <Button variant="outline">Ver Documentación Completa</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
