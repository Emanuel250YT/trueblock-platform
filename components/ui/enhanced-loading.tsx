"use client"

import { motion } from "framer-motion"
import { Loader2, Zap, Shield, Bot } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

interface EnhancedLoadingProps {
  type?: "default" | "verification" | "feed" | "analysis"
  message?: string
  progress?: number
  steps?: string[]
  currentStep?: number
}

export function EnhancedLoading({ type = "default", message, progress, steps, currentStep = 0 }: EnhancedLoadingProps) {
  const getLoadingConfig = () => {
    switch (type) {
      case "verification":
        return {
          icon: Shield,
          title: "Verificando noticia...",
          subtitle: "Analizando contenido con múltiples oráculos",
          color: "text-blue-600",
          bgColor: "bg-blue-50",
        }
      case "feed":
        return {
          icon: Zap,
          title: "Cargando feed...",
          subtitle: "Obteniendo las últimas verificaciones",
          color: "text-green-600",
          bgColor: "bg-green-50",
        }
      case "analysis":
        return {
          icon: Bot,
          title: "Analizando...",
          subtitle: "Procesando con inteligencia artificial",
          color: "text-purple-600",
          bgColor: "bg-purple-50",
        }
      default:
        return {
          icon: Loader2,
          title: "Cargando...",
          subtitle: "Por favor espera un momento",
          color: "text-primary",
          bgColor: "bg-primary/5",
        }
    }
  }

  const config = getLoadingConfig()
  const Icon = config.icon

  return (
    <div className="flex items-center justify-center min-h-[200px] p-4">
      <Card className="w-full max-w-md">
        <CardContent className="p-6">
          <div className="text-center space-y-4">
            {/* Animated Icon */}
            <div className={`mx-auto w-16 h-16 rounded-full ${config.bgColor} flex items-center justify-center`}>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
              >
                <Icon className={`h-8 w-8 ${config.color}`} />
              </motion.div>
            </div>

            {/* Title and Subtitle */}
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">{config.title}</h3>
              <p className="text-sm text-muted-foreground">{message || config.subtitle}</p>
            </div>

            {/* Progress Bar */}
            {progress !== undefined && (
              <div className="space-y-2">
                <div className="w-full bg-muted rounded-full h-2">
                  <motion.div
                    className="bg-primary h-2 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
                <p className="text-xs text-muted-foreground">{progress}% completado</p>
              </div>
            )}

            {/* Steps */}
            {steps && steps.length > 0 && (
              <div className="space-y-2">
                {steps.map((step, index) => (
                  <motion.div
                    key={index}
                    className={`flex items-center gap-2 text-sm ${
                      index === currentStep
                        ? "text-primary font-medium"
                        : index < currentStep
                          ? "text-muted-foreground line-through"
                          : "text-muted-foreground"
                    }`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div
                      className={`w-2 h-2 rounded-full ${
                        index === currentStep
                          ? "bg-primary animate-pulse"
                          : index < currentStep
                            ? "bg-green-500"
                            : "bg-muted"
                      }`}
                    />
                    {step}
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Componente específico para verificación
export function VerificationLoading({ progress, currentStep }: { progress?: number; currentStep?: number }) {
  const steps = [
    "Extrayendo contenido",
    "Analizando con oráculos IA",
    "Revisión LLM",
    "Validación comunitaria",
    "Consenso blockchain",
  ]

  return <EnhancedLoading type="verification" progress={progress} steps={steps} currentStep={currentStep} />
}
