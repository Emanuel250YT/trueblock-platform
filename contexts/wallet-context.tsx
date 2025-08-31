"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { authService } from "@/lib/auth"

interface WalletContextType {
  isConnected: boolean
  address: string | null
  balance: string | null
  connectWallet: () => Promise<void>
  disconnectWallet: () => void
  isLoading: boolean
}

const WalletContext = createContext<WalletContextType | undefined>(undefined)

export function WalletProvider({ children }: { children: ReactNode }) {
  const [isConnected, setIsConnected] = useState(false)
  const [address, setAddress] = useState<string | null>(null)
  const [balance, setBalance] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkPersistedConnection = async () => {
      try {
        const authState = authService.getState()

        if (authState.isAuthenticated && authState.user?.address) {
          setAddress(authState.user.address)
          setIsConnected(true)
          await updateBalance(authState.user.address)

          // Persistir en localStorage para compatibilidad
          localStorage.setItem("wallet_address", authState.user.address)
          localStorage.setItem("wallet_connected", "true")
        } else {
          // Verificar localStorage como fallback
          const savedAddress = localStorage.getItem("wallet_address")
          const savedConnection = localStorage.getItem("wallet_connected")

          if (savedAddress && savedConnection === "true" && window.ethereum) {
            const accounts = await window.ethereum.request({ method: "eth_accounts" })
            if (accounts.length > 0 && accounts[0] === savedAddress) {
              setAddress(savedAddress)
              setIsConnected(true)
              await updateBalance(savedAddress)
            } else {
              // Limpiar datos si la wallet ya no está conectada
              localStorage.removeItem("wallet_address")
              localStorage.removeItem("wallet_connected")
            }
          }
        }
      } catch (error) {
        console.error("[v0] Error checking persisted connection:", error)
      } finally {
        setIsLoading(false)
      }
    }

    checkPersistedConnection()

    const unsubscribe = authService.subscribe((authState) => {
      if (authState.isAuthenticated && authState.user?.address) {
        setAddress(authState.user.address)
        setIsConnected(true)
        updateBalance(authState.user.address)
      } else if (!authState.isAuthenticated) {
        setIsConnected(false)
        setAddress(null)
        setBalance(null)
        localStorage.removeItem("wallet_address")
        localStorage.removeItem("wallet_connected")
      }
    })

    return unsubscribe
  }, [])

  useEffect(() => {
    if (window.ethereum) {
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length === 0) {
          disconnectWallet()
        } else if (accounts[0] !== address) {
          setAddress(accounts[0])
          updateBalance(accounts[0])
          localStorage.setItem("wallet_address", accounts[0])
        }
      }

      window.ethereum.on("accountsChanged", handleAccountsChanged)
      return () => window.ethereum.removeListener("accountsChanged", handleAccountsChanged)
    }
  }, [address])

  const updateBalance = async (walletAddress: string) => {
    try {
      if (window.ethereum) {
        const balance = await window.ethereum.request({
          method: "eth_getBalance",
          params: [walletAddress, "latest"],
        })
        const balanceInEth = (Number.parseInt(balance, 16) / Math.pow(10, 18)).toFixed(4)
        setBalance(balanceInEth)
      }
    } catch (error) {
      console.error("[v0] Error getting balance:", error)
    }
  }

  const connectWallet = async () => {
    try {
      if (!window.ethereum) {
        alert("Por favor instala MetaMask para conectar tu wallet")
        return
      }

      setIsLoading(true)

      await authService.signInWithEthereum(window.ethereum)

      // El estado se actualizará automáticamente a través del subscriber
      console.log("[v0] Wallet connected and authenticated with TrueBlock API")
    } catch (error) {
      console.error("[v0] Error connecting wallet:", error)
      alert("Error al conectar la wallet: " + (error as Error).message)
    } finally {
      setIsLoading(false)
    }
  }

  const disconnectWallet = async () => {
    try {
      await authService.logout()

      // El estado se actualizará automáticamente a través del subscriber
      console.log("[v0] Wallet disconnected and logged out from TrueBlock API")
    } catch (error) {
      console.error("[v0] Error disconnecting wallet:", error)
      // Fallback: limpiar estado local
      setIsConnected(false)
      setAddress(null)
      setBalance(null)
      localStorage.removeItem("wallet_address")
      localStorage.removeItem("wallet_connected")
    }
  }

  return (
    <WalletContext.Provider
      value={{
        isConnected,
        address,
        balance,
        connectWallet,
        disconnectWallet,
        isLoading,
      }}
    >
      {children}
    </WalletContext.Provider>
  )
}

export function useWallet() {
  const context = useContext(WalletContext)
  if (context === undefined) {
    throw new Error("useWallet must be used within a WalletProvider")
  }
  return context
}

declare global {
  interface Window {
    ethereum?: any
  }
}
