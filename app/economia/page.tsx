import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Shield, CheckCircle, Clock, TrendingUp, Users, Eye, DollarSign } from "lucide-react"

export default function EconomiaPage() {
  const economicNews = [
    {
      id: 1,
      title: "Financial markets show positive trend after central bank announcements",
      excerpt:
        "Stock indices register 3.2% growth following statements on monetary policy and interest rates.",
      verificationScore: 96,
      category: "Economy",
      readTime: "4 min",
      views: "18.7K",
      trend: "trending",
      image: "/financial-markets-positive-trend.png",
      publishedAt: "1 hour ago",
      source: "Verified Source",
    },
    {
      id: 2,
      title: "Annual inflation remains at 2.8% according to latest official data",
      excerpt:
        "The consumer price index shows stability, meeting government projections for the current quarter.",
      verificationScore: 98,
      category: "Economy",
      readTime: "3 min",
      views: "14.2K",
      trend: "hot",
      image: "/inflation-data-analysis.png",
      publishedAt: "3 hours ago",
      source: "Verified Source",
    },
    {
      id: 3,
      title: "Technology sector leads economic growth with 15% expansion",
      excerpt:
        "Technology companies drive national GDP, generating over 200,000 direct jobs in the last year.",
      verificationScore: 93,
      category: "Economy",
      readTime: "5 min",
      views: "11.8K",
      trend: "rising",
      image: "/tech-sector-growth.png",
      publishedAt: "5 hours ago",
      source: "Verified Source",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-green-50">
      {/* Header Section */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-green-100 rounded-lg">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900">Economy</h1>
          </div>
          <p className="text-lg text-slate-600 max-w-3xl">
            Verified and reliable economic information. Market analysis, financial indicators and news that impact the national and international economy.
          </p>

          {/* Stats */}
          <div className="flex items-center gap-6 mt-6">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span className="text-sm font-medium text-slate-700">892 verified news</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-600" />
              <span className="text-sm font-medium text-slate-700">67 active validators</span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-orange-600" />
              <span className="text-sm font-medium text-slate-700">Trend: Bull markets</span>
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
            Markets
          </Button>
          <Button variant="outline" size="sm">
            Banking
          </Button>
          <Button variant="outline" size="sm">
            Cryptocurrency
          </Button>
          <Button variant="outline" size="sm">
            Companies
          </Button>
          <Button variant="outline" size="sm">
            International
          </Button>
        </div>
      </div>

      {/* News Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {economicNews.map((news) => (
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
                  <Badge variant="secondary" className="bg-green-600 text-white">
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
                <CardTitle className="text-lg leading-tight group-hover:text-green-600 transition-colors">
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
                  <span className="text-xs font-medium text-green-600">{news.source}</span>
                  <Button size="sm" variant="outline" className="hover:bg-green-50 bg-transparent">
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
