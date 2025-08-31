"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Shield,
  CheckCircle,
  Clock,
  TrendingUp,
  Users,
  Eye,
  Search,
  Filter,
  Calendar,
  BarChart3,
  Zap,
  Award,
} from "lucide-react"
import { Footer } from "@/components/ui/footer"

export default function VerificadasPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedVerification, setSelectedVerification] = useState("all")
  const [selectedDate, setSelectedDate] = useState("all")

  const verifiedNews = [
    {
      id: 1,
      title: "Reforma fiscal aprobada por mayoría parlamentaria tras intenso debate",
      excerpt:
        "El congreso aprueba la nueva reforma fiscal con 67% de votos a favor, incluyendo cambios en tributación empresarial y personal.",
      verificationScore: 98,
      category: "Política",
      readTime: "5 min",
      views: "24.8K",
      trend: "trending",
      image: "/government-economic-policy-announcement.png",
      publishedAt: "Hace 1 hora",
      source: "Fuente Verificada",
      verificationSteps: {
        ai: true,
        llm: true,
        community: true,
        blockchain: true,
      },
      validators: 45,
      confidence: "Muy Alta",
    },
    {
      id: 2,
      title: "Avance médico: Nueva terapia génica muestra 95% de efectividad",
      excerpt:
        "Ensayos clínicos confirman la efectividad de la nueva terapia génica para tratar enfermedades raras, beneficiando a miles de pacientes.",
      verificationScore: 96,
      category: "Tecnología",
      readTime: "6 min",
      views: "18.3K",
      trend: "hot",
      image: "/medical-technology-innovation.png",
      publishedAt: "Hace 2 horas",
      source: "Fuente Verificada",
      verificationSteps: {
        ai: true,
        llm: true,
        community: true,
        blockchain: true,
      },
      validators: 38,
      confidence: "Muy Alta",
    },
    {
      id: 3,
      title: "Mercados globales registran crecimiento sostenido del 4.2%",
      excerpt:
        "Los principales índices bursátiles mundiales muestran una tendencia positiva consolidada, impulsada por el sector tecnológico.",
      verificationScore: 94,
      category: "Economía",
      readTime: "4 min",
      views: "15.7K",
      trend: "rising",
      image: "/financial-markets-positive-trend.png",
      publishedAt: "Hace 3 horas",
      source: "Fuente Verificada",
      verificationSteps: {
        ai: true,
        llm: true,
        community: true,
        blockchain: true,
      },
      validators: 42,
      confidence: "Alta",
    },
    {
      id: 4,
      title: "Copa Mundial: Selección nacional clasifica a semifinales",
      excerpt:
        "Victoria histórica 3-1 asegura el pase a semifinales del mundial, generando celebraciones masivas en todo el país.",
      verificationScore: 99,
      category: "Deportes",
      readTime: "3 min",
      views: "32.1K",
      trend: "trending",
      image: "/football-world-championship.png",
      publishedAt: "Hace 4 horas",
      source: "Fuente Verificada",
      verificationSteps: {
        ai: true,
        llm: true,
        community: true,
        blockchain: true,
      },
      validators: 56,
      confidence: "Muy Alta",
    },
  ]

  const filteredNews = verifiedNews.filter((news) => {
    const matchesSearch =
      news.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      news.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || news.category.toLowerCase() === selectedCategory
    const matchesVerification =
      selectedVerification === "all" ||
      (selectedVerification === "high" && news.verificationScore >= 95) ||
      (selectedVerification === "medium" && news.verificationScore >= 90 && news.verificationScore < 95) ||
      (selectedVerification === "verified" && news.verificationScore >= 85)

    return matchesSearch && matchesCategory && matchesVerification
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header Section */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900">Noticias Verificadas</h1>
          </div>
          <p className="text-lg text-slate-600 max-w-3xl mb-6">
            Todas las noticias han pasado por nuestro proceso de verificación multicapa: Oráculos IA, Revisión LLM,
            Validación Comunitaria y Consenso Blockchain.
          </p>

          {/* Real-time Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span className="text-sm font-medium text-green-700">Verificadas Hoy</span>
              </div>
              <div className="text-2xl font-bold text-green-900">247</div>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Users className="h-5 w-5 text-blue-600" />
                <span className="text-sm font-medium text-blue-700">Validadores Activos</span>
              </div>
              <div className="text-2xl font-bold text-blue-900">523</div>
            </div>
            <div className="bg-orange-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <BarChart3 className="h-5 w-5 text-orange-600" />
                <span className="text-sm font-medium text-orange-700">Precisión Promedio</span>
              </div>
              <div className="text-2xl font-bold text-orange-900">96.8%</div>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="h-5 w-5 text-purple-600" />
                <span className="text-sm font-medium text-purple-700">Tiempo Promedio</span>
              </div>
              <div className="text-2xl font-bold text-purple-900">12 min</div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-200">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="h-5 w-5 text-slate-600" />
            <h3 className="font-semibold text-slate-900">Filtros Avanzados</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Buscar noticias..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Category Filter */}
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Categoría" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las categorías</SelectItem>
                <SelectItem value="política">Política</SelectItem>
                <SelectItem value="economía">Economía</SelectItem>
                <SelectItem value="deportes">Deportes</SelectItem>
                <SelectItem value="tecnología">Tecnología</SelectItem>
              </SelectContent>
            </Select>

            {/* Verification Level Filter */}
            <Select value={selectedVerification} onValueChange={setSelectedVerification}>
              <SelectTrigger>
                <SelectValue placeholder="Nivel de Verificación" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los niveles</SelectItem>
                <SelectItem value="high">Muy Alta (95%+)</SelectItem>
                <SelectItem value="medium">Alta (90-94%)</SelectItem>
                <SelectItem value="verified">Verificada (85%+)</SelectItem>
              </SelectContent>
            </Select>

            {/* Date Filter */}
            <Select value={selectedDate} onValueChange={setSelectedDate}>
              <SelectTrigger>
                <SelectValue placeholder="Fecha" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las fechas</SelectItem>
                <SelectItem value="today">Hoy</SelectItem>
                <SelectItem value="week">Esta semana</SelectItem>
                <SelectItem value="month">Este mes</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-200">
            <span className="text-sm text-slate-600">
              Mostrando {filteredNews.length} de {verifiedNews.length} noticias verificadas
            </span>
            <Button variant="outline" size="sm">
              <Calendar className="h-4 w-4 mr-2" />
              Exportar Resultados
            </Button>
          </div>
        </div>
      </div>

      {/* News Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredNews.map((news) => (
            <Card
              key={news.id}
              className="group hover:shadow-xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm"
            >
              <div className="flex gap-4 p-6">
                {/* Image */}
                <div className="relative flex-shrink-0 w-32 h-24 overflow-hidden rounded-lg">
                  <img
                    src={news.image || "/placeholder.svg"}
                    alt={news.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2 right-2">
                    <div className="flex items-center gap-1 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                      <Shield className="h-3 w-3" />
                      {news.verificationScore}%
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex gap-2">
                      <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                        {news.category}
                      </Badge>
                      {news.trend === "trending" && (
                        <Badge variant="secondary" className="bg-red-100 text-red-700">
                          <TrendingUp className="h-3 w-3 mr-1" />
                          Tendencia
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-slate-500">
                      <Award className="h-3 w-3" />
                      {news.confidence}
                    </div>
                  </div>

                  <h3 className="font-semibold text-slate-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                    {news.title}
                  </h3>

                  <p className="text-sm text-slate-600 mb-3 line-clamp-2">{news.excerpt}</p>

                  {/* Verification Steps */}
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex items-center gap-1">
                      <div
                        className={`w-2 h-2 rounded-full ${news.verificationSteps.ai ? "bg-green-500" : "bg-slate-300"}`}
                      ></div>
                      <span className="text-xs text-slate-600">IA</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div
                        className={`w-2 h-2 rounded-full ${news.verificationSteps.llm ? "bg-green-500" : "bg-slate-300"}`}
                      ></div>
                      <span className="text-xs text-slate-600">LLM</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div
                        className={`w-2 h-2 rounded-full ${news.verificationSteps.community ? "bg-green-500" : "bg-slate-300"}`}
                      ></div>
                      <span className="text-xs text-slate-600">Comunidad</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div
                        className={`w-2 h-2 rounded-full ${news.verificationSteps.blockchain ? "bg-green-500" : "bg-slate-300"}`}
                      ></div>
                      <span className="text-xs text-slate-600">Blockchain</span>
                    </div>
                  </div>

                  {/* Meta Info */}
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {news.readTime}
                      </span>
                      <span className="flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        {news.views}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {news.validators} validadores
                      </span>
                    </div>
                    <span>{news.publishedAt}</span>
                  </div>

                  <div className="flex items-center justify-between mt-3">
                    <span className="text-xs font-medium text-green-600">{news.source}</span>
                    <Button size="sm" variant="outline" className="hover:bg-blue-50 bg-transparent">
                      Ver Detalles
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Load More */}
        <div className="text-center mt-12">
          <Button size="lg" variant="outline" className="px-8 bg-transparent">
            Cargar más noticias verificadas
          </Button>
        </div>
      </div>

      <Footer />
    </div>
  )
}
