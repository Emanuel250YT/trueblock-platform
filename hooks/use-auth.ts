"use client"

import { useState, useEffect } from "react"
import { authService, detectWallet, type AuthState } from "@/lib/auth"

export function useAuth() {
  const [state, setState] = useState<AuthState>(authService.getState())

  useEffect(() => {
    const unsubscribe = authService.subscribe(setState)
    return unsubscribe
  }, [])

  const signIn = async () => {
    const wallet = detectWallet()
    if (!wallet) {
      throw new Error("No wallet detected. Please install MetaMask or another Ethereum wallet.")
    }

    return authService.signInWithEthereum(wallet.provider)
  }

  const signOut = async () => {
    return authService.logout()
  }

  const refreshSession = async () => {
    return authService.refreshSession()
  }

  const hasRole = (role: string) => {
    return authService.hasRole(role)
  }

  const hasAnyRole = (roles: string[]) => {
    return authService.hasAnyRole(roles)
  }

  return {
    ...state,
    signIn,
    signOut,
    refreshSession,
    hasRole,
    hasAnyRole,
    wallet: detectWallet(),
  }
}
