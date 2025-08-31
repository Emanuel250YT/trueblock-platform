'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export interface LocationData {
  city: string
  country: string
  temperature: number
  condition: string
  humidity: number
  windSpeed: number
  timezone: string
  currentDate: string
  currentTime: string
}

interface LocationContextType {
  location: LocationData
  updateLocation: (newLocation: Partial<LocationData>) => void
  refreshLocation: () => void
  isLoading: boolean
}

const LocationContext = createContext<LocationContextType | undefined>(undefined)

const getDefaultLocationData = (): LocationData => {
  const now = new Date()
  return {
    city: "Santiago",
    country: "Chile",
    temperature: 22,
    condition: "Soleado",
    humidity: 45,
    windSpeed: 12,
    timezone: "America/Santiago",
    currentDate: now.toLocaleDateString("es-ES", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }),
    currentTime: now.toLocaleTimeString("es-ES", {
      hour: "2-digit",
      minute: "2-digit"
    })
  }
}

interface LocationProviderProps {
  children: ReactNode
}

export function LocationProvider({ children }: LocationProviderProps) {
  const [location, setLocation] = useState<LocationData>(getDefaultLocationData())
  const [isLoading, setIsLoading] = useState(false)

  const generateRealisticWeatherData = () => {
    const conditions = ["Soleado", "Parcialmente nublado", "Nublado", "Lluvia ligera", "Despejado"]
    const temperatures = [18, 20, 22, 24, 26, 28]
    const humidities = [35, 40, 45, 50, 55, 60]
    const windSpeeds = [8, 10, 12, 15, 18, 20]

    return {
      condition: conditions[Math.floor(Math.random() * conditions.length)],
      temperature: temperatures[Math.floor(Math.random() * temperatures.length)],
      humidity: humidities[Math.floor(Math.random() * humidities.length)],
      windSpeed: windSpeeds[Math.floor(Math.random() * windSpeeds.length)]
    }
  }

  const detectLocationFromTimezone = () => {
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
    let city = "Santiago"
    let country = "Chile"

    if (timezone.includes("Mexico")) {
      city = "Ciudad de México"
      country = "México"
    } else if (timezone.includes("Argentina")) {
      city = "Buenos Aires"
      country = "Argentina"
    } else if (timezone.includes("Colombia")) {
      city = "Bogotá"
      country = "Colombia"
    } else if (timezone.includes("Peru")) {
      city = "Lima"
      country = "Perú"
    } else if (timezone.includes("Spain") || timezone.includes("Madrid")) {
      city = "Madrid"
      country = "España"
    } else if (timezone.includes("New_York")) {
      city = "Nueva York"
      country = "Estados Unidos"
    }

    return {
      city,
      country,
      timezone
    }
  }

  const updateLocation = (newLocation: Partial<LocationData>) => {
    setLocation(prev => ({ ...prev, ...newLocation }))
  }

  const refreshLocation = () => {
    setIsLoading(true)
    const locationData = detectLocationFromTimezone()
    const weatherData = generateRealisticWeatherData()
    const now = new Date()

    setLocation(prev => ({
      ...prev,
      ...locationData,
      ...weatherData,
      currentDate: now.toLocaleDateString("es-ES", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      currentTime: now.toLocaleTimeString("es-ES", {
        hour: "2-digit",
        minute: "2-digit"
      })
    }))

    setIsLoading(false)
  }

  const updateDateTime = () => {
    const now = new Date()
    setLocation(prev => ({
      ...prev,
      currentDate: now.toLocaleDateString("es-ES", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      currentTime: now.toLocaleTimeString("es-ES", {
        hour: "2-digit",
        minute: "2-digit"
      })
    }))
  }

  useEffect(() => {
    setIsLoading(true)

    // Simular carga de datos de ubicación
    const timer = setTimeout(() => {
      const locationData = detectLocationFromTimezone()
      const weatherData = generateRealisticWeatherData()
      const now = new Date()

      setLocation(prev => ({
        ...prev,
        ...locationData,
        ...weatherData,
        currentDate: now.toLocaleDateString("es-ES", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
        currentTime: now.toLocaleTimeString("es-ES", {
          hour: "2-digit",
          minute: "2-digit"
        })
      }))

      setIsLoading(false)
    }, 1000)

    // Actualizar hora cada minuto
    const timeInterval = setInterval(updateDateTime, 60000)

    // Actualizar clima cada 30 minutos
    const weatherInterval = setInterval(() => {
      const newWeatherData = generateRealisticWeatherData()
      setLocation(prev => ({ ...prev, ...newWeatherData }))
    }, 30 * 60 * 1000)

    return () => {
      clearTimeout(timer)
      clearInterval(timeInterval)
      clearInterval(weatherInterval)
    }
  }, [])

  const value: LocationContextType = {
    location,
    updateLocation,
    refreshLocation,
    isLoading
  }

  return (
    <LocationContext.Provider value={value}>
      {children}
    </LocationContext.Provider>
  )
}

export function useLocation() {
  const context = useContext(LocationContext)
  if (context === undefined) {
    throw new Error('useLocation must be used within a LocationProvider')
  }
  return context
}
