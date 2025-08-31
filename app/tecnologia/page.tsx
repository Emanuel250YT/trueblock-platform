import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Shield, CheckCircle, Clock, TrendingUp, Users, Eye, Cpu } from "lucide-react"

export default function TecnologiaPage() {
  const techNews = [
    {
      id: 1,
      title: "Avance revolucionario en inteligencia artificial mejora diagnósticos médicos",
      excerpt:
        "Nuevo algoritmo de IA logra 98% de precisión en detección temprana de enfermedades, superando a métodos tradicionales.",
      verificationScore: 96,
      category: "Tecnología",
      readTime: "5 min",
      views: "22.1K",
      trend: "trending",
      image: "/medical-technology-innovation.png",
      publishedAt: "Hace 1 hora",
      source: "Fuente Verificada",
    },
    {
      id: 2,
      title: "Energía renovable: Nueva tecnología solar aumenta eficiencia al 45%",
      excerpt:
        "Investigadores desarrollan células solares de perovskita que duplican la eficiencia de los paneles convencionales.",
      verificationScore: 94,
      category: "Tecnología",
      readTime: "4 min",
      views: "16.8K",
      trend: "hot",
      image: "/renewable-energy-solar-wind-technology.png",
      publishedAt: "Hace 3 horas",
      source: "Fuente Verificada",
    },
    {
      id: 3,
      title: "Blockchain revoluciona la cadena de suministro global",
      excerpt:
        "Grandes corporaciones adoptan tecnología blockchain para garantizar transparencia y trazabilidad en sus productos.",
      verificationScore: 92,
      category: "Tecnología",
      readTime: "6 min",
      views: "13.5K",
      trend: "rising",
      image: "/blockchain-supply-chain.png",
      publishedAt: "Hace 5 horas",
      source: "Fuente Verificada",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-purple-50">
      {/* Header Section */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Cpu className="h-6 w-6 text-purple-600" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900">Tecnología</h1>
          </div>
          <p className="text-lg text-slate-600 max-w-3xl">
            Las últimas innovaciones tecnológicas verificadas. Inteligencia artificial, blockchain, energías renovables
            y avances que transforman nuestro futuro.
          </p>

          {/* Stats */}
          <div className="flex items-center gap-6 mt-6">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span className="text-sm font-medium text-slate-700">1,543 noticias verificadas</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-600" />
              <span className="text-sm font-medium text-slate-700">156 validadores activos</span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-orange-600" />
              <span className="text-sm font-medium text-slate-700">Tendencia: IA en auge</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-wrap gap-3">
          <Button variant="default" size="sm">
            Todas
          </Button>
          <Button variant="outline" size="sm">
            IA
          </Button>
          <Button variant="outline" size="sm">
            Blockchain
          </Button>
          <Button variant="outline" size="sm">
            Energía
          </Button>
          <Button variant="outline" size="sm">
            Startups
          </Button>
          <Button variant="outline" size="sm">
            Investigación
          </Button>
        </div>
      </div>

      {/* News Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {techNews.map((news) => (
            <Card
              key={news.id}
              className="group hover:shadow-xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm"
            >
              <div className="relative overflow-hidden rounded-t-lg">
                <img
                  src={news.image || "/placeholder.svg"}
                  alt={news.title}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 left-3 flex gap-2">
                  <Badge variant="secondary" className="bg-purple-600 text-white">
                    {news.category}
                  </Badge>
                  {news.trend === "trending" && (
                    <Badge variant="secondary" className="bg-red-500 text-white">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      Tendencia
                    </Badge>
                  )}
                </div>
                <div className="absolute top-3 right-3">
                  <div className="flex items-center gap-1 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                    <Shield className="h-3 w-3" />
                    {news.verificationScore}%
                  </div>
                </div>
              </div>

              <CardHeader className="pb-3">
                <CardTitle className="text-lg leading-tight group-hover:text-purple-600 transition-colors">
                  {news.title}
                </CardTitle>
              </CardHeader>

              <CardContent className="pt-0">
                <p className="text-slate-600 text-sm mb-4 line-clamp-3">{news.excerpt}</p>

                <div className="flex items-center justify-between text-xs text-slate-500 mb-4">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {news.readTime}
                    </span>
                    <span className="flex items-center gap-1">
                      <Eye className="h-3 w-3" />
                      {news.views}
                    </span>
                  </div>
                  <span>{news.publishedAt}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-purple-600">{news.source}</span>
                  <Button size="sm" variant="outline" className="hover:bg-purple-50 bg-transparent">
                    Leer más
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Load More */}
        <div className="text-center mt-12">
          <Button size="lg" variant="outline" className="px-8 bg-transparent">
            Cargar más noticias
          </Button>
        </div>
      </div>
    </div>
  )
}
