"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  Shield,
  Search,
  Menu,
  CheckCircle,
  Wallet,
  ChevronDown,
  Newspaper,
  User,
  Settings,
  HelpCircle,
  MapPin,
  Thermometer,
  Clock,
  Calendar,
  RefreshCw,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useWallet } from "@/contexts/wallet-context"
import { useLocation } from "@/contexts/location-context"

export function MainNav() {
  const pathname = usePathname()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { isConnected, address, connectWallet, disconnectWallet, isLoading: walletLoading } = useWallet()
  const { location, isLoading: locationLoading, refreshLocation } = useLocation()

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur-lg shadow-sm">
      <div className="container mx-auto px-4">
        {/* Top bar with date, time, location, weather */}
        <div className="flex items-center justify-between py-2 text-sm border-b border-gray-100">
          <div className="flex items-center space-x-4 text-gray-600">
            <div className="flex items-center space-x-2">
              <Calendar className="h-3 w-3 text-blue-600" />
              <span className="text-xs">
                {locationLoading
                  ? "Cargando fecha..."
                  : location?.currentDate ||
                  new Date().toLocaleDateString("es-ES", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="h-3 w-3 text-blue-600" />
              <span className="text-xs">
                {locationLoading
                  ? "--:--"
                  : location?.currentTime ||
                  new Date().toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" })}
              </span>
            </div>
            <div className="hidden sm:flex items-center space-x-2">
              <MapPin className="h-3 w-3 text-green-600" />
              <span className="text-xs">
                {locationLoading ? "Ubicación..." : `${location?.city}, ${location?.country}` || "Tu Ciudad"}
              </span>
            </div>
            <div className="hidden md:flex items-center space-x-2">
              <Thermometer className="h-3 w-3 text-orange-600" />
              <span className="text-xs">{locationLoading ? "--°" : `${location?.temperature}°C` || "22°C"}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={refreshLocation}
                className="h-4 w-4 p-0 text-gray-400 hover:text-blue-600"
              >
                <RefreshCw className="h-2 w-2" />
              </Button>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="bg-gradient-to-r from-blue-50 to-green-50 text-blue-700 px-3 py-1 rounded-full text-xs font-medium flex items-center space-x-1">
              <CheckCircle className="h-3 w-3 text-green-600" />
              <span>Noticias Verificadas con Blockchain</span>
            </div>
          </div>
        </div>

        {/* Main navigation */}
        <div className="flex items-center justify-between py-4">
          <Link href="/" className="flex items-center space-x-3">
            <div className="relative">
              <Shield className="h-8 w-8 text-blue-600" />
              <CheckCircle className="h-4 w-4 text-green-500 absolute -bottom-1 -right-1 bg-white rounded-full" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-xl text-blue-600">TrueBlock</span>
              <span className="text-xs text-gray-500 hidden sm:block">
                {isConnected ? `Conectado: ${address?.slice(0, 6)}...${address?.slice(-4)}` : "Noticias Verificadas"}
              </span>
            </div>
          </Link>

          {/* Search bar */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="search"
                placeholder="Buscar en TrueBlock Noticias"
                className="pl-10 pr-4 py-2 w-full border-gray-200 focus:border-blue-500 focus:ring-blue-500 bg-white/80 backdrop-blur-sm"
              />
            </div>
          </div>

          {/* Navigation menu */}
          <div className="flex items-center space-x-4">
            <div className="hidden lg:flex items-center space-x-1">
              <Link
                href="/"
                className={cn(
                  "text-sm font-medium transition-colors hover:text-blue-600 pb-1 px-3 py-2",
                  pathname === "/" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-700",
                )}
              >
                Inicio
              </Link>

              <Link
                href="/verificadas"
                className={cn(
                  "text-sm font-medium transition-colors hover:text-blue-600 pb-1 px-3 py-2",
                  pathname === "/verificadas" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-700",
                )}
              >
                Verificadas
              </Link>

              {/* Validación Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="text-sm font-medium text-gray-700 hover:text-blue-600 px-3 py-2">
                    <Shield className="h-4 w-4 mr-1" />
                    Validación
                    <ChevronDown className="h-3 w-3 ml-1" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-72 bg-white border border-gray-200 rounded-lg shadow-lg p-2">
                  <div className="space-y-1">
                    <DropdownMenuItem asChild>
                      <Link
                        href="/submit"
                        className={cn(
                          "flex items-center space-x-3 w-full px-3 py-2.5 rounded-md text-sm font-medium transition-colors hover:bg-blue-50 hover:text-blue-600 focus:bg-blue-50 focus:text-blue-600",
                          pathname === "/submit" && "bg-blue-50 text-blue-600",
                        )}
                      >
                        <span className="text-lg">📝</span>
                        <span>Enviar para Validar</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link
                        href="/vote"
                        className={cn(
                          "flex items-center space-x-3 w-full px-3 py-2.5 rounded-md text-sm font-medium transition-colors hover:bg-green-50 hover:text-green-600 focus:bg-green-50 focus:text-green-600",
                          pathname === "/vote" && "bg-green-50 text-green-600",
                        )}
                      >
                        <span className="text-lg">🗳️</span>
                        <span>Votar</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link
                        href="/validators"
                        className={cn(
                          "flex items-center space-x-3 w-full px-3 py-2.5 rounded-md text-sm font-medium transition-colors hover:bg-purple-50 hover:text-purple-600 focus:bg-purple-50 focus:text-purple-600",
                          pathname === "/validators" && "bg-purple-50 text-purple-600",
                        )}
                      >
                        <span className="text-lg">👥</span>
                        <span>Validadores</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link
                        href="/oracles"
                        className={cn(
                          "flex items-center space-x-3 w-full px-3 py-2.5 rounded-md text-sm font-medium transition-colors hover:bg-orange-50 hover:text-orange-600 focus:bg-orange-50 focus:text-orange-600",
                          pathname === "/oracles" && "bg-orange-50 text-orange-600",
                        )}
                      >
                        <span className="text-lg">🤖</span>
                        <span>Oráculos IA</span>
                      </Link>
                    </DropdownMenuItem>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>

              <Link
                href="/staking"
                className={cn(
                  "text-sm font-medium transition-colors hover:text-blue-600 pb-1 px-3 py-2",
                  pathname === "/staking" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-700",
                )}
              >
                Staking
              </Link>

              {/* Categorías Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="text-sm font-medium text-gray-700 hover:text-blue-600 px-3 py-2">
                    <Newspaper className="h-4 w-4 mr-1" />
                    Categorías
                    <ChevronDown className="h-3 w-3 ml-1" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-64 bg-white border border-gray-200 rounded-lg shadow-lg p-2">
                  <div className="space-y-1">
                    <DropdownMenuItem asChild>
                      <Link
                        href="/politica"
                        className={cn(
                          "flex items-center space-x-3 w-full px-3 py-2.5 rounded-md text-sm font-medium transition-colors hover:bg-blue-50 hover:text-blue-600 focus:bg-blue-50 focus:text-blue-600",
                          pathname === "/politica" && "bg-blue-50 text-blue-600",
                        )}
                      >
                        <span className="text-lg">🏛️</span>
                        <span>Política</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link
                        href="/economia"
                        className={cn(
                          "flex items-center space-x-3 w-full px-3 py-2.5 rounded-md text-sm font-medium transition-colors hover:bg-green-50 hover:text-green-600 focus:bg-green-50 focus:text-green-600",
                          pathname === "/economia" && "bg-green-50 text-green-600",
                        )}
                      >
                        <span className="text-lg">💰</span>
                        <span>Economía</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link
                        href="/deportes"
                        className={cn(
                          "flex items-center space-x-3 w-full px-3 py-2.5 rounded-md text-sm font-medium transition-colors hover:bg-orange-50 hover:text-orange-600 focus:bg-orange-50 focus:text-orange-600",
                          pathname === "/deportes" && "bg-orange-50 text-orange-600",
                        )}
                      >
                        <span className="text-lg">⚽</span>
                        <span>Deportes</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link
                        href="/tecnologia"
                        className={cn(
                          "flex items-center space-x-3 w-full px-3 py-2.5 rounded-md text-sm font-medium transition-colors hover:bg-purple-50 hover:text-purple-600 focus:bg-purple-50 focus:text-purple-600",
                          pathname === "/tecnologia" && "bg-purple-50 text-purple-600",
                        )}
                      >
                        <span className="text-lg">💻</span>
                        <span>Tecnología</span>
                      </Link>
                    </DropdownMenuItem>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Profile dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="hidden lg:flex items-center space-x-1">
                  <User className="h-4 w-4" />
                  <span className="text-sm">{isConnected ? "Perfil" : "Cuenta"}</span>
                  <ChevronDown className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-white border border-gray-200 rounded-lg shadow-lg">
                {isConnected ? (
                  <>
                    <div className="px-3 py-2 text-sm">
                      <div className="font-medium text-gray-900">Wallet Conectada</div>
                      <div className="text-xs text-gray-500 font-mono">
                        {address?.slice(0, 6)}...{address?.slice(-4)}
                      </div>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href={`/perfil/${address}`} className="flex items-center">
                        <User className="h-4 w-4 mr-2" />
                        Mi Perfil
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/perfil/anonimo" className="flex items-center">
                        <Shield className="h-4 w-4 mr-2" />
                        Perfil Anónimo
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={disconnectWallet} className="text-red-600">
                      <Wallet className="h-4 w-4 mr-2" />
                      Desconectar Wallet
                    </DropdownMenuItem>
                  </>
                ) : (
                  <>
                    <DropdownMenuItem asChild>
                      <Link href="/auth" className="flex items-center">
                        <User className="h-4 w-4 mr-2" />
                        Iniciar Sesión
                      </Link>
                    </DropdownMenuItem>
                  </>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/acerca-de" className="flex items-center">
                    <HelpCircle className="h-4 w-4 mr-2" />
                    Acerca de
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/contacto" className="flex items-center">
                    <Settings className="h-4 w-4 mr-2" />
                    Contacto
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Wallet button */}
            <Button
              onClick={isConnected ? disconnectWallet : connectWallet}
              disabled={walletLoading}
              className={cn(
                "hidden lg:flex items-center space-x-2 px-4 py-2 text-sm font-medium transition-all duration-300",
                isConnected
                  ? "bg-green-600 hover:bg-green-700 text-white shadow-lg"
                  : "bg-blue-600 hover:bg-blue-700 text-white",
                walletLoading && "opacity-50 cursor-not-allowed",
              )}
            >
              <Wallet className="h-4 w-4" />
              <span>{walletLoading ? "Conectando..." : isConnected ? "Conectada" : "Conectar Wallet"}</span>
              {isConnected && <div className="w-2 h-2 bg-green-300 rounded-full animate-pulse"></div>}
            </Button>

            {/* Mobile menu button */}
            <Button variant="ghost" size="sm" className="lg:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Mobile search bar */}
        <div className="md:hidden pb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="search"
              placeholder="Buscar noticias..."
              className="pl-10 pr-4 py-2 w-full border-gray-200 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="lg:hidden border-t bg-white/95 backdrop-blur-lg">
          <div className="container mx-auto px-4 py-4 space-y-4">
            <div className="space-y-2">
              <Link
                href="/"
                className={cn(
                  "block py-2 text-sm font-medium transition-colors",
                  pathname === "/" ? "text-blue-600" : "text-gray-700 hover:text-blue-600",
                )}
                onClick={() => setIsMenuOpen(false)}
              >
                🏠 Inicio
              </Link>
              <Link
                href="/verificadas"
                className={cn(
                  "block py-2 text-sm font-medium transition-colors",
                  pathname === "/verificadas" ? "text-blue-600" : "text-gray-700 hover:text-blue-600",
                )}
                onClick={() => setIsMenuOpen(false)}
              >
                ✅ Verificadas
              </Link>
              <Link
                href="/submit"
                className={cn(
                  "block py-2 text-sm font-medium transition-colors",
                  pathname === "/submit" ? "text-blue-600" : "text-gray-700 hover:text-blue-600",
                )}
                onClick={() => setIsMenuOpen(false)}
              >
                📝 Enviar para Validar
              </Link>
              <Link
                href="/vote"
                className={cn(
                  "block py-2 text-sm font-medium transition-colors",
                  pathname === "/vote" ? "text-blue-600" : "text-gray-700 hover:text-blue-600",
                )}
                onClick={() => setIsMenuOpen(false)}
              >
                🗳️ Votar
              </Link>
              <Link
                href="/validators"
                className={cn(
                  "block py-2 text-sm font-medium transition-colors",
                  pathname === "/validators" ? "text-blue-600" : "text-gray-700 hover:text-blue-600",
                )}
                onClick={() => setIsMenuOpen(false)}
              >
                👥 Validadores
              </Link>
              <Link
                href="/oracles"
                className={cn(
                  "block py-2 text-sm font-medium transition-colors",
                  pathname === "/oracles" ? "text-blue-600" : "text-gray-700 hover:text-blue-600",
                )}
                onClick={() => setIsMenuOpen(false)}
              >
                🤖 Oráculos IA
              </Link>
              <Link
                href="/staking"
                className={cn(
                  "block py-2 text-sm font-medium transition-colors",
                  pathname === "/staking" ? "text-blue-600" : "text-gray-700 hover:text-blue-600",
                )}
                onClick={() => setIsMenuOpen(false)}
              >
                💎 Staking
              </Link>
            </div>

            <div className="border-t pt-4">
              <div className="text-xs font-medium text-gray-500 mb-2">CATEGORÍAS</div>
              <div className="space-y-2">
                <Link
                  href="/politica"
                  className={cn(
                    "block py-2 text-sm transition-colors",
                    pathname === "/politica" ? "text-blue-600" : "text-gray-700 hover:text-blue-600",
                  )}
                  onClick={() => setIsMenuOpen(false)}
                >
                  🏛️ Política
                </Link>
                <Link
                  href="/economia"
                  className={cn(
                    "block py-2 text-sm transition-colors",
                    pathname === "/economia" ? "text-blue-600" : "text-gray-700 hover:text-blue-600",
                  )}
                  onClick={() => setIsMenuOpen(false)}
                >
                  💰 Economía
                </Link>
                <Link
                  href="/deportes"
                  className={cn(
                    "block py-2 text-sm transition-colors",
                    pathname === "/deportes" ? "text-blue-600" : "text-gray-700 hover:text-blue-600",
                  )}
                  onClick={() => setIsMenuOpen(false)}
                >
                  ⚽ Deportes
                </Link>
                <Link
                  href="/tecnologia"
                  className={cn(
                    "block py-2 text-sm transition-colors",
                    pathname === "/tecnologia" ? "text-blue-600" : "text-gray-700 hover:text-blue-600",
                  )}
                  onClick={() => setIsMenuOpen(false)}
                >
                  💻 Tecnología
                </Link>
              </div>
            </div>

            <div className="border-t pt-4">
              {isConnected ? (
                <div className="space-y-2">
                  <div className="text-xs font-medium text-gray-500 mb-2">CUENTA</div>
                  <div className="text-sm text-gray-600 mb-2">
                    Conectado: {address?.slice(0, 6)}...{address?.slice(-4)}
                  </div>
                  <Link
                    href={`/perfil/${address}`}
                    className="block py-2 text-sm text-gray-700 hover:text-blue-600"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    👤 Mi Perfil
                  </Link>
                  <Link
                    href="/perfil/anonimo"
                    className="block py-2 text-sm text-gray-700 hover:text-blue-600"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    🔒 Perfil Anónimo
                  </Link>
                  <button
                    onClick={() => {
                      disconnectWallet()
                      setIsMenuOpen(false)
                    }}
                    className="block w-full text-left py-2 text-sm text-red-600 hover:text-red-700"
                  >
                    💸 Desconectar Wallet
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <Button
                    onClick={() => {
                      connectWallet()
                      setIsMenuOpen(false)
                    }}
                    disabled={walletLoading}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <Wallet className="h-4 w-4 mr-2" />
                    {walletLoading ? "Conectando..." : "Conectar Wallet"}
                  </Button>
                  <Link
                    href="/auth"
                    className="block py-2 text-sm text-gray-700 hover:text-blue-600"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    👤 Iniciar Sesión
                  </Link>
                </div>
              )}
            </div>

            <div className="border-t pt-4">
              <div className="space-y-2">
                <Link
                  href="/acerca-de"
                  className="block py-2 text-sm text-gray-700 hover:text-blue-600"
                  onClick={() => setIsMenuOpen(false)}
                >
                  ❓ Acerca de
                </Link>
                <Link
                  href="/contacto"
                  className="block py-2 text-sm text-gray-700 hover:text-blue-600"
                  onClick={() => setIsMenuOpen(false)}
                >
                  📧 Contacto
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
