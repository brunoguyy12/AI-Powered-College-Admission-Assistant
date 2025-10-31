import { redirect } from "next/navigation"
import { getAuthUser } from "@/lib/require-auth"
import { prisma } from "@/lib/db"
import { RecommendationsClient } from "@/components/recommendations-client"

export default async function RecommendationsPage() {
  const user = await getAuthUser()

  if (!user) {
    redirect("/sign-in")
  }

  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    include: {
      studentProfile: true,
      recommendations: true,
    },
  })

  if (!dbUser) {
    redirect("/sign-in")
  }

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b border-border bg-card">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary" />
            <span className="text-xl font-bold">AdmitAI</span>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">University Recommendations</h1>
          <p className="text-muted-foreground">AI-powered recommendations based on your profile</p>
        </div>

        <RecommendationsClient
          userId={user.id}
          studentProfile={dbUser.studentProfile}
          initialRecommendations={dbUser.recommendations}
        />
      </div>
    </div>
  )
}
