export interface AuthState {
  isAuthenticated: boolean
  isLoading: boolean
  user: {
    id: string
    address: string
    roles: string[]
    display_name: string
    avatar_url: string | null
  } | null
  error: string | null
}

type AuthListener = (state: AuthState) => void

class AuthService {
  private state: AuthState = {
    isAuthenticated: false,
    isLoading: true,
    user: null,
    error: null,
  }

  private listeners: Set<AuthListener> = new Set()

  constructor() {
    this.initializeAuth()
  }

  private async initializeAuth() {
    try {
      // En su lugar, verificar si hay JWT en localStorage y obtener datos del usuario
      const jwt = typeof window !== "undefined" ? localStorage.getItem("tb_jwt") : null

      if (jwt) {
        // Intentar obtener información del usuario usando el staking status como proxy
        // Ya que no hay endpoint de sesión, usamos datos locales
        const storedUser = typeof window !== "undefined" ? localStorage.getItem("tb_user") : null

        if (storedUser) {
          const user = JSON.parse(storedUser)
          this.setState({
            isAuthenticated: true,
            isLoading: false,
            user,
            error: null,
          })
        } else {
          // JWT existe pero no hay datos de usuario, limpiar
          if (typeof window !== "undefined") {
            localStorage.removeItem("tb_jwt")
          }
          this.setState({
            isAuthenticated: false,
            isLoading: false,
            user: null,
            error: null,
          })
        }
      } else {
        this.setState({
          isAuthenticated: false,
          isLoading: false,
          user: null,
          error: null,
        })
      }
    } catch (error) {
      console.error("Auth initialization error:", error)
      this.setState({
        isAuthenticated: false,
        isLoading: false,
        user: null,
        error: null,
      })
    }
  }

  private setState(newState: Partial<AuthState>) {
    this.state = { ...this.state, ...newState }
    this.listeners.forEach((listener) => listener(this.state))
  }

  subscribe(listener: AuthListener): () => void {
    this.listeners.add(listener)
    return () => this.listeners.delete(listener)
  }

  getState(): AuthState {
    return this.state
  }

  async signInWithEthereum(provider: any): Promise<void> {
    try {
      this.setState({ isLoading: true, error: null })

      // Verificar que tenemos un provider
      if (!provider) {
        throw new Error("No wallet provider found")
      }

      // Obtener dirección del usuario
      const accounts = await provider.request({ method: "eth_requestAccounts" })
      if (!accounts || accounts.length === 0) {
        throw new Error("No accounts found")
      }

      const address = accounts[0]

      // Ya que la API no tiene endpoints de autenticación tradicionales
      const mockUser = {
        id: `user_${address.slice(2, 10)}`,
        address,
        roles: ["community"],
        display_name: `Usuario ${address.slice(0, 6)}...${address.slice(-4)}`,
        avatar_url: null,
      }

      // Generar JWT mock para mantener consistencia
      const mockJwt = `mock_jwt_${Date.now()}_${address.slice(2, 10)}`

      // Guardar en localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem("tb_jwt", mockJwt)
        localStorage.setItem("tb_user", JSON.stringify(mockUser))
      }

      // Actualizar estado
      this.setState({
        isAuthenticated: true,
        isLoading: false,
        user: mockUser,
        error: null,
      })
    } catch (error: any) {
      console.error("SIWE sign in error:", error)
      this.setState({
        isAuthenticated: false,
        isLoading: false,
        user: null,
        error: error.message || "Sign in failed",
      })
      throw error
    }
  }

  async logout(): Promise<void> {
    try {
      this.setState({ isLoading: true })

      // Limpiar datos locales
      if (typeof window !== "undefined") {
        localStorage.removeItem("tb_jwt")
        localStorage.removeItem("tb_user")
      }

      // Actualizar estado
      this.setState({
        isAuthenticated: false,
        isLoading: false,
        user: null,
        error: null,
      })
    } catch (error: any) {
      console.error("Logout error:", error)
      // Aún así limpiar el estado local
      if (typeof window !== "undefined") {
        localStorage.removeItem("tb_jwt")
        localStorage.removeItem("tb_user")
      }

      this.setState({
        isAuthenticated: false,
        isLoading: false,
        user: null,
        error: null,
      })
    }
  }

  async refreshSession(): Promise<void> {
    try {
      // Verificar si tenemos datos locales válidos
      const jwt = typeof window !== "undefined" ? localStorage.getItem("tb_jwt") : null
      const storedUser = typeof window !== "undefined" ? localStorage.getItem("tb_user") : null

      if (jwt && storedUser) {
        const user = JSON.parse(storedUser)
        this.setState({
          isAuthenticated: true,
          user,
          error: null,
        })
      } else {
        await this.logout()
      }
    } catch (error) {
      console.error("Session refresh error:", error)
      await this.logout()
    }
  }

  hasRole(role: string): boolean {
    return this.state.user?.roles.includes(role) || false
  }

  hasAnyRole(roles: string[]): boolean {
    return roles.some((role) => this.hasRole(role))
  }
}

// Instancia global del servicio de autenticación
export const authService = new AuthService()

// Utilidades para detectar wallets
export const detectWallet = () => {
  if (typeof window === "undefined") return null

  // MetaMask
  if (window.ethereum?.isMetaMask) {
    return {
      name: "MetaMask",
      provider: window.ethereum,
    }
  }

  // Coinbase Wallet
  if (window.ethereum?.isCoinbaseWallet) {
    return {
      name: "Coinbase Wallet",
      provider: window.ethereum,
    }
  }

  // WalletConnect u otros
  if (window.ethereum) {
    return {
      name: "Ethereum Wallet",
      provider: window.ethereum,
    }
  }

  return null
}

// Tipos para TypeScript
declare global {
  interface Window {
    ethereum?: any
  }
}
