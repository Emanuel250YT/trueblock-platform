"use client"

import type React from "react"
import { createContext, useContext, useEffect } from "react"
import { useValidationPersistence } from "@/hooks/use-validation-persistence"
import { useWallet } from "./wallet-context"

interface ValidationContextType {
  tasks: any[]
  loading: boolean
  error: string | null
  addValidationTask: (task: any) => void
  updateTaskStatus: (contentHash: string) => Promise<any>
  syncTasks: () => Promise<void>
  removeTask: (contentHash: string) => void
  clearTasks: () => void
  getTask: (contentHash: string) => any
  getTasksByStatus: (status: string) => any[]
  pendingCount: number
  completedCount: number
}

const ValidationContext = createContext<ValidationContextType | undefined>(undefined)

export function ValidationProvider({ children }: { children: React.ReactNode }) {
  const { isConnected } = useWallet()
  const persistence = useValidationPersistence()

  // Listen for validation events
  useEffect(() => {
    const handleValidationSubmitted = (event: CustomEvent) => {
      console.log("[v0] Validation submitted event:", event.detail)
      persistence.addValidationTask(event.detail)
    }

    const handleValidationStatusUpdated = (event: CustomEvent) => {
      console.log("[v0] Validation status updated event:", event.detail)
      persistence.addValidationTask(event.detail)
    }

    window.addEventListener("validationSubmitted", handleValidationSubmitted as EventListener)
    window.addEventListener("validationStatusUpdated", handleValidationStatusUpdated as EventListener)

    return () => {
      window.removeEventListener("validationSubmitted", handleValidationSubmitted as EventListener)
      window.removeEventListener("validationStatusUpdated", handleValidationStatusUpdated as EventListener)
    }
  }, [persistence])

  // Auto-sync when wallet connects
  useEffect(() => {
    if (isConnected && persistence.tasks.length > 0) {
      console.log("[v0] Wallet connected, syncing validation tasks...")
      persistence.syncTasks()
    }
  }, [isConnected, persistence.tasks.length])

  return <ValidationContext.Provider value={persistence}>{children}</ValidationContext.Provider>
}

export function useValidationContext() {
  const context = useContext(ValidationContext)
  if (context === undefined) {
    throw new Error("useValidationContext must be used within a ValidationProvider")
  }
  return context
}
