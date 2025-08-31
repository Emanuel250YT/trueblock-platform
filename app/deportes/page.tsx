import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Shield, CheckCircle, Clock, TrendingUp, Users, Eye, Trophy } from "lucide-react"

export default function DeportesPage() {
  const sportsNews = [
    {
      id: 1,
      title: "Mundial de Fútbol 2024: Selección nacional avanza a cuartos de final",
      excerpt:
        "Con una victoria 2-1 sobre el equipo rival, la selección asegura su lugar en la siguiente ronda del campeonato mundial.",
      verificationScore: 99,
      category: "Deportes",
      readTime: "3 min",
      views: "25.4K",
      trend: "trending",
      image: "/football-world-championship.png",
      publishedAt: "Hace 30 min",
      source: "Fuente Verificada",
    },
    {
      id: 2,
      title: "Récord mundial en natación: Nueva marca en los 100 metros libres",
      excerpt:
        "El nadador establece un nuevo récord mundial con un tiempo de 46.86 segundos, superando la marca anterior por 0.12 segundos.",
      verificationScore: 97,
      category: "Deportes",
      readTime: "2 min",
      views: "19.8K",
      trend: "hot",
      image: "/swimming-world-record.png",
      publishedAt: "Hace 2 horas",
      source: "Fuente Verificada",
    },
    {
      id: 3,
      title: "Liga Nacional: Clásico del fútbol termina en empate histórico",
      excerpt:
        "El partido más esperado del año culmina 3-3 en un encuentro lleno de emociones y jugadas espectaculares que mantuvo en vilo a los aficionados.",
      verificationScore: 95,
      category: "Deportes",
      readTime: "4 min",
      views: "31.2K",
      trend: "rising",
      image: "/football-classic-match.png",
      publishedAt: "Hace 4 horas",
      source: "Fuente Verificada",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-orange-50">
      {/* Header Section */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Trophy className="h-6 w-6 text-orange-600" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900">Deportes</h1>
          </div>
          <p className="text-lg text-slate-600 max-w-3xl">
            Noticias deportivas verificadas al instante. Resultados, análisis y cobertura completa de todos los deportes
            con información 100% confiable.
          </p>

          {/* Stats */}
          <div className="flex items-center gap-6 mt-6">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span className="text-sm font-medium text-slate-700">2,156 noticias verificadas</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-600" />
              <span className="text-sm font-medium text-slate-700">134 validadores activos</span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-orange-600" />
              <span className="text-sm font-medium text-slate-700">Tendencia: Mundial en curso</span>
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
            Fútbol
          </Button>
          <Button variant="outline" size="sm">
            Baloncesto
          </Button>
          <Button variant="outline" size="sm">
            Tenis
          </Button>
          <Button variant="outline" size="sm">
            Natación
          </Button>
          <Button variant="outline" size="sm">
            Atletismo
          </Button>
        </div>
      </div>

      {/* News Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sportsNews.map((news) => (
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
                  <Badge variant="secondary" className="bg-orange-600 text-white">
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
                <CardTitle className="text-lg leading-tight group-hover:text-orange-600 transition-colors">
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
                  <span className="text-xs font-medium text-orange-600">{news.source}</span>
                  <Button size="sm" variant="outline" className="hover:bg-orange-50 bg-transparent">
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
