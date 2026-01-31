import { getAuthUser } from "@/lib/require-auth"
import { db } from "@/lib/db"
import { redirect, notFound } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BreadcrumbNav } from "@/components/breadcrumb-nav"
import { ApplicationDetailClient } from "@/components/admin/application-detail-client"

export default async function ApplicationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const userName = await getAuthUser()
  const { id: applicationId } = await params

  if (!userName || userName.role !== "ADMIN") {
    redirect("/dashboard")
  }

  const user = await db.user.findUnique({
    where: { id: userName.id },
  })



  if (!user) {
    redirect("/dashboard")
  }

  const application = await db.application.findUnique({
    where: { id: applicationId },
    include: {
      student: {
        include: {
          studentProfile: true,
        },
      },
    },
  })

  if (!application) {
    notFound()
  }

  return (
    <div className="space-y-6">

      <BreadcrumbNav
        items={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Applications", href: "/admin/applications" },
          { label: `${application.universityName}`, href: "#" },
        ]}
      />

      <ApplicationDetailClient application={application} user={user} />
    </div>
  )
}
