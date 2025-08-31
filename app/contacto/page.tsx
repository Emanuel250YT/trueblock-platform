"use client"

import type React from "react"

import { useState } from "react"
import { MainNav } from "@/components/navigation/main-nav"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Mail, Phone, MapPin, Clock, Send, MessageSquare, HelpCircle, Building, Globe } from "lucide-react"
import { Footer } from "@/components/ui/footer"

export default function ContactoPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    category: "",
    message: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Form submitted:", formData)
    // Aquí iría la lógica para enviar el formulario
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const contactInfo = [
    {
      icon: Mail,
      title: "Email",
      content: "contacto@trueblock.com",
      description: "Respuesta en 24 horas",
    },
    {
      icon: Phone,
      title: "Teléfono",
      content: "+1 (555) 123-4567",
      description: "Lun - Vie, 9:00 - 18:00",
    },
    {
      icon: MapPin,
      title: "Oficina Principal",
      content: "123 Blockchain Ave, Tech City",
      description: "San Francisco, CA 94105",
    },
    {
      icon: Globe,
      title: "Soporte Global",
      content: "24/7 en 15 idiomas",
      description: "Asistencia técnica continua",
    },
  ]

  const supportCategories = [
    {
      icon: HelpCircle,
      title: "Soporte Técnico",
      description: "Problemas con la plataforma, APIs, integraciones",
    },
    {
      icon: Building,
      title: "Empresas",
      description: "Consultas corporativas, planes empresariales",
    },
    {
      icon: MessageSquare,
      title: "Prensa",
      description: "Consultas de medios, entrevistas, comunicados",
    },
    {
      icon: Globe,
      title: "Partnerships",
      description: "Colaboraciones, integraciones, alianzas estratégicas",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <MainNav />

      {/* Hero Section */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">Contáctanos</h1>
            <p className="text-xl text-slate-600 leading-relaxed">
              Estamos aquí para ayudarte. Ponte en contacto con nuestro equipo para cualquier consulta sobre TrueBlock,
              soporte técnico o colaboraciones.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div>
            <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-3">
                  <Send className="h-6 w-6 text-blue-600" />
                  Envíanos un Mensaje
                </CardTitle>
                <p className="text-slate-600">Completa el formulario y te responderemos lo antes posible</p>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nombre Completo</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => handleInputChange("name", e.target.value)}
                        placeholder="Tu nombre"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        placeholder="tu@email.com"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category">Categoría</Label>
                    <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona una categoría" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="technical">Soporte Técnico</SelectItem>
                        <SelectItem value="business">Consulta Empresarial</SelectItem>
                        <SelectItem value="press">Prensa</SelectItem>
                        <SelectItem value="partnership">Partnership</SelectItem>
                        <SelectItem value="general">Consulta General</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subject">Asunto</Label>
                    <Input
                      id="subject"
                      value={formData.subject}
                      onChange={(e) => handleInputChange("subject", e.target.value)}
                      placeholder="Breve descripción del tema"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Mensaje</Label>
                    <Textarea
                      id="message"
                      value={formData.message}
                      onChange={(e) => handleInputChange("message", e.target.value)}
                      placeholder="Describe tu consulta en detalle..."
                      rows={6}
                      required
                    />
                  </div>

                  <Button type="submit" className="w-full" size="lg">
                    <Send className="h-4 w-4 mr-2" />
                    Enviar Mensaje
                  </Button>

                  <p className="text-xs text-slate-500 text-center">
                    Al enviar este formulario, aceptas nuestra{" "}
                    <button className="text-blue-600 hover:underline">Política de Privacidad</button>
                  </p>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Contact Information */}
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Información de Contacto</h2>
              <div className="grid grid-cols-1 gap-6">
                {contactInfo.map((info, index) => (
                  <Card key={index} className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="p-3 bg-blue-100 rounded-lg">
                          <info.icon className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-slate-900 mb-1">{info.title}</h3>
                          <p className="text-slate-900 mb-1">{info.content}</p>
                          <p className="text-sm text-slate-600">{info.description}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Support Categories */}
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Tipos de Consulta</h2>
              <div className="space-y-4">
                {supportCategories.map((category, index) => (
                  <Card key={index} className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-slate-100 rounded-lg">
                          <category.icon className="h-5 w-5 text-slate-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-slate-900">{category.title}</h3>
                          <p className="text-sm text-slate-600">{category.description}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Business Hours */}
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-blue-600" />
                  Horarios de Atención
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Lunes - Viernes</span>
                    <span className="font-medium">9:00 - 18:00 PST</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Sábados</span>
                    <span className="font-medium">10:00 - 14:00 PST</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Domingos</span>
                    <span className="font-medium">Cerrado</span>
                  </div>
                  <div className="pt-2 border-t border-slate-200">
                    <div className="flex justify-between">
                      <span className="text-slate-600">Soporte Técnico</span>
                      <span className="font-medium text-green-600">24/7</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Preguntas Frecuentes</h2>
            <p className="text-lg text-slate-600">Encuentra respuestas rápidas a las consultas más comunes</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <h3 className="font-semibold text-slate-900 mb-3">¿Cómo funciona la verificación?</h3>
                <p className="text-slate-600 text-sm">
                  Utilizamos un proceso de 4 etapas: Oráculos IA, Revisión LLM, Validación Comunitaria y Consenso
                  Blockchain para garantizar máxima precisión.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <h3 className="font-semibold text-slate-900 mb-3">¿Es gratuito para usuarios individuales?</h3>
                <p className="text-slate-600 text-sm">
                  Sí, el acceso básico a noticias verificadas es completamente gratuito. Los planes corporativos y APIs
                  tienen costos asociados.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <h3 className="font-semibold text-slate-900 mb-3">¿Cómo puedo ser validador?</h3>
                <p className="text-slate-600 text-sm">
                  Puedes aplicar para ser validador completando nuestro proceso de verificación de credenciales y
                  experiencia en el área correspondiente.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <h3 className="font-semibold text-slate-900 mb-3">¿Qué garantías de privacidad ofrecen?</h3>
                <p className="text-slate-600 text-sm">
                  Utilizamos seudónimos y tecnología blockchain para proteger tu identidad. Nunca compartimos datos
                  personales con terceros.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
