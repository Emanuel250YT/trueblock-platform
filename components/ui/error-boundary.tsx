"use client"

import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertTriangle, RefreshCw, Home } from "lucide-react"
import Link from "next/link"

interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
  errorInfo?: React.ErrorInfo
}

interface ErrorBoundaryProps {
  children: React.ReactNode
  fallback?: React.ComponentType<{ error: Error; retry: () => void }>
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error,
    }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("[v0] Error Boundary caught an error:", error, errorInfo)

    // Enviar error a servicio de logging en producción
    if (process.env.NODE_ENV === "production") {
      // apiClient.errors.report({ error: error.message, stack: error.stack, componentStack: errorInfo.componentStack })
    }

    this.setState({
      hasError: true,
      error,
      errorInfo,
    })
  }

  retry = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined })
  }

  render() {
    if (this.state.hasError) {
      const { error } = this.state
      const { fallback: Fallback } = this.props

      if (Fallback && error) {
        return <Fallback error={error} retry={this.retry} />
      }

      return (
        <div className="min-h-[400px] flex items-center justify-center p-4">
          <Card className="max-w-md w-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-destructive">
                <AlertTriangle className="h-5 w-5" />
                Algo salió mal
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>{error?.message || "Ha ocurrido un error inesperado"}</AlertDescription>
              </Alert>

              <div className="flex flex-col gap-2">
                <Button onClick={this.retry} className="w-full">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Reintentar
                </Button>
                <Button variant="outline" asChild className="w-full bg-transparent">
                  <Link href="/">
                    <Home className="h-4 w-4 mr-2" />
                    Volver al Inicio
                  </Link>
                </Button>
              </div>

              {process.env.NODE_ENV === "development" && error && (
                <details className="mt-4">
                  <summary className="text-sm font-medium cursor-pointer">Detalles del error</summary>
                  <pre className="mt-2 text-xs bg-muted p-2 rounded overflow-auto">{error.stack}</pre>
                </details>
              )}
            </CardContent>
          </Card>
        </div>
      )
    }

    return this.props.children
  }
}

// Hook para usar Error Boundary con componentes funcionales
export function useErrorHandler() {
  return (error: Error, errorInfo?: React.ErrorInfo) => {
    console.error("[v0] Error handled:", error, errorInfo)

    // En producción, enviar a servicio de logging
    if (process.env.NODE_ENV === "production") {
      // apiClient.errors.report({ error: error.message, stack: error.stack })
    }
  }
}
