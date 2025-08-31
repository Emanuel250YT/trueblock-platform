"use client"

import { cn } from "@/lib/utils"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Wallet, User, Settings, LogOut, AlertTriangle } from "lucide-react"

interface WalletConnectProps {
  className?: string
}

declare global {
  interface Window {
    ethereum?: any
  }
}

export function WalletConnect({ className }: WalletConnectProps) {
  const [isConnected, setIsConnected] = useState(false)
  const [address, setAddress] = useState("")
  const [isWrongNetwork, setIsWrongNetwork] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    checkConnection()
  }, [])

  const checkConnection = async () => {
    if (typeof window.ethereum !== "undefined") {
      try {
        const wasDisconnected = localStorage.getItem("wallet_manually_disconnected")
        if (wasDisconnected === "true") {
          console.log("[v0] Wallet was manually disconnected, not auto-connecting")
          return
        }

        const accounts = await window.ethereum.request({ method: "eth_accounts" })
        if (accounts.length > 0) {
          setAddress(accounts[0])
          setIsConnected(true)
          console.log("[v0] Wallet already connected:", accounts[0])
        }
      } catch (error) {
        console.error("[v0] Error checking wallet connection:", error)
      }
    }
  }

  const connectWallet = async () => {
    if (typeof window.ethereum === "undefined") {
      alert("MetaMask no está instalado. Por favor instala MetaMask para continuar.")
      return
    }

    try {
      setIsLoading(true)
      console.log("[v0] Connecting to MetaMask...")

      // Solicitar conexión
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      })

      if (accounts.length > 0) {
        const account = accounts[0]
        setAddress(account)
        setIsConnected(true)
        localStorage.removeItem("wallet_manually_disconnected")
        console.log("[v0] Wallet connected:", account)

        // Verificar red
        const chainId = await window.ethereum.request({ method: "eth_chainId" })
        console.log("[v0] Current chain ID:", chainId)

        // Base Mainnet: 0x2105, Base Sepolia: 0x14a34
        if (chainId !== "0x2105" && chainId !== "0x14a34") {
          setIsWrongNetwork(true)
        } else {
          setIsWrongNetwork(false)
        }
      }
    } catch (error) {
      console.error("[v0] Error connecting wallet:", error)
      if (error.code === 4001) {
        console.log("[v0] User rejected connection")
      }
    } finally {
      setIsLoading(false)
    }
  }

  const disconnectWallet = () => {
    setIsConnected(false)
    setAddress("")
    setIsWrongNetwork(false)
    localStorage.setItem("wallet_manually_disconnected", "true")
    console.log("[v0] Wallet disconnected")
  }

  const switchNetwork = async () => {
    try {
      console.log("[v0] Switching to Base network...")
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: "0x2105" }], // Base Mainnet
      })
      setIsWrongNetwork(false)
    } catch (error) {
      console.error("[v0] Error switching network:", error)
      // Si la red no está agregada, intentar agregarla
      if (error.code === 4902) {
        try {
          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: "0x2105",
                chainName: "Base",
                nativeCurrency: {
                  name: "Ethereum",
                  symbol: "ETH",
                  decimals: 18,
                },
                rpcUrls: ["https://mainnet.base.org"],
                blockExplorerUrls: ["https://basescan.org"],
              },
            ],
          })
          setIsWrongNetwork(false)
        } catch (addError) {
          console.error("[v0] Error adding network:", addError)
        }
      }
    }
  }

  if (!isConnected) {
    return (
      <Button
        onClick={connectWallet}
        disabled={isLoading}
        className={cn("text-xs sm:text-sm px-2 sm:px-4", className)}
        size="sm"
      >
        <Wallet className="h-4 w-4 sm:mr-2" />
        <span className="hidden sm:inline">{isLoading ? "Conectando..." : "Conectar"}</span>
      </Button>
    )
  }

  if (isWrongNetwork) {
    return (
      <Button
        variant="destructive"
        onClick={switchNetwork}
        className={cn("text-xs sm:text-sm px-2 sm:px-4", className)}
        size="sm"
      >
        <AlertTriangle className="h-4 w-4 sm:mr-2" />
        <span className="hidden sm:inline">Red Incorrecta</span>
      </Button>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className={cn("text-xs sm:text-sm px-2 sm:px-4", className)} size="sm">
          <User className="h-4 w-4 sm:mr-2" />
          <span className="hidden sm:inline">
            {address.slice(0, 6)}...{address.slice(-4)}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <div className="flex items-center justify-between p-2">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium">Conectado</p>
            <p className="text-xs text-muted-foreground">
              {address.slice(0, 6)}...{address.slice(-4)}
            </p>
          </div>
          <Badge variant="outline" className="bg-primary/10 text-primary border-primary">
            Base
          </Badge>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <User className="h-4 w-4 mr-2" />
          Mi Perfil
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Settings className="h-4 w-4 mr-2" />
          Configuración
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={disconnectWallet} className="text-destructive">
          <LogOut className="h-4 w-4 mr-2" />
          Desconectar
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
