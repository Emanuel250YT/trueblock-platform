"use client"

import { MainNav } from "@/components/navigation/main-nav"
import { BadgeGenerator } from "@/components/client/badge-generator"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Shield, Zap, Globe, Code } from "lucide-react"

const features = [
  {
    icon: Shield,
    title: "Verificación Confiable",
    description: "Badges respaldados por nuestro pipeline multicapa de validación",
  },
  {
    icon: Zap,
    title: "Actualización Automática",
    description: "Los badges se actualizan automáticamente cuando cambia el estado",
  },
  {
    icon: Globe,
    title: "Compatible Universal",
    description: "Funciona en cualquier sitio web, CMS o plataforma",
  },
  {
    icon: Code,
    title: "Fácil Integración",
    description: "Solo copia y pega el código, sin configuración compleja",
  },
]

export default function BadgePage() {
  return (
    <div className="min-h-screen bg-background">
      <MainNav />

      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold mb-4">Generador de Badges</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Crea badges embebibles para mostrar el estado de verificación de tus noticias directamente en tu sitio web
          </p>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <Card key={index} className="text-center">
                <CardHeader>
                  <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{feature.description}</CardDescription>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Badge Generator */}
        <BadgeGenerator />

        {/* Examples */}
        <Card className="mt-12">
          <CardHeader>
            <CardTitle>Ejemplos de Uso</CardTitle>
            <CardDescription>Casos comunes donde los badges de TrueBlock agregan valor</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-3">
                <h4 className="font-medium">Medios de Comunicación</h4>
                <p className="text-sm text-muted-foreground">
                  Muestra la verificación de tus artículos para aumentar la credibilidad y confianza de los lectores.
                </p>
                <Badge variant="outline">Recomendado</Badge>
              </div>

              <div className="space-y-3">
                <h4 className="font-medium">Redes Sociales</h4>
                <p className="text-sm text-muted-foreground">
                  Agrega badges a tus publicaciones para combatir la desinformación y mostrar fuentes verificadas.
                </p>
                <Badge variant="outline">Popular</Badge>
              </div>

              <div className="space-y-3">
                <h4 className="font-medium">Blogs y Sitios Web</h4>
                <p className="text-sm text-muted-foreground">
                  Integra badges en tus contenidos para demostrar que tus fuentes han sido verificadas.
                </p>
                <Badge variant="outline">Fácil</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
