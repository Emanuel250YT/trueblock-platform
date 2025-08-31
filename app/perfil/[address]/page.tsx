"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { motion } from "framer-motion"
import {
  Shield,
  Star,
  TrendingUp,
  Calendar,
  MapPin,
  Twitter,
  Globe,
  Award,
  Users,
  FileText,
  User,
  Trophy,
  Coins,
  Activity,
  CheckCircle,
  XCircle,
  Clock,
  Target,
  Edit,
  Copy
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useWallet } from "@/contexts/wallet-context"
import { trueBlockAPI } from '@/lib/trueblock-api'

interface UserProfile {
  address: string
  name: string
  avatar?: string
  bio: string
  role: "Periodista" | "Validador" | "Oracle" | "Lector"
  isVerified: boolean
  reputation: number
  joinedAt: string
  location: string
  website?: string
  twitter?: string
  totalValidations: number
  successRate: number
  totalStaked: string
  rewards: string
  isOracle: boolean
  oracleSpecialization?: string
  category: string
  joinDate: string
  badges: Array<{
    id: string
    name: string
    description: string
    icon: string
    earnedAt: string
  }>
  recentActivity: Array<{
    type: 'validation' | 'staking' | 'oracle' | 'reward'
    content: string
    timestamp: string
  }>
  stats: {
    articlesPublished: number
    verificationsCompleted: number
    totalDonationsReceived: string
    followers: number
    following: number
  }
  recentArticles: Array<{
    id: string
    title: string
    excerpt: string
    image?: string
    category: string
    publishedAt: string
    verificationScore: number
  }>
}

// Mock data
const mockProfile: UserProfile = {
  address: "0x123...456",
  name: "Ana García",
  avatar: "/placeholder-user.jpg",
  bio: "Periodista especializada en tecnología blockchain y validadora activa en la red TrueBlock. Comprometida con la veracidad y transparencia informativa.",
  role: "Periodista",
  isVerified: true,
  reputation: 85,
  joinedAt: "2023-03-15T10:00:00Z",
  joinDate: "2023-03-15T10:00:00Z",
  location: "Madrid, España",
  website: "https://anagarcia.com",
  twitter: "@ana_garcia_tech",
  totalValidations: 145,
  successRate: 92,
  totalStaked: "5.8 ETH",
  rewards: "0.75 ETH",
  isOracle: false,
  category: "Tecnología",
  stats: {
    articlesPublished: 42,
    verificationsCompleted: 156,
    totalDonationsReceived: "15.7 ETH",
    followers: 1245,
    following: 89,
  },
  recentActivity: [
    { type: 'validation', content: 'Validó noticia sobre economía', timestamp: new Date().toISOString() },
    { type: 'staking', content: 'Aumentó stake en 2.5 ETH', timestamp: new Date(Date.now() - 86400000).toISOString() },
    { type: 'reward', content: 'Recibió recompensa de validación', timestamp: new Date(Date.now() - 172800000).toISOString() },
  ],
  badges: [
    {
      id: "1",
      name: "Verificador Experto",
      description: "Más de 100 verificaciones exitosas",
      icon: "🎯",
      earnedAt: "2023-06-15T10:00:00Z",
    },
    {
      id: "2",
      name: "Escritor Prolífico",
      description: "Más de 50 artículos publicados",
      icon: "📝",
      earnedAt: "2023-08-20T14:30:00Z",
    },
  ],
  recentArticles: [
    {
      id: "1",
      title: "El futuro de la verificación de noticias con blockchain",
      excerpt: "Una mirada profunda a cómo la tecnología blockchain está revolucionando la manera en que verificamos la información...",
      image: "/tech-sector-growth.png",
      category: "Tecnología",
      publishedAt: "2024-01-15T10:00:00Z",
      verificationScore: 95,
    },
    {
      id: "2",
      title: "Impacto económico de las criptomonedas en 2024",
      excerpt: "Análisis del crecimiento del sector cripto y su influencia en los mercados tradicionales...",
      image: "/financial-market.png",
      category: "Economía",
      publishedAt: "2024-01-10T15:30:00Z",
      verificationScore: 88,
    },
  ],
}

