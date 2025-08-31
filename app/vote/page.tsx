"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Slider } from "@/components/ui/slider"
import { useToast } from "@/hooks/use-toast"
import {
  Search,
  Vote,
  Eye,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  TrendingUp,
  Users,
  FileText,
  Hash,
  ChevronRight,
  Award,
  Zap,
  Shield,
} from "lucide-react"
import { useWallet } from "@/contexts/wallet-context"

interface ValidationItem {
  id: string
  hash: string
  title: string
  summary: string
  source: string
  category: string
  submittedAt: string
  submittedBy: string
  status: "pending" | "in_review" | "completed"
  currentVotes: {
    true: number
    false: number
    uncertain: number
  }
  totalVoters: number
  timeRemaining: string
  rewardPool: number
  confidence: number
  evidence: string[]
  priority: "high" | "medium" | "low"
}

const mockValidations: ValidationItem[] = [
  {
    id: "val_001",
    hash: "0x1a2b3c4d5e6f7890abcdef1234567890abcdef12",
    title: "Nueva ley de ciberseguridad aprobada por el congreso con 78% de votos",
    summary: "El congreso nacional aprueba nueva legislación sobre ciberseguridad empresarial con amplio consenso político tras 6 meses de debate.",
    source: "Diario Oficial del Congreso",
    category: "Política",
    submittedAt: "Hace 2 horas",
    submittedBy: "0x9876543210987654321098765432109876543210",
    status: "pending",
    currentVotes: { true: 45, false: 12, uncertain: 8 },
    totalVoters: 65,
    timeRemaining: "22 horas",
    rewardPool: 2500,
    confidence: 85,
    evidence: [
      "Acta oficial del congreso",
      "Transmisión en vivo de la sesión",
      "Declaraciones de prensa oficiales"
    ],
    priority: "high"
  },
  {
    id: "val_002",
    hash: "0x2b3c4d5e6f7890abcdef1234567890abcdef1234",
    title: "Empresa tecnológica anuncia inversión de $500M en desarrollo de IA",
    summary: "TechCorp revela planes de inversión masiva en inteligencia artificial para los próximos 3 años, enfocándose en IA generativa y aprendizaje automático.",
    source: "Comunicado de prensa oficial",
    category: "Tecnología",
    submittedAt: "Hace 4 horas",
    submittedBy: "0x1234567890123456789012345678901234567890",
    status: "in_review",
    currentVotes: { true: 32, false: 5, uncertain: 3 },
    totalVoters: 40,
    timeRemaining: "18 horas",
    rewardPool: 1800,
    confidence: 92,
    evidence: [
      "Comunicado oficial en sitio web",
      "Conferencia de prensa grabada",
      "Documentos SEC filing"
    ],
    priority: "medium"
  },
  {
    id: "val_003",
    hash: "0x3c4d5e6f7890abcdef1234567890abcdef123456",
    title: "Récord mundial de natación roto en campeonato internacional",
    summary: "Atleta establece nuevo récord mundial en 200m estilo libre con tiempo de 1:42.15, superando el anterior récord por 0.3 segundos.",
    source: "Federación Internacional de Natación",
    category: "Deportes",
    submittedAt: "Hace 6 horas",
    submittedBy: "0x5678901234567890123456789012345678901234",
    status: "pending",
    currentVotes: { true: 28, false: 2, uncertain: 1 },
    totalVoters: 31,
    timeRemaining: "16 horas",
    rewardPool: 1200,
    confidence: 96,
    evidence: [
      "Video oficial de la carrera",
      "Tiempo oficial certificado",
      "Declaraciones de jueces"
    ],
    priority: "low"
  }
]

