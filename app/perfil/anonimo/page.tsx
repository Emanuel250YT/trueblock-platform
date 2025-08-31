"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { useWallet } from "@/contexts/wallet-context"
import {
  Shield,
  Eye,
  EyeOff,
  Star,
  Trophy,
  Target,
  TrendingUp,
  Activity,
  Coins,
  CheckCircle,
  Zap,
  Lock,
  Users,
  Calendar,
} from "lucide-react"

export default function AnonymousProfile() {
  const { isConnected, address } = useWallet()
  const [showSensitiveData, setShowSensitiveData] = useState(false)

  if (!isConnected) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-md mx-auto">
          <CardContent className="text-center py-8">
            <Shield className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Conecta tu Wallet</h2>
            <p className="text-gray-600 mb-4">
              Para ver tu perfil anónimo, necesitas conectar tu wallet primero.
            </p>
            <Button className="w-full">
              Conectar Wallet
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const maskData = (data: string | number | undefined, length: number = 4): string => {
    if (!data) return "***"
    const str = data.toString()
    if (showSensitiveData) return str
    return "*".repeat(Math.min(str.length, length))
  }

  // Mock data for demonstration (would come from API in real implementation)
  const mockProfileData = {
    reputation: 850,
    totalValidations: 25,
    stakedAmount: 1500,
    activeOracles: 3,
    accuracy: 92,
    trustLevel: 88,
    activityLevel: 75,
    rewards: 120,
    duration: 45,
    averageAccuracy: 94
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Perfil Anónimo
            </h1>
            <p className="text-gray-600">
              Vista protegida de tu actividad en TrueBlock
            </p>
          </div>

          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowSensitiveData(!showSensitiveData)}
              className="flex items-center space-x-2"
            >
              {showSensitiveData ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
              <span>
                {showSensitiveData ? "Ocultar Datos" : "Mostrar Datos"}
              </span>
            </Button>

            <div className="flex items-center space-x-2 bg-green-50 text-green-700 px-3 py-1 rounded-full">
              <Shield className="h-4 w-4" />
              <span className="text-sm font-medium">Modo Anónimo</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Reputación</p>
                <p className="text-2xl font-bold text-green-600">
                  {maskData(mockProfileData.reputation)}
                </p>
              </div>
              <Star className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Validaciones</p>
                <p className="text-2xl font-bold text-blue-600">
                  {maskData(mockProfileData.totalValidations)}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">TB Tokens</p>
                <p className="text-2xl font-bold text-purple-600">
                  {maskData(mockProfileData.stakedAmount)}
                </p>
              </div>
              <Coins className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Oráculos</p>
                <p className="text-2xl font-bold text-orange-600">
                  {maskData(mockProfileData.activeOracles)}
                </p>
              </div>
              <Zap className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview" className="flex items-center space-x-2">
            <Activity className="h-4 w-4" />
            <span>Resumen</span>
          </TabsTrigger>
          <TabsTrigger value="validations" className="flex items-center space-x-2">
            <CheckCircle className="h-4 w-4" />
            <span>Validaciones</span>
          </TabsTrigger>
          <TabsTrigger value="staking" className="flex items-center space-x-2">
            <Coins className="h-4 w-4" />
            <span>Staking</span>
          </TabsTrigger>
          <TabsTrigger value="oracles" className="flex items-center space-x-2">
            <Zap className="h-4 w-4" />
            <span>Oráculos</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Trophy className="h-5 w-5 text-yellow-500" />
                  <span>Rendimiento General</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Precisión en Validaciones</span>
                    <span>{maskData(mockProfileData.accuracy)}%</span>
                  </div>
                  <Progress
                    value={showSensitiveData ? mockProfileData.accuracy : 50}
                    className="h-2"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Nivel de Confianza</span>
                    <span>{maskData(mockProfileData.trustLevel)}%</span>
                  </div>
                  <Progress
                    value={showSensitiveData ? mockProfileData.trustLevel : 60}
                    className="h-2"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Participación Activa</span>
                    <span>{maskData(mockProfileData.activityLevel)}%</span>
                  </div>
                  <Progress
                    value={showSensitiveData ? mockProfileData.activityLevel : 75}
                    className="h-2"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Target className="h-5 w-5 text-blue-500" />
                  <span>Logros Recientes</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <div>
                        <p className="text-sm font-medium">Validación Perfecta</p>
                        <p className="text-xs text-gray-600">100% precisión esta semana</p>
                      </div>
                    </div>
                    <Badge variant="secondary">Nuevo</Badge>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Users className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="text-sm font-medium">Colaborador Activo</p>
                        <p className="text-xs text-gray-600">{maskData(10)} validaciones este mes</p>
                      </div>
                    </div>
                    <Badge variant="secondary">Activo</Badge>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Coins className="h-5 w-5 text-purple-600" />
                      <div>
                        <p className="text-sm font-medium">HODLer Comprometido</p>
                        <p className="text-xs text-gray-600">{maskData(30)} días de staking</p>
                      </div>
                    </div>
                    <Badge variant="secondary">Constante</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="validations" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Historial de Validaciones (Anónimo)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Lock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Datos Protegidos</h3>
                <p className="text-gray-600 mb-4">
                  Los detalles específicos de validaciones están ocultos para proteger tu privacidad.
                </p>
                <Button
                  variant="outline"
                  onClick={() => setShowSensitiveData(!showSensitiveData)}
                >
                  {showSensitiveData ? "Ocultar" : "Mostrar"} Detalles
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="staking" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Información de Staking (Anónimo)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <Coins className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Tokens en Staking</p>
                  <p className="text-xl font-bold text-purple-600">
                    {maskData(mockProfileData.stakedAmount)} TB
                  </p>
                </div>

                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <TrendingUp className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Recompensas</p>
                  <p className="text-xl font-bold text-green-600">
                    {maskData(mockProfileData.rewards)} TB
                  </p>
                </div>

                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <Calendar className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Duración</p>
                  <p className="text-xl font-bold text-blue-600">
                    {maskData(mockProfileData.duration)} días
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="oracles" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Actividad de Oráculos (Anónimo)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Modo Privado</h3>
                <p className="text-gray-600 mb-4">
                  La información detallada de oráculos está protegida en modo anónimo.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                  <div className="text-center p-4 bg-orange-50 rounded-lg">
                    <Zap className="h-6 w-6 text-orange-600 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">Oráculos Activos</p>
                    <p className="text-lg font-bold text-orange-600">
                      {maskData(mockProfileData.activeOracles)}
                    </p>
                  </div>

                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <Activity className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">Precisión Promedio</p>
                    <p className="text-lg font-bold text-blue-600">
                      {maskData(mockProfileData.averageAccuracy)}%
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
