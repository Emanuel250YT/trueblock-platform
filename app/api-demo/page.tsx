"use client"

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { trueBlockAPI } from '@/lib/trueblock-api'
import { ApiStatusDashboard } from '@/components/api/api-status-dashboard'
import { ValidationSubmissionForm } from '@/components/validation/validation-submission-form'
import { NewsFeedComponent } from '@/components/feed/news-feed-component'
import { Book, Search, Upload, BarChart3 } from 'lucide-react'

export default function TrueBlockAPIDemo() {
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [searching, setSearching] = useState(false)
  const [validationHash, setValidationHash] = useState('')
  const [validationStatus, setValidationStatus] = useState<any>(null)
  const [checkingStatus, setCheckingStatus] = useState(false)

  const handleSearch = async () => {
    if (!searchQuery.trim()) return

    setSearching(true)
    try {
      const response = await trueBlockAPI.searchNews({
        query: searchQuery,
        filters: {
          status: 'validated',
          minScore: 70
        },
        page: 1,
        limit: 10
      })

      if (response.success) {
        setSearchResults(response.data?.data?.results || [])
      } else {
        console.error('Search failed:', response.error)
      }
    } catch (error) {
      console.error('Search error:', error)
    } finally {
      setSearching(false)
    }
  }

  const checkValidationStatus = async () => {
    if (!validationHash.trim()) return

    setCheckingStatus(true)
    try {
      const response = await trueBlockAPI.getValidationStatus(validationHash)

      if (response.success) {
        setValidationStatus(response.data)
      } else {
        console.error('Status check failed:', response.error)
      }
    } catch (error) {
      console.error('Status check error:', error)
    } finally {
      setCheckingStatus(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">TrueBlock API Demo</h1>
        <p className="text-lg text-gray-600 mb-8">
          Demostración completa de la API de TrueBlock corriendo en trust.cloudycoding.com
        </p>
      </div>

      <Tabs defaultValue="status" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="status" className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            Estado API
          </TabsTrigger>
          <TabsTrigger value="submit" className="flex items-center gap-2">
            <Upload className="w-4 h-4" />
            Enviar Validación
          </TabsTrigger>
          <TabsTrigger value="feed" className="flex items-center gap-2">
            <Book className="w-4 h-4" />
            Feed de Noticias
          </TabsTrigger>
          <TabsTrigger value="search" className="flex items-center gap-2">
            <Search className="w-4 h-4" />
            Búsqueda
          </TabsTrigger>
          <TabsTrigger value="validation" className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            Estado Validación
          </TabsTrigger>
        </TabsList>

        <TabsContent value="status" className="space-y-4">
          <ApiStatusDashboard />
        </TabsContent>

        <TabsContent value="submit" className="space-y-4">
          <div className="flex justify-center">
            <ValidationSubmissionForm />
          </div>
        </TabsContent>

        <TabsContent value="feed" className="space-y-4">
          <NewsFeedComponent />
        </TabsContent>

        <TabsContent value="search" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="w-5 h-5" />
                Búsqueda de Noticias
              </CardTitle>
              <CardDescription>
                Busca noticias validadas en la base de datos de TrueBlock
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4 mb-6">
                <Input
                  placeholder="Buscar noticias..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
                <Button onClick={handleSearch} disabled={searching}>
                  {searching ? 'Buscando...' : 'Buscar'}
                </Button>
              </div>

              {searchResults.length > 0 && (
                <div className="space-y-4">
                  <h3 className="font-semibold">Resultados de búsqueda:</h3>
                  {searchResults.map((result, index) => (
                    <Card key={index} className="p-4">
                      <h4 className="font-medium">{result.title}</h4>
                      <p className="text-sm text-gray-600 mt-2">{result.summary}</p>
                      <div className="flex gap-2 mt-3">
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                          Score: {result.score}%
                        </span>
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                          {result.status}
                        </span>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="validation" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Verificar Estado de Validación</CardTitle>
              <CardDescription>
                Ingresa un content hash para verificar el estado de su validación
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4 mb-6">
                <Input
                  placeholder="Content Hash (ej: QmXYZ123...)"
                  value={validationHash}
                  onChange={(e) => setValidationHash(e.target.value)}
                />
                <Button onClick={checkValidationStatus} disabled={checkingStatus}>
                  {checkingStatus ? 'Verificando...' : 'Verificar'}
                </Button>
              </div>

              {validationStatus && (
                <Alert>
                  <AlertDescription>
                    <div className="space-y-2">
                      <p><strong>Estado:</strong> {validationStatus.status}</p>
                      <p><strong>Score:</strong> {validationStatus.score}%</p>
                      <p><strong>Validaciones totales:</strong> {validationStatus.validations?.total_votes || 0}</p>
                      {validationStatus.breakdown && (
                        <div>
                          <p><strong>Análisis detallado:</strong></p>
                          <ul className="list-disc list-inside ml-4">
                            <li>Fake news score: {validationStatus.breakdown.fake_news_score}%</li>
                            <li>Credibility score: {validationStatus.breakdown.credibility_score}%</li>
                            <li>Bias score: {validationStatus.breakdown.bias_score}%</li>
                          </ul>
                        </div>
                      )}
                      <p><strong>Timestamp:</strong> {new Date(validationStatus.timestamp).toLocaleString()}</p>
                    </div>
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle>Información de la API</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg">
              <h3 className="font-semibold">Base URL</h3>
              <p className="text-sm text-gray-600">https://trust.cloudycoding.com</p>
            </div>
            <div className="p-4 border rounded-lg">
              <h3 className="font-semibold">Rate Limit</h3>
              <p className="text-sm text-gray-600">100 requests / 15 min</p>
            </div>
            <div className="p-4 border rounded-lg">
              <h3 className="font-semibold">Documentación</h3>
              <p className="text-sm text-gray-600">Ver INTEGRATION_GUIDE.md</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
