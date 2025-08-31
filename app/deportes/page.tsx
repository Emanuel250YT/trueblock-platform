import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Shield, CheckCircle, Clock, TrendingUp, Users, Eye, Trophy } from "lucide-react"

export default function SportsPage() {
  const sportsNews = [
    {
      id: 1,
      title: "FIFA World Cup 2024: National team advances to quarterfinals",
      excerpt:
        "With a 2-1 victory over the rival team, the national team secures its place in the next round of the world championship.",
      verificationScore: 99,
      category: "Sports",
      readTime: "3 min",
      views: "25.4K",
      trend: "trending",
      image: "/football-world-championship.png",
      publishedAt: "30 minutes ago",
      source: "Verified Source",
    },
    {
      id: 2,
      title: "World swimming record: New mark in 100-meter freestyle",
      excerpt:
        "The swimmer sets a new world record with a time of 46.86 seconds, beating the previous mark by 0.12 seconds.",
      verificationScore: 97,
      category: "Sports",
      readTime: "2 min",
      views: "19.8K",
      trend: "hot",
      image: "/swimming-world-record.png",
      publishedAt: "2 hours ago",
      source: "Verified Source",
    },
    {
      id: 3,
      title: "National League: Football classic ends in historic tie",
      excerpt:
        "The most anticipated match of the year culminates 3-3 in an encounter full of emotions and spectacular plays that kept fans on edge.",
      verificationScore: 95,
      category: "Sports",
      readTime: "4 min",
      views: "31.2K",
      trend: "rising",
      image: "/football-classic-match.png",
      publishedAt: "4 hours ago",
      source: "Verified Source",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-orange-50">
      {/* Header Section */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Trophy className="h-6 w-6 text-orange-600" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900">Sports</h1>
          </div>
          <p className="text-lg text-slate-600 max-w-3xl">
            Sports news verified instantly. Results, analysis and complete coverage of all sports with 100% reliable information.
          </p>

          {/* Stats */}
          <div className="flex items-center gap-6 mt-6">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span className="text-sm font-medium text-slate-700">2,156 verified news</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-600" />
              <span className="text-sm font-medium text-slate-700">134 active validators</span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-orange-600" />
              <span className="text-sm font-medium text-slate-700">Trend: World Cup in progress</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-wrap gap-3">
          <Button variant="default" size="sm">
            All
          </Button>
          <Button variant="outline" size="sm">
            Football
          </Button>
          <Button variant="outline" size="sm">
            Basketball
          </Button>
          <Button variant="outline" size="sm">
            Tennis
          </Button>
          <Button variant="outline" size="sm">
            Swimming
          </Button>
          <Button variant="outline" size="sm">
            Atletismo
          </Button>
        </div>
      </div>

      {/* News Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sportsNews.map((news) => (
            <Card
              key={news.id}
              className="group hover:shadow-xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm"
            >
              <div className="relative overflow-hidden rounded-t-lg">
                <img
                  src={news.image || "/placeholder.svg"}
                  alt={news.title}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 left-3 flex gap-2">
                  <Badge variant="secondary" className="bg-orange-600 text-white">
                    {news.category}
                  </Badge>
                  {news.trend === "trending" && (
                    <Badge variant="secondary" className="bg-red-500 text-white">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      Trending
                    </Badge>
                  )}
                </div>
                <div className="absolute top-3 right-3">
                  <div className="flex items-center gap-1 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                    <Shield className="h-3 w-3" />
                    {news.verificationScore}%
                  </div>
                </div>
              </div>

              <CardHeader className="pb-3">
                <CardTitle className="text-lg leading-tight group-hover:text-orange-600 transition-colors">
                  {news.title}
                </CardTitle>
              </CardHeader>

              <CardContent className="pt-0">
                <p className="text-slate-600 text-sm mb-4 line-clamp-3">{news.excerpt}</p>

                <div className="flex items-center justify-between text-xs text-slate-500 mb-4">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {news.readTime}
                    </span>
                    <span className="flex items-center gap-1">
                      <Eye className="h-3 w-3" />
                      {news.views}
                    </span>
                  </div>
                  <span>{news.publishedAt}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-orange-600">{news.source}</span>
                  <Button size="sm" variant="outline" className="hover:bg-orange-50 bg-transparent">
                    Read more
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Load More */}
        <div className="text-center mt-12">
          <Button size="lg" variant="outline" className="px-8 bg-transparent">
            Load more news
          </Button>
        </div>
      </div>
    </div>
  )
}
