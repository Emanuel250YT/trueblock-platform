"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { useWallet } from "@/contexts/wallet-context"
import { useOracle } from "@/hooks/use-trueblock-api"
import {
  Network,
  Activity,
  Settings,
  Plus,
  AlertCircle,
  RefreshCw,
  BarChart3,
  Eye,
  Cpu,
  CheckCircle,
  XCircle,
  Clock,
  Loader2,
  Edit,
  Trash2
} from "lucide-react"

export default function OraclesPage() {
  const { isConnected, address } = useWallet()
  const { registerOracle, loading, error } = useOracle()

  const [oracles, setOracles] = useState<any[]>([])
  const [networkMetrics, setNetworkMetrics] = useState({
    totalOracles: 0,
    activeOracles: 0,
    avgAccuracy: 0,
    totalPredictions: 0,
    consensusRate: 0,
    networkHealth: "unknown" as "unknown" | "healthy" | "warning" | "error"
  })
  const [showRegisterForm, setShowRegisterForm] = useState(false)
  const [newOracleData, setNewOracleData] = useState({
    specialization: "fake_news" as "fake_news" | "deepfake" | "image_manipulation" | "text_analysis",
    stake: "1.0"
  })
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    if (isConnected) {
      loadOracles()
    }
  }, [isConnected])

  const loadOracles = async () => {
    setRefreshing(true)
    try {
      // Simular carga de oráculos y métricas
      // En la implementación real usarías getOracles()
      setOracles([
        {
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
        },
        {
          id: "2",
          name: "Claude Oracle",
          model: "Claude-3",
          provider: "Anthropic",
          status: "active",
          accuracy: 94.2,
          predictions: 2891,
          latency: 920,
          weight: 1.3,
          lastActive: "hace 5 min",
          rewardsEarned: "0.189",
          version: "2.1.0",
        }
      ])

      setNetworkMetrics({
        totalOracles: 12,
        activeOracles: 10,
        avgAccuracy: 94.2,
        totalPredictions: 15847,
        consensusRate: 89.3,
        networkHealth: "healthy" as const
      })
    } catch (err) {
      console.error("Error loading oracles:", err)
    } finally {
      setRefreshing(false)
    }
  }

  const handleRegisterOracle = async () => {
    if (!isConnected) {
      alert("Por favor conecta tu wallet")
      return
    }

    try {
      const result = await registerOracle({
        walletAddress: address!,
        specialization: newOracleData.specialization,
        stake: newOracleData.stake,
        signature: "0x..." // En la implementación real, se generaría la firma
      })

      alert("Oráculo registrado exitosamente")
      setShowRegisterForm(false)
      setNewOracleData({
        specialization: "fake_news",
        stake: "1.0"
      })
      loadOracles()
    } catch (err) {
      console.error("Error registering oracle:", err)
    }
  }

  if (!isConnected) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-md mx-auto">
          <CardContent className="text-center py-8">
            <Network className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Conecta tu Wallet</h2>
            <p className="text-gray-600 mb-4">
              Para gestionar oráculos, necesitas conectar tu wallet primero.
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
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Red de Oráculos IA
            </h1>
            <p className="text-gray-600">
              Gestiona y monitorea los oráculos de validación de noticias
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              onClick={loadOracles}
              disabled={refreshing}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? "animate-spin" : ""}`} />
              Actualizar
            </Button>
            <Button
              onClick={() => setShowRegisterForm(true)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Registrar Oráculo
            </Button>
          </div>
        </div>

        {error && (
          <Alert className="mb-6 border-red-200 bg-red-50">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              Error: {error}
            </AlertDescription>
          </Alert>
        )}

        {/* Métricas de la Red */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Oráculos Totales</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{networkMetrics.totalOracles}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Activos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{networkMetrics.activeOracles}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Precisión Promedio</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{networkMetrics.avgAccuracy}%</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Predicciones</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{networkMetrics.totalPredictions.toLocaleString()}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Consenso</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">{networkMetrics.consensusRate}%</div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="oracles" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="oracles">Oráculos</TabsTrigger>
            <TabsTrigger value="analytics">Analíticas</TabsTrigger>
            <TabsTrigger value="settings">Configuración</TabsTrigger>
          </TabsList>

          <TabsContent value="oracles" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {oracles.map((oracle) => (
                <Card key={oracle.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{oracle.name}</CardTitle>
                        <CardDescription>{oracle.model} - {oracle.provider}</CardDescription>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge
                          variant={oracle.status === "active" ? "default" : "secondary"}
                          className={oracle.status === "active" ? "bg-green-100 text-green-800" : ""}
                        >
                          {oracle.status === "active" ? (
                            <CheckCircle className="h-3 w-3 mr-1" />
                          ) : (
                            <XCircle className="h-3 w-3 mr-1" />
                          )}
                          {oracle.status}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Precisión:</span>
                          <div className="font-medium text-blue-600">{oracle.accuracy}%</div>
                        </div>
                        <div>
                          <span className="text-gray-600">Predicciones:</span>
                          <div className="font-medium">{oracle.predictions.toLocaleString()}</div>
                        </div>
                        <div>
                          <span className="text-gray-600">Latencia:</span>
                          <div className="font-medium">{oracle.latency}ms</div>
                        </div>
                        <div>
                          <span className="text-gray-600">Peso:</span>
                          <div className="font-medium">{oracle.weight}x</div>
                        </div>
                      </div>

                      <div className="text-sm text-gray-600">
                        <div className="flex justify-between">
                          <span>Última actividad:</span>
                          <span>{oracle.lastActive}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Recompensas:</span>
                          <span className="text-green-600">{oracle.rewardsEarned} ETH</span>
                        </div>
                      </div>

                      <div className="flex space-x-2 pt-2">
                        <Button variant="outline" size="sm" className="flex-1">
                          <Eye className="h-4 w-4 mr-1" />
                          Ver Detalles
                        </Button>
                        <Button variant="outline" size="sm">
                          <Settings className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Rendimiento por Oráculo</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {oracles.map((oracle) => (
                      <div key={oracle.id} className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">{oracle.name}</div>
                          <div className="text-sm text-gray-600">{oracle.predictions} predicciones</div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">{oracle.accuracy}%</div>
                          <div className="text-sm text-gray-600">precisión</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Estado de la Red</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span>Estado General:</span>
                      <Badge variant="default" className="bg-green-100 text-green-800">
                        Saludable
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Consenso Promedio:</span>
                      <span className="font-medium">{networkMetrics.consensusRate}%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Tiempo de Respuesta:</span>
                      <span className="font-medium">~885ms</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="settings" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Configuración de Red</CardTitle>
                <CardDescription>
                  Ajustes globales para la red de oráculos
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Umbral de Consenso</Label>
                      <Input type="number" placeholder="75" />
                    </div>
                    <div>
                      <Label>Timeout Máximo</Label>
                      <Input type="number" placeholder="5000" />
                    </div>
                  </div>
                  <Button>Guardar Configuración</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Modal de Registro de Oráculo */}
        {showRegisterForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <Card className="w-full max-w-md mx-4">
              <CardHeader>
                <CardTitle>Registrar Nuevo Oráculo</CardTitle>
                <CardDescription>
                  Agrega un nuevo oráculo IA a la red de validación
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="specialization">Especialización</Label>
                    <Select
                      value={newOracleData.specialization}
                      onValueChange={(value: "fake_news" | "deepfake" | "image_manipulation" | "text_analysis") =>
                        setNewOracleData(prev => ({ ...prev, specialization: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona una especialización" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="fake_news">Detección de Fake News</SelectItem>
                        <SelectItem value="deepfake">Detección de Deepfakes</SelectItem>
                        <SelectItem value="image_manipulation">Manipulación de Imágenes</SelectItem>
                        <SelectItem value="text_analysis">Análisis de Texto</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="stake">Cantidad de Stake (ETH)</Label>
                    <Input
                      id="stake"
                      type="number"
                      step="0.1"
                      min="0.1"
                      value={newOracleData.stake}
                      onChange={(e) => setNewOracleData(prev => ({ ...prev, stake: e.target.value }))}
                      placeholder="1.0"
                    />
                    <p className="text-sm text-gray-600 mt-1">
                      Mínimo 0.1 ETH requerido para registrar un oráculo
                    </p>
                  </div>
                </div>

                <div className="flex space-x-2 mt-6">
                  <Button
                    variant="outline"
                    onClick={() => setShowRegisterForm(false)}
                    className="flex-1"
                  >
                    Cancelar
                  </Button>
                  <Button
                    onClick={handleRegisterOracle}
                    disabled={loading}
                    className="flex-1"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Registrando...
                      </>
                    ) : (
                      "Registrar"
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
