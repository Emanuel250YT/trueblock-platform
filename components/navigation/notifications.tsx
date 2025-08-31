"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Bell, CheckCircle, Clock, Users } from "lucide-react"

const notifications = [
  {
    id: 1,
    type: "verification_complete",
    title: "Verificación completada",
    message: "Tu noticia sobre política económica ha sido verificada como Verdadera",
    time: "hace 5 min",
    read: false,
    icon: CheckCircle,
    iconColor: "text-primary",
  },
  {
    id: 2,
    type: "community_vote",
    title: "Nueva votación disponible",
    message: "Hay 3 noticias esperando tu validación comunitaria",
    time: "hace 12 min",
    read: false,
    icon: Users,
    iconColor: "text-info",
  },
  {
    id: 3,
    type: "processing",
    title: "Verificación en proceso",
    message: "Tu solicitud está siendo procesada por los oráculos de IA",
    time: "hace 1 hora",
    read: true,
    icon: Clock,
    iconColor: "text-accent",
  },
]

export function NotificationCenter() {
  const [unreadCount, setUnreadCount] = useState(notifications.filter((n) => !n.read).length)

  const markAsRead = (id: number) => {
    // En una implementación real, esto actualizaría el estado en el servidor
    setUnreadCount((prev) => Math.max(0, prev - 1))
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
            >
              {unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="font-semibold">Notificaciones</h3>
          {unreadCount > 0 && <Badge variant="secondary">{unreadCount} nuevas</Badge>}
        </div>

        <div className="max-h-96 overflow-y-auto">
          {notifications.map((notification) => {
            const Icon = notification.icon
            return (
              <DropdownMenuItem
                key={notification.id}
                className="flex items-start space-x-3 p-4 cursor-pointer"
                onClick={() => !notification.read && markAsRead(notification.id)}
              >
                <Icon className={`h-5 w-5 mt-0.5 ${notification.iconColor}`} />
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">{notification.title}</p>
                    {!notification.read && <div className="h-2 w-2 bg-primary rounded-full" />}
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2">{notification.message}</p>
                  <p className="text-xs text-muted-foreground">{notification.time}</p>
                </div>
              </DropdownMenuItem>
            )
          })}
        </div>

        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-center justify-center">Ver todas las notificaciones</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
