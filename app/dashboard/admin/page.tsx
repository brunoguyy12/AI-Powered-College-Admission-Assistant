import { redirect } from "next/navigation"
import { getAuthUser } from "@/lib/require-auth"
import { prisma } from "@/lib/db"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default async function AdminDashboard() {
  const user = await getAuthUser()

  if (!user) {
    redirect("/sign-in")
  }

  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
  })

  if (!dbUser || dbUser.role !== "ADMIN") {
    redirect("/dashboard/student")
  }

  const stats = await Promise.all([
    prisma.user.count({ where: { role: "STUDENT" } }),
    prisma.university.count(),
    prisma.application.count(),
    prisma.recommendation.count(),
    prisma.partnership.count(),
  ])

  const [studentCount, universityCount, applicationCount, recommendationCount, partnershipCount] = stats

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b border-border bg-card">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary" />
            <span className="text-xl font-bold">AdmitAI Admin</span>
          </div>
          <div className="text-sm text-muted-foreground">Admin Panel</div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage universities, students, and system data</p>
        </div>

        <div className="grid gap-6 md:grid-cols-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{studentCount}</div>
              <p className="text-xs text-muted-foreground">Active student accounts</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Universities</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{universityCount}</div>
              <p className="text-xs text-muted-foreground">In database</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Applications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{applicationCount}</div>
              <p className="text-xs text-muted-foreground">Total applications</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Recommendations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{recommendationCount}</div>
              <p className="text-xs text-muted-foreground">Generated</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Partnerships</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{partnershipCount}</div>
              <p className="text-xs text-muted-foreground">University requests</p>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Application Management</CardTitle>
              <CardDescription>Review and manage student applications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link href="/admin/applications" className="block">
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  📋 View Applications
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>University Management</CardTitle>
              <CardDescription>Add and manage universities in the system</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link href="/admin/universities" className="block">
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  📚 View Universities
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Student Management</CardTitle>
              <CardDescription>View and manage student accounts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link href="/admin/students" className="block">
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  👥 View Students
                </Button>
              </Link>
              <Link href="/admin/analytics" className="block">
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  📊 Analytics
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>University Partnerships</CardTitle>
              <CardDescription>Manage partnership requests and contracts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link href="/admin/partnerships" className="block">
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  🤝 Manage Partnerships
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
