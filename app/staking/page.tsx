"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { useWallet } from "@/contexts/wallet-context"
import { useStaking } from "@/hooks/use-trueblock-api"
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  PiggyBank,
  AlertCircle,
  CheckCircle,
  Clock,
  Loader2,
  Plus,
  Minus,
  RefreshCw
} from "lucide-react"

export default function StakingPage() {
  const { isConnected, address } = useWallet()
  const { addStake, getStakingStatus, loading, error } = useStaking()

  const [stakingData, setStakingData] = useState({
    totalStaked: "0",
    rewards: "0",
    apy: 0,
    lockPeriod: 0,
    userStake: "0",
    canUnstake: false
  })
  const [stakeAmount, setStakeAmount] = useState("")
  const [unstakeAmount, setUnstakeAmount] = useState("")
  const [activeTab, setActiveTab] = useState("stake")

  useEffect(() => {
    if (isConnected && address) {
      loadStakingData()
    }
  }, [isConnected, address])

  const loadStakingData = async () => {
    try {
      // Simular carga de datos de staking
      // En la implementación real usarías getStakingInfo(address)
      setStakingData({
        totalStaked: "1.5",
        rewards: "0.125",
        apy: 12.5,
        lockPeriod: 7,
        userStake: "1.5",
        canUnstake: true
      })
    } catch (err) {
      console.error("Error loading staking data:", err)
    }
  }

  const handleStake = async () => {
    if (!isConnected || !stakeAmount) {
      alert("Por favor conecta tu wallet e ingresa una cantidad")
      return
    }

    try {
      const result = await addStake({
        walletAddress: address!,
        amount: stakeAmount,
        signature: "0x..." // En la implementación real, se generaría la firma
      })

      alert("Stake realizado exitosamente")
      setStakeAmount("")
      loadStakingData()
    } catch (err) {
      console.error("Error staking:", err)
    }
  }

  const handleUnstake = async () => {
    if (!isConnected || !unstakeAmount) {
      alert("Por favor conecta tu wallet e ingresa una cantidad")
      return
    }

    try {
      // Simular unstake - esta funcionalidad no está disponible en la API actual
      alert("Función de unstake no disponible en esta versión")
      setUnstakeAmount("")
    } catch (err) {
      console.error("Error unstaking:", err)
    }
  }

  const handleClaimRewards = async () => {
    if (!isConnected) {
      alert("Por favor conecta tu wallet")
      return
    }

    try {
      // Simular reclamar recompensas - esta funcionalidad no está disponible en la API actual
      alert("Función de reclamar recompensas no disponible en esta versión")
      loadStakingData()
    } catch (err) {
      console.error("Error claiming rewards:", err)
    }
  }

  if (!isConnected) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-md mx-auto">
          <CardContent className="text-center py-8">
            <PiggyBank className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Conecta tu Wallet</h2>
            <p className="text-gray-600 mb-4">
              Para participar en staking, necesitas conectar tu wallet primero.
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
              Staking TrueBlock
            </h1>
            <p className="text-gray-600">
              Participa en el consenso y gana recompensas por validar noticias
            </p>
          </div>
          <Button
            variant="outline"
            onClick={loadStakingData}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Actualizar
          </Button>
        </div>

        {error && (
          <Alert className="mb-6 border-red-200 bg-red-50">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              Error: {error}
            </AlertDescription>
          </Alert>
        )}

        {/* Métricas de Staking */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
                <PiggyBank className="h-4 w-4 mr-2" />
                Tu Stake
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stakingData.userStake} ETH</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
                <DollarSign className="h-4 w-4 mr-2" />
                Recompensas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stakingData.rewards} ETH</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
                <TrendingUp className="h-4 w-4 mr-2" />
                APY
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{stakingData.apy}%</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
                <Clock className="h-4 w-4 mr-2" />
                Período de Bloqueo
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stakingData.lockPeriod} días</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Panel Principal de Staking */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="stake" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="stake">Stake</TabsTrigger>
                <TabsTrigger value="unstake">Unstake</TabsTrigger>
                <TabsTrigger value="rewards">Recompensas</TabsTrigger>
              </TabsList>

              <TabsContent value="stake" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Plus className="h-5 w-5 mr-2 text-green-600" />
                      Realizar Stake
                    </CardTitle>
                    <CardDescription>
                      Bloquea tus ETH para participar en la validación y ganar recompensas
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div>
                        <Label htmlFor="stakeAmount">Cantidad a Stakear (ETH)</Label>
                        <div className="flex space-x-2 mt-2">
                          <Input
                            id="stakeAmount"
                            type="number"
                            step="0.01"
                            min="0.01"
                            value={stakeAmount}
                            onChange={(e) => setStakeAmount(e.target.value)}
                            placeholder="0.00"
                            className="flex-1"
                          />
                          <Button
                            variant="outline"
                            onClick={() => setStakeAmount("1.0")}
                          >
                            Máx
                          </Button>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          Mínimo: 0.01 ETH
                        </p>
                      </div>

                      <div className="bg-blue-50 p-4 rounded-lg">
                        <h4 className="font-medium text-blue-900 mb-2">Detalles del Stake</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-blue-700">Cantidad:</span>
                            <span className="font-medium">{stakeAmount || "0"} ETH</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-blue-700">APY Estimado:</span>
                            <span className="font-medium">{stakingData.apy}%</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-blue-700">Recompensas Anuales:</span>
                            <span className="font-medium text-green-600">
                              {stakeAmount ? (parseFloat(stakeAmount) * stakingData.apy / 100).toFixed(4) : "0"} ETH
                            </span>
                          </div>
                        </div>
                      </div>

                      <Button
                        onClick={handleStake}
                        disabled={loading || !stakeAmount}
                        className="w-full bg-green-600 hover:bg-green-700"
                      >
                        {loading ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Procesando...
                          </>
                        ) : (
                          <>
                            <Plus className="h-4 w-4 mr-2" />
                            Stakear {stakeAmount || "0"} ETH
                          </>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="unstake" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Minus className="h-5 w-5 mr-2 text-red-600" />
                      Realizar Unstake
                    </CardTitle>
                    <CardDescription>
                      Retira tus ETH del stake (sujeto a período de bloqueo)
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {stakingData.canUnstake ? (
                        <>
                          <div>
                            <Label htmlFor="unstakeAmount">Cantidad a Retirar (ETH)</Label>
                            <div className="flex space-x-2 mt-2">
                              <Input
                                id="unstakeAmount"
                                type="number"
                                step="0.01"
                                min="0.01"
                                max={stakingData.userStake}
                                value={unstakeAmount}
                                onChange={(e) => setUnstakeAmount(e.target.value)}
                                placeholder="0.00"
                                className="flex-1"
                              />
                              <Button
                                variant="outline"
                                onClick={() => setUnstakeAmount(stakingData.userStake)}
                              >
                                Todo
                              </Button>
                            </div>
                            <p className="text-sm text-gray-600 mt-1">
                              Disponible: {stakingData.userStake} ETH
                            </p>
                          </div>

                          <Alert className="border-yellow-200 bg-yellow-50">
                            <AlertCircle className="h-4 w-4 text-yellow-600" />
                            <AlertDescription className="text-yellow-800">
                              El unstaking puede tomar hasta {stakingData.lockPeriod} días en completarse.
                            </AlertDescription>
                          </Alert>

                          <Button
                            onClick={handleUnstake}
                            disabled={loading || !unstakeAmount}
                            variant="destructive"
                            className="w-full"
                          >
                            {loading ? (
                              <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                Procesando...
                              </>
                            ) : (
                              <>
                                <Minus className="h-4 w-4 mr-2" />
                                Unstakear {unstakeAmount || "0"} ETH
                              </>
                            )}
                          </Button>
                        </>
                      ) : (
                        <Alert className="border-red-200 bg-red-50">
                          <AlertCircle className="h-4 w-4 text-red-600" />
                          <AlertDescription className="text-red-800">
                            No puedes realizar unstake en este momento. Período de bloqueo activo.
                          </AlertDescription>
                        </Alert>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="rewards" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <DollarSign className="h-5 w-5 mr-2 text-green-600" />
                      Reclamar Recompensas
                    </CardTitle>
                    <CardDescription>
                      Retira las recompensas acumuladas por tu participación
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="bg-green-50 p-6 rounded-lg text-center">
                        <div className="text-3xl font-bold text-green-600 mb-2">
                          {stakingData.rewards} ETH
                        </div>
                        <p className="text-green-700">Recompensas Disponibles</p>
                      </div>

                      <div className="space-y-4">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Recompensas de Validación:</span>
                          <span className="font-medium">{(parseFloat(stakingData.rewards) * 0.7).toFixed(4)} ETH</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Bonificaciones de Consenso:</span>
                          <span className="font-medium">{(parseFloat(stakingData.rewards) * 0.3).toFixed(4)} ETH</span>
                        </div>
                      </div>

                      <Button
                        onClick={handleClaimRewards}
                        disabled={loading || parseFloat(stakingData.rewards) === 0}
                        className="w-full bg-green-600 hover:bg-green-700"
                      >
                        {loading ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Procesando...
                          </>
                        ) : (
                          <>
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Reclamar {stakingData.rewards} ETH
                          </>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Panel de Información */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Información del Pool</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Total Stakeado:</span>
                  <span className="text-sm font-medium">1,247.8 ETH</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Stakers Activos:</span>
                  <span className="text-sm font-medium">342</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">APY Promedio:</span>
                  <span className="text-sm font-medium text-blue-600">{stakingData.apy}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Tu Participación:</span>
                  <span className="text-sm font-medium">
                    {stakingData.userStake !== "0" ?
                      ((parseFloat(stakingData.userStake) / 1247.8) * 100).toFixed(2) + "%" :
                      "0%"
                    }
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Cómo Funciona</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Stakea ETH para participar en el consenso</li>
                  <li>• Gana recompensas por validaciones correctas</li>
                  <li>• Penalizaciones por comportamiento malicioso</li>
                  <li>• Período de bloqueo de 7 días para unstaking</li>
                  <li>• Recompensas distribuidas diariamente</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Riesgos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm text-red-600">
                  <p>• Slashing por validaciones incorrectas</p>
                  <p>• Período de bloqueo obligatorio</p>
                  <p>• Volatilidad del precio de ETH</p>
                  <p>• Riesgos técnicos del protocolo</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