export default function ProfilePage() {
  const params = useParams()
  const address = params.address as string
  const { isConnected, address: currentUserAddress } = useWallet()

  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState('overview')
  const [isFollowing, setIsFollowing] = useState(false)

  const isOwnProfile = currentUserAddress === address

  useEffect(() => {
    loadProfileData()
  }, [address])

  const loadProfileData = async () => {
    setLoading(true)
    setError(null)

    try {
      // Obtener datos de staking
      const stakingResponse = await trueBlockAPI.getStakingStatus(address)
      const stakingData = stakingResponse.success ? stakingResponse.data : null

      // Obtener datos de oráculo si aplica
      let oracleData = null
      try {
        const oracleResponse = await trueBlockAPI.getOracleStats(address)
        oracleData = oracleResponse.success ? oracleResponse.data : null
      } catch (err) {
        // Usuario no es oráculo
      }

      // Combinar datos reales con mock data
      const combinedProfile: UserProfile = {
        address,
        name: "Usuario TrueBlock",
        avatar: "/professional-journalist-woman.png",
        bio: "Validador activo en la red TrueBlock",
        role: oracleData ? "Oracle" : stakingData?.validatorCategory === 'journalist' ? "Periodista" : "Validador",
        isVerified: true,
        reputation: stakingData?.reputation || oracleData?.reputation || 500,
        totalValidations: oracleData?.totalValidations || 45,
        successRate: oracleData?.accuracy || 92.5,
        totalStaked: stakingData?.totalStaked || '0 ETH',
        category: stakingData?.validatorCategory || 'community',
        rewards: stakingData?.availableRewards || '0 ETH',
        joinDate: '2024-01-15',
        isOracle: !!oracleData,
        oracleSpecialization: oracleData?.specialization,
        joinedAt: '2024-01-15T00:00:00Z',
        location: 'Global',
        stats: {
          articlesPublished: 15,
          verificationsCompleted: oracleData?.totalValidations || 45,
          totalDonationsReceived: "5.7 ETH",
          followers: 234,
          following: 89,
        },
        badges: [
          {
            id: '1',
            name: 'Validador Activo',
            description: 'Ha completado más de 10 validaciones',
            icon: '🏆',
            earnedAt: '2024-02-01'
          }
        ],
        recentActivity: [
          { type: 'validation', content: 'Validó noticia sobre economía', timestamp: new Date().toISOString() },
          { type: 'staking', content: 'Aumentó stake en 2.5 ETH', timestamp: new Date(Date.now() - 86400000).toISOString() },
          { type: 'reward', content: 'Recibió 0.05 ETH de recompensa', timestamp: new Date(Date.now() - 172800000).toISOString() }
        ],
        recentArticles: []
      }

      setProfile(combinedProfile)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar perfil')
    } finally {
      setLoading(false)
    }
  }

  const handleFollow = () => {
    if (!isConnected) return
    setIsFollowing(!isFollowing)
  }

  const copyAddress = () => {
    navigator.clipboard.writeText(address)
    alert('Dirección copiada al portapapeles')
  }

  const getReputationLevel = (reputation: number) => {
    if (reputation >= 900) return { level: 'Elite', color: 'text-purple-600', bg: 'bg-purple-100' }
    if (reputation >= 700) return { level: 'Expert', color: 'text-blue-600', bg: 'bg-blue-100' }
    if (reputation >= 500) return { level: 'Advanced', color: 'text-green-600', bg: 'bg-green-100' }
    if (reputation >= 300) return { level: 'Intermediate', color: 'text-yellow-600', bg: 'bg-yellow-100' }
    return { level: 'Beginner', color: 'text-gray-600', bg: 'bg-gray-100' }
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'validation': return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'staking': return <Coins className="w-4 h-4 text-blue-500" />
      case 'oracle': return <Shield className="w-4 h-4 text-purple-500" />
      case 'reward': return <Award className="w-4 h-4 text-yellow-500" />
      default: return <Activity className="w-4 h-4 text-gray-500" />
    }
  }

  const getRoleColor = (role?: string) => {
    switch (role) {
      case "Periodista":
        return "bg-blue-100 text-blue-800"
      case "Verificador":
        return "bg-green-100 text-green-800"
      case "Oráculo":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getRoleIcon = (role?: string) => {
    switch (role) {
      case "Periodista":
        return <FileText className="h-4 w-4" />
      case "Verificador":
        return <Shield className="h-4 w-4" />
      case "Oráculo":
        return <Award className="h-4 w-4" />
      default:
        return <Users className="h-4 w-4" />
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <Activity className="w-8 h-8 animate-spin mx-auto mb-4" />
              <p>Cargando perfil...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <Alert variant="destructive">
            <XCircle className="w-4 h-4" />
            <AlertDescription>
              Error al cargar el perfil: {error || 'Perfil no encontrado'}
            </AlertDescription>
          </Alert>
        </div>
      </div>
    )
  }

  const reputationLevel = getReputationLevel(profile.reputation)

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header del perfil */}
        <div className="mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <User className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold flex items-center gap-2">
                      {profile.name || 'Validador TrueBlock'}
                      {profile.isOracle && <Shield className="w-5 h-5 text-blue-600" />}
                    </h1>
                    <div className="flex items-center gap-2 mt-1">
                      <code className="bg-gray-100 px-2 py-1 rounded text-sm">
                        {address.slice(0, 6)}...{address.slice(-4)}
                      </code>
                      <Button variant="ghost" size="sm" onClick={copyAddress}>
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge className={getRoleColor(profile.role)}>
                        {getRoleIcon(profile.role)}
                        <span className="ml-1">{profile.role}</span>
                      </Badge>
                      <Badge className={`${reputationLevel.bg} ${reputationLevel.color}`}>
                        {reputationLevel.level}
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-600">
                    Miembro desde {new Date(profile.joinDate).toLocaleDateString()}
                  </div>
                  {!isOwnProfile && (
                    <Button
                      onClick={handleFollow}
                      disabled={!isConnected}
                      variant={isFollowing ? "outline" : "default"}
                      className="mt-2"
                    >
                      {isFollowing ? "Siguiendo" : "Seguir"}
                    </Button>
                  )}
                  {isOwnProfile && (
                    <Link href="/perfil/editar">
                      <Button variant="outline" className="mt-2">
                        <Edit className="w-4 h-4 mr-2" />
                        Editar perfil
                      </Button>
                    </Link>
                  )}
                </div>
              </div>

              {/* Estadísticas principales */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-3 border rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{profile.reputation}</div>
                  <div className="text-sm text-gray-600">Reputación</div>
                </div>
                <div className="text-center p-3 border rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{profile.totalValidations}</div>
                  <div className="text-sm text-gray-600">Validaciones</div>
                </div>
                <div className="text-center p-3 border rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">{profile.successRate}%</div>
                  <div className="text-sm text-gray-600">Tasa de éxito</div>
                </div>
                <div className="text-center p-3 border rounded-lg">
                  <div className="text-2xl font-bold text-yellow-600">{profile.totalStaked}</div>
                  <div className="text-sm text-gray-600">Total en Stake</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs del perfil */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Resumen</TabsTrigger>
            <TabsTrigger value="validations">Validaciones</TabsTrigger>
            <TabsTrigger value="staking">Staking</TabsTrigger>
            <TabsTrigger value="activity">Actividad</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Progreso de reputación */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Progreso de Reputación
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm">Reputación actual</span>
                        <span className="text-sm font-medium">{profile.reputation}/1000</span>
                      </div>
                      <Progress value={(profile.reputation / 1000) * 100} className="h-2" />
                    </div>
                    <div className="text-sm text-gray-600">
                      {1000 - profile.reputation} puntos para el siguiente nivel
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Información del validador */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5" />
                    Información del Validador
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Categoría:</span>
                      <Badge variant="outline">{profile.category}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Estado:</span>
                      <Badge className="bg-green-100 text-green-800">Activo</Badge>
                    </div>
                    {profile.isOracle && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Especialización:</span>
                        <Badge className="bg-blue-100 text-blue-800">{profile.oracleSpecialization}</Badge>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-gray-600">Recompensas disponibles:</span>
                      <span className="font-medium">{profile.rewards}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Logros */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="w-5 h-5" />
                  Logros
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {profile.badges.map((badge) => (
                    <div key={badge.id} className="text-center p-3 border rounded-lg">
                      <div className="text-2xl mb-2">{badge.icon}</div>
                      <div className="font-medium">{badge.name}</div>
                      <div className="text-sm text-gray-600">{badge.description}</div>
                    </div>
                  ))}
                  <div className="text-center p-3 border rounded-lg opacity-50">
                    <Trophy className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <div className="font-medium">Top Validador</div>
                    <div className="text-sm text-gray-600">100 validaciones</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="validations" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Historial de Validaciones</CardTitle>
                <CardDescription>
                  Últimas validaciones realizadas por este usuario
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <div>
                          <div className="font-medium">Noticia sobre tecnología blockchain</div>
                          <div className="text-sm text-gray-600">Hace {i + 1} días</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge className="bg-green-100 text-green-800">Correcto</Badge>
                        <div className="text-sm text-gray-600 mt-1">+0.05 ETH</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="staking" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Estado del Stake</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total en stake:</span>
                      <span className="font-medium">{profile.totalStaked}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Recompensas pendientes:</span>
                      <span className="font-medium">{profile.rewards}</span>
                    </div>
                    {isOwnProfile && (
                      <Button className="w-full">
                        Reclamar Recompensas
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>

              {isOwnProfile && (
                <Card>
                  <CardHeader>
                    <CardTitle>Gestión de Stake</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <Button className="w-full" variant="outline">
                        Aumentar Stake
                      </Button>
                      <Button className="w-full" variant="outline">
                        Retirar Stake
                      </Button>
                      <div className="text-sm text-gray-600">
                        Período de enfriamiento: 7 días para retiro
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="activity" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Actividad Reciente</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {profile.recentActivity.map((activity, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 border rounded-lg">
                      {getActivityIcon(activity.type)}
                      <div className="flex-1">
                        <div className="font-medium">{activity.content}</div>
                        <div className="text-sm text-gray-600">
                          {new Date(activity.timestamp).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
