import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Shield, CheckCircle, Clock, TrendingUp, Users, Eye, DollarSign } from "lucide-react"

export default function EconomiaPage() {
  const economicNews = [
    {
      id: 1,
      title: "Mercados financieros muestran tendencia positiva tras anuncios del banco central",
      excerpt:
        "Los índices bursátiles registran un crecimiento del 3.2% después de las declaraciones sobre política monetaria y tasas de interés.",
      verificationScore: 96,
      category: "Economía",
      readTime: "4 min",
      views: "18.7K",
      trend: "trending",
      image: "/financial-markets-positive-trend.png",
      publishedAt: "Hace 1 hora",
      source: "Fuente Verificada",
    },
    {
      id: 2,
      title: "Inflación anual se mantiene en 2.8% según últimos datos oficiales",
      excerpt:
        "El índice de precios al consumidor muestra estabilidad, cumpliendo con las proyecciones del gobierno para el trimestre actual.",
      verificationScore: 98,
      category: "Economía",
      readTime: "3 min",
      views: "14.2K",
      trend: "hot",
      image: "/inflation-data-analysis.png",
      publishedAt: "Hace 3 horas",
      source: "Fuente Verificada",
    },
    {
      id: 3,
      title: "Sector tecnológico lidera crecimiento económico con 15% de expansión",
      excerpt:
        "Las empresas de tecnología impulsan el PIB nacional, generando más de 200,000 empleos directos en el último año.",
      verificationScore: 93,
      category: "Economía",
      readTime: "5 min",
      views: "11.8K",
      trend: "rising",
      image: "/tech-sector-growth.png",
      publishedAt: "Hace 5 horas",
      source: "Fuente Verificada",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-green-50">
      {/* Header Section */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-green-100 rounded-lg">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900">Economía</h1>
          </div>
          <p className="text-lg text-slate-600 max-w-3xl">
            Información económica verificada y confiable. Análisis de mercados, indicadores financieros y noticias que
            impactan la economía nacional e internacional.
          </p>

          {/* Stats */}
          <div className="flex items-center gap-6 mt-6">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span className="text-sm font-medium text-slate-700">892 noticias verificadas</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-600" />
              <span className="text-sm font-medium text-slate-700">67 validadores activos</span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-orange-600" />
              <span className="text-sm font-medium text-slate-700">Tendencia: Mercados alcistas</span>
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
            Mercados
          </Button>
          <Button variant="outline" size="sm">
            Banca
          </Button>
          <Button variant="outline" size="sm">
            Criptomonedas
          </Button>
          <Button variant="outline" size="sm">
            Empresas
          </Button>
          <Button variant="outline" size="sm">
            Internacional
          </Button>
        </div>
      </div>

      {/* News Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {economicNews.map((news) => (
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
                  <Badge variant="secondary" className="bg-green-600 text-white">
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
                <CardTitle className="text-lg leading-tight group-hover:text-green-600 transition-colors">
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
                  <span className="text-xs font-medium text-green-600">{news.source}</span>
                  <Button size="sm" variant="outline" className="hover:bg-green-50 bg-transparent">
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
