"use client"

import { useState, useEffect } from "react"
import { FeedFilters } from "@/components/feed/feed-filters"
import { NewsCard } from "@/components/feed/news-card"
import { PremiumBanner } from "@/components/feed/premium-banner"
import { EmptyState } from "@/components/feed/empty-states"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Loader2, TrendingUp, MapPin } from "lucide-react"
import { useNewsFeed, useNewsSearch } from "@/hooks/use-trueblock-api"
import { useWallet } from "@/contexts/wallet-context"
import { useLocation } from "@/contexts/location-context"

export default function FeedPage() {
  const { news, loading, error, refetch } = useNewsFeed()
  const { searchNews } = useNewsSearch()
  const [filteredNews, setFilteredNews] = useState<any[]>([])
  const [hasMore, setHasMore] = useState(true)
  const [showPremiumBanner, setShowPremiumBanner] = useState(true)

  const { isConnected } = useWallet()
  const { location } = useLocation()

  useEffect(() => {
    console.log("[v0] Loading feed from API...")
    refetch()
  }, [refetch])

  useEffect(() => {
    if (news) {
      console.log("[v0] Feed data received:", news)
      setFilteredNews(news)
    }
  }, [news])

  const handleFiltersChange = async (filters: any) => {
    console.log("[v0] Applying filters:", filters)

    if (filters.search) {
      await searchNews({
        query: filters.search,
        filters: {
          status: filters.status !== "all" ? filters.status : undefined,
          dateFrom: filters.dateFrom,
          dateTo: filters.dateTo,
          minScore: filters.minScore,
        },
        page: 1,
        limit: 20,
      })
    } else {
      await refetch()
    }
  }

  const loadMore = async () => {
    console.log("[v0] Loading more items...")
    const currentPage = Math.floor((filteredNews?.length || 0) / 20) + 1
    await refetch()
  }

  const clearFilters = () => {
    console.log("[v0] Clearing filters...")
    refetch()
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <main className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <p className="text-destructive mb-4">Error cargando el feed: {error}</p>
            <Button onClick={() => refetch()}>Reintentar</Button>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
            <div className="min-w-0 flex-1">
              <h1 className="text-2xl sm:text-3xl font-bold mb-2">Feed de Verificaciones</h1>
              <p className="text-muted-foreground text-sm sm:text-base">
                Noticias verificadas en tiempo real por nuestra red de oráculos y comunidad
              </p>
              {location.city && (
                <div className="flex items-center gap-1 mt-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>
                    Contenido personalizado para {location.city}, {location.country}
                  </span>
                </div>
              )}
            </div>
            <div className="flex-shrink-0">
              <Badge variant="outline" className="bg-primary/10 text-primary border-primary text-xs sm:text-sm">
                <TrendingUp className="h-3 w-3 mr-1" />
                <span className="truncate">{filteredNews?.length || 0} verificaciones</span>
              </Badge>
            </div>
          </div>

          {/* Premium Banner */}
          {showPremiumBanner && !isConnected && (
            <div className="mb-6">
              <PremiumBanner />
            </div>
          )}

          {/* Filters */}
          <FeedFilters onFiltersChange={handleFiltersChange} />
        </div>

        {/* Content */}
        <div className="space-y-6">
          {loading && (!filteredNews || filteredNews.length === 0) ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2 text-muted-foreground">Cargando verificaciones...</span>
            </div>
          ) : !filteredNews || filteredNews.length === 0 ? (
            <EmptyState type="no-results" onClearFilters={clearFilters} />
          ) : (
            <>
              {/* News Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredNews.map((item, index) => (
                  <NewsCard key={item.contentHash || item.id || index} {...item} />
                ))}
              </div>

              {/* Load More */}
              {hasMore && (
                <div className="text-center py-8">
                  <Button onClick={loadMore} disabled={loading} variant="outline" size="lg">
                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Cargando...
                      </>
                    ) : (
                      "Cargar Más Verificaciones"
                    )}
                  </Button>
                </div>
              )}

              {!hasMore && filteredNews.length > 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <p>Has visto todas las verificaciones disponibles</p>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  )
}
