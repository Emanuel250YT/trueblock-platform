"use client"

import { MainNav } from "@/components/navigation/main-nav"
import { BottomNav } from "@/components/navigation/bottom-nav"
import { Footer } from "@/components/ui/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Settings, Bell, Shield, User, Palette, MapPin, Wallet } from "lucide-react"
import { motion } from "framer-motion"
import { useWallet } from "@/contexts/wallet-context"
import { useLocation } from "@/contexts/location-context"

export default function SettingsPage() {
  const { isConnected, address, connectWallet, disconnectWallet } = useWallet()
  const { location } = useLocation()

  return (
    <div className="min-h-screen bg-background">
      <MainNav />
      <BottomNav />

      <main className="container mx-auto px-4 py-8 pb-20 md:pb-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div className="flex items-center space-x-2 mb-8">
            <Settings className="h-6 w-6 text-primary" />
            <h1 className="text-3xl font-bold">Configuración</h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <Wallet className="h-5 w-5 text-primary" />
                  <CardTitle>Wallet</CardTitle>
                </div>
                <CardDescription>Gestiona tu conexión de wallet Web3</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {isConnected ? (
                  <div className="space-y-4">
                    <div className="p-3 bg-green-50 rounded-lg">
                      <p className="text-sm font-medium text-green-800">Wallet Conectada</p>
                      <p className="text-xs text-green-600 mt-1">
                        {address?.slice(0, 6)}...{address?.slice(-4)}
                      </p>
                    </div>
                    <Button variant="outline" onClick={disconnectWallet} className="w-full bg-transparent">
                      Desconectar Wallet
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      Conecta tu wallet para acceder a todas las funciones de TrueBlock
                    </p>
                    <Button onClick={connectWallet} className="w-full">
                      Conectar Wallet
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Perfil */}
            <Card>
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <User className="h-5 w-5 text-primary" />
                  <CardTitle>Perfil</CardTitle>
                </div>
                <CardDescription>Gestiona tu información personal</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nombre</Label>
                  <input id="name" className="w-full px-3 py-2 border rounded-md" placeholder="Tu nombre" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <input
                    id="email"
                    type="email"
                    className="w-full px-3 py-2 border rounded-md"
                    placeholder="tu@email.com"
                  />
                </div>
                <Button>Guardar Cambios</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <MapPin className="h-5 w-5 text-primary" />
                  <CardTitle>Ubicación y Región</CardTitle>
                </div>
                <CardDescription>Personaliza el contenido según tu ubicación</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {location.city && (
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm font-medium text-blue-800">Ubicación Detectada</p>
                    <p className="text-xs text-blue-600 mt-1">
                      {location.city}, {location.country}
                    </p>
                    <p className="text-xs text-blue-600">Zona horaria: {location.timezone}</p>
                  </div>
                )}
                <div className="space-y-2">
                  <Label htmlFor="region">Región preferida</Label>
                  <Select defaultValue={location.country?.toLowerCase() || "auto"}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="auto">Detectar automáticamente</SelectItem>
                      <SelectItem value="mx">México</SelectItem>
                      <SelectItem value="es">España</SelectItem>
                      <SelectItem value="ar">Argentina</SelectItem>
                      <SelectItem value="co">Colombia</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Notificaciones */}
            <Card>
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <Bell className="h-5 w-5 text-primary" />
                  <CardTitle>Notificaciones</CardTitle>
                </div>
                <CardDescription>Configura tus preferencias de notificación</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="email-notifications">Notificaciones por email</Label>
                  <Switch id="email-notifications" />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="push-notifications">Notificaciones push</Label>
                  <Switch id="push-notifications" />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="validation-alerts">Alertas de validación</Label>
                  <Switch id="validation-alerts" defaultChecked />
                </div>
              </CardContent>
            </Card>

            {/* Privacidad */}
            <Card>
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <Shield className="h-5 w-5 text-primary" />
                  <CardTitle>Privacidad y Seguridad</CardTitle>
                </div>
                <CardDescription>Controla tu privacidad y seguridad</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="public-profile">Perfil público</Label>
                  <Switch id="public-profile" />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="show-stats">Mostrar estadísticas</Label>
                  <Switch id="show-stats" defaultChecked />
                </div>
                <Button variant="outline">Cambiar Contraseña</Button>
              </CardContent>
            </Card>

            {/* Preferencias */}
            <Card>
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <Palette className="h-5 w-5 text-primary" />
                  <CardTitle>Preferencias</CardTitle>
                </div>
                <CardDescription>Personaliza tu experiencia</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="language">Idioma</Label>
                  <Select defaultValue="es">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="es">Español</SelectItem>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="fr">Français</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timezone">Zona horaria</Label>
                  <Select defaultValue={location.timezone || "america/mexico"}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="america/mexico">América/México</SelectItem>
                      <SelectItem value="america/new_york">América/Nueva York</SelectItem>
                      <SelectItem value="europe/madrid">Europa/Madrid</SelectItem>
                      <SelectItem value="america/argentina/buenos_aires">América/Buenos Aires</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  )
}
