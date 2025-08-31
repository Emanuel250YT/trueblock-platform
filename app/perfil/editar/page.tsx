"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { ArrowLeft, Save, Upload, X } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useWallet } from "@/contexts/wallet-context"
import { RoleBadge } from "@/components/user/role-badge"

interface UserProfile {
  name: string
  bio: string
  location: string
  website: string
  twitter: string
  avatar: string
  role: "Periodista" | "Verificador" | "Oráculo" | "Usuario"
  isVerified: boolean
  reputation: number
}

export default function EditProfilePage() {
  const { isConnected, address } = useWallet()
  const [profile, setProfile] = useState<UserProfile>({
    name: "María González",
    bio: "Periodista especializada en economía y política con más de 10 años de experiencia. Comprometida con el periodismo verificado y transparente.",
    location: "Madrid, España",
    website: "https://mariagonzalez.com",
    twitter: "@mariagonzalez",
    avatar: "/professional-journalist-woman.png",
    role: "Periodista",
    isVerified: true,
    reputation: 95,
  })
  const [isLoading, setIsLoading] = useState(false)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)

  const handleInputChange = (field: keyof UserProfile, value: string) => {
    setProfile((prev) => ({ ...prev, [field]: value }))
  }

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setAvatarPreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSave = async () => {
    if (!isConnected) return

    setIsLoading(true)
    // Simular guardado
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setIsLoading(false)

    // Redirigir al perfil
    window.location.href = `/perfil/${address}`
  }

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <CardContent className="p-8 text-center">
            <h2 className="text-xl font-bold mb-4">Conecta tu wallet</h2>
            <p className="text-gray-600 mb-6">Necesitas conectar tu wallet para editar tu perfil</p>
            <Button className="w-full">Conectar Wallet</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href={`/perfil/${address}`} className="flex items-center gap-2 text-gray-600 hover:text-blue-600">
              <ArrowLeft className="h-5 w-5" />
              <span>Volver al perfil</span>
            </Link>
            <Button onClick={handleSave} disabled={isLoading}>
              {isLoading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              Guardar cambios
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
          {/* Información básica */}
          <Card>
            <CardHeader>
              <CardTitle>Información básica</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Avatar */}
              <div className="flex items-center gap-6">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={avatarPreview || profile.avatar || "/placeholder.svg"} />
                  <AvatarFallback className="text-xl">{profile.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="space-y-2">
                  <Label htmlFor="avatar">Foto de perfil</Label>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" asChild>
                      <label htmlFor="avatar" className="cursor-pointer">
                        <Upload className="h-4 w-4 mr-2" />
                        Subir imagen
                      </label>
                    </Button>
                    {avatarPreview && (
                      <Button variant="outline" size="sm" onClick={() => setAvatarPreview(null)}>
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  <input id="avatar" type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
                </div>
              </div>

              {/* Nombre */}
              <div className="space-y-2">
                <Label htmlFor="name">Nombre completo</Label>
                <Input
                  id="name"
                  value={profile.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="Tu nombre completo"
                />
              </div>

              {/* Bio */}
              <div className="space-y-2">
                <Label htmlFor="bio">Biografía</Label>
                <Textarea
                  id="bio"
                  value={profile.bio}
                  onChange={(e) => handleInputChange("bio", e.target.value)}
                  placeholder="Cuéntanos sobre ti..."
                  rows={4}
                />
              </div>

              {/* Ubicación */}
              <div className="space-y-2">
                <Label htmlFor="location">Ubicación</Label>
                <Input
                  id="location"
                  value={profile.location}
                  onChange={(e) => handleInputChange("location", e.target.value)}
                  placeholder="Ciudad, País"
                />
              </div>
            </CardContent>
          </Card>

          {/* Enlaces sociales */}
          <Card>
            <CardHeader>
              <CardTitle>Enlaces sociales</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="website">Sitio web</Label>
                <Input
                  id="website"
                  value={profile.website}
                  onChange={(e) => handleInputChange("website", e.target.value)}
                  placeholder="https://tusitio.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="twitter">Twitter</Label>
                <Input
                  id="twitter"
                  value={profile.twitter}
                  onChange={(e) => handleInputChange("twitter", e.target.value)}
                  placeholder="@tuusuario"
                />
              </div>
            </CardContent>
          </Card>

          {/* Información del rol */}
          <Card>
            <CardHeader>
              <CardTitle>Rol y verificación</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium mb-2">Rol actual</p>
                  <RoleBadge
                    role={profile.role}
                    isVerified={profile.isVerified}
                    reputation={profile.reputation}
                    showReputation={true}
                  />
                </div>
                <Button variant="outline" size="sm">
                  Solicitar cambio de rol
                </Button>
              </div>

              <div className="text-sm text-gray-600">
                <p>Tu rol determina qué acciones puedes realizar en la plataforma:</p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>
                    <strong>Periodista:</strong> Puede publicar artículos y recibir donaciones
                  </li>
                  <li>
                    <strong>Verificador:</strong> Puede validar noticias y participar en el consenso
                  </li>
                  <li>
                    <strong>Oráculo:</strong> Proporciona validación externa automatizada
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Configuración de privacidad */}
          <Card>
            <CardHeader>
              <CardTitle>Configuración de privacidad</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Perfil público</p>
                  <p className="text-sm text-gray-600">Permite que otros usuarios vean tu perfil</p>
                </div>
                <Button variant="outline" size="sm">
                  Habilitado
                </Button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Mostrar estadísticas</p>
                  <p className="text-sm text-gray-600">Muestra tus métricas de actividad públicamente</p>
                </div>
                <Button variant="outline" size="sm">
                  Habilitado
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
