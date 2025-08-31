"use client"

import { useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertTriangle, RefreshCw, Home, Bug } from "lucide-react"
import Link from "next/link"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error("[v0] Global error:", error)

    // Enviar error a servicio de logging en producción
    if (process.env.NODE_ENV === "production") {
      // apiClient.errors.report({
      //   error: error.message,
      //   stack: error.stack,
      //   digest: error.digest
      // })
    }
  }, [error])

  const isNetworkError = error.message.includes("fetch") || error.message.includes("network")
  const isAuthError = error.message.includes("401") || error.message.includes("unauthorized")

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-5 w-5" />
            {isNetworkError ? "Error de conexión" : isAuthError ? "Error de autenticación" : "Error de aplicación"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert variant="destructive">
            <Bug className="h-4 w-4" />
            <AlertDescription>
              {isNetworkError
                ? "No se pudo conectar con el servidor. Verifica tu conexión a internet."
                : isAuthError
                  ? "Tu sesión ha expirado. Por favor, inicia sesión nuevamente."
                  : "Ha ocurrido un error inesperado en la aplicación."}
            </AlertDescription>
          </Alert>

          <div className="flex flex-col gap-2">
            <Button onClick={reset} className="w-full">
              <RefreshCw className="h-4 w-4 mr-2" />
              {isNetworkError ? "Reintentar conexión" : "Reintentar"}
            </Button>

            {isAuthError ? (
              <Button variant="outline" asChild className="w-full bg-transparent">
                <Link href="/auth">Iniciar Sesión</Link>
              </Button>
            ) : (
              <Button variant="outline" asChild className="w-full bg-transparent">
                <Link href="/">
                  <Home className="h-4 w-4 mr-2" />
                  Volver al Inicio
                </Link>
              </Button>
            )}
          </div>

          <div className="pt-4 border-t text-center">
            <p className="text-sm text-muted-foreground mb-2">Si el problema persiste, contacta a soporte</p>
            <Button variant="ghost" size="sm" asChild>
              <Link href="https://vercel.com/help" target="_blank">
                Reportar Error
              </Link>
            </Button>
          </div>

          {process.env.NODE_ENV === "development" && (
            <details className="mt-4">
              <summary className="text-sm font-medium cursor-pointer">Detalles del error</summary>
              <pre className="mt-2 text-xs bg-muted p-2 rounded overflow-auto">{error.stack}</pre>
              {error.digest && <p className="text-xs text-muted-foreground mt-2">Error ID: {error.digest}</p>}
            </details>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
