import { redirect } from "next/navigation"
import { getAuthUser } from "@/lib/require-auth"
import { prisma } from "@/lib/db"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default async function StudentDashboard() {
  const user = await getAuthUser()

  if (!user) {
    redirect("/sign-in")
  }

  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    include: {
      studentProfile: true,
      applications: true,
      recommendations: true,
    },
  })

  if (!dbUser) {
    redirect("/sign-in")
  }

  const profileComplete = dbUser.studentProfile?.gpa && dbUser.studentProfile?.satScore

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b border-border bg-card">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary" />
            <span className="text-xl font-bold">AdmitAI</span>
          </div>
          <div className="text-sm text-muted-foreground">Welcome, {dbUser.name}</div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Your Dashboard</h1>
          <p className="text-muted-foreground">Manage your college applications and get AI recommendations</p>
        </div>

        {!profileComplete && (
          <div className="mb-8 rounded-lg border border-yellow-200 bg-yellow-50 p-4 dark:border-yellow-900 dark:bg-yellow-950">
            <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
              Complete your profile to get personalized university recommendations
            </p>
            <Link href="/profile">
              <Button className="mt-2" size="sm">
                Complete Profile
              </Button>
            </Link>
          </div>
        )}

        <div className="grid gap-6 md:grid-cols-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Profile Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{profileComplete ? "Complete" : "Incomplete"}</div>
              <p className="text-xs text-muted-foreground">
                {profileComplete ? "Ready for recommendations" : "Add your academic info"}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Applications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dbUser.applications.length}</div>
              <p className="text-xs text-muted-foreground">Active applications</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Recommendations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dbUser.recommendations.length}</div>
              <p className="text-xs text-muted-foreground">Universities recommended</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">GPA</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dbUser.studentProfile?.gpa?.toFixed(2) || "N/A"}</div>
              <p className="text-xs text-muted-foreground">Current GPA</p>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Get started with your college journey</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link href="/profile" className="block">
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  📝 Update Profile
                </Button>
              </Link>
              <Link href="/recommendations" className="block">
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  🎯 Get Recommendations
                </Button>
              </Link>
              <Link href="/applications" className="block">
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  📋 Manage Applications
                </Button>
              </Link>
              <Link href="/chatbot" className="block">
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  💬 Chat with AI
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Your latest updates</CardDescription>
            </CardHeader>
            <CardContent>
              {dbUser.applications.length === 0 ? (
                <p className="text-sm text-muted-foreground">No applications yet. Start by updating your profile!</p>
              ) : (
                <div className="space-y-2">
                  {dbUser.applications.slice(0, 3).map((app) => (
                    <div key={app.id} className="text-sm">
                      <p className="font-medium">{app.universityName}</p>
                      <p className="text-xs text-muted-foreground">{app.status}</p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
