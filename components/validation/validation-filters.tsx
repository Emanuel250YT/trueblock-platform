"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Filter, X } from "lucide-react"

interface ValidationFiltersProps {
  onFiltersChange: (filters: any) => void
}

const categories = ["Todas", "Política", "Salud", "Economía", "Tecnología", "Deportes", "Entretenimiento", "Ciencia"]
const priorities = [
  { value: "all", label: "Todas las prioridades" },
  { value: "high", label: "Alta prioridad" },
  { value: "normal", label: "Normal" },
]
const sortOptions = [
  { value: "reward", label: "Mayor recompensa" },
  { value: "time", label: "Menos tiempo restante" },
  { value: "difficulty", label: "Más difícil" },
  { value: "recent", label: "Más reciente" },
]

export function ValidationFilters({ onFiltersChange }: ValidationFiltersProps) {
  const [selectedCategory, setSelectedCategory] = useState("Todas")
  const [selectedPriority, setSelectedPriority] = useState("all")
  const [selectedSort, setSelectedSort] = useState("reward")
  const [showFilters, setShowFilters] = useState(false)

  const activeFiltersCount = [selectedCategory !== "Todas", selectedPriority !== "all"].filter(Boolean).length

  const clearFilters = () => {
    setSelectedCategory("Todas")
    setSelectedPriority("all")
    setSelectedSort("reward")
    onFiltersChange({
      category: "Todas",
      priority: "all",
      sort: "reward",
    })
  }

  const handleFiltersChange = () => {
    onFiltersChange({
      category: selectedCategory,
      priority: selectedPriority,
      sort: selectedSort,
    })
  }

  return (
    <div className="space-y-4">
      {/* Filter Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <Button variant="outline" onClick={() => setShowFilters(!showFilters)} className="bg-transparent w-fit">
          <Filter className="h-4 w-4 mr-2" />
          Filtros
          {activeFiltersCount > 0 && (
            <Badge variant="secondary" className="ml-2">
              {activeFiltersCount}
            </Badge>
          )}
        </Button>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
          {activeFiltersCount > 0 && (
            <Button variant="ghost" onClick={clearFilters} size="sm" className="w-fit">
              <X className="h-4 w-4 mr-1" />
              Limpiar
            </Button>
          )}

          {/* Sort - Always visible */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Label className="text-sm whitespace-nowrap">Ordenar:</Label>
            <Select value={selectedSort} onValueChange={setSelectedSort}>
              <SelectTrigger className="w-full sm:w-40 min-w-0">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {sortOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Expanded Filters */}
      {showFilters && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border rounded-lg bg-muted/20">
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

          {/* Priority Filter */}
          <div className="space-y-2">
            <Label>Prioridad</Label>
            <Select value={selectedPriority} onValueChange={setSelectedPriority}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {priorities.map((priority) => (
                  <SelectItem key={priority.value} value={priority.value}>
                    {priority.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Apply Filters Button */}
          <div className="md:col-span-2 flex justify-end">
            <Button onClick={handleFiltersChange}>Aplicar Filtros</Button>
          </div>
        </div>
      )}
    </div>
  )
}
