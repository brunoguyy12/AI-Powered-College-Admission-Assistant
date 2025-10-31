import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/db"
import { UniversitiesClient } from "@/components/admin/universities-client"

export default async function UniversitiesPage() {
  const { userId } = await auth()

  if (!userId) {
    redirect("/sign-in")
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
  })

  if (!user || user.role !== "ADMIN") {
    redirect("/dashboard/student")
  }

  const universities = await prisma.university.findMany({
    include: { programs: true },
    orderBy: { name: "asc" },
  })

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b border-border bg-card">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary" />
            <span className="text-xl font-bold">AdmitAI Admin</span>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Universities</h1>
          <p className="text-muted-foreground">Manage universities and their programs</p>
        </div>

        <UniversitiesClient universities={universities} />
      </div>
    </div>
  )
}
