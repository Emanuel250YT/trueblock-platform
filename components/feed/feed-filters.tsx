"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { Badge } from "@/components/ui/badge"
import { Search, Filter, CalendarIcon, X } from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"

interface FeedFiltersProps {
  onFiltersChange: (filters: any) => void
}

const categories = ["Todas", "Política", "Salud", "Economía", "Tecnología", "Deportes", "Entretenimiento", "Ciencia"]

const statuses = [
  { value: "all", label: "Todos los estados" },
  { value: "true", label: "Verdadero" },
  { value: "fake", label: "Falso" },
  { value: "doubtful", label: "Dudoso" },
  { value: "processing", label: "Procesando" },
]

const languages = [
  { value: "all", label: "Todos los idiomas" },
  { value: "es", label: "Español" },
  { value: "en", label: "Inglés" },
  { value: "pt", label: "Portugués" },
]

export function FeedFilters({ onFiltersChange }: FeedFiltersProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("Todas")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [selectedLanguage, setSelectedLanguage] = useState("all")
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({})
  const [showFilters, setShowFilters] = useState(false)

  const activeFiltersCount = [
    selectedCategory !== "Todas",
    selectedStatus !== "all",
    selectedLanguage !== "all",
    dateRange.from || dateRange.to,
    searchQuery.length > 0,
  ].filter(Boolean).length

  const clearFilters = () => {
    setSearchQuery("")
    setSelectedCategory("Todas")
    setSelectedStatus("all")
    setSelectedLanguage("all")
    setDateRange({})
    onFiltersChange({
      search: "",
      category: "Todas",
      status: "all",
      language: "all",
      dateRange: {},
      minScore: 50, // Score mínimo por defecto
    })
  }

  const handleFiltersChange = () => {
    onFiltersChange({
      search: searchQuery,
      category: selectedCategory,
      status: selectedStatus,
      language: selectedLanguage,
      dateFrom: dateRange.from?.toISOString(),
      dateTo: dateRange.to?.toISOString(),
      minScore: 50, // Score mínimo por defecto
    })
  }

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por URL, dominio o palabras clave..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleFiltersChange()}
            className="pl-10"
          />
        </div>
        <Button onClick={handleFiltersChange}>Buscar</Button>
      </div>

      {/* Filter Toggle */}
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={() => setShowFilters(!showFilters)} className="bg-transparent">
          <Filter className="h-4 w-4 mr-2" />
          Filtros
          {activeFiltersCount > 0 && (
            <Badge variant="secondary" className="ml-2">
              {activeFiltersCount}
            </Badge>
          )}
        </Button>

        {activeFiltersCount > 0 && (
          <Button variant="ghost" onClick={clearFilters} size="sm">
            <X className="h-4 w-4 mr-1" />
            Limpiar filtros
          </Button>
        )}
      </div>

      {/* Expanded Filters */}
      {showFilters && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4 border rounded-lg bg-muted/20">
          {/* Category Filter */}
          <div className="space-y-2">
            <Label>Categoría</Label>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Status Filter */}
          <div className="space-y-2">
            <Label>Estado</Label>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {statuses.map((status) => (
                  <SelectItem key={status.value} value={status.value}>
                    {status.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Language Filter */}
          <div className="space-y-2">
            <Label>Idioma</Label>
            <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {languages.map((language) => (
                  <SelectItem key={language.value} value={language.value}>
                    {language.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Date Range Filter */}
          <div className="space-y-2">
            <Label>Rango de fechas</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start text-left font-normal bg-transparent">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateRange.from ? (
                    dateRange.to ? (
                      <>
                        {format(dateRange.from, "dd/MM/yy", { locale: es })} -{" "}
                        {format(dateRange.to, "dd/MM/yy", { locale: es })}
                      </>
                    ) : (
                      format(dateRange.from, "dd/MM/yyyy", { locale: es })
                    )
                  ) : (
                    "Seleccionar fechas"
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={dateRange.from}
                  selected={dateRange}
                  onSelect={setDateRange}
                  numberOfMonths={2}
                  locale={es}
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Apply Filters Button */}
          <div className="md:col-span-2 lg:col-span-4 flex justify-end">
            <Button onClick={handleFiltersChange}>Aplicar Filtros</Button>
          </div>
        </div>
      )}
    </div>
  )
}
