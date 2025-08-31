"use client"

import { useState } from 'react'
import { useNewsFeed } from '@/hooks/use-trueblock-api'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Loader2, RefreshCw, CheckCircle, XCircle, Clock } from 'lucide-react'

export function NewsFeedComponent() {
  const [page, setPage] = useState(1)
  const [status, setStatus] = useState<string>('')
  const [category, setCategory] = useState<string>('')
  const [minScore, setMinScore] = useState<number>()

  const { news, meta, loading, error, refetch } = useNewsFeed({
    page,
    limit: 10,
    status: status || undefined,
    category: category || undefined,
    minScore,
  })

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'validated':
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'rejected':
        return <XCircle className="w-4 h-4 text-red-500" />
      case 'pending':
      case 'validating':
        return <Clock className="w-4 h-4 text-yellow-500" />
      default:
        return <Clock className="w-4 h-4 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'validated':
        return 'bg-green-100 text-green-800'
      case 'rejected':
        return 'bg-red-100 text-red-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'validating':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Feed de Noticias Validadas
            <Button onClick={refetch} variant="outline" size="sm" disabled={loading}>
              <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Actualizar
            </Button>
          </CardTitle>
          <CardDescription>
            Noticias procesadas y validadas por la red TrueBlock
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Filtros */}
          <div className="flex gap-4 mb-6 flex-wrap">
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todos</SelectItem>
                <SelectItem value="validated">Validadas</SelectItem>
                <SelectItem value="rejected">Rechazadas</SelectItem>
                <SelectItem value="pending">Pendientes</SelectItem>
                <SelectItem value="validating">En validación</SelectItem>
              </SelectContent>
            </Select>

            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Categoría" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todas</SelectItem>
                <SelectItem value="politics">Política</SelectItem>
                <SelectItem value="economics">Economía</SelectItem>
                <SelectItem value="technology">Tecnología</SelectItem>
                <SelectItem value="sports">Deportes</SelectItem>
                <SelectItem value="science">Ciencia</SelectItem>
              </SelectContent>
            </Select>

            <Select value={minScore?.toString() || ''} onValueChange={(value) => setMinScore(value ? parseInt(value) : undefined)}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Score mínimo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Cualquiera</SelectItem>
                <SelectItem value="50">50+</SelectItem>
                <SelectItem value="70">70+</SelectItem>
                <SelectItem value="80">80+</SelectItem>
                <SelectItem value="90">90+</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {loading && (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin mr-2" />
              Cargando noticias...
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
              <p className="text-red-800">Error: {error}</p>
            </div>
          )}

          {!loading && !error && (
            <div className="space-y-4">
              {news.map((article, index) => (
                <Card key={article.contentHash || index} className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        {getStatusIcon(article.status)}
                        <Badge className={getStatusColor(article.status)}>
                          {article.status}
                        </Badge>
                        {article.score && (
                          <Badge variant="outline">
                            Score: {article.score}%
                          </Badge>
                        )}
                      </div>

                      <h3 className="font-semibold text-lg mb-2">
                        {article.title}
                      </h3>

                      {article.summary && (
                        <p className="text-gray-600 mb-3">
                          {article.summary}
                        </p>
                      )}

                      {article.url && (
                        <a
                          href={article.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline text-sm"
                        >
                          Ver fuente original
                        </a>
                      )}

                      <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
                        {article.validations && (
                          <span>
                            Validaciones: {article.validations.total || 0}
                          </span>
                        )}
                        {article.timestamp && (
                          <span>
                            {new Date(article.timestamp).toLocaleDateString()}
                          </span>
                        )}
                        {article.category && (
                          <Badge variant="secondary">
                            {article.category}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}

              {news.length === 0 && !loading && (
                <div className="text-center py-8 text-gray-500">
                  No se encontraron noticias con los filtros seleccionados
                </div>
              )}
            </div>
          )}

          {/* Paginación */}
          {meta && (
            <div className="flex items-center justify-between mt-6">
              <div className="text-sm text-gray-500">
                Página {meta.page} de {meta.totalPages} ({meta.total} noticias totales)
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={!meta.hasPrev || loading}
                >
                  Anterior
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(p => p + 1)}
                  disabled={!meta.hasNext || loading}
                >
                  Siguiente
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
