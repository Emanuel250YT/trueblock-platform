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
import { useStaking } from "@/hooks/use-trueblock-api"
import {
  Shield,
  Users,
  Award,
  AlertCircle,
  CheckCircle,
  User,
  Loader2,
  Plus,
  RefreshCw,
  UserCheck,
  GraduationCap,
  Newspaper
} from "lucide-react"

export default function ValidatorsPage() {
  const { isConnected, address } = useWallet()
  const { registerValidator, getStakingStatus, loading, error } = useStaking()

  const [validators, setValidators] = useState<any[]>([])
  const [validatorData, setValidatorData] = useState({
    category: "community" as "journalist" | "fact_checker" | "expert" | "community",
    stake: "0.1"
  })
  const [userValidatorStatus, setUserValidatorStatus] = useState<any>(null)
  const [showRegisterForm, setShowRegisterForm] = useState(false)

  useEffect(() => {
    if (isConnected && address) {
      loadValidatorData()
    }
  }, [isConnected, address])

  const loadValidatorData = async () => {
    try {
      // Cargar estado del validador del usuario
      const status = await getStakingStatus(address!)
      setUserValidatorStatus(status)

      // Simular lista de validadores
      setValidators([
        {
          id: "1",
          address: "0x1234...5678",
          category: "journalist",
          stake: "2.5",
          reputation: 950,
          validations: 245,
          accuracy: 96.8,
          status: "active",
          joinDate: "2024-01-15"
        },
        {
          id: "2",
          address: "0x8765...4321",
          category: "expert",
          stake: "5.0",
          reputation: 1200,
          validations: 189,
          accuracy: 98.2,
          status: "active",
          joinDate: "2024-02-03"
        },
        {
          id: "3",
          address: "0xabcd...efgh",
          category: "fact_checker",
          stake: "1.8",
          reputation: 780,
          validations: 156,
          accuracy: 94.5,
          status: "active",
          joinDate: "2024-02-20"
        }
      ])
    } catch (err) {
      console.error("Error loading validator data:", err)
    }
  }

  const handleRegisterValidator = async () => {
    if (!isConnected) {
      alert("Por favor conecta tu wallet")
      return
    }

    try {
      const result = await registerValidator({
        walletAddress: address!,
        category: validatorData.category,
        stake: validatorData.stake,
        signature: "0x..." // En la implementación real, se generaría la firma
      })

      alert("Validador registrado exitosamente")
      setShowRegisterForm(false)
      setValidatorData({
        category: "community",
        stake: "0.1"
      })
      loadValidatorData()
    } catch (err) {
      console.error("Error registering validator:", err)
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "journalist":
        return <Newspaper className="h-4 w-4" />
      case "fact_checker":
        return <Shield className="h-4 w-4" />
      case "expert":
        return <GraduationCap className="h-4 w-4" />
      case "community":
        return <Users className="h-4 w-4" />
      default:
        return <User className="h-4 w-4" />
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "journalist":
        return "bg-blue-100 text-blue-800"
      case "fact_checker":
        return "bg-green-100 text-green-800"
      case "expert":
        return "bg-purple-100 text-purple-800"
      case "community":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (!isConnected) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-md mx-auto">
          <CardContent className="text-center py-8">
            <Shield className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Conecta tu Wallet</h2>
            <p className="text-gray-600 mb-4">
              Para registrarte como validador, necesitas conectar tu wallet primero.
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
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Validadores TrueBlock
            </h1>
            <p className="text-gray-600">
              Únete a la red de validadores y ayuda a combatir la desinformación
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              onClick={loadValidatorData}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Actualizar
            </Button>
            {!userValidatorStatus?.isValidator && (
              <Button
                onClick={() => setShowRegisterForm(true)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Registrarse
              </Button>
            )}
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

        {/* Estado del Usuario */}
        {userValidatorStatus?.isValidator && (
          <Alert className="mb-6 border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              <div className="flex items-center justify-between">
                <span>Eres un validador activo en la categoría: <strong>{userValidatorStatus.category}</strong></span>
                <Badge className="bg-green-100 text-green-800">
                  Stake: {userValidatorStatus.stake} ETH
                </Badge>
              </div>
            </AlertDescription>
          </Alert>
        )}

        {/* Métricas de la Red */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
                <Shield className="h-4 w-4 mr-2" />
                Validadores Totales
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{validators.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
                <UserCheck className="h-4 w-4 mr-2" />
                Validadores Activos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {validators.filter(v => v.status === "active").length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
                <Award className="h-4 w-4 mr-2" />
                Precisión Promedio
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {validators.length > 0 ?
                  (validators.reduce((acc, v) => acc + v.accuracy, 0) / validators.length).toFixed(1) :
                  "0"
                }%
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
                <CheckCircle className="h-4 w-4 mr-2" />
                Validaciones Totales
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {validators.reduce((acc, v) => acc + v.validations, 0).toLocaleString()}
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="validators" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="validators">Validadores</TabsTrigger>
            <TabsTrigger value="categories">Categorías</TabsTrigger>
            <TabsTrigger value="leaderboard">Ranking</TabsTrigger>
          </TabsList>

          <TabsContent value="validators" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {validators.map((validator) => (
                <Card key={validator.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-sm font-mono">
                          {validator.address}
                        </CardTitle>
                        <div className="flex items-center space-x-2 mt-2">
                          <Badge className={getCategoryColor(validator.category)}>
                            {getCategoryIcon(validator.category)}
                            <span className="ml-1 capitalize">{validator.category}</span>
                          </Badge>
                          <Badge
                            variant={validator.status === "active" ? "default" : "secondary"}
                            className={validator.status === "active" ? "bg-green-100 text-green-800" : ""}
                          >
                            {validator.status}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Stake:</span>
                          <div className="font-medium text-blue-600">{validator.stake} ETH</div>
                        </div>
                        <div>
                          <span className="text-gray-600">Reputación:</span>
                          <div className="font-medium">{validator.reputation}</div>
                        </div>
                        <div>
                          <span className="text-gray-600">Validaciones:</span>
                          <div className="font-medium">{validator.validations}</div>
                        </div>
                        <div>
                          <span className="text-gray-600">Precisión:</span>
                          <div className="font-medium text-green-600">{validator.accuracy}%</div>
                        </div>
                      </div>

                      <div className="text-sm text-gray-600">
                        <div className="flex justify-between">
                          <span>Fecha de registro:</span>
                          <span>{new Date(validator.joinDate).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="categories" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Newspaper className="h-5 w-5 mr-2 text-blue-600" />
                    Periodistas
                  </CardTitle>
                  <CardDescription>
                    Profesionales de medios de comunicación verificados
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <p><strong>Requisitos:</strong> Credenciales periodísticas verificadas</p>
                    <p><strong>Stake mínimo:</strong> 1.0 ETH</p>
                    <p><strong>Peso de voto:</strong> 2.0x</p>
                    <p><strong>Recompensas:</strong> +20% bonificación</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Shield className="h-5 w-5 mr-2 text-green-600" />
                    Fact-Checkers
                  </CardTitle>
                  <CardDescription>
                    Verificadores profesionales de hechos
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <p><strong>Requisitos:</strong> Experiencia en fact-checking</p>
                    <p><strong>Stake mínimo:</strong> 1.5 ETH</p>
                    <p><strong>Peso de voto:</strong> 2.5x</p>
                    <p><strong>Recompensas:</strong> +30% bonificación</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <GraduationCap className="h-5 w-5 mr-2 text-purple-600" />
                    Expertos
                  </CardTitle>
                  <CardDescription>
                    Especialistas en campos específicos
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <p><strong>Requisitos:</strong> Títulos académicos o experiencia</p>
                    <p><strong>Stake mínimo:</strong> 2.0 ETH</p>
                    <p><strong>Peso de voto:</strong> 3.0x</p>
                    <p><strong>Recompensas:</strong> +40% bonificación</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Users className="h-5 w-5 mr-2 text-gray-600" />
                    Comunidad
                  </CardTitle>
                  <CardDescription>
                    Validadores de la comunidad general
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <p><strong>Requisitos:</strong> Ninguno específico</p>
                    <p><strong>Stake mínimo:</strong> 0.1 ETH</p>
                    <p><strong>Peso de voto:</strong> 1.0x</p>
                    <p><strong>Recompensas:</strong> Base</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="leaderboard" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Top Validadores</CardTitle>
                <CardDescription>
                  Ranking basado en reputación y precisión
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {validators
                    .sort((a, b) => b.reputation - a.reputation)
                    .map((validator, index) => (
                      <div key={validator.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div className="text-lg font-bold text-gray-400">#{index + 1}</div>
                          <div>
                            <div className="font-mono text-sm">{validator.address}</div>
                            <Badge className={getCategoryColor(validator.category)}>
                              {getCategoryIcon(validator.category)}
                              <span className="ml-1 capitalize">{validator.category}</span>
                            </Badge>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">{validator.reputation} puntos</div>
                          <div className="text-sm text-gray-600">{validator.accuracy}% precisión</div>
                        </div>
                      </div>
                    ))
                  }
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Modal de Registro */}
        {showRegisterForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <Card className="w-full max-w-md mx-4">
              <CardHeader>
                <CardTitle>Registrarse como Validador</CardTitle>
                <CardDescription>
                  Únete a la red de validadores de TrueBlock
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="category">Categoría de Validador</Label>
                    <Select
                      value={validatorData.category}
                      onValueChange={(value: "journalist" | "fact_checker" | "expert" | "community") =>
                        setValidatorData(prev => ({ ...prev, category: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona una categoría" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="community">
                          <div className="flex items-center">
                            <Users className="h-4 w-4 mr-2" />
                            Comunidad
                          </div>
                        </SelectItem>
                        <SelectItem value="journalist">
                          <div className="flex items-center">
                            <Newspaper className="h-4 w-4 mr-2" />
                            Periodista
                          </div>
                        </SelectItem>
                        <SelectItem value="fact_checker">
                          <div className="flex items-center">
                            <Shield className="h-4 w-4 mr-2" />
                            Fact-Checker
                          </div>
                        </SelectItem>
                        <SelectItem value="expert">
                          <div className="flex items-center">
                            <GraduationCap className="h-4 w-4 mr-2" />
                            Experto
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="stake">Cantidad de Stake (ETH)</Label>
                    <Input
                      id="stake"
                      type="number"
                      step="0.1"
                      min={validatorData.category === "community" ? "0.1" : "1.0"}
                      value={validatorData.stake}
                      onChange={(e) => setValidatorData(prev => ({ ...prev, stake: e.target.value }))}
                      placeholder="0.1"
                    />
                    <p className="text-sm text-gray-600 mt-1">
                      Mínimo requerido: {
                        validatorData.category === "community" ? "0.1" :
                          validatorData.category === "journalist" ? "1.0" :
                            validatorData.category === "fact_checker" ? "1.5" :
                              "2.0"
                      } ETH
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
                    onClick={handleRegisterValidator}
                    disabled={loading}
                    className="flex-1"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Registrando...
                      </>
                    ) : (
                      "Registrarse"
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
