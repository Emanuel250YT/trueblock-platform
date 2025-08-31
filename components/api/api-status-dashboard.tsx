"use client"

import { useState } from 'react'
import { useHealthCheck } from '@/hooks/use-trueblock-api'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, RefreshCw, CheckCircle, XCircle, Activity } from 'lucide-react'

export function ApiStatusDashboard() {
  const { status, loading, error, refetch } = useHealthCheck()

  const getServiceStatusBadge = (serviceStatus: string) => {
    if (serviceStatus.includes('Active')) {
      return <Badge className="bg-green-100 text-green-800">Activo</Badge>
    }
    return <Badge className="bg-red-100 text-red-800">Inactivo</Badge>
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5" />
            Estado de la API TrueBlock
          </div>
          <Button onClick={refetch} variant="outline" size="sm" disabled={loading}>
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Actualizar
          </Button>
        </CardTitle>
        <CardDescription>
          Estado en tiempo real de la API de TrueBlock en trust.cloudycoding.com
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading && (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin mr-2" />
            Verificando estado de la API...
          </div>
        )}

        {error && (
          <Alert variant="destructive">
            <XCircle className="w-4 h-4" />
            <AlertDescription>
              Error al conectar con la API: {error}
            </AlertDescription>
          </Alert>
        )}

        {status && !loading && (
          <div className="space-y-4">
            {/* Estado general */}
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                {status.success ? (
                  <CheckCircle className="w-6 h-6 text-green-500" />
                ) : (
                  <XCircle className="w-6 h-6 text-red-500" />
                )}
                <div>
                  <h3 className="font-semibold">Estado General</h3>
                  <p className="text-sm text-gray-600">{status.data?.message || status.message}</p>
                </div>
              </div>
              <Badge className={status.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                {status.data?.status || (status.success ? 'OK' : 'ERROR')}
              </Badge>
            </div>

            {/* Información de versión y timestamp */}
            {status.data && (
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 border rounded-lg">
                  <h4 className="font-medium text-sm text-gray-500">Versión</h4>
                  <p className="text-lg font-semibold">{status.data.version}</p>
                </div>
                <div className="p-3 border rounded-lg">
                  <h4 className="font-medium text-sm text-gray-500">Última actualización</h4>
                  <p className="text-lg font-semibold">
                    {status.data.timestamp ? new Date(status.data.timestamp).toLocaleString() : 'N/A'}
                  </p>
                </div>
              </div>
            )}

            {/* Servicios */}
            {status.data?.services && (
              <div>
                <h3 className="font-semibold mb-3">Servicios Disponibles</h3>
                <div className="space-y-3">
                  {Object.entries(status.data.services).map(([serviceName, serviceStatus]) => (
                    <div key={serviceName} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <h4 className="font-medium capitalize">{serviceName.replace('_', ' ')}</h4>
                        <p className="text-sm text-gray-600">{serviceStatus as string}</p>
                      </div>
                      {getServiceStatusBadge(serviceStatus as string)}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Endpoints disponibles */}
            <div>
              <h3 className="font-semibold mb-3">Endpoints Principales</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  { name: 'Validación', path: '/api/validation/*', color: 'blue' },
                  { name: 'Oráculos', path: '/api/oracle/*', color: 'purple' },
                  { name: 'Staking', path: '/api/staking/*', color: 'green' },
                  { name: 'Feed de Noticias', path: '/api/news/*', color: 'orange' },
                  { name: 'TruthBoard', path: '/api/truthboard/*', color: 'pink' },
                  { name: 'Filecoin', path: '/api/filecoin/*', color: 'indigo' },
                ].map((endpoint) => (
                  <div key={endpoint.name} className="p-3 border rounded-lg">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">{endpoint.name}</h4>
                      <Badge variant="outline">{endpoint.path}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Rate limits info */}
            <Alert>
              <AlertDescription>
                <strong>Rate Limits:</strong> 100 requests por 15 minutos por IP.
                Ver documentación completa para límites específicos por endpoint.
              </AlertDescription>
            </Alert>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