export default function VotePage() {
  const [activeTab, setActiveTab] = useState("search")
  const [searchHash, setSearchHash] = useState("")
  const [selectedValidation, setSelectedValidation] = useState<ValidationItem | null>(null)
  const [voteChoice, setVoteChoice] = useState<"true" | "false" | "uncertain" | null>(null)
  const [confidence, setConfidence] = useState([75])
  const [evidence, setEvidence] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { isConnected, address } = useWallet()
  const { toast } = useToast()

  const handleSearch = () => {
    if (!searchHash.trim()) {
      toast({
        title: "Hash requerido",
        description: "Por favor ingresa un hash de validación para buscar.",
        variant: "destructive",
      })
      return
    }

    const found = mockValidations.find(v =>
      v.hash.toLowerCase().includes(searchHash.toLowerCase()) ||
      v.id.toLowerCase().includes(searchHash.toLowerCase())
    )

    if (found) {
      setSelectedValidation(found)
      setActiveTab("analysis")
      toast({
        title: "Validación encontrada",
        description: `Se encontró la validación: ${found.title.slice(0, 50)}...`,
      })
    } else {
      toast({
        title: "No encontrado",
        description: "No se encontró ninguna validación con ese hash.",
        variant: "destructive",
      })
    }
  }

  const handleVote = async () => {
    if (!isConnected) {
      toast({
        title: "Wallet requerida",
        description: "Conecta tu wallet para poder votar.",
        variant: "destructive",
      })
      return
    }

    if (!voteChoice) {
      toast({
        title: "Voto requerido",
        description: "Selecciona una opción de voto.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      // Simular envío a la API
      await new Promise(resolve => setTimeout(resolve, 2000))

      toast({
        title: "¡Voto enviado!",
        description: `Tu voto "${voteChoice}" ha sido registrado exitosamente. Recompensa estimada: ${Math.floor(selectedValidation!.rewardPool / 10)} TRU`,
      })

      // Reset form
      setVoteChoice(null)
      setConfidence([75])
      setEvidence("")

    } catch (error) {
      toast({
        title: "Error al votar",
        description: "Hubo un problema al enviar tu voto. Inténtalo de nuevo.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "bg-red-100 text-red-800"
      case "medium": return "bg-yellow-100 text-yellow-800"
      case "low": return "bg-green-100 text-green-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "bg-blue-100 text-blue-800"
      case "in_review": return "bg-orange-100 text-orange-800"
      case "completed": return "bg-green-100 text-green-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-blue-100 rounded-xl">
              <Vote className="h-8 w-8 text-blue-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900">Sistema de Votación</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Participa en la validación de noticias y gana recompensas por contribuir a la veracidad de la información
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <FileText className="h-5 w-5 text-blue-600" />
                <span className="text-2xl font-bold text-gray-900">{mockValidations.length}</span>
              </div>
              <p className="text-sm text-gray-600">Validaciones Activas</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Users className="h-5 w-5 text-green-600" />
                <span className="text-2xl font-bold text-gray-900">
                  {mockValidations.reduce((sum, v) => sum + v.totalVoters, 0)}
                </span>
              </div>
              <p className="text-sm text-gray-600">Votantes Totales</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Award className="h-5 w-5 text-yellow-600" />
                <span className="text-2xl font-bold text-gray-900">
                  {mockValidations.reduce((sum, v) => sum + v.rewardPool, 0)}
                </span>
              </div>
              <p className="text-sm text-gray-600">TRU en Recompensas</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <TrendingUp className="h-5 w-5 text-purple-600" />
                <span className="text-2xl font-bold text-gray-900">
                  {Math.round(mockValidations.reduce((sum, v) => sum + v.confidence, 0) / mockValidations.length)}%
                </span>
              </div>
              <p className="text-sm text-gray-600">Confianza Promedio</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Interface */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-blue-600" />
              Interfaz de Votación
            </CardTitle>
            <CardDescription>
              Busca validaciones por hash, analiza la información y emite tu voto
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="search" className="flex items-center gap-2">
                  <Search className="h-4 w-4" />
                  Buscar
                </TabsTrigger>
                <TabsTrigger value="analysis" className="flex items-center gap-2" disabled={!selectedValidation}>
                  <Eye className="h-4 w-4" />
                  Análisis
                </TabsTrigger>
                <TabsTrigger value="vote" className="flex items-center gap-2" disabled={!selectedValidation}>
                  <Vote className="h-4 w-4" />
                  Votar
                </TabsTrigger>
              </TabsList>

              {/* Search Tab */}
              <TabsContent value="search" className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="search-hash" className="text-base font-semibold">
                      Hash de Validación
                    </Label>
                    <div className="flex gap-4 mt-2">
                      <Input
                        id="search-hash"
                        placeholder="Ingresa el hash de la validación (ej: 0x1a2b3c4d...)"
                        value={searchHash}
                        onChange={(e) => setSearchHash(e.target.value)}
                        className="flex-1"
                      />
                      <Button onClick={handleSearch} className="bg-blue-600 hover:bg-blue-700">
                        <Search className="h-4 w-4 mr-2" />
                        Buscar
                      </Button>
                    </div>
                  </div>

                  {/* Available Validations */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Validaciones Disponibles</h3>
                    <div className="grid gap-4">
                      {mockValidations.map((validation) => (
                        <Card key={validation.id} className="cursor-pointer hover:shadow-md transition-shadow"
                          onClick={() => {
                            setSelectedValidation(validation)
                            setActiveTab("analysis")
                          }}>
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-2">
                                  <Badge className={getPriorityColor(validation.priority)}>
                                    {validation.priority.toUpperCase()}
                                  </Badge>
                                  <Badge className={getStatusColor(validation.status)}>
                                    {validation.status.replace("_", " ").toUpperCase()}
                                  </Badge>
                                  <Badge variant="outline">{validation.category}</Badge>
                                </div>
                                <h4 className="font-semibold text-gray-900 mb-1 line-clamp-2">
                                  {validation.title}
                                </h4>
                                <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                                  {validation.summary}
                                </p>
                                <div className="flex items-center gap-4 text-xs text-gray-500">
                                  <span className="flex items-center gap-1">
                                    <Hash className="h-3 w-3" />
                                    {validation.hash.slice(0, 10)}...
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <Clock className="h-3 w-3" />
                                    {validation.timeRemaining}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <Users className="h-3 w-3" />
                                    {validation.totalVoters} votantes
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <Award className="h-3 w-3" />
                                    {validation.rewardPool} TRU
                                  </span>
                                </div>
                              </div>
                              <ChevronRight className="h-5 w-5 text-gray-400 flex-shrink-0" />
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* Analysis Tab */}
              <TabsContent value="analysis" className="space-y-6">
                {selectedValidation && (
                  <>
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 mb-4">
                        <Badge className={getPriorityColor(selectedValidation.priority)}>
                          {selectedValidation.priority.toUpperCase()}
                        </Badge>
                        <Badge className={getStatusColor(selectedValidation.status)}>
                          {selectedValidation.status.replace("_", " ").toUpperCase()}
                        </Badge>
                        <Badge variant="outline">{selectedValidation.category}</Badge>
                      </div>

                      <h3 className="text-xl font-bold text-gray-900">
                        {selectedValidation.title}
                      </h3>

                      <p className="text-gray-700 leading-relaxed">
                        {selectedValidation.summary}
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Información */}
                        <div className="space-y-4">
                          <h4 className="font-semibold text-gray-900">Información de la Validación</h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-600">Hash:</span>
                              <span className="font-mono text-gray-900">{selectedValidation.hash.slice(0, 20)}...</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Fuente:</span>
                              <span className="text-gray-900">{selectedValidation.source}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Enviado por:</span>
                              <span className="font-mono text-gray-900">{selectedValidation.submittedBy.slice(0, 10)}...</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Tiempo enviado:</span>
                              <span className="text-gray-900">{selectedValidation.submittedAt}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Tiempo restante:</span>
                              <span className="text-gray-900">{selectedValidation.timeRemaining}</span>
                            </div>
                          </div>
                        </div>

                        {/* Votación Actual */}
                        <div className="space-y-4">
                          <h4 className="font-semibold text-gray-900">Estado de Votación</h4>
                          <div className="space-y-3">
                            <div>
                              <div className="flex justify-between items-center mb-1">
                                <span className="text-sm text-green-600 flex items-center gap-1">
                                  <CheckCircle className="h-4 w-4" />
                                  Verdadero ({selectedValidation.currentVotes.true})
                                </span>
                                <span className="text-sm text-gray-600">
                                  {Math.round((selectedValidation.currentVotes.true / selectedValidation.totalVoters) * 100)}%
                                </span>
                              </div>
                              <Progress
                                value={(selectedValidation.currentVotes.true / selectedValidation.totalVoters) * 100}
                                className="h-2 bg-gray-200"
                              />
                            </div>
                            <div>
                              <div className="flex justify-between items-center mb-1">
                                <span className="text-sm text-red-600 flex items-center gap-1">
                                  <XCircle className="h-4 w-4" />
                                  Falso ({selectedValidation.currentVotes.false})
                                </span>
                                <span className="text-sm text-gray-600">
                                  {Math.round((selectedValidation.currentVotes.false / selectedValidation.totalVoters) * 100)}%
                                </span>
                              </div>
                              <Progress
                                value={(selectedValidation.currentVotes.false / selectedValidation.totalVoters) * 100}
                                className="h-2 bg-gray-200"
                              />
                            </div>
                            <div>
                              <div className="flex justify-between items-center mb-1">
                                <span className="text-sm text-yellow-600 flex items-center gap-1">
                                  <AlertCircle className="h-4 w-4" />
                                  Incierto ({selectedValidation.currentVotes.uncertain})
                                </span>
                                <span className="text-sm text-gray-600">
                                  {Math.round((selectedValidation.currentVotes.uncertain / selectedValidation.totalVoters) * 100)}%
                                </span>
                              </div>
                              <Progress
                                value={(selectedValidation.currentVotes.uncertain / selectedValidation.totalVoters) * 100}
                                className="h-2 bg-gray-200"
                              />
                            </div>
                          </div>

                          <div className="flex justify-between pt-4 border-t">
                            <div className="text-center">
                              <div className="text-lg font-bold text-gray-900">{selectedValidation.totalVoters}</div>
                              <div className="text-sm text-gray-600">Votantes</div>
                            </div>
                            <div className="text-center">
                              <div className="text-lg font-bold text-gray-900">{selectedValidation.confidence}%</div>
                              <div className="text-sm text-gray-600">Confianza</div>
                            </div>
                            <div className="text-center">
                              <div className="text-lg font-bold text-gray-900">{selectedValidation.rewardPool}</div>
                              <div className="text-sm text-gray-600">TRU Pool</div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Evidencia */}
                      <div className="space-y-4">
                        <h4 className="font-semibold text-gray-900">Evidencia Disponible</h4>
                        <div className="grid gap-2">
                          {selectedValidation.evidence.map((item, index) => (
                            <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                              <FileText className="h-4 w-4 text-gray-600" />
                              <span className="text-sm text-gray-900">{item}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end pt-6 border-t">
                      <Button
                        onClick={() => setActiveTab("vote")}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        Proceder a Votar
                        <ChevronRight className="h-4 w-4 ml-2" />
                      </Button>
                    </div>
                  </>
                )}
              </TabsContent>

              {/* Vote Tab */}
              <TabsContent value="vote" className="space-y-6">
                {selectedValidation && (
                  <>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <h3 className="font-semibold text-blue-900 mb-2">Votando en:</h3>
                      <p className="text-blue-800 text-sm">{selectedValidation.title}</p>
                    </div>

                    <div className="space-y-6">
                      {/* Opción de Voto */}
                      <div className="space-y-3">
                        <Label className="text-base font-semibold">Tu Voto</Label>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          <Button
                            variant={voteChoice === "true" ? "default" : "outline"}
                            onClick={() => setVoteChoice("true")}
                            className={`p-4 h-auto ${voteChoice === "true" ? "bg-green-600 hover:bg-green-700" : "hover:bg-green-50"}`}
                          >
                            <div className="text-center">
                              <CheckCircle className="h-6 w-6 mx-auto mb-2" />
                              <div className="font-semibold">Verdadero</div>
                              <div className="text-xs opacity-80">La información es exacta</div>
                            </div>
                          </Button>
                          <Button
                            variant={voteChoice === "false" ? "default" : "outline"}
                            onClick={() => setVoteChoice("false")}
                            className={`p-4 h-auto ${voteChoice === "false" ? "bg-red-600 hover:bg-red-700" : "hover:bg-red-50"}`}
                          >
                            <div className="text-center">
                              <XCircle className="h-6 w-6 mx-auto mb-2" />
                              <div className="font-semibold">Falso</div>
                              <div className="text-xs opacity-80">La información es incorrecta</div>
                            </div>
                          </Button>
                          <Button
                            variant={voteChoice === "uncertain" ? "default" : "outline"}
                            onClick={() => setVoteChoice("uncertain")}
                            className={`p-4 h-auto ${voteChoice === "uncertain" ? "bg-yellow-600 hover:bg-yellow-700" : "hover:bg-yellow-50"}`}
                          >
                            <div className="text-center">
                              <AlertCircle className="h-6 w-6 mx-auto mb-2" />
                              <div className="font-semibold">Incierto</div>
                              <div className="text-xs opacity-80">Necesita más evidencia</div>
                            </div>
                          </Button>
                        </div>
                      </div>

                      {/* Nivel de Confianza */}
                      <div className="space-y-3">
                        <Label className="text-base font-semibold">Nivel de Confianza</Label>
                        <div className="space-y-2">
                          <Slider
                            value={confidence}
                            onValueChange={setConfidence}
                            max={100}
                            min={0}
                            step={5}
                            className="w-full"
                          />
                          <div className="flex justify-between text-sm text-gray-600">
                            <span>0% - Sin confianza</span>
                            <span className="font-semibold text-gray-900">{confidence[0]}%</span>
                            <span>100% - Completamente seguro</span>
                          </div>
                        </div>
                      </div>

                      {/* Evidencia Adicional */}
                      <div className="space-y-3">
                        <Label htmlFor="evidence" className="text-base font-semibold">
                          Evidencia Adicional (Opcional)
                        </Label>
                        <Textarea
                          id="evidence"
                          placeholder="Proporciona enlaces, fuentes o comentarios que respalden tu voto..."
                          value={evidence}
                          onChange={(e) => setEvidence(e.target.value)}
                          rows={4}
                        />
                      </div>

                      {/* Recompensa Estimada */}
                      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Zap className="h-5 w-5 text-green-600" />
                          <h4 className="font-semibold text-green-900">Recompensa Estimada</h4>
                        </div>
                        <p className="text-green-800 text-sm mb-2">
                          Basado en el pool actual y tu nivel de confianza:
                        </p>
                        <div className="text-2xl font-bold text-green-900">
                          ~{Math.floor((selectedValidation.rewardPool * confidence[0]) / 1000)} TRU
                        </div>
                      </div>

                      {/* Submit Button */}
                      <div className="flex flex-col gap-4 pt-6 border-t">
                        {!isConnected && (
                          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                            <p className="text-yellow-800 text-sm">
                              Conecta tu wallet para poder enviar tu voto
                            </p>
                          </div>
                        )}

                        <Button
                          onClick={handleVote}
                          disabled={!isConnected || !voteChoice || isSubmitting}
                          className="bg-blue-600 hover:bg-blue-700 text-white"
                        >
                          {isSubmitting ? (
                            <>
                              <div className="animate-spin h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full"></div>
                              Enviando voto...
                            </>
                          ) : (
                            <>
                              <Vote className="h-4 w-4 mr-2" />
                              Enviar Voto
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
