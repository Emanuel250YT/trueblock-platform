import { useState, useEffect, useCallback } from 'react'
import { trueBlockAPI, ApiResponse, ValidationStatus, NewsSearchRequest } from '@/lib/trueblock-api'

// Hook para el health check
export function useHealthCheck() {
  const [status, setStatus] = useState<ApiResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const checkHealth = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await trueBlockAPI.healthCheck()
      setStatus(response)
      if (!response.success) {
        setError(response.message || 'Health check failed')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    checkHealth()
  }, [checkHealth])

  return { status, loading, error, refetch: checkHealth }
}

// Hook para validación de noticias
export function useValidation() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const submitValidation = useCallback(async (data: {
    url?: string
    content?: string
    title?: string
  }) => {
    setLoading(true)
    setError(null)
    try {
      const response = await trueBlockAPI.submitValidation(data)
      if (!response.success) {
        setError(response.message || 'Validation submission failed')
        return null
      }
      return response.data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  const getValidationStatus = useCallback(async (contentHash: string) => {
    setLoading(true)
    setError(null)
    try {
      // Primero intentar la API real, si falla usar simulación
      try {
        const response = await trueBlockAPI.getValidationStatus(contentHash)
        if (response.success) {
          return response.data as ValidationStatus
        }
      } catch (apiError) {
        // Si la API falla, usar datos simulados
        console.log("API not available, using simulated data")
      }

      // Simular obtención de estado de validación
      await new Promise(resolve => setTimeout(resolve, 1000))

      const result = {
        contentHash,
        status: "validating",
        score: Math.floor(Math.random() * 40) + 60,
        validations: {
          ai_oracles: Math.floor(Math.random() * 5) + 1,
          community_validators: Math.floor(Math.random() * 15) + 5,
          total_votes: Math.floor(Math.random() * 20) + 6
        },
        breakdown: {
          fake_news_score: Math.floor(Math.random() * 30) + 10,
          deepfake_score: Math.floor(Math.random() * 15) + 5,
          bias_score: Math.floor(Math.random() * 25) + 10,
          credibility_score: Math.floor(Math.random() * 20) + 75
        }
      }

      return result
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  const submitVote = useCallback(async (data: {
    contentHash: string
    walletAddress: string
    vote: boolean
    confidence: number
    evidence?: string
    signature: string
  }) => {
    setLoading(true)
    setError(null)
    try {
      // Simular envío de voto hasta que la API esté disponible
      await new Promise(resolve => setTimeout(resolve, 2000))

      const result = {
        success: true,
        voteId: `vote_${Date.now()}`,
        reward: "0.001 ETH",
        newReputation: Math.floor(Math.random() * 100) + 700
      }

      return result
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    loading,
    error,
    submitValidation,
    getValidationStatus,
    submitVote
  }
}

// Hook para feed de noticias
export function useNewsFeed(params?: {
  page?: number
  limit?: number
  status?: string
  category?: string
  minScore?: number
}) {
  const [news, setNews] = useState<any[]>([])
  const [meta, setMeta] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchNews = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await trueBlockAPI.getNewsFeed(params)
      if (!response.success) {
        setError(response.message || 'Failed to fetch news')
        return
      }
      setNews(response.data?.data || [])
      setMeta(response.data?.meta || null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }, [params])

  useEffect(() => {
    fetchNews()
  }, [fetchNews])

  return { news, meta, loading, error, refetch: fetchNews }
}

// Hook para búsqueda de noticias
export function useNewsSearch() {
  const [results, setResults] = useState<any[]>([])
  const [meta, setMeta] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const searchNews = useCallback(async (searchData: NewsSearchRequest) => {
    setLoading(true)
    setError(null)
    try {
      const response = await trueBlockAPI.searchNews(searchData)
      if (!response.success) {
        setError(response.message || 'Search failed')
        return
      }
      setResults(response.data?.data?.results || [])
      setMeta(response.data?.meta || null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }, [])

  return { results, meta, loading, error, searchNews }
}

// Hook para oráculos
export function useOracle() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const registerOracle = useCallback(async (data: {
    walletAddress: string
    specialization: 'fake_news' | 'deepfake' | 'image_manipulation' | 'text_analysis'
    stake: string
    signature: string
  }) => {
    setLoading(true)
    setError(null)
    try {
      const response = await trueBlockAPI.registerOracle(data)
      if (!response.success) {
        setError(response.message || 'Oracle registration failed')
        return null
      }
      return response.data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  const submitOracleValidation = useCallback(async (data: {
    contentHash: string
    oracleAddress: string
    validationType: string
    signature: string
  }) => {
    setLoading(true)
    setError(null)
    try {
      const response = await trueBlockAPI.submitOracleValidation(data)
      if (!response.success) {
        setError(response.message || 'Oracle validation failed')
        return null
      }
      return response.data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  const getOracleStats = useCallback(async (oracleAddress: string) => {
    setLoading(true)
    setError(null)
    try {
      const response = await trueBlockAPI.getOracleStats(oracleAddress)
      if (!response.success) {
        setError(response.message || 'Failed to get oracle stats')
        return null
      }
      return response.data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    loading,
    error,
    registerOracle,
    submitOracleValidation,
    getOracleStats
  }
}

// Hook para staking
export function useStaking() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const registerValidator = useCallback(async (data: {
    walletAddress: string
    category: 'journalist' | 'fact_checker' | 'expert' | 'community'
    stake: string
    signature: string
  }) => {
    setLoading(true)
    setError(null)
    try {
      const response = await trueBlockAPI.registerValidator(data)
      if (!response.success) {
        setError(response.message || 'Validator registration failed')
        return null
      }
      return response.data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  const addStake = useCallback(async (data: {
    walletAddress: string
    amount: string
    signature: string
  }) => {
    setLoading(true)
    setError(null)
    try {
      const response = await trueBlockAPI.addStake(data)
      if (!response.success) {
        setError(response.message || 'Add stake failed')
        return null
      }
      return response.data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  const getStakingStatus = useCallback(async (walletAddress: string) => {
    setLoading(true)
    setError(null)
    try {
      const response = await trueBlockAPI.getStakingStatus(walletAddress)
      if (!response.success) {
        setError(response.message || 'Failed to get staking status')
        return null
      }
      return response.data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    loading,
    error,
    registerValidator,
    addStake,
    getStakingStatus
  }
}

// Hook para TruthBoard (periodismo anónimo)
export function useTruthBoard() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const publishAnonymous = useCallback(async (data: {
    content: string
    title: string
    region: 'latam' | 'usa' | 'europe' | 'asia' | 'africa' | 'global'
    publisherIdentity: {
      zkProof: string
      commitment: string
      nullifier: string
    }
  }) => {
    setLoading(true)
    setError(null)
    try {
      const response = await trueBlockAPI.publishAnonymous(data)
      if (!response.success) {
        setError(response.message || 'Anonymous publication failed')
        return null
      }
      return response.data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  const getTruthBoardStats = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await trueBlockAPI.getTruthBoardStats()
      if (!response.success) {
        setError(response.message || 'Failed to get TruthBoard stats')
        return null
      }
      return response.data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    loading,
    error,
    publishAnonymous,
    getTruthBoardStats
  }
}

// Hook para Filecoin
export function useFilecoin() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const archiveNews = useCallback(async (data: {
    contentHash: string
    title: string
    content: string
    validationScore: number
    validators: any[]
  }) => {
    setLoading(true)
    setError(null)
    try {
      const response = await trueBlockAPI.archiveNews(data)
      if (!response.success) {
        setError(response.message || 'News archiving failed')
        return null
      }
      return response.data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  const getStorageStatistics = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await trueBlockAPI.getStorageStatistics()
      if (!response.success) {
        setError(response.message || 'Failed to get storage statistics')
        return null
      }
      return response.data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    loading,
    error,
    archiveNews,
    getStorageStatistics
  }
}
