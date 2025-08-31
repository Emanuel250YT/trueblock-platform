"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { motion } from "framer-motion"
import { ArrowLeft, Share2, Heart, MessageCircle, DollarSign, Shield, Clock, Eye, TrendingUp } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useWallet } from "@/contexts/wallet-context"
import { useLocation } from "@/contexts/location-context"
import { apiClient } from "@/lib/api"

interface Article {
  id: string
  slug: string
  title: string
  content: string
  excerpt: string
  image: string
  category: string
  author: {
    name: string
    address: string
    avatar: string
    isVerified: boolean
    role: "Periodista" | "Verificador" | "Oráculo" | "Usuario"
    reputation: number
  }
  publishedAt: string
  readTime: number
  views: number
  likes: number
  comments: number
  verificationScore: number
  isVerified: boolean
  donations: {
    total: number
    count: number
  }
  tags: string[]
}

// Mock data - en producción vendría de una API
const mockArticle: Article = {
  id: "1",
  slug: "nueva-politica-economica-gobierno",
  title: "Nueva política económica anunciada por el gobierno para impulsar el crecimiento",
  content: `
    <p>El gobierno presenta un paquete de medidas económicas que incluye incentivos fiscales y programas de inversión pública para estimular la economía nacional en los próximos meses.</p>
    
    <h2>Principales medidas anunciadas</h2>
    <p>Entre las medidas más destacadas se encuentran:</p>
    <ul>
      <li>Reducción del impuesto a las empresas del 25% al 20%</li>
      <li>Programa de inversión en infraestructura por $50 mil millones</li>
      <li>Incentivos para la contratación de jóvenes profesionales</li>
      <li>Apoyo financiero a pequeñas y medianas empresas</li>
    </ul>
    
    <h2>Impacto esperado</h2>
    <p>Los analistas económicos estiman que estas medidas podrían generar un crecimiento del PIB del 3.5% en el próximo año, creando aproximadamente 200,000 nuevos empleos.</p>
    
    <h2>Reacciones del sector privado</h2>
    <p>Las principales cámaras empresariales han recibido positivamente el anuncio, destacando especialmente los incentivos fiscales y el apoyo a las PYMES.</p>
  `,
  excerpt:
    "El gobierno presenta un paquete de medidas económicas que incluye incentivos fiscales y programas de inversión pública para estimular la economía nacional.",
  image: "/government-economic-policy-announcement.png",
  category: "Política",
  author: {
    name: "María González",
    address: "0x1234...5678",
    avatar: "/professional-journalist-woman.png",
    isVerified: true,
    role: "Periodista",
    reputation: 95,
  },
  publishedAt: "2024-01-15T10:30:00Z",
  readTime: 5,
  views: 1250,
  likes: 89,
  comments: 34,
  verificationScore: 98,
  isVerified: true,
  donations: {
    total: 2.5,
    count: 12,
  },
  tags: ["economía", "política fiscal", "crecimiento", "empleo"],
}

