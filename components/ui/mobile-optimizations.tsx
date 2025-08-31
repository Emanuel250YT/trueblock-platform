"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronUp, Wifi, WifiOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useWallet } from "@/contexts/wallet-context"
import { useLocation } from "@/contexts/location-context"

export function MobileOptimizations() {
  const [isOnline, setIsOnline] = useState(true)
  const [showScrollTop, setShowScrollTop] = useState(false)
  const { isConnected } = useWallet()
  const { locationData } = useLocation()

  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400)
    }

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)
    window.addEventListener("scroll", handleScroll)

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <>
      {/* Indicador de conexión offline */}
      <AnimatePresence>
        {!isOnline && (
          <motion.div
            className="fixed top-0 left-0 right-0 z-50 bg-red-500 text-white text-center py-2 text-sm font-medium md:hidden"
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            exit={{ y: -100 }}
          >
            <div className="flex items-center justify-center space-x-2">
              <WifiOff className="h-4 w-4" />
              <span>Sin conexión a internet</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Indicador de estado de conexión */}
      <div className="fixed top-4 right-4 z-40 md:hidden">
        <div className="flex flex-col space-y-2">
          {isConnected && (
            <motion.div
              className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1 shadow-lg"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5 }}
            >
              <div className="w-2 h-2 bg-green-300 rounded-full animate-pulse"></div>
              <span>Wallet</span>
            </motion.div>
          )}

          {locationData && (
            <motion.div
              className="bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1 shadow-lg"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.7 }}
            >
              <div className="w-2 h-2 bg-blue-300 rounded-full animate-pulse"></div>
              <span>{locationData.temperature}°C</span>
            </motion.div>
          )}

          {isOnline && (
            <motion.div
              className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1 shadow-lg"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3 }}
            >
              <Wifi className="h-3 w-3" />
              <span>Online</span>
            </motion.div>
          )}
        </div>
      </div>

      {/* Botón scroll to top */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.div
            className="fixed bottom-24 right-4 z-40 md:hidden"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Button
              onClick={scrollToTop}
              className="w-12 h-12 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg"
            >
              <ChevronUp className="h-5 w-5" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
