import { Shield, FileText, Award, Users, Crown, Star } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

export type UserRole = "Periodista" | "Verificador" | "Oráculo" | "Usuario" | "Administrador" | "Moderador"

interface RoleBadgeProps {
  role: UserRole
  isVerified?: boolean
  reputation?: number
  className?: string
  showIcon?: boolean
  showReputation?: boolean
}

export function RoleBadge({
  role,
  isVerified = false,
  reputation,
  className,
  showIcon = true,
  showReputation = false,
}: RoleBadgeProps) {
  const getRoleConfig = (role: UserRole) => {
    switch (role) {
      case "Periodista":
        return {
          icon: FileText,
          color: "bg-blue-100 text-blue-800 border-blue-200",
          label: "Periodista",
        }
      case "Verificador":
        return {
          icon: Shield,
          color: "bg-green-100 text-green-800 border-green-200",
          label: "Verificador",
        }
      case "Oráculo":
        return {
          icon: Award,
          color: "bg-purple-100 text-purple-800 border-purple-200",
          label: "Oráculo",
        }
      case "Administrador":
        return {
          icon: Crown,
          color: "bg-red-100 text-red-800 border-red-200",
          label: "Admin",
        }
      case "Moderador":
        return {
          icon: Star,
          color: "bg-yellow-100 text-yellow-800 border-yellow-200",
          label: "Moderador",
        }
      default:
        return {
          icon: Users,
          color: "bg-gray-100 text-gray-800 border-gray-200",
          label: "Usuario",
        }
    }
  }

  const config = getRoleConfig(role)
  const Icon = config.icon

  return (
    <div className="flex items-center gap-2">
      <Badge className={cn(config.color, "border", className)}>
        {showIcon && <Icon className="h-3 w-3 mr-1" />}
        <span>{config.label}</span>
      </Badge>
      {isVerified && <Shield className="h-4 w-4 text-green-600" />}
      {showReputation && reputation && (
        <Badge variant="outline" className="text-yellow-600 border-yellow-600">
          <Star className="h-3 w-3 mr-1 fill-current" />
          {reputation}%
        </Badge>
      )}
    </div>
  )
}