export default function ArticlePage() {
  const params = useParams()
  const { isConnected } = useWallet()
  const { location } = useLocation()
  const [article, setArticle] = useState<Article | null>(null)
  const [isLiked, setIsLiked] = useState(false)
  const [showDonationModal, setShowDonationModal] = useState(false)
  const [donationAmount, setDonationAmount] = useState("")

  useEffect(() => {
    const loadArticle = async () => {
      try {
        console.log("[v0] Loading article from API:", params.slug)

        // Usar el endpoint de noticias para obtener el artículo
        const response = await apiClient.news.getNewsDetail(params.slug as string)

        if (response.success && response.data) {
          // Mapear datos de la API al formato del componente
          const articleData = {
            ...mockArticle,
            id: response.data.contentHash,
            slug: params.slug as string,
            title: response.data.title,
            content: mockArticle.content, // Usar contenido mock ya que la API solo tiene summary
            excerpt: response.data.summary,
            category: response.data.category,
            verificationScore: response.data.score,
            isVerified: response.data.status === "verified",
            publishedAt: response.data.timestamp,
          }
          setArticle(articleData)
        } else {
          // Fallback a datos mock si no se encuentra
          setArticle(mockArticle)
        }
      } catch (error) {
        console.error("[v0] Error loading article:", error)
        // Fallback a datos mock en caso de error
        setArticle(mockArticle)
      }
    }

    if (params.slug) {
      loadArticle()
    }
  }, [params.slug])

  const handleLike = () => {
    if (!isConnected) return
    setIsLiked(!isLiked)
  }

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: article?.title,
        text: article?.excerpt,
        url: window.location.href,
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
    }
  }

  const handleDonate = () => {
    if (!isConnected) return
    setShowDonationModal(true)
  }

  if (!article) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header con navegación */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 text-gray-600 hover:text-blue-600">
              <ArrowLeft className="h-5 w-5" />
              <span>Volver</span>
            </Link>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handleShare}>
                <Share2 className="h-4 w-4 mr-2" />
                Compartir
              </Button>
              <Button variant={isLiked ? "default" : "outline"} size="sm" onClick={handleLike} disabled={!isConnected}>
                <Heart className={`h-4 w-4 mr-2 ${isLiked ? "fill-current" : ""}`} />
                {article.likes + (isLiked ? 1 : 0)}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <motion.article
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-sm overflow-hidden"
        >
          {/* Header del artículo */}
          <div className="p-6 pb-4">
            <div className="flex items-center gap-2 mb-4">
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                {article.category}
              </Badge>
              {article.isVerified && (
                <Badge variant="default" className="bg-green-100 text-green-800">
                  <Shield className="h-3 w-3 mr-1" />
                  {article.verificationScore}% Verificado
                </Badge>
              )}
            </div>

            <h1 className="text-3xl font-bold text-gray-900 mb-4 text-balance">{article.title}</h1>

            <div className="flex items-center justify-between text-sm text-gray-500 mb-6">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {article.readTime} min lectura
                </div>
                <div className="flex items-center gap-1">
                  <Eye className="h-4 w-4" />
                  {article.views.toLocaleString()} vistas
                </div>
                <div className="flex items-center gap-1">
                  <TrendingUp className="h-4 w-4" />
                  Tendencia
                </div>
              </div>
              <time dateTime={article.publishedAt}>
                {new Date(article.publishedAt).toLocaleDateString("es-ES", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </time>
            </div>

            {/* Información del autor */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg mb-6">
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={article.author.avatar || "/placeholder.svg"} />
                  <AvatarFallback>{article.author.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/perfil/${article.author.address}`}
                      className="font-semibold text-gray-900 hover:text-blue-600"
                    >
                      {article.author.name}
                    </Link>
                    {article.author.isVerified && <Shield className="h-4 w-4 text-green-600" />}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <span>{article.author.role}</span>
                    <span>•</span>
                    <span>{article.author.reputation}% reputación</span>
                  </div>
                </div>
              </div>
              <Button
                onClick={handleDonate}
                disabled={!isConnected}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                <DollarSign className="h-4 w-4 mr-2" />
                Donar
              </Button>
            </div>
          </div>

          {/* Imagen principal */}
          <div className="relative h-96 mb-6">
            <Image src={article.image || "/placeholder.svg"} alt={article.title} fill className="object-cover" />
          </div>

          {/* Contenido del artículo */}
          <div className="p-6">
            <div className="prose prose-lg max-w-none" dangerouslySetInnerHTML={{ __html: article.content }} />

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mt-8 pt-6 border-t">
              {article.tags.map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs">
                  #{tag}
                </Badge>
              ))}
            </div>
          </div>
        </motion.article>

        {/* Sección de donaciones */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-green-600" />
              Apoya al autor
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-2xl font-bold text-green-600">{article.donations.total} ETH</p>
                <p className="text-sm text-gray-500">recaudados de {article.donations.count} donadores</p>
              </div>
              <Button
                onClick={handleDonate}
                disabled={!isConnected}
                size="lg"
                className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
              >
                <Heart className="h-4 w-4 mr-2" />
                Donar ahora
              </Button>
            </div>
            <p className="text-sm text-gray-600">
              Las donaciones van directamente al autor para apoyar el periodismo independiente y verificado.
            </p>
          </CardContent>
        </Card>

        {/* Sección de comentarios */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5" />
              Comentarios ({article.comments})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-gray-500">
              <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Los comentarios estarán disponibles próximamente</p>
              <p className="text-sm">Conecta tu wallet para participar en la discusión</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Modal de donación */}
      {showDonationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg p-6 max-w-md w-full"
          >
            <h3 className="text-xl font-bold mb-4">Donar al autor</h3>
            <p className="text-gray-600 mb-4">Apoya a {article.author.name} por su excelente trabajo periodístico</p>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Cantidad (ETH)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  value={donationAmount}
                  onChange={(e) => setDonationAmount(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0.1"
                />
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setShowDonationModal(false)} className="flex-1">
                  Cancelar
                </Button>
                <Button
                  onClick={() => {
                    // Aquí iría la lógica de donación
                    setShowDonationModal(false)
                    setDonationAmount("")
                  }}
                  className="flex-1 bg-gradient-to-r from-green-600 to-blue-600"
                >
                  Donar
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}
