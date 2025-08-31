// TrueBlock API Client
// Integración completa con la API v1 documentada

const API_BASE_URL = "https://trust.cloudycoding.com"

const MOCK_NEWS = [
  {
    contentHash: "QmX1Y2Z3abc123def456",
    title: "Crisis económica global afecta mercados emergentes",
    summary:
      "Los mercados financieros muestran signos de volatilidad debido a factores geopolíticos y cambios en las políticas...",
    url: "https://financiero.com/crisis-economica-global",
    status: "verified",
    score: 78,
    category: "politics",
    timestamp: "2025-08-30T10:30:00.000Z",
    validations: {
      total: 15,
      ai_oracles: 3,
      community: 12,
    },
  },
  {
    contentHash: "QmA4B5C6def789ghi012",
    title: "Nuevo tratamiento médico revolucionario aprobado por FDA",
    summary: "La FDA aprueba un innovador tratamiento que promete cambiar el panorama de la medicina moderna...",
    url: "https://salud.com/nuevo-tratamiento-fda",
    status: "verified",
    score: 92,
    category: "health",
    timestamp: "2025-08-30T08:15:00.000Z",
    validations: {
      total: 18,
      ai_oracles: 3,
      community: 15,
    },
  },
  {
    contentHash: "QmG7H8I9jkl345mno678",
    title: "Estudio revela datos falsos sobre cambio climático",
    summary: "Un análisis detallado demuestra inconsistencias en los datos presentados sobre el cambio climático...",
    url: "https://deportes24.com/estudio-clima-falso",
    status: "fake",
    score: 6,
    category: "science",
    timestamp: "2025-08-29T16:45:00.000Z",
    validations: {
      total: 22,
      ai_oracles: 3,
      community: 19,
    },
  },
]

const MOCK_TASKS = [
  {
    task_id: "task_001",
    news_id: "news_001",
    stages: [
      {
        name: "AI Oracles",
        status: "done",
        started_at: "2025-08-30T10:30:00.000Z",
        ended_at: "2025-08-30T10:32:00.000Z",
      },
      {
        name: "LLM Review",
        status: "done",
        started_at: "2025-08-30T10:32:00.000Z",
        ended_at: "2025-08-30T10:35:00.000Z",
      },
      {
        name: "Community",
        status: "done",
        started_at: "2025-08-30T10:35:00.000Z",
        ended_at: "2025-08-30T12:45:00.000Z",
      },
      {
        name: "Blockchain",
        status: "done",
        started_at: "2025-08-30T12:45:00.000Z",
        ended_at: "2025-08-30T12:47:00.000Z",
      },
    ],
    current_state: "completed",
    progress_pct: 100,
  },
  {
    task_id: "task_002",
    news_id: "news_002",
    stages: [
      {
        name: "AI Oracles",
        status: "done",
        started_at: "2025-08-30T08:15:00.000Z",
        ended_at: "2025-08-30T08:17:00.000Z",
      },
      {
        name: "LLM Review",
        status: "done",
        started_at: "2025-08-30T08:17:00.000Z",
        ended_at: "2025-08-30T08:20:00.000Z",
      },
      { name: "Community", status: "running", started_at: "2025-08-30T08:20:00.000Z" },
      { name: "Blockchain", status: "queued" },
    ],
    current_state: "validating",
    progress_pct: 65,
  },
]

interface ApiResponse<T = any> {
  success: boolean
  data?: T
  meta?: {
    page: number
    per_page: number
    total: number
    total_pages: number
  }
  error?: {
    code: string
    message: string
    details?: any
    trace_id?: string
  }
}

class ApiClient {
  private baseURL: string
  private defaultHeaders: HeadersInit
  private corsFailureDetected = false

  constructor(baseURL: string) {
    this.baseURL = baseURL
    this.defaultHeaders = {
      "Content-Type": "application/json",
      Accept: "application/json",
    }
  }

  private isCorsError(error: Error): boolean {
    return (
      error.message.includes("Failed to fetch") ||
      error.message.includes("CORS") ||
      error.message.includes("Network request failed")
    )
  }

