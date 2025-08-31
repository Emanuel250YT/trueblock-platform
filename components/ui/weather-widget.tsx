"use client"

import { Cloud, Sun, CloudRain, CloudSnow, Zap, Eye, Wind, Droplets, Thermometer, MapPin } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useLocation } from "@/contexts/location-context"
import { motion } from "framer-motion"

export function WeatherWidget() {
  const { locationData, isLoading, requestPreciseLocation } = useLocation()

  const getWeatherIcon = (iconCode: string) => {
    if (iconCode.startsWith("01")) return <Sun className="h-6 w-6 text-yellow-500" />
    if (iconCode.startsWith("02") || iconCode.startsWith("03")) return <Cloud className="h-6 w-6 text-gray-500" />
    if (iconCode.startsWith("10") || iconCode.startsWith("09")) return <CloudRain className="h-6 w-6 text-blue-500" />
    if (iconCode.startsWith("13")) return <CloudSnow className="h-6 w-6 text-blue-300" />
    if (iconCode.startsWith("11")) return <Zap className="h-6 w-6 text-purple-500" />
    return <Sun className="h-6 w-6 text-yellow-500" />
  }

  if (isLoading) {
    return (
      <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-100">
        <CardContent className="p-4">
          <div className="animate-pulse">
            <div className="h-4 bg-blue-200 rounded w-3/4 mb-2"></div>
            <div className="h-6 bg-blue-200 rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!locationData) return null

  return (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }}>
      <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-100 hover:shadow-lg transition-all duration-300">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <MapPin className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-900">
                {locationData.city}, {locationData.country}
              </span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={requestPreciseLocation}
              className="h-6 px-2 text-xs text-blue-600 hover:bg-blue-100"
            >
              <Eye className="h-3 w-3 mr-1" />
              Precisa
            </Button>
          </div>

          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-3">
              {getWeatherIcon(locationData.weatherIcon)}
              <div>
                <div className="text-2xl font-bold text-blue-900">{locationData.temperature}°C</div>
                <div className="text-xs text-blue-700 capitalize">{locationData.weather}</div>
              </div>
            </div>

            <div className="text-right">
              <div className="text-sm font-medium text-blue-900">{locationData.currentTime}</div>
              <div className="text-xs text-blue-700">{locationData.currentDate.split(",")[0]}</div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 text-xs">
            <div className="flex items-center space-x-1 text-blue-700">
              <Thermometer className="h-3 w-3" />
              <span>Sensación {locationData.feelsLike}°</span>
            </div>
            <div className="flex items-center space-x-1 text-blue-700">
              <Droplets className="h-3 w-3" />
              <span>{locationData.humidity}% hum.</span>
            </div>
            <div className="flex items-center space-x-1 text-blue-700">
              <Wind className="h-3 w-3" />
              <span>{locationData.windSpeed} km/h</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
