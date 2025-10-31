import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/db"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default async function StudentsPage() {
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

  const students = await prisma.user.findMany({
    where: { role: "STUDENT" },
    include: {
      studentProfile: true,
      applications: true,
      recommendations: true,
    },
    orderBy: { createdAt: "desc" },
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
          <h1 className="text-3xl font-bold">Students</h1>
          <p className="text-muted-foreground">View and manage student accounts</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Student List</CardTitle>
            <CardDescription>{students.length} total students</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>GPA</TableHead>
                    <TableHead>SAT Score</TableHead>
                    <TableHead>Applications</TableHead>
                    <TableHead>Recommendations</TableHead>
                    <TableHead>Joined</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {students.map((student) => (
                    <TableRow key={student.id}>
                      <TableCell className="font-medium">{student.name || "N/A"}</TableCell>
                      <TableCell>{student.email}</TableCell>
                      <TableCell>{student.studentProfile?.gpa?.toFixed(2) || "N/A"}</TableCell>
                      <TableCell>{student.studentProfile?.satScore || "N/A"}</TableCell>
                      <TableCell>{student.applications.length}</TableCell>
                      <TableCell>{student.recommendations.length}</TableCell>
                      <TableCell>{new Date(student.createdAt).toLocaleDateString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