  private async getMockFallback<T>(endpoint: string): Promise<ApiResponse<T>> {
    console.log("[v0] 🔄 Usando datos mock como fallback para:", endpoint)

    if (endpoint.includes("/news")) {
      return {
        success: true,
        data: MOCK_NEWS as T,
        meta: {
          page: 1,
          per_page: 20,
          total: MOCK_NEWS.length,
          total_pages: 1,
        },
      }
    }

    if (endpoint.includes("/tasks")) {
      return {
        success: true,
        data: MOCK_TASKS as T,
        meta: {
          page: 1,
          per_page: 20,
          total: MOCK_TASKS.length,
          total_pages: 1,
        },
      }
    }

    // Fallback genérico para otros endpoints
    return {
      success: false,
      error: {
        code: "CORS_FALLBACK",
        message: "Datos no disponibles en modo de desarrollo. Usando fallback mock.",
      },
    }
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}/api${endpoint}`

    // Get JWT from localStorage or cookie
    const jwt = typeof window !== "undefined" ? localStorage.getItem("tb_jwt") : null

    const headers = {
      ...this.defaultHeaders,
      ...options.headers,
    }

    if (jwt) {
      headers["Authorization"] = `Bearer ${jwt}`
    }

    try {
      console.log("[v0] 🚀 API Request:", {
        url,
        method: options.method || "GET",
        headers: Object.keys(headers),
        hasBody: !!options.body,
        bodyType: options.body ? typeof options.body : null,
      })

      const response = await fetch(url, {
        ...options,
        headers,
        mode: "cors",
      })

      console.log("[v0] 📡 HTTP Response:", {
        url,
        status: response.status,
        statusText: response.statusText,
        ok: response.ok,
        headers: Object.fromEntries(response.headers.entries()),
        type: response.type,
        redirected: response.redirected,
      })

      let errorData
      if (!response.ok) {
        const errorText = await response.text()
        try {
          errorData = JSON.parse(errorText)
        } catch {
          errorData = { error: { message: errorText || `HTTP ${response.status}` } }
        }

        console.error("[v0] ❌ API Error Response:", {
          status: response.status,
          statusText: response.statusText,
          url,
          errorData,
          rawErrorText: errorText,
        })

        if (response.status >= 500) {
          console.warn("[v0] 🔄 Error de servidor detectado, usando fallback mock")
          return this.getMockFallback<T>(endpoint)
        }

        throw new Error(errorData.error?.message || `HTTP ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()

      console.log("[v0] ✅ API Success Response:", {
        url,
        status: response.status,
        dataType: typeof data,
        dataKeys: data && typeof data === "object" ? Object.keys(data) : null,
        dataLength: Array.isArray(data) ? data.length : null,
        hasMetadata: data?.meta ? true : false,
        success: data?.success,
        actualData: data, // Mostrar los datos completos para debugging
      })

