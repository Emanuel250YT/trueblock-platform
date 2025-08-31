"use client"

import { useState, useEffect } from "react"
import { MainNav } from "@/components/navigation/main-nav"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { StatusBadge } from "@/components/ui/status-badge"
import { Search, Filter, Plus, Download, Eye, MoreHorizontal, Loader2 } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import Link from "next/link"
import { useTasks } from "@/hooks/use-api"
import { apiClient } from "@/lib/api"

export default function TasksPage() {
  const { data: tasks, loading, error, loadTasks, updateTask } = useTasks()
  const [filteredTasks, setFilteredTasks] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [categoryFilter, setCategoryFilter] = useState("all")

  useEffect(() => {
    console.log("[v0] Loading tasks from API...")
    loadTasks()
  }, [loadTasks])

  useEffect(() => {
    if (tasks) {
      console.log("[v0] Tasks data received:", tasks)
      setFilteredTasks(tasks)
    }
  }, [tasks])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const handleSearch = async () => {
    console.log("[v0] Applying filters and reloading from API...")

    await loadTasks({
      page: 1,
      per_page: 20,
      status: statusFilter !== "all" ? statusFilter : undefined,
      category: categoryFilter !== "all" ? categoryFilter : undefined,
    })
  }

  const exportTasks = async () => {
    console.log("[v0] Exporting tasks...")
    try {
      const response = await apiClient.tasks.export({
        format: "csv",
        status: statusFilter !== "all" ? statusFilter : undefined,
        category: categoryFilter !== "all" ? categoryFilter : undefined,
      })

      if (response.ok) {
        const blob = await response.blob()
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = "trueblock-tasks.csv"
        a.click()
        URL.revokeObjectURL(url)
      }
    } catch (error) {
      console.error("[v0] Error exporting tasks:", error)
      if (filteredTasks && filteredTasks.length > 0) {
        const csv = [
          "ID,Title,URL,Status,Category,Created,Updated",
          ...filteredTasks.map(
            (task) =>
              `${task.id},"${task.title}","${task.url}",${task.status},${task.category},${task.createdAt},${task.updatedAt}`,
          ),
        ].join("\n")

        const blob = new Blob([csv], { type: "text/csv" })
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = "trueblock-tasks.csv"
        a.click()
        URL.revokeObjectURL(url)
      }
    }
  }

  const duplicateTask = async (taskId: string) => {
    console.log("[v0] Duplicating task:", taskId)
    await updateTask(taskId, "retry")
    await loadTasks() // Recargar lista
  }

  const cancelTask = async (taskId: string) => {
    console.log("[v0] Cancelling task:", taskId)
    await updateTask(taskId, "cancel")
    await loadTasks() // Recargar lista
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <MainNav />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <p className="text-destructive mb-4">Error loading tasks: {error}</p>
            <Button onClick={() => loadTasks()}>Reintentar</Button>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <MainNav />

      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold mb-2">My Verifications</h1>
            <p className="text-muted-foreground">Manage and monitor all your verification requests</p>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <Button variant="outline" onClick={exportTasks} className="w-full sm:w-auto bg-transparent">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button asChild className="w-full sm:w-auto">
              <Link href="/submit">
                <Plus className="h-4 w-4 mr-2" />
                New Verification
              </Link>
            </Button>
          </div>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardHeader className="pb-4">
            <CardTitle className="text-base">Filtros</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by title, domain or URL..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All statuses</SelectItem>
                    <SelectItem value="pending">Pendiente</SelectItem>
                    <SelectItem value="processing">En proceso</SelectItem>
                    <SelectItem value="completed">Completado</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All categories</SelectItem>
                    <SelectItem value="Política">Política</SelectItem>
                    <SelectItem value="Ciencia">Ciencia</SelectItem>
                    <SelectItem value="Deportes">Deportes</SelectItem>
                    <SelectItem value="Tecnología">Tecnología</SelectItem>
                  </SelectContent>
                </Select>
                <Button onClick={handleSearch}>
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tasks Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <span>Verifications ({filteredTasks?.length || 0})</span>
              <Badge variant="outline">{filteredTasks?.length || 0} resultados</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <span className="ml-2 text-muted-foreground">Loading tasks...</span>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredTasks && filteredTasks.length > 0 ? (
                  filteredTasks.map((task) => (
                    <div
                      key={task.id}
                      className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-4 border rounded-lg hover:bg-muted/20 transition-colors"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <Badge variant="outline" className="text-xs">
                            {task.category}
                          </Badge>
                          <span className="text-xs text-muted-foreground truncate">{task.domain}</span>
                        </div>
                        <h3 className="font-medium text-sm mb-2 line-clamp-2">{task.title}</h3>
                        <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs text-muted-foreground">
                          <span>ID: {task.id}</span>
                          <span>Created: {formatDate(task.createdAt || task.created_at)}</span>
                          <span>Updated: {formatDate(task.updatedAt || task.updated_at)}</span>
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                        <div className="text-center">
                          <StatusBadge status={task.verdict || task.status} confidence={task.confidence} />
                          {task.confidence && (
                            <p className="text-xs text-muted-foreground mt-1">
                              {Math.round(task.confidence * 100)}% confianza
                            </p>
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm" asChild className="flex-1 sm:flex-none bg-transparent">
                            <Link href={`/tasks/${task.id}`}>
                              <Eye className="h-4 w-4 mr-2" />
                              Ver
                            </Link>
                          </Button>

                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => duplicateTask(task.id)}>Duplicar</DropdownMenuItem>
                              {task.status === "pending" && (
                                <DropdownMenuItem onClick={() => cancelTask(task.id)} className="text-destructive">
                                  Cancelar
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground mb-4">No se encontraron verificaciones</p>
                    <Button asChild>
                      <Link href="/submit">
                        <Plus className="h-4 w-4 mr-2" />
                        Crear Primera Verificación
                      </Link>
                    </Button>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
