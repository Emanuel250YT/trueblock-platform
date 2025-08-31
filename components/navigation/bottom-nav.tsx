"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Rss, Plus, Users, Settings, Zap } from "lucide-react"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

const navItems = [
  {
    name: "Feed",
    href: "/feed",
    icon: Rss,
  },
  {
    name: "Verificar",
    href: "/submit",
    icon: Plus,
  },
  {
    name: "Validar",
    href: "/vote",
    icon: Users,
  },
  {
    name: "Oráculos",
    href: "/oracles",
    icon: Zap,
  },
  {
    name: "Ajustes",
    href: "/settings",
    icon: Settings,
  },
]

export function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-t border-border md:hidden">
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map((item, index) => {
          const isActive = pathname === item.href
          const Icon = item.icon

          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center flex-1 h-full space-y-1 transition-colors relative",
                isActive ? "text-primary" : "text-muted-foreground hover:text-foreground",
              )}
            >
              <motion.div animate={isActive ? { scale: [1, 1.1, 1] } : { scale: 1 }} transition={{ duration: 0.3 }}>
                <Icon className="h-5 w-5" />
              </motion.div>
              <span className="text-xs font-medium">{item.name}</span>

              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute -top-0.5 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-primary rounded-full"
                  initial={false}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
