"use client"

import { ArrowLeft, Share2, Bookmark, MoreVertical } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { useWallet } from "@/contexts/wallet-context"

interface MobileHeaderProps {
  title?: string
  showBack?: boolean
  showActions?: boolean
  onShare?: () => void
  onBookmark?: () => void
}

export function MobileHeader({
  title = "TrueBlock",
  showBack = false,
  showActions = false,
  onShare,
  onBookmark,
}: MobileHeaderProps) {
  const router = useRouter()
  const { isConnected, address } = useWallet()

  return (
    <motion.header
      className="sticky top-0 z-40 bg-white/95 backdrop-blur-lg border-b border-gray-200/50 md:hidden"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center space-x-3">
          {showBack && (
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-full" onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
          )}

          <div>
            <h1 className="text-lg font-bold text-gray-900 truncate max-w-48">{title}</h1>
            {isConnected && (
              <p className="text-xs text-green-600 font-medium">
                {address?.slice(0, 6)}...{address?.slice(-4)}
              </p>
            )}
          </div>
        </div>

        {showActions && (
          <div className="flex items-center space-x-2">
            {onShare && (
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-full" onClick={onShare}>
                <Share2 className="h-4 w-4" />
              </Button>
            )}

            {onBookmark && (
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-full" onClick={onBookmark}>
                <Bookmark className="h-4 w-4" />
              </Button>
            )}

            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-full">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </motion.header>
  )
}
