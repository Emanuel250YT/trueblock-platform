import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Shield, CheckCircle, Clock, TrendingUp, Users, Eye } from "lucide-react"

export default function PoliticaPage() {
  const politicalNews = [
    {
      id: 1,
      title: "New tax reform proposed by government generates debate in congress",
      excerpt:
        "The proposal includes significant changes in taxation for companies and individuals, aiming to increase revenue by 15%.",
      verificationScore: 94,
      category: "Politics",
      readTime: "5 min",
      views: "12.5K",
      trend: "trending",
      image: "/government-economic-policy-announcement.png",
      publishedAt: "2 hours ago",
      source: "Verified Source",
    },
    {
      id: 2,
      title: "Bipartisan agreement reached for government transparency law",
      excerpt:
        "After months of negotiations, political parties reach consensus on new transparency and accountability measures.",
      verificationScore: 97,
      category: "Politics",
      readTime: "4 min",
      views: "8.3K",
      trend: "hot",
      image: "/political-agreement-transparency.png",
      publishedAt: "4 hours ago",
      source: "Verified Source",
    },
    {
      id: 3,
      title: "Economy Minister presents post-pandemic recovery plan",
      excerpt:
        "The plan includes infrastructure investments, support for small businesses and youth employment programs worth $50 billion.",
      verificationScore: 91,
      category: "Politics",
      readTime: "6 min",
      views: "15.2K",
      trend: "rising",
      image: "/economic-recovery-plan.png",
      publishedAt: "6 hours ago",
      source: "Verified Source",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header Section */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Shield className="h-6 w-6 text-blue-600" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900">Politics</h1>
          </div>
          <p className="text-lg text-slate-600 max-w-3xl">
            Blockchain-verified political news. Reliable information about government, public policies and decisions that affect society.
          </p>

          {/* Stats */}
          <div className="flex items-center gap-6 mt-6">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span className="text-sm font-medium text-slate-700">1,247 verified news</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-600" />
              <span className="text-sm font-medium text-slate-700">89 active validators</span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-orange-600" />
              <span className="text-sm font-medium text-slate-700">Trend: High activity</span>
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
            Government
          </Button>
          <Button variant="outline" size="sm">
            Congress
          </Button>
          <Button variant="outline" size="sm">
            Elections
          </Button>
          <Button variant="outline" size="sm">
            Public Policies
          </Button>
          <Button variant="outline" size="sm">
            International
          </Button>
        </div>
      </div>

      {/* News Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {politicalNews.map((news) => (
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
                  <Badge variant="secondary" className="bg-blue-600 text-white">
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
                <CardTitle className="text-lg leading-tight group-hover:text-blue-600 transition-colors">
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
                  <span className="text-xs font-medium text-blue-600">{news.source}</span>
                  <Button size="sm" variant="outline" className="hover:bg-blue-50 bg-transparent">
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
