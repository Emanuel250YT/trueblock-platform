"use client"

import { EnhancedLoading } from "@/components/ui/enhanced-loading"

export default function Loading() {
  return (
    <div className="min-h-screen">
      <EnhancedLoading type="verification" message="Cargando tus verificaciones..." />
    </div>
  )
}
