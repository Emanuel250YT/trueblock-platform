/**
 * TrueBlock API Client
 * Cliente para interactuar con la API de TrueBlock en trust.cloudycoding.com
 */

const API_BASE_URL = 'https://trust.cloudycoding.com'

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface ValidationSubmitRequest {
  url?: string
  content?: string
  title?: string
}

export interface ValidationStatus {
  contentHash: string
  status: 'pending' | 'validating' | 'validated' | 'rejected'
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

export interface VoteRequest {
  contentHash: string
  walletAddress: string
  vote: boolean
  confidence: number
  evidence?: string
  signature: string
}

export interface OracleRegistrationRequest {
  walletAddress: string
  specialization: 'fake_news' | 'deepfake' | 'image_manipulation' | 'text_analysis'
  stake: string
  signature: string
}

export interface StakingRequest {
  walletAddress: string
  category: 'journalist' | 'fact_checker' | 'expert' | 'community'
  stake: string
  signature: string
}

export interface NewsSearchRequest {
  query: string
  filters?: {
    status?: string
    dateFrom?: string
    dateTo?: string
    minScore?: number
  }
  page?: number
  limit?: number
}

export interface TruthBoardPublishRequest {
  content: string
  title: string
  region: 'latam' | 'usa' | 'europe' | 'asia' | 'africa' | 'global'
  publisherIdentity: {
    zkProof: string
    commitment: string
    nullifier: string
  }
}

export interface ConfidentialValidationRequest {
  contentHash: string
  validatorAddress: string
  encryptedVote: {
    vote: string
    confidence: string
    evidence: string
  }
  zkProof: string
}

class TrueBlockAPIClient {
  private baseURL: string

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL
  }

  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          'X-API-Version': '1.0',
          'User-Agent': 'TrueBlock-Client/1.0',
          ...options.headers,
        },
        ...options,
      })

      const data = await response.json()

      if (!response.ok) {
        return {
          success: false,
          error: data.error || 'API Error',
          message: data.message || `HTTP ${response.status}`,
        }
      }

      return data
    } catch (error) {
      return {
        success: false,
        error: 'Network Error',
        message: error instanceof Error ? error.message : 'Unknown error',
      }
    }
  }

  // ========== SYSTEM ENDPOINTS ==========

  async healthCheck(): Promise<ApiResponse> {
    return this.makeRequest('/health')
  }

  async getApiInfo(): Promise<ApiResponse> {
    return this.makeRequest('/api/info')
  }

  // ========== VALIDATION ENDPOINTS ==========

  async submitValidation(data: ValidationSubmitRequest): Promise<ApiResponse> {
    return this.makeRequest('/api/validation/submit', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async getValidationStatus(contentHash: string): Promise<ApiResponse<ValidationStatus>> {
    return this.makeRequest(`/api/validation/status/${contentHash}`)
  }

  async submitVote(data: VoteRequest): Promise<ApiResponse> {
    return this.makeRequest('/api/validation/vote', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  // ========== ORACLE ENDPOINTS ==========

  async registerOracle(data: OracleRegistrationRequest): Promise<ApiResponse> {
    return this.makeRequest('/api/oracle/register', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async submitOracleValidation(data: {
    contentHash: string
    oracleAddress: string
    validationType: string
    signature: string
  }): Promise<ApiResponse> {
    return this.makeRequest('/api/oracle/validate', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async getOracleStats(oracleAddress: string): Promise<ApiResponse> {
    return this.makeRequest(`/api/oracle/stats/${oracleAddress}`)
  }

  // ========== STAKING ENDPOINTS ==========

  async registerValidator(data: StakingRequest): Promise<ApiResponse> {
    return this.makeRequest('/api/staking/validator/register', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async addStake(data: { walletAddress: string; amount: string; signature: string }): Promise<ApiResponse> {
    return this.makeRequest('/api/staking/stake', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async unstake(data: { walletAddress: string; amount: string; signature: string }): Promise<ApiResponse> {
    return this.makeRequest('/api/staking/unstake', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async getStakingStatus(walletAddress: string): Promise<ApiResponse> {
    return this.makeRequest(`/api/staking/status/${walletAddress}`)
  }

  // ========== NEWS ENDPOINTS ==========

  async getNewsFeed(params?: {
    page?: number
    limit?: number
    status?: string
    category?: string
    minScore?: number
  }): Promise<ApiResponse> {
    const searchParams = new URLSearchParams()
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.append(key, value.toString())
        }
      })
    }

    const queryString = searchParams.toString()
    const endpoint = queryString ? `/api/news/feed?${queryString}` : '/api/news/feed'

    return this.makeRequest(endpoint)
  }

  async getNewsDetail(contentHash: string): Promise<ApiResponse> {
    return this.makeRequest(`/api/news/${contentHash}`)
  }

  async searchNews(data: NewsSearchRequest): Promise<ApiResponse> {
    return this.makeRequest('/api/news/search', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  // ========== TRUTHBOARD ENDPOINTS ==========

  async publishAnonymous(data: TruthBoardPublishRequest): Promise<ApiResponse> {
    return this.makeRequest('/api/truthboard/publish', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async registerAnonymousValidator(data: {
    identity: { zkProof: string; commitment: string; nullifier: string }
    region: string
    stake: string
  }): Promise<ApiResponse> {
    return this.makeRequest('/api/truthboard/validator/register', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async validateAnonymously(data: {
    articleId: string
    validatorIdentity: { zkProof: string; nullifier: string }
    validation: { score: number; confidence: number; evidence?: string; encrypted: boolean }
  }): Promise<ApiResponse> {
    return this.makeRequest('/api/truthboard/validate', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async donateAnonymously(data: {
    articleId: string
    amount: string
    donorIdentity: { zkProof: string; nullifier: string }
    message?: string
  }): Promise<ApiResponse> {
    return this.makeRequest('/api/truthboard/donate', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async getTruthBoardStats(): Promise<ApiResponse> {
    return this.makeRequest('/api/truthboard/stats')
  }

  // ========== FILECOIN ENDPOINTS ==========

  async archiveNews(data: {
    contentHash: string
    title: string
    content: string
    validationScore: number
    validators: any[]
  }): Promise<ApiResponse> {
    return this.makeRequest('/api/filecoin/archive/news', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async storeEvidence(data: {
    contentHash: string
    evidenceType: 'image' | 'document' | 'video' | 'link'
    evidenceData: string
    validatorAddress: string
    description: string
  }): Promise<ApiResponse> {
    return this.makeRequest('/api/filecoin/evidence/store', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async retrieveContent(hash: string): Promise<ApiResponse> {
    return this.makeRequest(`/api/filecoin/retrieve/${hash}`)
  }

  async getStorageStatistics(): Promise<ApiResponse> {
    return this.makeRequest('/api/filecoin/statistics')
  }

  // ========== CONFIDENTIAL ENDPOINTS ==========

  async initializeFHE(data: {
    contractAddress: string
    relayerConfig: { endpoint: string; apiKey: string }
  }): Promise<ApiResponse> {
    return this.makeRequest('/api/confidential/initialize', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async registerConfidentialValidator(data: {
    validatorAddress: string
    initialReputation?: number
    validationHistory?: any[]
  }): Promise<ApiResponse> {
    return this.makeRequest('/api/confidential/register-validator', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async submitConfidentialValidation(data: ConfidentialValidationRequest): Promise<ApiResponse> {
    return this.makeRequest('/api/confidential/submit-validation', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async aggregateValidations(data: {
    contentHash: string
    validationIds: string[]
    aggregationProof: string
  }): Promise<ApiResponse> {
    return this.makeRequest('/api/confidential/aggregate-validations', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async updateReputation(data: {
    validatorAddress: string
    validationResult: 'correct' | 'incorrect'
    impactScore: string
    zkProof: string
  }): Promise<ApiResponse> {
    return this.makeRequest('/api/confidential/update-reputation', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async getConfidentialValidatorStats(address: string): Promise<ApiResponse> {
    return this.makeRequest(`/api/confidential/validator-stats/${address}`)
  }
}

// Crear instancia singleton
export const trueBlockAPI = new TrueBlockAPIClient()

// Export para uso directo
export { TrueBlockAPIClient }
export default trueBlockAPI
