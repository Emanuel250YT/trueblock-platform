"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"
import { Menu, Shield, Rss, Plus, Vote, Network, Settings, User } from "lucide-react"

const navigation = [
  { name: "Inicio", href: "/", icon: Shield },
  { name: "Feed", href: "/feed", icon: Rss },
  { name: "Verificar", href: "/submit", icon: Plus },
  { name: "Validar", href: "/vote", icon: Vote },
  { name: "Oráculos", href: "/oracles", icon: Network },
  { name: "Configuración", href: "/settings", icon: Settings },
]

export function MobileNav() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-80">
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center space-x-2 pb-6 border-b">
            <Shield className="h-6 w-6 text-primary" />
            <span className="font-bold text-xl">TrueBlock</span>
          </div>

          {/* Navigation */}
          <nav className="flex-1 py-6">
            <div className="space-y-2">
              {navigation.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                      pathname === item.href
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted",
                    )}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{item.name}</span>
                  </Link>
                )
              })}
            </div>
          </nav>

          {/* User Section */}
          <div className="border-t pt-6">
            <Button variant="outline" className="w-full justify-start bg-transparent">
              <User className="h-4 w-4 mr-2" />
              Conectar Wallet
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
