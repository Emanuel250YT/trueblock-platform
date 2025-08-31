"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { MainNav } from "@/components/navigation/main-nav"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Search, Hash, ArrowRight, AlertCircle, Info } from "lucide-react"
import { trueBlockAPI } from "@/lib/trueblock-api"

export default function SeguimientoPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [hash, setHash] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [searching, setSearching] = useState(false)

  useEffect(() => {
    // Si hay un hash en los parámetros de búsqueda, usarlo
    const hashParam = searchParams.get('hash')
    if (hashParam) {
      setHash(hashParam)
      handleSearch(hashParam)
    }
  }, [searchParams])

  const handleSearch = async (searchHash?: string) => {
    const targetHash = searchHash || hash
    if (!targetHash.trim()) {
      setError("Por favor ingresa un hash válido")
      return
    }

    setSearching(true)
    setError(null)

    try {
      // Buscar el estado de la validación en la API
      const response = await trueBlockAPI.getValidationStatus(targetHash.trim())

      if (response.success && response.data) {
        // Si encontramos la validación, redirigir a la página de detalles
        router.push(`/tasks/${targetHash.trim()}`)
      } else {
        setError(response.error || "No se encontró una validación con ese hash")
      }
    } catch (err) {
      setError("Error al buscar la validación")
    } finally {
      setSearching(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    handleSearch()
  }

  const handlePasteFromClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText()
      if (text) {
        setHash(text.trim())
        setError(null)
      }
    } catch (err) {
      console.error("Error reading clipboard:", err)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <MainNav />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Header */}
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-2">Seguimiento de Verificación</h1>
            <p className="text-lg text-muted-foreground">
              Ingresa el hash de tu verificación para ver su estado actual
            </p>
          </div>

          {/* Search Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5 text-primary" />
                Buscar por Hash
              </CardTitle>
              <CardDescription>Usa el Content Hash que recibiste al enviar tu verificación</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="hash">Content Hash / Task ID</Label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="hash"
                        placeholder="QmX7Yv8K2mN9pL3qR5sT6uW8vZ1aB4cD7eF9gH2iJ5kL8mN"
                        value={hash}
                        onChange={(e) => setHash(e.target.value)}
                        className="pl-10 font-mono text-sm"
                      />
                    </div>
                    <Button type="button" variant="outline" onClick={handlePasteFromClipboard}>
                      Pegar
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    El hash es un identificador único de 46+ caracteres que comienza con "Qm"
                  </p>
                </div>

                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <Button type="submit" disabled={!hash.trim() || searching} className="w-full" size="lg">
                  {searching ? (
                    <>
                      <Search className="h-4 w-4 mr-2 animate-spin" />
                      Buscando...
                    </>
                  ) : (
                    <>
                      <ArrowRight className="h-4 w-4 mr-2" />
                      Ver Estado de Verificación
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Info Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Info className="h-4 w-4" />
                ¿Dónde encuentro mi hash?
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div>
                <h4 className="font-medium mb-1">Después de enviar una verificación:</h4>
                <p className="text-muted-foreground">
                  Recibes un Content Hash único que puedes usar para hacer seguimiento
                </p>
              </div>
              <div>
                <h4 className="font-medium mb-1">En tu dashboard:</h4>
                <p className="text-muted-foreground">
                  Todas tus verificaciones aparecen en "Mis Tareas" con sus respectivos hashes
                </p>
              </div>
              <div>
                <h4 className="font-medium mb-1">Por email (próximamente):</h4>
                <p className="text-muted-foreground">
                  Recibirás notificaciones con el hash y actualizaciones de estado
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
