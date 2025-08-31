"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { StatusBadge } from "@/components/ui/status-badge"
import { ConfidenceIndicator } from "@/components/ui/confidence-indicator"
import { CheckCircle, XCircle, AlertTriangle, ExternalLink, Clock, DollarSign, Wallet } from "lucide-react"
import { cryptoUtils } from "@/lib/crypto"
import { apiClient } from "@/lib/api"

interface VotingCardProps {
  item: {
    id: string
    contentHash: string
    title: string
    domain: string
    url: string
    excerpt: string
    category: string
    priority: "normal" | "high"
    timeRemaining: string
    reward: string
    aiPrediction: {
      status: "true" | "fake" | "doubtful"
      confidence: number
    }
    llmAnalysis: string
    evidences: string[]
  }
  onVote?: (id: string, vote: "true" | "fake" | "doubtful", justification: string) => void
}

export function VotingCard({ item, onVote }: VotingCardProps) {
  const [selectedVote, setSelectedVote] = useState<"true" | "fake" | "doubtful" | null>(null)
  const [justification, setJustification] = useState("")
  const [confidence, setConfidence] = useState(75)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showDetails, setShowDetails] = useState(false)
  const [walletAddress, setWalletAddress] = useState<string | null>(null)
  const [isConnecting, setIsConnecting] = useState(false)

  useEffect(() => {
    checkWalletConnection()
  }, [])

  const checkWalletConnection = async () => {
    try {
      const address = await cryptoUtils.getConnectedAddress()
      setWalletAddress(address)
      console.log("[v0] Wallet conectada:", address)
    } catch (error) {
      console.error("[v0] Error al verificar wallet:", error)
    }
  }

  const connectWallet = async () => {
    setIsConnecting(true)
    try {
      const address = await cryptoUtils.connectWallet()
      setWalletAddress(address)
    } catch (error: any) {
      console.error("[v0] Error al conectar wallet:", error)
      alert("Error al conectar wallet: " + error.message)
    } finally {
      setIsConnecting(false)
    }
  }

  const handleSubmitVote = async () => {
    if (!selectedVote || !justification.trim() || !walletAddress) return

    setIsSubmitting(true)
    try {
      const voteBoolean = selectedVote === "true"
      const message = cryptoUtils.generateValidationMessage(item.contentHash, walletAddress, voteBoolean, confidence)

      console.log("[v0] Generando firma para mensaje:", message)
      const signature = await cryptoUtils.signMessage(message, walletAddress)

      const voteData = {
        contentHash: item.contentHash,
        walletAddress,
        vote: voteBoolean,
        confidence,
        evidence: justification,
        signature,
      }

      console.log("[v0] Enviando voto:", voteData)
      const response = await apiClient.validation.vote(voteData)
      console.log("[v0] Respuesta de voto:", response)

      // Mostrar resultado exitoso
      alert(`¡Voto registrado exitosamente! Recompensa: ${response.data.reward}`)

      // Callback opcional
      onVote?.(item.id, selectedVote, justification)

      // Limpiar formulario
      setSelectedVote(null)
      setJustification("")
      setConfidence(75)
    } catch (error: any) {
      console.error("[v0] Error al enviar voto:", error)
      alert("Error al enviar voto: " + error.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const voteOptions = [
    {
      value: "true" as const,
      label: "Verdadero",
      icon: CheckCircle,
      color: "text-true",
      bgColor: "bg-true/10 hover:bg-true/20",
      borderColor: "border-true",
    },
    {
      value: "fake" as const,
      label: "Falso",
      icon: XCircle,
      color: "text-fake",
      bgColor: "bg-fake/10 hover:bg-fake/20",
      borderColor: "border-fake",
    },
    {
      value: "doubtful" as const,
      label: "Dudoso",
      icon: AlertTriangle,
      color: "text-doubtful",
      bgColor: "bg-doubtful/10 hover:bg-doubtful/20",
      borderColor: "border-doubtful",
    },
  ]

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <Badge variant="outline">{item.category}</Badge>
                {item.priority === "high" && <Badge variant="destructive">Alta Prioridad</Badge>}
                <div className="flex items-center text-sm text-muted-foreground">
                  <Clock className="h-3 w-3 mr-1" />
                  {item.timeRemaining}
                </div>
              </div>
              <CardTitle className="text-base sm:text-lg line-clamp-2">{item.title}</CardTitle>
            </div>
            <div className="flex items-center justify-between sm:justify-end gap-2 shrink-0">
              <div className="flex items-center text-sm text-muted-foreground">
                <DollarSign className="h-3 w-3 mr-1" />
                {item.reward}
              </div>
            </div>
          </div>

          <CardDescription className="flex flex-col sm:flex-row sm:items-center gap-2">
            <span>{item.domain}</span>
            <Button variant="ghost" size="sm" asChild className="w-fit">
              <a href={item.url} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-3 w-3 mr-1" />
                <span className="text-xs">Ver fuente</span>
              </a>
            </Button>
          </CardDescription>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Excerpt */}
        <p className="text-sm text-muted-foreground line-clamp-3">{item.excerpt}</p>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 bg-muted/20 rounded-lg">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Predicción IA:</span>
            <StatusBadge status={item.aiPrediction.status} confidence={item.aiPrediction.confidence} />
          </div>
          <div className="flex justify-center sm:justify-end">
            <ConfidenceIndicator confidence={item.aiPrediction.confidence} size="sm" />
          </div>
        </div>

        {/* Toggle Details */}
        <Button variant="ghost" onClick={() => setShowDetails(!showDetails)} className="w-full">
          {showDetails ? "Ocultar" : "Ver"} Análisis Detallado
        </Button>

        {/* Detailed Analysis */}
        {showDetails && (
          <div className="space-y-3 p-3 border rounded-lg bg-muted/10">
            <div>
              <Label className="text-sm font-medium">Análisis LLM:</Label>
              <p className="text-sm text-muted-foreground mt-1">{item.llmAnalysis}</p>
            </div>

            {item.evidences.length > 0 && (
              <div>
                <Label className="text-sm font-medium">Evidencias:</Label>
                <ul className="text-sm text-muted-foreground mt-1 space-y-1">
                  {item.evidences.map((evidence, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-primary shrink-0">•</span>
                      <span className="break-words">{evidence}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        <Separator />

        {/* Wallet Connection */}
        {!walletAddress ? (
          <div className="space-y-3">
            <div className="text-center p-4 border rounded-lg bg-muted/10">
              <Wallet className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
              <p className="text-sm font-medium mb-1">Conecta tu wallet para votar</p>
              <p className="text-xs text-muted-foreground mb-3">
                Necesitas una wallet conectada para participar en la validación
              </p>
              <Button onClick={connectWallet} disabled={isConnecting}>
                {isConnecting ? "Conectando..." : "Conectar Wallet"}
              </Button>
            </div>
          </div>
        ) : (
          /* Voting Section */
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">Tu Validación:</Label>
              <div className="text-xs text-muted-foreground">
                Wallet: {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {voteOptions.map((option) => {
                const Icon = option.icon
                const isSelected = selectedVote === option.value
                return (
                  <Button
                    key={option.value}
                    variant="outline"
                    onClick={() => setSelectedVote(option.value)}
                    className={`flex items-center justify-center gap-2 h-auto py-3 ${
                      isSelected ? `${option.bgColor} ${option.borderColor} ${option.color}` : option.bgColor
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="text-sm">{option.label}</span>
                  </Button>
                )
              })}
            </div>

            {/* Confidence Slider */}
            {selectedVote && (
              <div className="space-y-2">
                <Label>Confianza: {confidence}%</Label>
                <input
                  type="range"
                  min="1"
                  max="100"
                  value={confidence}
                  onChange={(e) => setConfidence(Number(e.target.value))}
                  className="w-full"
                />
              </div>
            )}

            {/* Justification */}
            {selectedVote && (
              <div className="space-y-2">
                <Label htmlFor={`justification-${item.id}`}>Evidencia/Justificación (requerida):</Label>
                <Textarea
                  id={`justification-${item.id}`}
                  placeholder="Proporciona evidencia o explica tu razonamiento para esta validación..."
                  value={justification}
                  onChange={(e) => setJustification(e.target.value)}
                  rows={3}
                />
              </div>
            )}

            {/* Submit Button */}
            <Button
              onClick={handleSubmitVote}
              disabled={!selectedVote || !justification.trim() || isSubmitting}
              className="w-full"
            >
              {isSubmitting ? "Firmando y Enviando..." : "Firmar y Enviar Validación"}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
