"use client"

import { useState } from 'react'
import { useValidation } from '@/hooks/use-trueblock-api'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, Send, CheckCircle, XCircle } from 'lucide-react'

export function ValidationSubmissionForm() {
  const [url, setUrl] = useState('')
  const [content, setContent] = useState('')
  const [title, setTitle] = useState('')
  const [submissionResult, setSubmissionResult] = useState<any>(null)

  const { loading, error, submitValidation } = useValidation()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!url && !content) {
      alert('Debes proporcionar al menos una URL o contenido')
      return
    }

    const result = await submitValidation({
      url: url || undefined,
      content: content || undefined,
      title: title || undefined,
    })

    if (result) {
      setSubmissionResult(result)
      // Limpiar formulario
      setUrl('')
      setContent('')
      setTitle('')
    }
  }

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Send className="w-5 h-5" />
          Enviar Noticia para Validación
        </CardTitle>
        <CardDescription>
          Envía una noticia a la API de TrueBlock para validación multicapa con IA y comunidad
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="url">URL de la Noticia (opcional)</Label>
            <Input
              id="url"
              type="url"
              placeholder="https://ejemplo.com/noticia"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Contenido de la Noticia (opcional)</Label>
            <Textarea
              id="content"
              placeholder="Pega aquí el contenido completo de la noticia..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              disabled={loading}
              rows={6}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Título (opcional)</Label>
            <Input
              id="title"
              placeholder="Título de la noticia"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={loading}
            />
          </div>

          <Button type="submit" disabled={loading || (!url && !content)} className="w-full">
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Enviando validación...
              </>
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Enviar para Validación
              </>
            )}
          </Button>
        </form>

        {error && (
          <Alert variant="destructive" className="mt-4">
            <XCircle className="w-4 h-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {submissionResult && (
          <Alert className="mt-4">
            <CheckCircle className="w-4 h-4" />
            <AlertDescription>
              <div className="space-y-2">
                <p className="font-medium">¡Noticia enviada exitosamente!</p>
                <p><strong>Content Hash:</strong> {submissionResult.contentHash}</p>
                <p><strong>Transaction Hash:</strong> {submissionResult.transactionHash}</p>
                {submissionResult.processedContent && (
                  <p><strong>Título procesado:</strong> {submissionResult.processedContent.title}</p>
                )}
              </div>
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  )
}
