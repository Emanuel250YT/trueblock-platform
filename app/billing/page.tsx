"use client"

import { useState } from "react"
import { MainNav } from "@/components/navigation/main-nav"
import { BillingOverview } from "@/components/client/billing-overview"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CreditCard, Receipt, Download, CheckCircle, AlertCircle } from "lucide-react"

// Datos de ejemplo
const currentPlan = {
  name: "Profesional",
  price: "$49",
  period: "mes",
  features: ["1,000 verificaciones/mes", "API ilimitada", "Soporte prioritario", "Badges personalizados"],
  usage: {
    verifications: { used: 247, limit: 1000 },
    apiCalls: { used: 12847, limit: 50000 },
  },
  nextBilling: "15 Feb 2024",
  status: "active" as const,
}

const plans = [
  {
    name: "Básico",
    price: "$19",
    period: "mes",
    features: ["100 verificaciones/mes", "API básica", "Soporte por email"],
    popular: false,
  },
  {
    name: "Profesional",
    price: "$49",
    period: "mes",
    features: ["1,000 verificaciones/mes", "API ilimitada", "Soporte prioritario", "Badges personalizados"],
    popular: true,
  },
  {
    name: "Empresa",
    price: "$199",
    period: "mes",
    features: ["10,000 verificaciones/mes", "API dedicada", "Soporte 24/7", "Integración personalizada"],
    popular: false,
  },
]

const invoices = [
  {
    id: "INV-2024-001",
    date: "2024-01-15",
    amount: "$49.00",
    status: "paid" as const,
    description: "Plan Profesional - Enero 2024",
  },
  {
    id: "INV-2023-012",
    date: "2023-12-15",
    amount: "$49.00",
    status: "paid" as const,
    description: "Plan Profesional - Diciembre 2023",
  },
  {
    id: "INV-2023-011",
    date: "2023-11-15",
    amount: "$49.00",
    status: "paid" as const,
    description: "Plan Profesional - Noviembre 2023",
  },
]

export default function BillingPage() {
  const [selectedPlan, setSelectedPlan] = useState("Profesional")

  return (
    <div className="min-h-screen bg-background">
      <MainNav />

      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Facturación</h1>
            <p className="text-muted-foreground">Gestiona tu suscripción, pagos y facturas</p>
          </div>
        </div>

        {/* Billing Overview */}
        <BillingOverview plan={currentPlan} />

        {/* Main Content */}
        <Tabs defaultValue="plans" className="space-y-6">
          <TabsList>
            <TabsTrigger value="plans" className="flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              Planes
            </TabsTrigger>
            <TabsTrigger value="invoices" className="flex items-center gap-2">
              <Receipt className="h-4 w-4" />
              Facturas
            </TabsTrigger>
          </TabsList>

          {/* Plans */}
          <TabsContent value="plans" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Cambiar Plan</CardTitle>
                <CardDescription>Elige el plan que mejor se adapte a tus necesidades</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {plans.map((plan) => (
                    <Card
                      key={plan.name}
                      className={`relative ${
                        plan.name === selectedPlan ? "ring-2 ring-primary" : ""
                      } ${plan.popular ? "border-primary" : ""}`}
                    >
                      {plan.popular && (
                        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                          <Badge className="bg-primary text-primary-foreground">Más Popular</Badge>
                        </div>
                      )}
                      <CardHeader className="text-center">
                        <CardTitle className="text-xl">{plan.name}</CardTitle>
                        <div className="text-3xl font-bold">
                          {plan.price}
                          <span className="text-lg font-normal text-muted-foreground">/{plan.period}</span>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <ul className="space-y-2">
                          {plan.features.map((feature, index) => (
                            <li key={index} className="flex items-center gap-2 text-sm">
                              <CheckCircle className="h-4 w-4 text-primary flex-shrink-0" />
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                        <Button
                          className="w-full"
                          variant={plan.name === selectedPlan ? "default" : "outline"}
                          onClick={() => setSelectedPlan(plan.name)}
                        >
                          {plan.name === selectedPlan ? "Plan Actual" : "Seleccionar Plan"}
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {selectedPlan !== currentPlan.name && (
                  <Alert className="mt-6">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Cambio de plan:</strong> El cambio se aplicará inmediatamente. Se prorrateará el costo
                      según el uso del período actual.
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Invoices */}
          <TabsContent value="invoices" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Historial de Facturas</CardTitle>
                    <CardDescription>Todas tus facturas y pagos</CardDescription>
                  </div>
                  <Button variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Descargar Todo
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {invoices.map((invoice) => (
                    <div key={invoice.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                          <Receipt className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-medium">{invoice.description}</h4>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <span>{invoice.date}</span>
                            <span>•</span>
                            <span>{invoice.id}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className="font-medium">{invoice.amount}</div>
                          <Badge className="bg-true/10 text-true">Pagado</Badge>
                        </div>
                        <Button variant="outline" size="sm">
                          <Download className="h-3 w-3 mr-1" />
                          PDF
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
