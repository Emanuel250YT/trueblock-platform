"use client"

import { Home, Search, Bell, User, Menu, Shield, Wallet, TrendingUp, BookOpen, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useRouter, usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { useWallet } from "@/contexts/wallet-context"
import { useState } from "react"

export function MobileBottomNav() {
  const router = useRouter()
  const pathname = usePathname()
  const { isConnected, connectWallet } = useWallet()
  const [showMoreMenu, setShowMoreMenu] = useState(false)

  const navItems = [
    {
      icon: Home,
      label: "Inicio",
      path: "/",
      active: pathname === "/",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      icon: Search,
      label: "Buscar",
      path: "/buscar",
      active: pathname === "/buscar",
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      icon: Bell,
      label: "Alertas",
      path: "/alertas",
      active: pathname === "/alertas",
      badge: 3,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
    {
      icon: isConnected ? Wallet : User,
      label: isConnected ? "Wallet" : "Conectar",
      path: isConnected ? "/perfil" : "/auth",
      active: pathname === "/perfil" || pathname === "/auth",
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      special: true,
    },
    {
      icon: Menu,
      label: "Más",
      path: "/menu",
      active: pathname === "/menu" || showMoreMenu,
      color: "text-gray-600",
      bgColor: "bg-gray-50",
      isMore: true,
    },
  ]

  const moreMenuItems = [
    {
      icon: Shield,
      label: "Verificadas",
      path: "/verificadas",
      color: "text-green-600",
    },
    {
      icon: TrendingUp,
      label: "Tendencias",
      path: "/tendencias",
      color: "text-orange-600",
    },
    {
      icon: BookOpen,
      label: "Categorías",
      path: "/categorias",
      color: "text-blue-600",
    },
    {
      icon: Settings,
      label: "Configuración",
      path: "/configuracion",
      color: "text-gray-600",
    },
  ]

  const handleNavClick = (item: any) => {
    if (item.isMore) {
      setShowMoreMenu(!showMoreMenu)
    } else if (item.special && !isConnected) {
      connectWallet()
    } else {
      router.push(item.path)
      setShowMoreMenu(false)
    }
  }

  return (
    <>
      <AnimatePresence>
        {showMoreMenu && (
          <motion.div
            className="fixed inset-0 bg-black/20 z-40 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowMoreMenu(false)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showMoreMenu && (
          <motion.div
            className="fixed bottom-20 right-4 z-50 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden md:hidden"
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ duration: 0.2 }}
          >
            <div className="p-2">
              {moreMenuItems.map((item, index) => {
                const Icon = item.icon
                return (
                  <motion.button
                    key={item.path}
                    className="flex items-center space-x-3 w-full px-4 py-3 text-left hover:bg-gray-50 rounded-xl transition-colors"
                    onClick={() => {
                      router.push(item.path)
                      setShowMoreMenu(false)
                    }}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Icon className={`h-5 w-5 ${item.color}`} />
                    <span className="text-sm font-medium text-gray-900">{item.label}</span>
                  </motion.button>
                )
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        className="fixed bottom-0 left-0 right-0 z-50 md:hidden"
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="bg-white/95 backdrop-blur-lg border-t border-gray-200/50 shadow-2xl">
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-12 h-1 bg-gradient-to-r from-blue-400 to-purple-400 rounded-b-full"></div>

          <div className="flex items-center justify-around px-1 py-2">
            {navItems.map((item, index) => {
              const Icon = item.icon
              const isActive = item.active

              return (
                <motion.div
                  key={item.path}
                  className="relative"
                  whileTap={{ scale: 0.95 }}
                  transition={{ duration: 0.1 }}
                >
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`flex flex-col items-center justify-center h-14 w-14 relative transition-all duration-300 rounded-2xl ${
                      isActive
                        ? `${item.color} ${item.bgColor} shadow-lg`
                        : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                    }`}
                    onClick={() => handleNavClick(item)}
                  >
                    <div className="relative">
                      <motion.div animate={isActive ? { scale: 1.1 } : { scale: 1 }} transition={{ duration: 0.2 }}>
                        <Icon className="h-5 w-5 mb-0.5" />
                      </motion.div>

                      {item.badge && (
                        <motion.div
                          className="absolute -top-1 -right-1"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.2, type: "spring", stiffness: 500 }}
                        >
                          <Badge className="h-4 w-4 p-0 text-xs bg-gradient-to-r from-red-500 to-pink-500 text-white flex items-center justify-center border-2 border-white shadow-lg">
                            {item.badge}
                          </Badge>
                        </motion.div>
                      )}

                      {item.special && isConnected && (
                        <motion.div
                          className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.1 }}
                        />
                      )}
                    </div>

                    <span
                      className={`text-xs font-medium transition-all duration-200 ${
                        isActive ? "opacity-100" : "opacity-70"
                      }`}
                    >
                      {item.label}
                    </span>

                    {isActive && (
                      <motion.div
                        className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-6 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-b-full"
                        layoutId="activeTab"
                        transition={{ duration: 0.3, type: "spring", stiffness: 400 }}
                      />
                    )}

                    <motion.div
                      className="absolute inset-0 rounded-2xl"
                      initial={false}
                      animate={
                        isActive
                          ? {
                              boxShadow: "0 0 0 0 rgba(59, 130, 246, 0.4)",
                            }
                          : {}
                      }
                      whileTap={{
                        boxShadow: "0 0 0 8px rgba(59, 130, 246, 0.2)",
                      }}
                      transition={{ duration: 0.2 }}
                    />
                  </Button>
                </motion.div>
              )
            })}
          </div>

          {isConnected && (
            <motion.div
              className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-green-400 to-blue-500"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.5 }}
            />
          )}
        </div>
      </motion.div>
    </>
  )
}
