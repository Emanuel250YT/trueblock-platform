"use client"

import { useState, useCallback } from "react"
import { apiClient, type ApiResponse } from "@/lib/api"
import { useErrorToast } from "@/components/ui/error-toast"

interface UseApiState<T> {
  data: T | null
  loading: boolean
  error: string | null
}

interface UseApiOptions {
  onSuccess?: (data: any) => void
  onError?: (error: string) => void
}

export function useApi<T = any>() {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: false,
    error: null,
  })

  const execute = useCallback(
    async <R = T>(apiCall: () => Promise<ApiResponse<R>>, options?: UseApiOptions): Promise<R | null> => {
      try {
        setState((prev) => ({ ...prev, loading: true, error: null }))

        const response = await apiCall()

        if (response.success && response.data) {
          setState({
            data: response.data as T,
            loading: false,
            error: null,
          })

          options?.onSuccess?.(response.data)
          return response.data
        } else {
          const errorMessage = response.error?.message || "Unknown error"
          setState({
            data: null,
            loading: false,
            error: errorMessage,
          })

          options?.onError?.(errorMessage)
          return null
        }
      } catch (error: any) {
        const errorMessage = error.message || "Network error"
        setState({
          data: null,
          loading: false,
          error: errorMessage,
        })

        console.error("[v0] Hook API Error:", errorMessage)
        options?.onError?.(errorMessage)
        return null
      }
    },
    [],
  )

  const reset = useCallback(() => {
    setState({
      data: null,
      loading: false,
      error: null,
    })
  }, [])

  return {
    ...state,
    execute,
    reset,
  }
}

function isEmpty(data: any): boolean {
  if (!data) return true
  if (Array.isArray(data)) return data.length === 0
  if (typeof data === "object") return Object.keys(data).length === 0
  return false
}

// Hook específico para el feed de noticias
export function useNewsFeed() {
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { showApiError } = useErrorToast()

  const loadFeed = useCallback(
    async (params: any = {}) => {
      try {
        setLoading(true)
        setError(null)

        const response = await apiClient.news.getFeed(params)

        if (response.success && response.data) {
          setData(response.data)
        } else {
          throw new Error(response.error?.message || "Error cargando el feed")
        }
      } catch (err: any) {
        console.error("[v0] Error loading feed:", err)
        setError(err.message)
        showApiError(err, () => loadFeed(params))
      } finally {
        setLoading(false)
      }
    },
    [showApiError],
  )

  const searchNews = useCallback(
    async (params: any) => {
      try {
        setLoading(true)
        setError(null)

        const response = await apiClient.news.search(params)

        if (response.success && response.data) {
          setData(response.data)
        } else {
          throw new Error(response.error?.message || "Error en la búsqueda")
        }
      } catch (err: any) {
        console.error("[v0] Error searching news:", err)
        setError(err.message)
        showApiError(err, () => searchNews(params))
      } finally {
        setLoading(false)
      }
    },
    [showApiError],
  )

  const getEmptyMessage = () => {
    if (error) return `Error: ${error}`
    if (isEmpty(data)) return "No se encontraron noticias"
    return null
  }

  return { data, loading, error, loadFeed, searchNews, getEmptyMessage, isEmpty: isEmpty(data) }
}

// Hook específico para validación
export function useValidation() {
  const { execute, ...state } = useApi()

  const submitValidation = useCallback(
    async (data: Parameters<typeof apiClient.validation.submit>[0]) => {
      const result = await execute(() => apiClient.validation.submit(data), {
        onError: (error) => {
          console.error("[v0] Validation Submit Error:", error)
        },
        onSuccess: (response) => {
          console.log("[v0] Validation submitted successfully:", response)

          // Trigger custom event for persistence hook
          if (response.contentHash) {
            const event = new CustomEvent("validationSubmitted", {
              detail: {
                contentHash: response.contentHash,
                title: data.title || response.processedContent?.title || "Verificación sin título",
                url: data.url,
                status: "processing",
                score: 0,
                timestamp: new Date().toISOString(),
                category: response.processedContent?.category || "General",
                summary: response.processedContent?.summary || "Verificación en proceso",
              },
            })
            window.dispatchEvent(event)
          }
        },
      })

      return result
    },
    [execute],
  )

  const getValidationStatus = useCallback(
    (taskId: string) => {
      return execute(() => apiClient.validation.getStatus(taskId), {
        onError: (error) => {
          console.error("[v0] Validation Status Error:", error)
        },
        onSuccess: (response) => {
          // Trigger custom event for persistence hook
          const event = new CustomEvent("validationStatusUpdated", {
            detail: {
              contentHash: taskId,
              ...response,
            },
          })
          window.dispatchEvent(event)
        },
      })
    },
    [execute],
  )

  return {
    ...state,
    submitValidation,
    getValidationStatus,
  }
}