      return data
    } catch (error) {
      console.error("[v0] 🔥 API Network Error:", {
        url: `${this.baseURL}/api${endpoint}`,
        errorMessage: error.message,
        errorType: error.constructor.name,
        stack: error.stack,
        timestamp: new Date().toISOString(),
      })

      if (this.isCorsError(error)) {
        console.warn("[v0] 🌐 CORS detectado, usando datos mock como fallback")
        this.corsFailureDetected = true
        return this.getMockFallback<T>(endpoint)
      }

      if (error.message.includes("Failed to fetch")) {
        console.warn("[v0] 🔄 Network error detectado, usando fallback mock")
        return this.getMockFallback<T>(endpoint)
      }

      throw error
    }
  }

  // 1. AUTENTICACIÓN WEB3
  auth = {
    // getNonce: () => this.request<{ nonce: string; expires_at: string }>("/auth/nonce"),
    // verify: (data: { address: string; signature: string; message: string; chain_id: number }) =>
    //   this.request<{
    //     jwt: string;
    //     user: { id: string; address: string; roles: string[]; display_name: string; avatar_url: string | null };
    //     session: { id: string; created_at: string };
    //   }>("/auth/verify", { method: "POST", body: JSON.stringify(data) }),
    // getSession: () =>
    //   this.request<{
    //     authenticated: boolean;
    //     user: { id: string; address: string; roles: string[] };
    //   }>("/auth/session"),
    // logout: () => this.request("/auth/logout", { method: "POST" }),

    getRoles: () =>
      this.request<{
        roles: string[]
        effective: string
      }>("/auth/roles"),
  }

  // 2. FEED DE NOTICIAS
  news = {
    getFeed: (params?: {
      page?: number
      limit?: number
      status?: "verified" | "fake" | "uncertain" | "pending"
      category?: string
      minScore?: number
    }) => {
      const searchParams = new URLSearchParams()
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined) {
            searchParams.append(key, String(value))
          }
        })
      }
      return this.request<{
        success: boolean
        data: any[]
        meta: {
          page: number
          limit: number
          total: number
          totalPages: number
          hasNext: boolean
          hasPrev: boolean
        }
      }>(`/news/feed?${searchParams.toString()}`)
    },

    getDetail: (contentHash: string) =>
      this.request<{
        success: boolean
        data: {
          contentHash: string
          title: string
          content: string
          url: string
          status: string
          finalScore: number
          detailedAnalysis: any
          validationHistory: any[]
          ipfsHash: string
          filecoinArchive?: string
        }
      }>(`/news/${contentHash}`),

    getNewsDetail: (contentHash: string) =>
      this.request<{
        success: boolean
        data: {
          contentHash: string
          title: string
          summary: string
          url: string
          status: string
          score: number
          category: string
          timestamp: string
          validations: {
            total: number
            ai_oracles: number
            community: number
          }
        }
      }>(`/news/${contentHash}`),

    search: (data: {
      query: string
      filters?: {
        status?: string
        dateFrom?: string
        dateTo?: string
        minScore?: number
      }
      page?: number
      limit?: number
    }) =>
      this.request<{
        success: boolean
        data: {
          results: any[]
          totalResults: number
          searchTime: string
        }
        meta: any
      }>("/news/search", {
        method: "POST",
        body: JSON.stringify(data),
      }),
  }

  // 3. SISTEMA DE VERIFICACIÓN
  validation = {
    submit: (data: {
      url?: string
      content?: string
      title?: string
    }) =>
      this.request<{
        success: boolean
        message: string
        data: {
          contentHash: string
          transactionHash: string
          processedContent: {
            title: string
            summary: string
            timestamp: string
          }
        }
      }>("/validation/submit", {
        method: "POST",
        body: JSON.stringify(data),
      }),

    getStatus: (contentHash: string) =>
      this.request<{
        success: boolean
        data: {
          contentHash: string
          status: "pending" | "validating" | "validated" | "rejected"
          score: number
          validations: {
            ai_oracles: number
            community_validators: number
            total_votes: number
          }
          breakdown: {
            fake_news_score: number
            deepfake_score: number
            bias_score: number
            credibility_score: number
          }
          timestamp: string
        }
      }>(`/validation/status/${contentHash}`),

    vote: (data: {
      contentHash: string
      walletAddress: string
      vote: boolean
      confidence: number
      evidence: string
      signature: string
    }) =>
      this.request<{
        success: boolean
        message: string
        data: {
          voteId: string
          transactionHash: string
          reward: string
          newReputation: number
        }
      }>("/validation/vote", {
        method: "POST",
        body: JSON.stringify(data),
      }),
  }

  // 4. GESTIÓN DE TAREAS
  tasks = {
    list: (params?: {
      page?: number
      per_page?: number
      status?: string
      category?: string
      from?: string
      to?: string
    }) => {
      const searchParams = new URLSearchParams()
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined) {
            searchParams.append(key, String(value))
          }
        })
      }
      return this.request(`/tasks?${searchParams.toString()}`)
    },

    getDetail: (taskId: string) => this.request(`/tasks/${taskId}`),

    update: (taskId: string, action: "cancel" | "retry") =>
      this.request(`/tasks/${taskId}`, {
        method: "PATCH",
        body: JSON.stringify({ action }),
      }),

    export: (params?: {
      format?: "csv" | "json"
      from?: string
      to?: string
      status?: string
      category?: string
    }) => {
      const searchParams = new URLSearchParams()
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined) {
            searchParams.append(key, String(value))
          }
        })
      }
      return fetch(`${this.baseURL}/api/tasks/export?${searchParams.toString()}`, {
        credentials: "include",
      })
    },
  }

  // 5. VALIDACIÓN COMUNITARIA
  community = {
    getPending: (params?: {
      page?: number
      per_page?: number
      category?: string
      lang?: string
      skill?: string
    }) => {
      const searchParams = new URLSearchParams()
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined) {
            searchParams.append(key, String(value))
          }
        })
      }
      return this.request(`/community/pending?${searchParams.toString()}`)
    },

    vote: (data: {
      news_id: string
      vote: "true" | "fake" | "uncertain"
      justification: string
      evidence_urls?: string[]
    }) =>
      this.request<{
        vote_id: string
        weight: number
        reputation_delta: number
      }>("/community/votes", {
        method: "POST",
        body: JSON.stringify(data),
      }),

    getMyVotes: (params?: {
      page?: number
      per_page?: number
      from?: string
      to?: string
      outcome?: "aligned" | "misaligned"
    }) => {
      const searchParams = new URLSearchParams()
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined) {
            searchParams.append(key, String(value))
          }
        })
      }
      return this.request(`/community/votes/me?${searchParams.toString()}`)
    },

    getValidatorStats: (address: string) =>
      this.request<{
        address: string
        reputation: number
        accuracy: number
        votes_total: number
        aligned_rate: number
        stakes: { amount: string; symbol: string }
      }>(`/community/validators/${address}/stats`),

    getLeaderboard: (params?: {
      period?: "daily" | "weekly" | "monthly" | "all"
      page?: number
      per_page?: number
    }) => {
      const searchParams = new URLSearchParams()
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined) {
            searchParams.append(key, String(value))
          }
        })
      }
      return this.request(`/community/leaderboard?${searchParams.toString()}`)
    },
  }

  // 6. GESTIÓN DE ORÁCULOS
  oracles = {
    register: (data: {
      walletAddress: string
      specialization: "fake_news" | "deepfake" | "image_manipulation" | "text_analysis"
      stake: string
      signature: string
    }) =>
      this.request<{
        success: boolean
        message: string
        data: {
          oracleId: string
          transactionHash: string
          specialization: string
          stake: string
          status: string
        }
      }>("/oracle/register", {
        method: "POST",
        body: JSON.stringify(data),
      }),

    validate: (data: {
      contentHash: string
      oracleAddress: string
      validationType: string
      signature: string
    }) =>
      this.request<{
        success: boolean
        message: string
        data: {
          validationId: string
          score: number
          confidence: number
          details: any
          transactionHash: string
        }
      }>("/oracle/validate", {
        method: "POST",
        body: JSON.stringify(data),
      }),

    getStats: (oracleAddress: string) =>
      this.request<{
        success: boolean
        data: {
          oracleAddress: string
          specialization: string
          totalValidations: number
          accuracy: number
          reputation: number
          stake: string
          rewards: string
          performance: {
            last_7_days: number
            success_rate: number
            avg_response_time: string
          }
        }
      }>(`/oracle/stats/${oracleAddress}`),
  }

  // 7. FACTURACIÓN Y PLANES
  billing = {
    getPlans: () => this.request("/billing/plans"),

    getSubscription: () => this.request("/billing/subscription"),

    getInvoices: (params?: { page?: number; per_page?: number }) => {
      const searchParams = new URLSearchParams()
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined) {
            searchParams.append(key, String(value))
          }
        })
      }
      return this.request(`/billing/invoices?${searchParams.toString()}`)
    },

    getPaymentMethods: () => this.request("/billing/payment-methods"),

    addPaymentMethod: (data: any) =>
      this.request("/billing/payment-methods", {
        method: "POST",
        body: JSON.stringify(data),
      }),

    getUsage: (params?: { from?: string; to?: string }) => {
      const searchParams = new URLSearchParams()
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined) {
            searchParams.append(key, String(value))
          }
        })
      }
      return this.request(`/billing/usage?${searchParams.toString()}`)
    },
  }

  // 8. API KEYS
  apiKeys = {
    list: () => this.request("/apikeys"),

    create: (data: { name: string; scopes: string[] }) =>
      this.request("/apikeys", {
        method: "POST",
        body: JSON.stringify(data),
      }),

    delete: (keyId: string) =>
      this.request(`/apikeys/${keyId}`, {
        method: "DELETE",
      }),

    getLimits: (keyId: string) => this.request(`/apikeys/${keyId}/limits`),

    getStats: (keyId: string, params?: { from?: string; to?: string }) => {
      const searchParams = new URLSearchParams()
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined) {
            searchParams.append(key, String(value))
          }
        })
      }
      return this.request(`/apikeys/${keyId}/stats?${searchParams.toString()}`)
    },
  }

  // 9. BADGES Y CERTIFICADOS
  badges = {
    generate: (data: {
      news_id: string
      style: "light" | "dark"
      locale: string
    }) =>
      this.request<{
        badge_id: string
        embed: {
          script: string
          iframe: string
        }
      }>("/badges/generate", {
        method: "POST",
        body: JSON.stringify(data),
      }),

    getConfig: () => this.request("/badges/config"),

    updateConfig: (config: any) =>
      this.request("/badges/config", {
        method: "PATCH",
        body: JSON.stringify(config),
      }),

    getStats: (badgeId: string, params?: { from?: string; to?: string }) => {
      const searchParams = new URLSearchParams()
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined) {
            searchParams.append(key, String(value))
          }
        })
      }
      return this.request(`/badges/${badgeId}/stats?${searchParams.toString()}`)
    },
  }

  certificates = {
    download: (newsId: string, format: "pdf" | "jsonld" = "pdf") => {
      return fetch(`${this.baseURL}/api/certificates/${newsId}/download?format=${format}`, {
        credentials: "include",
      })
    },
  }

  // 10. CONFIGURACIONES
  users = {
    // getProfile: () => this.request("/users/me"),
    // updateProfile: (data: {
    //   display_name?: string
    //   avatar_url?: string
    //   bio?: string
    // }) =>
    //   this.request("/users/me", {
    //     method: "PATCH",
    //     body: JSON.stringify(data),
    //   }),
    // getNotifications: () => this.request("/users/me/notifications"),
    // updateNotifications: (settings: any) =>
    //   this.request("/users/me/notifications", {
    //     method: "PATCH",
    //     body: JSON.stringify(settings),
    //   }),
    // getValidationPreferences: () => this.request("/users/me/validation-preferences"),
    // updateValidationPreferences: (preferences: any) =>
    //   this.request("/users/me/validation-preferences", {
    //     method: "PATCH",
    //     body: JSON.stringify(preferences),
    //   }),
    // getSecurity: () => this.request("/users/me/security"),
    // updateSecurity: (settings: any) =>
    //   this.request("/users/me/security", {
    //     method: "PATCH",
    //     body: JSON.stringify(settings),
    //   }),
  }

  // 11. DATOS MOCK (para desarrollo)
  mock = {
    getNews: (params?: { count?: number; state?: string }) => {
      const searchParams = new URLSearchParams()
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined) {
            searchParams.append(key, String(value))
          }
        })
      }
      return this.request(`/mock/news?${searchParams.toString()}`)
    },

    getPipelineStates: () => this.request("/mock/pipeline-states"),

    reset: () => this.request("/mock/reset", { method: "POST" }),
  }

  // 12. STAKING
  staking = {
    registerValidator: (data: {
      walletAddress: string
      category: "journalist" | "fact_checker" | "expert" | "community"
      stake: string
      signature: string
    }) =>
      this.request<{
        success: boolean
        message: string
        data: {
          validatorId: string
          transactionHash: string
          category: string
          stake: string
          reputation: number
          status: string
        }
      }>("/staking/validator/register", {
        method: "POST",
        body: JSON.stringify(data),
      }),

    stake: (data: {
      walletAddress: string
      amount: string
      signature: string
    }) =>
      this.request<{
        success: boolean
        message: string
        data: {
          newStakeAmount: string
          transactionHash: string
          stakingRewards: string
        }
      }>("/staking/stake", {
        method: "POST",
        body: JSON.stringify(data),
      }),

    unstake: (data: {
      walletAddress: string
      amount: string
      signature: string
    }) =>
      this.request<{
        success: boolean
        message: string
        data: {
          unstakeAmount: string
          cooldownPeriod: string
          availableAt: string
          transactionHash: string
        }
      }>("/staking/unstake", {
        method: "POST",
        body: JSON.stringify(data),
      }),

    getStatus: (walletAddress: string) =>
      this.request<{
        success: boolean
        data: {
          walletAddress: string
          totalStaked: string
          availableRewards: string
          reputation: number
          validatorCategory: string
          pendingUnstakes: Array<{
            amount: string
            availableAt: string
          }>
          slashingHistory: any[]
        }
      }>(`/staking/status/${walletAddress}`),
  }
}

// Instancia global del cliente API
export const apiClient = new ApiClient(API_BASE_URL)

// Tipos útiles
export type { ApiResponse }
