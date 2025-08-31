"use client"

import { MainNav } from "@/components/navigation/main-nav"
import { ApiKeys } from "@/components/client/api-keys"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Key, BarChart3, Book, Activity, AlertCircle } from "lucide-react"
import { useWallet } from "@/contexts/wallet-context"
import { useLocation } from "@/contexts/location-context"

// Datos de ejemplo
const apiUsage = {
  currentMonth: {
    requests: 12847,
    limit: 50000,
    successRate: 99.2,
    avgLatency: 245,
  },
  endpoints: [
    { name: "/v1/verify", requests: 8234, percentage: 64.1 },
    { name: "/v1/status", requests: 3456, percentage: 26.9 },
    { name: "/v1/feed", requests: 892, percentage: 6.9 },
    { name: "/v1/badge", requests: 265, percentage: 2.1 },
  ],
}

export default function ApiPage() {
  const { isConnected, address } = useWallet()
  const { location } = useLocation()

  return (
    <div className="min-h-screen bg-background">
      <MainNav />

      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">API de TrueBlock</h1>
            <p className="text-muted-foreground">Gestiona tus claves API y monitorea el uso</p>
            {location.city && (
              <p className="text-sm text-muted-foreground mt-1">
                Accediendo desde {location.city}, {location.country}
              </p>
            )}
          </div>
        </div>

        {!isConnected && (
          <Alert className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>Conecta tu wallet</strong> para acceder a las funciones completas de la API y generar claves de
              acceso.
            </AlertDescription>
          </Alert>
        )}

        {/* API Usage Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Requests Este Mes</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{apiUsage.currentMonth.requests.toLocaleString()}</div>
              <div className="flex items-center space-x-2 mt-2">
                <Progress
                  value={(apiUsage.currentMonth.requests / apiUsage.currentMonth.limit) * 100}
                  className="flex-1"
                />
                <span className="text-xs text-muted-foreground">
                  {Math.round((apiUsage.currentMonth.requests / apiUsage.currentMonth.limit) * 100)}%
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tasa de Éxito</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{apiUsage.currentMonth.successRate}%</div>
              <p className="text-xs text-muted-foreground">Últimos 30 días</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Latencia Promedio</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{apiUsage.currentMonth.avgLatency}ms</div>
              <p className="text-xs text-muted-foreground">Tiempo de respuesta</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Límite Mensual</CardTitle>
              <Key className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{apiUsage.currentMonth.limit.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Requests disponibles</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="keys" className="space-y-6">
          <TabsList>
            <TabsTrigger value="keys" className="flex items-center gap-2">
              <Key className="h-4 w-4" />
              Claves API
            </TabsTrigger>
            <TabsTrigger value="usage" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Uso y Estadísticas
            </TabsTrigger>
            <TabsTrigger value="docs" className="flex items-center gap-2">
              <Book className="h-4 w-4" />
              Documentación
            </TabsTrigger>
          </TabsList>

          {/* API Keys */}
          <TabsContent value="keys" className="space-y-6">
            <ApiKeys isConnected={isConnected} userAddress={address} />
          </TabsContent>

          {/* Usage Statistics */}
          <TabsContent value="usage" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Uso por Endpoint</CardTitle>
                <CardDescription>Distribución de requests por endpoint en el último mes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {apiUsage.endpoints.map((endpoint) => (
                    <div key={endpoint.name} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-sm">{endpoint.name}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">{endpoint.requests.toLocaleString()}</span>
                          <Badge variant="outline">{endpoint.percentage}%</Badge>
                        </div>
                      </div>
                      <Progress value={endpoint.percentage} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Documentation */}
          <TabsContent value="docs" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Documentación de API</CardTitle>
                <CardDescription>Guías completas y referencias de endpoints</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-medium">Guías de Inicio</h3>
                    <div className="space-y-2">
                      <a href="#" className="block p-3 border rounded-lg hover:bg-muted/20 transition-colors">
                        <h4 className="font-medium text-sm">Autenticación</h4>
                        <p className="text-xs text-muted-foreground">Cómo usar las claves API</p>
                      </a>
                      <a href="#" className="block p-3 border rounded-lg hover:bg-muted/20 transition-colors">
                        <h4 className="font-medium text-sm">Verificar Noticias</h4>
                        <p className="text-xs text-muted-foreground">Endpoint principal de verificación</p>
                      </a>
                      <a href="#" className="block p-3 border rounded-lg hover:bg-muted/20 transition-colors">
                        <h4 className="font-medium text-sm">Webhooks</h4>
                        <p className="text-xs text-muted-foreground">Recibir notificaciones en tiempo real</p>
                      </a>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-medium">Referencias</h3>
                    <div className="space-y-2">
                      <a href="#" className="block p-3 border rounded-lg hover:bg-muted/20 transition-colors">
                        <h4 className="font-medium text-sm">Endpoints</h4>
                        <p className="text-xs text-muted-foreground">Lista completa de endpoints</p>
                      </a>
                      <a href="#" className="block p-3 border rounded-lg hover:bg-muted/20 transition-colors">
                        <h4 className="font-medium text-sm">Códigos de Error</h4>
                        <p className="text-xs text-muted-foreground">Manejo de errores y códigos HTTP</p>
                      </a>
                      <a href="#" className="block p-3 border rounded-lg hover:bg-muted/20 transition-colors">
                        <h4 className="font-medium text-sm">SDKs</h4>
                        <p className="text-xs text-muted-foreground">Librerías para diferentes lenguajes</p>
                      </a>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
