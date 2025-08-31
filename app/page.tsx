"use client"

import { MobileHeader } from "@/components/ui/mobile-header"
import { WeatherWidget } from "@/components/ui/weather-widget"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Link } from "@/components/ui/link"
import {
  Calendar,
  Clock,
  ArrowRight,
  Zap,
  Eye,
  MessageCircle,
  Share2,
  Shield,
  CheckCircle,
  TrendingUp,
  Users,
  Lock,
  Bot,
  FileText,
  Network,
  MapPin,
  Thermometer,
  RefreshCw,
} from "lucide-react"
import { motion } from "framer-motion"
import { useEffect, useState } from "react"
import Image from "next/image"
import cn from "classnames"
import { useRouter } from "next/navigation"
import { useWallet } from "@/contexts/wallet-context"
import { useLocation } from "@/contexts/location-context"

const featuredNews = {
  id: 1,
  title: "New economic policy announced by government to boost growth",
  excerpt:
    "The government presents an economic package that includes tax incentives and public investment programs to stimulate the national economy in the coming months.",
  category: "Politics",
  publishedAt: "June 26, 2024",
  readTime: "5 min",
  image: "/government-economic-policy-announcement.png",
  views: 1250,
  comments: 34,
  verificationScore: 98,
}

const sidebarNews = [
  {
    id: 2,
    title: "Technological advances revolutionize the medical industry",
    category: "Technology",
    publishedAt: "2 hours ago",
    image: "/medical-technology-innovation.png",
    verificationScore: 96,
  },
  {
    id: 3,
    title: "World football championship generates expectations",
    category: "Sports",
    publishedAt: "4 hours ago",
    image: "/football-world-championship.png",
    verificationScore: 94,
  },
  {
    id: 4,
    title: "Climate change: new environmental measures",
    category: "Environment",
    publishedAt: "6 hours ago",
    image: "/climate-change-environmental-measures.png",
    verificationScore: 97,
  },
  {
    id: 5,
    title: "Financial markets show positive trend",
    category: "Economy",
    publishedAt: "8 hours ago",
    image: "/financial-markets-positive-trend.png",
    verificationScore: 95,
  },
]

const categories = [
  { name: "All", active: true, count: 156 },
  { name: "Politics", active: false, count: 42 },
  { name: "Economy", active: false, count: 38 },
  { name: "Sports", active: false, count: 29 },
  { name: "Technology", active: false, count: 31 },
  { name: "Health", active: false, count: 16 },
]

const recentNews = [
  {
    id: 6,
    title: "Renewable energy innovation sets new record",
    excerpt: "New solar and wind technologies reach unprecedented efficiency levels.",
    category: "Technology",
    publishedAt: "June 25, 2024",
    image: "/renewable-energy-solar-wind-technology.png",
    verificationScore: 99,
    trending: true,
  },
  {
    id: 7,
    title: "Education reform seeks to improve academic quality",
    excerpt: "The ministry of education presents new guidelines to strengthen the educational system.",
    category: "Education",
    publishedAt: "June 25, 2024",
    image: "/education-reform-academic-quality.png",
    verificationScore: 93,
  },
  {
    id: 8,
    title: "Scientific discovery opens new possibilities",
    excerpt: "Researchers achieve significant advances in the treatment of complex diseases.",
    category: "Science",
    publishedAt: "June 24, 2024",
    image: "/scientific-discovery-medical-research.png",
    verificationScore: 97,
  },
  {
    id: 9,
    title: "Urban infrastructure receives major investment",
    excerpt: "New transportation and connectivity projects will transform major cities.",
    category: "Urban Planning",
    publishedAt: "June 24, 2024",
    image: "/urban-infrastructure-transport-investment.png",
    verificationScore: 91,
  },
  {
    id: 10,
    title: "Tourism sector experiences notable recovery",
    excerpt: "Visitor numbers exceed expectations after implementing new strategies.",
    category: "Tourism",
    publishedAt: "June 23, 2024",
    image: "/tourism-recovery-travel-industry.png",
    verificationScore: 89,
  },
  {
    id: 11,
    title: "Sustainable agriculture boosts local production",
    excerpt: "Innovative techniques allow increased productivity while respecting the environment.",
    category: "Agriculture",
    publishedAt: "June 23, 2024",
    image: "/sustainable-agriculture-local-production.png",
    verificationScore: 95,
  },
]

