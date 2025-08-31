"use client"

import { useState, useEffect, useCallback } from "react"
import { useWallet } from "@/contexts/wallet-context"
import { apiClient } from "@/lib/api"

interface ValidationTask {
  contentHash: string
  title: string
  url?: string
  status: string
  score: number
  timestamp: string
  category?: string
  summary?: string
  lastUpdated?: string
}

interface ValidationPersistenceState {
  tasks: ValidationTask[]
  loading: boolean
  error: string | null
}

const STORAGE_KEY = "trueblock_validations"
const SYNC_INTERVAL = 30000 // 30 seconds

export function useValidationPersistence() {
  const { address, isConnected } = useWallet()
  const [state, setState] = useState<ValidationPersistenceState>({
    tasks: [],
    loading: false,
    error: null,
  })

  // Load tasks from localStorage
  const loadFromStorage = useCallback(() => {
    if (!address) return []

    try {
      const stored = localStorage.getItem(`${STORAGE_KEY}_${address}`)
      return stored ? JSON.parse(stored) : []
    } catch (error) {
      console.error("[v0] Error loading from storage:", error)
      return []
    }
  }, [address])

  // Save tasks to localStorage
  const saveToStorage = useCallback(
    (tasks: ValidationTask[]) => {
      if (!address) return

      try {
        localStorage.setItem(`${STORAGE_KEY}_${address}`, JSON.stringify(tasks))
        console.log("[v0] Saved", tasks.length, "tasks to storage for", address)
      } catch (error) {
        console.error("[v0] Error saving to storage:", error)
      }
    },
    [address],
  )

  // Add new validation task
  const addValidationTask = useCallback(
    (task: ValidationTask) => {
      setState((prev) => {
        const existingIndex = prev.tasks.findIndex((t) => t.contentHash === task.contentHash)
        let newTasks: ValidationTask[]

        if (existingIndex >= 0) {
          // Update existing task
          newTasks = [...prev.tasks]
          newTasks[existingIndex] = { ...newTasks[existingIndex], ...task, lastUpdated: new Date().toISOString() }
        } else {
          // Add new task
          newTasks = [task, ...prev.tasks]
        }

        saveToStorage(newTasks)
        return { ...prev, tasks: newTasks }
      })
    },
    [saveToStorage],
  )

  // Update task status
  const updateTaskStatus = useCallback(
    async (contentHash: string) => {
      try {
        console.log("[v0] Updating status for hash:", contentHash)
        const response = await apiClient.validation.getStatus(contentHash)

        if (response.success && response.data) {
          const updatedTask: Partial<ValidationTask> = {
            contentHash,
            status: response.data.status,
            score: response.data.score || 0,
            lastUpdated: new Date().toISOString(),
          }

          if (response.data.title) updatedTask.title = response.data.title
          if (response.data.summary) updatedTask.summary = response.data.summary
          if (response.data.category) updatedTask.category = response.data.category

          setState((prev) => {
            const taskIndex = prev.tasks.findIndex((t) => t.contentHash === contentHash)
            if (taskIndex >= 0) {
              const newTasks = [...prev.tasks]
              newTasks[taskIndex] = { ...newTasks[taskIndex], ...updatedTask }
              saveToStorage(newTasks)
              return { ...prev, tasks: newTasks }
            }
            return prev
          })

          return response.data
        }
      } catch (error) {
        console.error("[v0] Error updating task status:", error)
        return null
      }
    },
    [saveToStorage],
  )

  // Sync all tasks with API
  const syncTasks = useCallback(async () => {
    if (!isConnected || state.tasks.length === 0) return

    setState((prev) => ({ ...prev, loading: true, error: null }))

    try {
      console.log("[v0] Syncing", state.tasks.length, "tasks with API")

      const updatePromises = state.tasks
        .filter((task) => task.status === "processing" || task.status === "pending")
        .map((task) => updateTaskStatus(task.contentHash))

      await Promise.allSettled(updatePromises)

      setState((prev) => ({ ...prev, loading: false }))
    } catch (error: any) {
      console.error("[v0] Error syncing tasks:", error)
      setState((prev) => ({ ...prev, loading: false, error: error.message }))
    }
  }, [isConnected, state.tasks, updateTaskStatus])

  // Remove task
  const removeTask = useCallback(
    (contentHash: string) => {
      setState((prev) => {
        const newTasks = prev.tasks.filter((t) => t.contentHash !== contentHash)
        saveToStorage(newTasks)
        return { ...prev, tasks: newTasks }
      })
    },
    [saveToStorage],
  )

  // Clear all tasks
  const clearTasks = useCallback(() => {
    setState((prev) => ({ ...prev, tasks: [] }))
    if (address) {
      localStorage.removeItem(`${STORAGE_KEY}_${address}`)
    }
  }, [address])

  // Get task by hash
  const getTask = useCallback(
    (contentHash: string) => {
      return state.tasks.find((t) => t.contentHash === contentHash)
    },
    [state.tasks],
  )

  // Get tasks by status
  const getTasksByStatus = useCallback(
    (status: string) => {
      return state.tasks.filter((t) => t.status === status)
    },
    [state.tasks],
  )

  // Load tasks on wallet connection
  useEffect(() => {
    if (isConnected && address) {
      const storedTasks = loadFromStorage()
      setState((prev) => ({ ...prev, tasks: storedTasks }))
      console.log("[v0] Loaded", storedTasks.length, "tasks from storage")
    } else {
      setState((prev) => ({ ...prev, tasks: [] }))
    }
  }, [isConnected, address, loadFromStorage])

  // Auto-sync tasks periodically
  useEffect(() => {
    if (!isConnected || state.tasks.length === 0) return

    const interval = setInterval(syncTasks, SYNC_INTERVAL)
    return () => clearInterval(interval)
  }, [isConnected, state.tasks.length, syncTasks])

  // Initial sync when tasks are loaded
  useEffect(() => {
    if (isConnected && state.tasks.length > 0) {
      const pendingTasks = state.tasks.filter((t) => t.status === "processing" || t.status === "pending")
      if (pendingTasks.length > 0) {
        console.log("[v0] Found", pendingTasks.length, "pending tasks, syncing...")
        syncTasks()
      }
    }
  }, [isConnected, state.tasks.length])

  return {
    ...state,
    addValidationTask,
    updateTaskStatus,
    syncTasks,
    removeTask,
    clearTasks,
    getTask,
    getTasksByStatus,
    pendingCount: state.tasks.filter((t) => t.status === "processing" || t.status === "pending").length,
    completedCount: state.tasks.filter((t) => t.status === "verified" || t.status === "rejected").length,
  }
}