// Hook específico para tareas
export function useTasks() {
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { showApiError } = useErrorToast()

  const loadTasks = useCallback(
    async (params: any = {}) => {
      try {
        setLoading(true)
        setError(null)

        const response = await apiClient.tasks.list(params)

        if (response.success && response.data) {
          setData(response.data)
        } else {
          throw new Error(response.error?.message || "Error cargando las tareas")
        }
      } catch (err: any) {
        console.error("[v0] Error loading tasks:", err)
        setError(err.message)
        showApiError(err, () => loadTasks(params))
      } finally {
        setLoading(false)
      }
    },
    [showApiError],
  )

  const updateTask = useCallback(
    async (taskId: string, action: string) => {
      try {
        const response = await apiClient.tasks.update(taskId, { action })

        if (!response.success) {
          throw new Error(response.error?.message || "Error actualizando la tarea")
        }

        return response.data
      } catch (err: any) {
        console.error("[v0] Error updating task:", err)
        showApiError(err, () => updateTask(taskId, action))
        throw err
      }
    },
    [showApiError],
  )

  const getEmptyMessage = () => {
    if (error) return `Error: ${error}`
    if (isEmpty(data)) return "No se encontraron tareas"
    return null
  }

  return { data, loading, error, loadTasks, updateTask, getEmptyMessage, isEmpty: isEmpty(data) }
}

// Hook específico para validación comunitaria
export function useCommunityValidation() {
  const { execute, ...state } = useApi()

  const loadPendingTasks = useCallback(
    (params?: Parameters<typeof apiClient.community.getPending>[0]) => {
      console.log("[v0] Loading pending validation tasks...")
      return execute(() => apiClient.community.getPending(params), {
        onError: (error) => {
          console.error("[v0] Community Validation Error:", error)
        },
        onSuccess: (data) => {
          if (isEmpty(data)) {
            console.log("[v0] No pending validation tasks found")
          } else {
            console.log("[v0] Pending tasks loaded:", data?.length || 0, "items")
          }
        },
      })
    },
    [execute],
  )

  const submitVote = useCallback(
    (data: Parameters<typeof apiClient.community.vote>[0]) => {
      return execute(() => apiClient.community.vote(data), {
        onError: (error) => {
          console.error("[v0] Vote Submit Error:", error)
        },
      })
    },
    [execute],
  )

  const loadMyVotes = useCallback(
    (params?: Parameters<typeof apiClient.community.getMyVotes>[0]) => {
      return execute(() => apiClient.community.getMyVotes(params), {
        onError: (error) => {
          console.error("[v0] My Votes Error:", error)
        },
      })
    },
    [execute],
  )

  const loadLeaderboard = useCallback(
    (params?: Parameters<typeof apiClient.community.getLeaderboard>[0]) => {
      return execute(() => apiClient.community.getLeaderboard(params), {
        onError: (error) => {
          console.error("[v0] Leaderboard Error:", error)
        },
      })
    },
    [execute],
  )

  const getEmptyMessage = () => {
    if (state.error) return `Error: ${state.error}`
    if (isEmpty(state.data)) return "No se encontraron tareas de validación"
    return null
  }

  return {
    ...state,
    loadPendingTasks,
    submitVote,
    loadMyVotes,
    loadLeaderboard,
    getEmptyMessage,
    isEmpty: isEmpty(state.data),
  }
}

// Hook específico para oráculos
export function useOracles() {
  const { execute, ...state } = useApi()

  // const loadOracles = useCallback(
  //   (params?: Parameters<typeof apiClient.oracles.list>[0]) => {
  //     console.log("[v0] Loading oracles from API...")
  //     return execute(() => apiClient.oracles.list(params), {
  //       onError: (error) => {
  //         console.error("[v0] Oracles Error:", error)
  //       },
  //       onSuccess: (data) => {
  //         if (isEmpty(data)) {
  //           console.log("[v0] No oracles found")
  //         } else {
  //           console.log("[v0] Oracles loaded:", data?.length || 0, "items")
  //         }
  //       },
  //     })
  //   },
  //   [execute],
  // )

  // const loadOracleMetrics = useCallback(
  //   (oracleId: string, params?: Parameters<typeof apiClient.oracles.getMetrics>[1]) => {
  //     return execute(() => apiClient.oracles.getMetrics(oracleId, params), {
  //       onError: (error) => {
  //         console.error("[v0] Oracle Metrics Error:", error)
  //       },
  //     })
  //   },
  //   [execute],
  // )

  // const updateOracleConfig = useCallback(
  //   (oracleId: string, config: any) => {
  //     return execute(() => apiClient.oracles.updateConfig(oracleId, config), {
  //       onError: (error) => {
  //         console.error("[v0] Oracle Config Update Error:", error)
  //       },
  //     })
  //   },
  //   [execute],
  // )

  // const loadLogs = useCallback(
  //   (params?: Parameters<typeof apiClient.oracles.getLogs>[0]) => {
  //     return execute(() => apiClient.oracles.getLogs(params), {
  //       onError: (error) => {
  //         console.error("[v0] Oracle Logs Error:", error)
  //       },
  //     })
  //   },
  //   [execute],
  // )

  const getEmptyMessage = () => {
    if (state.error) return `Error: ${state.error}`
    if (isEmpty(state.data)) return "No se encontraron oráculos"
    return null
  }

  return {
    ...state,
    // loadOracles,
    // loadOracleMetrics,
    // updateOracleConfig,
    // loadLogs,
    getEmptyMessage,
    isEmpty: isEmpty(state.data),
  }
}