export default function HomePage() {
  const [mounted, setMounted] = useState(false)
  const router = useRouter()
  const { isConnected, address, connectWallet, disconnectWallet, isLoading: walletLoading } = useWallet()
  const { location, isLoading: locationLoading, refreshLocation } = useLocation()

  useEffect(() => {
    setMounted(true)
  }, [])

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  const navigateToVerified = () => {
    router.push("/verificadas")
  }

  const navigateToAuth = () => {
    if (isConnected) {
      router.push("/perfil")
    } else {
      connectWallet()
    }
  }

  const navigateToContact = () => {
    router.push("/contacto")
  }

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-gray-50">
      <MobileHeader title="TrueBlock - Verified News" />

      <main className="container mx-auto px-4 pt-6 pb-8">
        <div className="md:hidden mb-6">
          <WeatherWidget />
        </div>

        <motion.section
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl shadow-lg overflow-hidden">
            <div className="flex flex-col lg:flex-row">
              <div className="lg:w-2/3 p-6 lg:p-8 text-white">
                <div className="flex flex-wrap items-center gap-2 mb-4">
                  <div className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium">FEATURED</span>
                  </div>
                  <Badge className="bg-green-500 text-white font-semibold px-3 py-1">Economy</Badge>
                  <div className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full flex items-center space-x-1">
                    <CheckCircle className="h-4 w-4 text-green-400" />
                    <span className="text-sm font-bold">95%</span>
                  </div>
                </div>

                <h1 className="text-2xl lg:text-4xl font-bold mb-4 text-balance leading-tight">
                  Financial markets show positive trend
                </h1>

                <p className="text-blue-100 text-base lg:text-lg mb-6 text-pretty leading-relaxed">
                  Major stock indices register sustained growth following the implementation of new economic policies.
                </p>

                <div className="flex flex-wrap items-center gap-3 mb-6 text-sm">
                  <div className="flex items-center space-x-2 text-blue-100">
                    <Clock className="h-4 w-4" />
                    <span>8h ago</span>
                  </div>
                  <div className="flex items-center space-x-2 text-blue-100">
                    <Eye className="h-4 w-4" />
                    <span>2.8K</span>
                  </div>
                  <div className="flex items-center space-x-2 text-blue-100">
                    <MessageCircle className="h-4 w-4" />
                    <span>156</span>
                  </div>
                </div>

                <Button
                  className="bg-white text-blue-600 hover:bg-blue-50 font-semibold px-6 py-3 w-full sm:w-auto"
                  onClick={() => {
                    console.log("[v0] Abriendo noticia destacada")
                  }}
                >
                  Read Full Article
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>

              <div className="lg:w-1/3 relative h-48 lg:h-auto">
                <Image
                  src="/financial-markets-positive-trend.png"
                  alt="Financial markets chart"
                  width={800}
                  height={600}
                  className="w-full h-full object-cover lg:absolute lg:inset-0"
                />
                <div className="absolute inset-0 bg-gradient-to-l from-transparent to-blue-600/20"></div>
              </div>
            </div>
          </div>
        </motion.section>

        <motion.section
          className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 lg:p-6 mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0 gap-6">
            <div className="grid grid-cols-2 lg:flex lg:items-center gap-4 lg:space-x-8">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Calendar className="h-4 w-4 text-blue-600" />
                <span className="font-medium">
                  {locationLoading ? "Loading..." : location?.currentDate || "Saturday, June 26"}
                </span>
              </div>

              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Clock className="h-4 w-4 text-blue-600" />
                <span className="font-medium">{locationLoading ? "--:--" : location?.currentTime || "14:30"}</span>
              </div>

              <div className="hidden lg:flex items-center space-x-4">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <MapPin className="h-4 w-4 text-green-600" />
                  <span className="font-medium">
                    {locationLoading
                      ? "Location..."
                      : `${location?.city}, ${location?.country}` || "Your City"}
                  </span>
                </div>

                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Thermometer className="h-4 w-4 text-orange-600" />
                  <span className="font-medium">
                    {locationLoading ? "--°" : `${location?.temperature}°C` || "22°C"}
                  </span>
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={refreshLocation}
                  className="h-6 w-6 p-0 text-gray-400 hover:text-blue-600"
                >
                  <RefreshCw className="h-3 w-3" />
                </Button>
              </div>

              <div className="flex items-center space-x-2 text-sm">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-green-600 font-medium">Live</span>
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 lg:px-6 py-3 lg:py-4 rounded-xl flex items-center space-x-3 shadow-lg">
              <div className="flex items-center space-x-2">
                <Shield className="h-5 w-5" />
              </div>
              <div className="flex flex-col">
                <span className="font-semibold text-sm">
                  {isConnected ? `Hello! ${address?.slice(0, 6)}...${address?.slice(-4)}` : "Hello! Welcome"}
                </span>
                <span className="text-xs text-blue-100">
                  {isConnected ? "Wallet connected" : "Verified news"}
                </span>
              </div>
              <Button
                size="sm"
                className="bg-white text-blue-600 hover:bg-gray-100 ml-2"
                onClick={navigateToAuth}
                disabled={walletLoading}
              >
                {walletLoading ? "Connecting..." : isConnected ? "Profile" : "Connect"}
              </Button>
            </div>
          </div>
        </motion.section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <motion.div
            className="lg:col-span-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Card className="overflow-hidden hover:shadow-2xl transition-all duration-500 border-0 shadow-xl bg-white">
              <div className="relative group">
                <Image
                  src={featuredNews.image || "/placeholder.svg"}
                  alt={featuredNews.title}
                  width={600}
                  height={400}
                  className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                <div className="absolute top-4 left-4 flex items-center space-x-2">
                  <Badge className="bg-blue-600 text-white font-semibold px-3 py-1.5 text-sm">
                    {featuredNews.category}
                  </Badge>
                  <div className="bg-green-500 text-white px-3 py-1.5 rounded-full text-xs font-bold flex items-center space-x-1">
                    <CheckCircle className="h-3.5 w-3.5" />
                    <span>{featuredNews.verificationScore}% Verified</span>
                  </div>
                </div>

                <div className="absolute bottom-4 right-4 flex items-center space-x-3 text-white text-sm">
                  <div className="flex items-center space-x-1 bg-black/40 px-2 py-1 rounded-full">
                    <Eye className="h-4 w-4" />
                    <span className="font-medium">{featuredNews.views.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center space-x-1 bg-black/40 px-2 py-1 rounded-full">
                    <MessageCircle className="h-4 w-4" />
                    <span className="font-medium">{featuredNews.comments}</span>
                  </div>
                </div>
              </div>

              <CardHeader className="pb-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <Clock className="h-4 w-4" />
                    <span>{featuredNews.publishedAt}</span>
                    <span>•</span>
                    <span>{featuredNews.readTime} read</span>
                  </div>
                  <div className="flex items-center space-x-1 text-sm text-orange-600">
                    <TrendingUp className="h-4 w-4" />
                    <span className="font-medium">Trending</span>
                  </div>
                </div>

                <CardTitle className="text-2xl font-bold text-balance leading-tight hover:text-blue-600 transition-colors cursor-pointer mb-3">
                  {featuredNews.title}
                </CardTitle>
                <CardDescription className="text-base text-pretty leading-relaxed text-gray-600">
                  {featuredNews.excerpt}
                </CardDescription>
              </CardHeader>

              <CardContent>
                <div className="flex items-center justify-between">
                  <Button
                    className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2.5 font-semibold"
                    onClick={() => {
                      console.log("[v0] Abriendo artículo:", featuredNews.id)
                    }}
                  >
                    Read Full Article
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-gray-600 hover:text-blue-600 hover:bg-blue-50"
                      onClick={() => {
                        navigator
                          .share?.({
                            title: featuredNews.title,
                            text: featuredNews.excerpt,
                            url: window.location.href,
                          })
                          .catch(() => {
                            navigator.clipboard.writeText(window.location.href)
                            alert("Link copied to clipboard")
                          })
                      }}
                    >
                      <Share2 className="h-4 w-4 mr-1" />
                      Share
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="mt-8">
              <Card className="overflow-hidden hover:shadow-2xl transition-all duration-500 border-0 shadow-xl bg-white">
                <div className="relative group">
                  <Image
                    src={recentNews[0].image || "/placeholder.svg"}
                    alt={recentNews[0].title}
                    width={600}
                    height={400}
                    className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

                  <div className="absolute top-4 left-4 flex items-center space-x-2">
                    <Badge className="bg-green-600 text-white font-semibold px-3 py-1.5 text-sm">
                      {recentNews[0].category}
                    </Badge>
                    <div className="bg-green-500 text-white px-3 py-1.5 rounded-full text-xs font-bold flex items-center space-x-1">
                      <CheckCircle className="h-3.5 w-3.5" />
                      <span>{recentNews[0].verificationScore}% Verificado</span>
                    </div>
                  </div>

                  <div className="absolute bottom-4 right-4 flex items-center space-x-3 text-white text-sm">
                    <div className="flex items-center space-x-1 bg-black/40 px-2 py-1 rounded-full">
                      <Eye className="h-4 w-4" />
                      <span className="font-medium">1,847</span>
                    </div>
                    <div className="flex items-center space-x-1 bg-black/40 px-2 py-1 rounded-full">
                      <MessageCircle className="h-4 w-4" />
                      <span className="font-medium">28</span>
                    </div>
                  </div>
                </div>

                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <Clock className="h-4 w-4" />
                      <span>{recentNews[0].publishedAt}</span>
                      <span>•</span>
                      <span>4 min lectura</span>
                    </div>
                    <div className="flex items-center space-x-1 text-sm text-orange-600">
                      <TrendingUp className="h-4 w-4" />
                      <span className="font-medium">Trending</span>
                    </div>
                  </div>

                  <CardTitle className="text-2xl font-bold text-balance leading-tight hover:text-blue-600 transition-colors cursor-pointer mb-3">
                    {recentNews[0].title}
                  </CardTitle>
                  <CardDescription className="text-base text-pretty leading-relaxed text-gray-600">
                    {recentNews[0].excerpt}
                  </CardDescription>
                </CardHeader>

                <CardContent>
                  <div className="flex items-center justify-between">
                    <Button
                      className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2.5 font-semibold"
                      onClick={() => {
                        console.log("[v0] Abriendo artículo:", recentNews[0].id)
                      }}
                    >
                      Leer artículo completo
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-gray-600 hover:text-blue-600 hover:bg-blue-50"
                        onClick={() => {
                          navigator
                            .share?.({
                              title: recentNews[0].title,
                              text: recentNews[0].excerpt,
                              url: window.location.href,
                            })
                            .catch(() => {
                              navigator.clipboard.writeText(window.location.href)
                              alert("Enlace copiado al portapapeles")
                            })
                        }}
                      >
                        <Share2 className="h-4 w-4 mr-1" />
                        Share
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </motion.div>

          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Latest News</h2>
              <div className="flex items-center space-x-1 text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">
                <Shield className="h-3 w-3" />
                <span className="font-medium">Verified</span>
              </div>
            </div>

            {sidebarNews.map((news, index) => (
              <motion.div
                key={news.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.4 }}
              >
                <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer border-0 shadow-sm hover:shadow-blue-100 bg-white group">
                  <CardContent className="p-4">
                    <div className="flex space-x-4">
                      <div className="relative flex-shrink-0">
                        <Image
                          src={news.image || "/placeholder.svg"}
                          alt={news.title}
                          width={120}
                          height={80}
                          className="w-28 h-20 object-cover rounded-lg group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                          <CheckCircle className="h-3 w-3 text-white" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-2">
                          <Badge variant="secondary" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                            {news.category}
                          </Badge>
                          <span className="text-xs text-green-600 font-medium">{news.verificationScore}%</span>
                        </div>
                        <h3 className="font-semibold text-sm line-clamp-2 mb-2 text-gray-900 group-hover:text-blue-600 transition-colors">
                          {news.title}
                        </h3>
                        <p className="text-xs text-gray-500 flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {news.publishedAt}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}

            <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-100 shadow-sm">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Shield className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-bold text-blue-900 mb-2">Why TrueBlock?</h3>
                <p className="text-sm text-blue-700 leading-relaxed mb-3">
                  Each news is verified with blockchain technology to guarantee the veracity of information.
                </p>
                <div className="flex items-center justify-center space-x-4 text-xs text-blue-600">
                  <div className="flex items-center space-x-1">
                    <Users className="h-3 w-3" />
                    <span>+50K users</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <CheckCircle className="h-3 w-3" />
                    <span>98% precisión</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <motion.section
          className="mb-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">TrueBlock Validation Process</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Each news goes through our multilayer verification system to ensure maximum veracity
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <motion.div
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 text-center hover:shadow-lg transition-all duration-300"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Bot className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-blue-600">Oráculos IA</h3>
              <p className="text-sm text-gray-600">Análisis automatizado con múltiples modelos de IA independientes</p>
            </motion.div>

            <motion.div
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 text-center hover:shadow-lg transition-all duration-300"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-green-600">Revisión LLM</h3>
              <p className="text-sm text-gray-600">Coherence evaluation and source verification</p>
            </motion.div>

            <motion.div
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 text-center hover:shadow-lg transition-all duration-300"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-purple-600">Community</h3>
              <p className="text-sm text-gray-600">Validation by experts and specialized community</p>
            </motion.div>

            <motion.div
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 text-center hover:shadow-lg transition-all duration-300"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Network className="h-6 w-6 text-orange-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-orange-600">Blockchain</h3>
              <p className="text-sm text-gray-600">Immutable consensus with ZK proofs and total transparency</p>
            </motion.div>
          </div>
        </motion.section>

        <motion.section
          className="mb-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex flex-wrap gap-3 justify-center">
              {categories.map((category) => (
                <Button
                  key={category.name}
                  variant={category.active ? "default" : "outline"}
                  className={cn(
                    "px-6 py-2 font-medium transition-all duration-300",
                    category.active
                      ? "bg-blue-600 text-white shadow-lg"
                      : "border-gray-200 text-gray-600 hover:border-blue-300 hover:text-blue-600 hover:bg-blue-50",
                  )}
                >
                  {category.name}
                  <span className="ml-2 text-xs opacity-75">({category.count})</span>
                </Button>
              ))}
            </div>
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900">More News</h2>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6" onClick={navigateToVerified}>
              See all news
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {recentNews.map((news, index) => (
              <motion.div
                key={news.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                viewport={{ once: true }}
                whileHover={{ y: -8 }}
              >
                <Card className="hover:shadow-2xl transition-all duration-500 cursor-pointer h-full border-0 shadow-lg group bg-white">
                  <div className="relative overflow-hidden">
                    <Image
                      src={news.image || "/placeholder.svg"}
                      alt={news.title}
                      width={300}
                      height={200}
                      className="w-full h-52 object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    <div className="absolute top-4 left-4 flex items-center space-x-2">
                      <Badge className="bg-blue-600 text-white font-semibold px-3 py-1">{news.category}</Badge>
                      {news.trending && (
                        <div className="bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center space-x-1">
                          <TrendingUp className="h-3 w-3" />
                          <span>Trending</span>
                        </div>
                      )}
                    </div>

                    <div className="absolute top-4 right-4 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center space-x-1">
                      <CheckCircle className="h-3 w-3" />
                      <span>{news.verificationScore}%</span>
                    </div>
                  </div>

                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg line-clamp-2 font-bold group-hover:text-blue-600 transition-colors">
                      {news.title}
                    </CardTitle>
                    <CardDescription className="line-clamp-2 text-gray-600 leading-relaxed">
                      {news.excerpt}
                    </CardDescription>
                  </CardHeader>

                  <CardContent>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                          <Shield className="h-3 w-3 text-blue-600" />
                        </div>
                        <span className="font-medium">Fuente Verificada</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="h-3 w-3" />
                        <span>{news.publishedAt}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.section>

        <motion.section
          className="py-16 mt-16"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <Card className="bg-gradient-to-r from-blue-600 to-indigo-600 border-0 text-white shadow-2xl">
            <CardHeader className="text-center pb-8">
              <div className="flex items-center justify-center mb-6">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                  <Shield className="h-8 w-8 text-white" />
                </div>
              </div>
              <CardTitle className="text-4xl font-bold mb-4">Join TrueBlock</CardTitle>
              <CardDescription className="text-white/90 text-xl max-w-2xl mx-auto leading-relaxed">
                Receive 100% verified blockchain news using your preferred pseudonym. Keep your privacy
                while accessing reliable and transparent information.
              </CardDescription>
            </CardHeader>
            <CardContent className="px-8 pb-8">
              <div className="max-w-2xl mx-auto">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 mb-6">
                  <div className="space-y-4 mb-6">
                    <div>
                      <input
                        type="email"
                        placeholder="Tu correo electrónico"
                        className="w-full px-6 py-4 bg-white border-0 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-300 text-gray-900 text-lg font-medium shadow-lg placeholder-gray-500"
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        placeholder="Elige tu seudónimo (opcional)"
                        className="w-full px-6 py-4 bg-white border-0 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-300 text-gray-900 text-lg font-medium shadow-lg placeholder-gray-500"
                      />
                    </div>
                    <div className="pt-2">
                      <Button
                        className="w-full bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 font-bold text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                        onClick={() => {
                          console.log("[v0] Procesando suscripción")
                          alert("Thanks for subscribing! You will receive verified news in your email.")
                        }}
                      >
                        <Zap className="h-5 w-5 mr-2" />
                        Suscribirse Gratis*
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                  <div className="flex items-center space-x-3 bg-white/15 backdrop-blur-sm px-4 py-3 rounded-lg">
                    <CheckCircle className="h-5 w-5 text-green-300 flex-shrink-0" />
                    <span className="text-sm font-medium text-white">Blockchain verified news</span>
                  </div>
                  <div className="flex items-center space-x-3 bg-white/15 backdrop-blur-sm px-4 py-3 rounded-lg">
                    <Lock className="h-5 w-5 text-green-300 flex-shrink-0" />
                    <span className="text-sm font-medium text-white">Seudónimos para privacidad total</span>
                  </div>
                  <div className="flex items-center space-x-3 bg-white/15 backdrop-blur-sm px-4 py-3 rounded-lg">
                    <Shield className="h-5 w-5 text-green-300 flex-shrink-0" />
                    <span className="text-sm font-medium text-white">Sin spam ni publicidad invasiva</span>
                  </div>
                  <div className="flex items-center space-x-3 bg-white/15 backdrop-blur-sm px-4 py-3 rounded-lg">
                    <Zap className="h-5 w-5 text-green-300 flex-shrink-0" />
                    <span className="text-sm font-medium text-white">Cancela cuando quieras</span>
                  </div>
                </div>

                <div className="bg-white/15 backdrop-blur-sm rounded-xl p-6 text-center">
                  <p className="text-white/95 text-sm leading-relaxed">
                    <span className="font-bold text-white">*Free subscription</span> for individual users.
                    Includes full access to verified news feed and basic platform features.
                  </p>
                  <p className="text-white/80 text-xs mt-2">
                    Para uso corporativo, acceso a APIs y funciones avanzadas, consulta nuestros
                    <Link href="/contacto" className="underline hover:text-white transition-colors ml-1 text-white/90">
                      planes empresariales
                    </Link>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.section>
      </main>
    </div>
  )
}
