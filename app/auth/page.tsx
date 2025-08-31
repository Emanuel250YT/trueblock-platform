"use client"

import type React from "react"

import { useState } from "react"
import { MainNav } from "@/components/navigation/main-nav"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Shield, Mail, Lock, User, Wallet, Eye, EyeOff, CheckCircle } from "lucide-react"
import { Footer } from "@/components/ui/footer"
import { useWallet } from "@/contexts/wallet-context"
import { useLocation } from "@/contexts/location-context"

export default function AuthPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [isConnecting, setIsConnecting] = useState(false)

  const { isConnected, address, connectWallet, disconnectWallet } = useWallet()
  const { location } = useLocation()

  const handleMetaMaskConnect = async () => {
    setIsConnecting(true)
    try {
      await connectWallet()
    } catch (error) {
      console.error("Error connecting wallet:", error)
    } finally {
      setIsConnecting(false)
    }
  }

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    // Lógica de login
    console.log("Login submitted")
  }

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault()
    // Lógica de registro
    console.log("Register submitted")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <MainNav />

      <div className="flex items-center justify-center min-h-[calc(100vh-80px)] px-4 py-12">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <div className="p-3 bg-blue-100 rounded-full">
                <Shield className="h-8 w-8 text-blue-600" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Únete a TrueBlock</h1>
            <p className="text-slate-600">Accede a noticias 100% verificadas con blockchain</p>
            {location.city && (
              <p className="text-sm text-slate-500 mt-2">
                Conectándote desde {location.city}, {location.country}
              </p>
            )}
          </div>

          <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-center text-xl">
                {isConnected ? "¡Wallet Conectada!" : "Iniciar Sesión"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isConnected ? (
                <div className="space-y-4 text-center">
                  <div className="flex items-center justify-center gap-2 text-green-600">
                    <CheckCircle className="h-5 w-5" />
                    <span className="font-medium">Wallet Conectada</span>
                  </div>
                  <div className="p-3 bg-green-50 rounded-lg text-sm text-green-700">
                    <strong>Dirección:</strong> {address?.slice(0, 6)}...{address?.slice(-4)}
                  </div>
                  <div className="flex gap-2">
                    <Button className="flex-1" onClick={() => (window.location.href = "/")}>
                      Ir a TrueBlock
                    </Button>
                    <Button variant="outline" onClick={disconnectWallet}>
                      Desconectar
                    </Button>
                  </div>
                </div>
              ) : (
                <Tabs defaultValue="traditional" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 mb-6">
                    <TabsTrigger value="traditional">Email</TabsTrigger>
                    <TabsTrigger value="web3">Web3</TabsTrigger>
                  </TabsList>

                  {/* Traditional Login */}
                  <TabsContent value="traditional" className="space-y-6">
                    <Tabs defaultValue="login" className="w-full">
                      <TabsList className="grid w-full grid-cols-2 mb-4">
                        <TabsTrigger value="login">Iniciar Sesión</TabsTrigger>
                        <TabsTrigger value="register">Registrarse</TabsTrigger>
                      </TabsList>

                      {/* Login Form */}
                      <TabsContent value="login">
                        <form onSubmit={handleLogin} className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <div className="relative">
                              <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                              <Input id="email" type="email" placeholder="tu@email.com" className="pl-10" required />
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="password">Contraseña</Label>
                            <div className="relative">
                              <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                              <Input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                placeholder="••••••••"
                                className="pl-10 pr-10"
                                required
                              />
                              <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                              >
                                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                              </button>
                            </div>
                          </div>

                          <Button type="submit" className="w-full">
                            Iniciar Sesión
                          </Button>

                          <div className="text-center">
                            <button type="button" className="text-sm text-blue-600 hover:underline">
                              ¿Olvidaste tu contraseña?
                            </button>
                          </div>
                        </form>
                      </TabsContent>

                      {/* Register Form */}
                      <TabsContent value="register">
                        <form onSubmit={handleRegister} className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="pseudonym">Seudónimo</Label>
                            <div className="relative">
                              <User className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                              <Input
                                id="pseudonym"
                                type="text"
                                placeholder="Tu seudónimo único"
                                className="pl-10"
                                required
                              />
                            </div>
                            <p className="text-xs text-slate-500">Tu identidad permanecerá privada</p>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="register-email">Email</Label>
                            <div className="relative">
                              <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                              <Input
                                id="register-email"
                                type="email"
                                placeholder="tu@email.com"
                                className="pl-10"
                                required
                              />
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="register-password">Contraseña</Label>
                            <div className="relative">
                              <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                              <Input
                                id="register-password"
                                type={showPassword ? "text" : "password"}
                                placeholder="••••••••"
                                className="pl-10 pr-10"
                                required
                              />
                              <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                              >
                                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                              </button>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="confirm-password">Confirmar Contraseña</Label>
                            <div className="relative">
                              <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                              <Input
                                id="confirm-password"
                                type={showPassword ? "text" : "password"}
                                placeholder="••••••••"
                                className="pl-10"
                                required
                              />
                            </div>
                          </div>

                          <Button type="submit" className="w-full">
                            Crear Cuenta
                          </Button>

                          <div className="text-xs text-slate-500 text-center">
                            Al registrarte, aceptas nuestros{" "}
                            <button className="text-blue-600 hover:underline">Términos de Servicio</button> y{" "}
                            <button className="text-blue-600 hover:underline">Política de Privacidad</button>
                          </div>
                        </form>
                      </TabsContent>
                    </Tabs>
                  </TabsContent>

                  {/* Web3 Login */}
                  <TabsContent value="web3" className="space-y-6">
                    <div className="text-center space-y-4">
                      <div className="p-4 bg-blue-50 rounded-lg">
                        <Wallet className="h-12 w-12 text-blue-600 mx-auto mb-3" />
                        <h3 className="font-semibold text-slate-900 mb-2">Conecta tu Wallet</h3>
                        <p className="text-sm text-slate-600 mb-4">
                          Accede de forma segura usando tu wallet de criptomonedas
                        </p>
                      </div>

                      <Button onClick={handleMetaMaskConnect} disabled={isConnecting} className="w-full" size="lg">
                        {isConnecting ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Conectando...
                          </>
                        ) : (
                          <>
                            <Wallet className="h-4 w-4 mr-2" />
                            Conectar MetaMask
                          </>
                        )}
                      </Button>

                      <div className="space-y-3 text-sm text-slate-600">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span>Autenticación descentralizada</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span>Sin contraseñas que recordar</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span>Máxima seguridad blockchain</span>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              )}
            </CardContent>
          </Card>

          {/* Benefits */}
          <div className="mt-8 text-center">
            <h3 className="font-semibold text-slate-900 mb-4">¿Por qué unirse a TrueBlock?</h3>
            <div className="grid grid-cols-1 gap-3 text-sm">
              <div className="flex items-center gap-2 text-slate-600">
                <Shield className="h-4 w-4 text-blue-600" />
                <span>Noticias 100% verificadas con blockchain</span>
              </div>
              <div className="flex items-center gap-2 text-slate-600">
                <User className="h-4 w-4 text-blue-600" />
                <span>Privacidad total con seudónimos</span>
              </div>
              <div className="flex items-center gap-2 text-slate-600">
                <CheckCircle className="h-4 w-4 text-blue-600" />
                <span>Acceso gratuito para usuarios individuales</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
