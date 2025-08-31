// Utilidades para firmas criptográficas con MetaMask
export interface WalletProvider {
  request: (args: { method: string; params?: any[] }) => Promise<any>
  selectedAddress: string | null
}

export class CryptoUtils {
  private provider: WalletProvider | null = null

  constructor() {
    if (typeof window !== "undefined" && (window as any).ethereum) {
      this.provider = (window as any).ethereum
    }
  }

  // Generar mensaje para firmar según la documentación de la API
  generateValidationMessage(contentHash: string, walletAddress: string, vote: boolean, confidence: number): string {
    const timestamp = Math.floor(Date.now() / 1000)
    return `TrueBlock Validation
Content Hash: ${contentHash}
Validator: ${walletAddress}
Vote: ${vote}
Confidence: ${confidence}
Timestamp: ${timestamp}`
  }

  // Firmar mensaje con MetaMask
  async signMessage(message: string, walletAddress: string): Promise<string> {
    if (!this.provider) {
      throw new Error("MetaMask no está disponible")
    }

    try {
      console.log("[v0] Firmando mensaje:", message)
      const signature = await this.provider.request({
        method: "personal_sign",
        params: [message, walletAddress],
      })
      console.log("[v0] Firma generada:", signature)
      return signature
    } catch (error) {
      console.error("[v0] Error al firmar mensaje:", error)
      throw new Error("Error al firmar el mensaje")
    }
  }

  // Obtener dirección de wallet conectada
  async getConnectedAddress(): Promise<string | null> {
    if (!this.provider) return null

    try {
      const accounts = await this.provider.request({ method: "eth_accounts" })
      return accounts.length > 0 ? accounts[0] : null
    } catch (error) {
      console.error("[v0] Error al obtener dirección de wallet:", error)
      return null
    }
  }

  // Conectar wallet
  async connectWallet(): Promise<string> {
    if (!this.provider) {
      throw new Error("MetaMask no está instalado")
    }

    try {
      const accounts = await this.provider.request({ method: "eth_requestAccounts" })
      if (accounts.length === 0) {
        throw new Error("No se pudo conectar la wallet")
      }
      console.log("[v0] Wallet conectada:", accounts[0])
      return accounts[0]
    } catch (error) {
      console.error("[v0] Error al conectar wallet:", error)
      throw error
    }
  }
}

export const cryptoUtils = new CryptoUtils()
