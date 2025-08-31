import { MainNav } from "@/components/navigation/main-nav"
import { TaskDetailSimple } from "@/components/verification/task-detail-simple"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

interface TaskDetailPageProps {
  params: {
    id: string
  }
}

export default function TaskDetailPage({ params }: TaskDetailPageProps) {
  return (
    <div className="min-h-screen bg-background">
      <MainNav />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Button variant="ghost" asChild>
            <Link href="/seguimiento">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver al Seguimiento
            </Link>
          </Button>
        </div>

        <TaskDetailSimple taskId={params.id} />
      </main>
    </div>
  )
}
