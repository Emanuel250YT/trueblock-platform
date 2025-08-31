import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Zap, Clock, TrendingUp, Shield } from "lucide-react"
import Link from "next/link"

export function PremiumBanner() {
  return (
    <Card className="bg-gradient-to-r from-primary/10 via-info/5 to-accent/10 border-primary/20">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-primary" />
              Feed Premium en Tiempo Real
            </CardTitle>
            <CardDescription>
              Accede a verificaciones instantáneas, alertas personalizadas y análisis avanzados
            </CardDescription>
          </div>
          <Badge variant="outline" className="bg-primary/10 text-primary border-primary">
            Nuevo
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-info" />
            <span className="text-sm">Actualizaciones en tiempo real</span>
          </div>
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-accent" />
            <span className="text-sm">Análisis de tendencias</span>
          </div>
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-primary" />
            <span className="text-sm">Verificación prioritaria</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Button asChild>
            <Link href="/pricing">
              Suscribirse Ahora
              <Zap className="h-4 w-4 ml-2" />
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/demo">Ver Demo</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
