"use client"

import { useToast } from "@/components/ui/use-toast"
import { AlertTriangle, RefreshCw, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"

export interface ErrorToastOptions {
  title?: string
  description: string
  action?: {
    label: string
    onClick: () => void
  }
  retry?: () => void
  reportable?: boolean
  duration?: number
}

export function useErrorToast() {
  const { toast } = useToast()

  const showError = (options: ErrorToastOptions) => {
    const { title = "Error", description, action, retry, reportable = false, duration = 5000 } = options

    toast({
      variant: "destructive",
      title: (
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-4 w-4" />
          {title}
        </div>
      ),
      description,
      duration,
      action: (
        <div className="flex items-center gap-2">
          {retry && (
            <Button variant="outline" size="sm" onClick={retry} className="h-8 px-2 bg-transparent">
              <RefreshCw className="h-3 w-3 mr-1" />
              Reintentar
            </Button>
          )}
          {action && (
            <Button variant="outline" size="sm" onClick={action.onClick} className="h-8 px-2 bg-transparent">
              {action.label}
            </Button>
          )}
          {reportable && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                // Abrir formulario de reporte o enviar a soporte
                window.open("https://vercel.com/help", "_blank")
              }}
              className="h-8 px-2"
            >
              <ExternalLink className="h-3 w-3 mr-1" />
              Reportar
            </Button>
          )}
        </div>
      ),
    })
  }

  const showNetworkError = (retry?: () => void) => {
    showError({
      title: "Error de conexión",
      description: "No se pudo conectar con el servidor. Verifica tu conexión a internet.",
      retry,
      reportable: true,
    })
  }

  const showValidationError = (message: string) => {
    showError({
      title: "Error de validación",
      description: message,
      duration: 3000,
    })
  }

  const showAuthError = () => {
    showError({
      title: "Error de autenticación",
      description: "Tu sesión ha expirado. Por favor, inicia sesión nuevamente.",
      action: {
        label: "Iniciar sesión",
        onClick: () => (window.location.href = "/auth"),
      },
    })
  }

  const showApiError = (error: any, retry?: () => void) => {
    const message = error?.message || error?.error?.message || "Ha ocurrido un error inesperado"
    const isNetworkError = !error?.response || error?.code === "NETWORK_ERROR"

    if (isNetworkError) {
      showNetworkError(retry)
    } else if (error?.response?.status === 401) {
      showAuthError()
    } else {
      showError({
        description: message,
        retry,
        reportable: true,
      })
    }
  }

  return {
    showError,
    showNetworkError,
    showValidationError,
    showAuthError,
    showApiError,
  }
}
