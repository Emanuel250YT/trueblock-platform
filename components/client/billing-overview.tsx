import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { CreditCard, Calendar, TrendingUp } from "lucide-react"

interface BillingOverviewProps {
  plan: {
    name: string
    price: string
    period: string
    features: string[]
    usage: {
      verifications: { used: number; limit: number }
      apiCalls: { used: number; limit: number }
    }
    nextBilling: string
    status: "active" | "cancelled" | "past_due"
  }
}

export function BillingOverview({ plan }: BillingOverviewProps) {
  const statusConfig = {
    active: { color: "text-true", bg: "bg-true/10", label: "Activo" },
    cancelled: { color: "text-muted-foreground", bg: "bg-muted/20", label: "Cancelado" },
    past_due: { color: "text-fake", bg: "bg-fake/10", label: "Pago Vencido" },
  }

  const status = statusConfig[plan.status]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Plan Actual
              </CardTitle>
              <CardDescription>Tu suscripción y límites</CardDescription>
            </div>
            <Badge className={`${status.bg} ${status.color} border-0`}>{status.label}</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold">{plan.name}</span>
              <span className="text-lg text-muted-foreground">
                {plan.price}/{plan.period}
              </span>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <div className="flex items-center justify-between text-sm mb-1">
                <span>Verificaciones</span>
                <span>
                  {plan.usage.verifications.used.toLocaleString()}/{plan.usage.verifications.limit.toLocaleString()}
                </span>
              </div>
              <Progress value={(plan.usage.verifications.used / plan.usage.verifications.limit) * 100} />
            </div>

            <div>
              <div className="flex items-center justify-between text-sm mb-1">
                <span>Llamadas API</span>
                <span>
                  {plan.usage.apiCalls.used.toLocaleString()}/{plan.usage.apiCalls.limit.toLocaleString()}
                </span>
              </div>
              <Progress value={(plan.usage.apiCalls.used / plan.usage.apiCalls.limit) * 100} />
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>Próxima facturación: {plan.nextBilling}</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Uso Este Mes
          </CardTitle>
          <CardDescription>Estadísticas de consumo</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{plan.usage.verifications.used}</div>
              <div className="text-xs text-muted-foreground">Verificaciones</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-info">{plan.usage.apiCalls.used}</div>
              <div className="text-xs text-muted-foreground">API Calls</div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Costo estimado</span>
              <span className="font-medium">{plan.price}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span>Créditos restantes</span>
              <span className="font-medium">
                {(plan.usage.verifications.limit - plan.usage.verifications.used).toLocaleString()}
              </span>
            </div>
          </div>

          <Button className="w-full bg-transparent" variant="outline">
            Ver Detalles de Facturación
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
