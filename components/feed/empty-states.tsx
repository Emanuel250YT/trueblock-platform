"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Search, Filter, Plus, RefreshCw } from "lucide-react"
import Link from "next/link"

interface EmptyStateProps {
  type: "no-results" | "no-data" | "error"
  onRetry?: () => void
  onClearFilters?: () => void
}

export function EmptyState({ type, onRetry, onClearFilters }: EmptyStateProps) {
  if (type === "no-results") {
    return (
      <Card className="text-center py-12">
        <CardContent>
          <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No se encontraron resultados</h3>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            No encontramos verificaciones con esos filtros. Prueba otros términos de búsqueda o ajusta los filtros.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            {onClearFilters && (
              <Button variant="outline" onClick={onClearFilters}>
                <Filter className="h-4 w-4 mr-2" />
                Limpiar Filtros
              </Button>
            )}
            <Button asChild>
              <Link href="/submit">
                <Plus className="h-4 w-4 mr-2" />
                Crear Nueva Verificación
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (type === "error") {
    return (
      <Card className="text-center py-12">
        <CardContent>
          <RefreshCw className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Error al cargar el feed</h3>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            Hubo un problema al cargar las verificaciones. Por favor, inténtalo de nuevo.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            {onRetry && (
              <Button onClick={onRetry}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Reintentar
              </Button>
            )}
            <Button variant="outline" asChild>
              <Link href="/">Volver al Inicio</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  // no-data
  return (
    <Card className="text-center py-12">
      <CardContent>
        <Plus className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">Aún no hay verificaciones</h3>
        <p className="text-muted-foreground mb-6 max-w-md mx-auto">
          Sé el primero en verificar una noticia. Ayuda a construir una red de información confiable.
        </p>
        <Button asChild>
          <Link href="/submit">
            <Plus className="h-4 w-4 mr-2" />
            Verificar Primera Noticia
          </Link>
        </Button>
      </CardContent>
    </Card>
  )
}
