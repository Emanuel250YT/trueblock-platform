import { MainNav } from "@/components/navigation/main-nav"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Shield, CheckCircle, Users, Globe, Zap, Brain, Network, Award, Target, Eye, Heart } from "lucide-react"
import { Footer } from "@/components/ui/footer"

export default function AcercaDePage() {
  const teamMembers = [
    {
      name: "Dr. Ana Martínez",
      role: "CEO & Fundadora",
      expertise: "Blockchain & Criptografía",
      image: "/team-ceo.png",
    },
    {
      name: "Carlos Rodríguez",
      role: "CTO",
      expertise: "Inteligencia Artificial",
      image: "/team-cto.png",
    },
    {
      name: "María González",
      role: "Head of Community",
      expertise: "Verificación Comunitaria",
      image: "/team-community.png",
    },
    {
      name: "Dr. Luis Fernández",
      role: "Chief Scientist",
      expertise: "ZK Proofs & Consenso",
      image: "/team-scientist.png",
    },
  ]

  const milestones = [
    {
      year: "2022",
      title: "Fundación de TrueBlock",
      description: "Inicio del desarrollo de la plataforma de verificación blockchain",
    },
    {
      year: "2023",
      title: "Primera Verificación",
      description: "Lanzamiento del sistema de oráculos IA y validación comunitaria",
    },
    {
      year: "2024",
      title: "10,000 Noticias Verificadas",
      description: "Alcanzamos el hito de 10,000 noticias verificadas con 95%+ de precisión",
    },
    {
      year: "2024",
      title: "Red Global",
      description: "Expansión a 15 países con más de 500 validadores activos",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <MainNav />

      {/* Hero Section */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center max-w-4xl mx-auto">
            <div className="flex items-center justify-center mb-6">
              <div className="p-4 bg-blue-100 rounded-full">
                <Shield className="h-12 w-12 text-blue-600" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">Acerca de TrueBlock</h1>
            <p className="text-xl text-slate-600 mb-8 leading-relaxed">
              Somos la primera plataforma de verificación de noticias que combina inteligencia artificial, validación
              comunitaria y tecnología blockchain para garantizar información 100% confiable y transparente.
            </p>
            <div className="flex items-center justify-center gap-8 text-sm text-slate-600">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span>+10,000 noticias verificadas</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-600" />
                <span>+500 validadores</span>
              </div>
              <div className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-purple-600" />
                <span>15 países</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mission & Vision */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Target className="h-6 w-6 text-blue-600" />
                </div>
                <CardTitle className="text-2xl">Nuestra Misión</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600 leading-relaxed mb-4">
                Combatir la desinformación mediante una plataforma descentralizada que verifica noticias en tiempo real,
                garantizando transparencia total y privacidad del usuario.
              </p>
              <p className="text-slate-600 leading-relaxed">
                Creemos que el acceso a información veraz es un derecho fundamental en la era digital, y trabajamos para
                democratizar la verificación de noticias a nivel global.
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Eye className="h-6 w-6 text-green-600" />
                </div>
                <CardTitle className="text-2xl">Nuestra Visión</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600 leading-relaxed mb-4">
                Ser la plataforma líder mundial en verificación de noticias, estableciendo el estándar de oro para la
                confiabilidad informativa en el ecosistema digital.
              </p>
              <p className="text-slate-600 leading-relaxed">
                Aspiramos a un futuro donde cada noticia sea verificable, transparente y accesible, fortaleciendo la
                democracia y la toma de decisiones informadas.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* How It Works */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Cómo Funciona TrueBlock</h2>
            <p className="text-lg text-slate-600 max-w-3xl mx-auto">
              Nuestro proceso de verificación multicapa garantiza la máxima precisión y confiabilidad
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="p-4 bg-blue-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Brain className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">1. Oráculos IA</h3>
              <p className="text-sm text-slate-600">Análisis automatizado con múltiples modelos de IA independientes</p>
            </div>

            <div className="text-center">
              <div className="p-4 bg-green-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Zap className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">2. Revisión LLM</h3>
              <p className="text-sm text-slate-600">Evaluación de coherencia y verificación de fuentes</p>
            </div>

            <div className="text-center">
              <div className="p-4 bg-orange-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Users className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">3. Comunidad</h3>
              <p className="text-sm text-slate-600">Validación por expertos y comunidad especializada</p>
            </div>

            <div className="text-center">
              <div className="p-4 bg-purple-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Network className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">4. Blockchain</h3>
              <p className="text-sm text-slate-600">Consenso inmutable con pruebas ZK y transparencia total</p>
            </div>
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">Nuestro Equipo</h2>
          <p className="text-lg text-slate-600 max-w-3xl mx-auto">
            Expertos en blockchain, IA y verificación de información trabajando por un futuro más transparente
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {teamMembers.map((member, index) => (
            <Card key={index} className="border-0 shadow-lg bg-white/80 backdrop-blur-sm text-center">
              <CardContent className="pt-6">
                <div className="w-24 h-24 bg-slate-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Users className="h-12 w-12 text-slate-400" />
                </div>
                <h3 className="font-semibold text-slate-900 mb-1">{member.name}</h3>
                <p className="text-sm text-blue-600 mb-2">{member.role}</p>
                <Badge variant="secondary" className="text-xs">
                  {member.expertise}
                </Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Timeline */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Nuestra Historia</h2>
            <p className="text-lg text-slate-600 max-w-3xl mx-auto">
              El camino hacia la verificación de noticias descentralizada
            </p>
          </div>

          <div className="space-y-8">
            {milestones.map((milestone, index) => (
              <div key={index} className="flex items-start gap-6">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <Award className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <Badge variant="outline">{milestone.year}</Badge>
                    <h3 className="font-semibold text-slate-900">{milestone.title}</h3>
                  </div>
                  <p className="text-slate-600">{milestone.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Values */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">Nuestros Valores</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm text-center">
            <CardContent className="pt-8">
              <div className="p-3 bg-blue-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Shield className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-3">Transparencia</h3>
              <p className="text-slate-600 text-sm">
                Cada verificación es auditable y pública, garantizando total transparencia en nuestros procesos.
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm text-center">
            <CardContent className="pt-8">
              <div className="p-3 bg-green-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Heart className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-3">Privacidad</h3>
              <p className="text-slate-600 text-sm">
                Protegemos la identidad de nuestros usuarios mediante seudónimos y tecnología blockchain.
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm text-center">
            <CardContent className="pt-8">
              <div className="p-3 bg-purple-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <CheckCircle className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-3">Precisión</h3>
              <p className="text-slate-600 text-sm">
                Mantenemos los más altos estándares de precisión con un 96.8% de exactitud promedio.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* CTA */}
      <div className="bg-blue-600 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Únete a la Revolución de la Información Verificada</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
            Forma parte de la comunidad que está construyendo el futuro de las noticias confiables
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" className="px-8">
              Comenzar Ahora
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="px-8 text-white border-white hover:bg-white hover:text-blue-600 bg-transparent"
            >
              Conocer Más
            </Button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
