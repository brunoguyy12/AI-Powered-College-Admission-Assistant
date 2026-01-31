import { getAuthUser } from "@/lib/require-auth"
import { prisma } from "@/lib/db"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BreadcrumbNav } from "@/components/breadcrumb-nav"
import { PartnershipManagementClient } from "@/components/admin/partnership-management-client"

export default async function PartnershipsPage() {
  const user = await getAuthUser()

  if (!user || user.role !== "ADMIN") {
    redirect("/dashboard")
  }

  const partnerships = await prisma.partnership.findMany({
    where: { adminId: user.id },
    orderBy: { createdAt: "desc" },
  })

  return (
    <div className="space-y-6">
      <BreadcrumbNav
        items={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Partnerships", href: "#" },
        ]}
      />

      <PartnershipManagementClient partnerships={partnerships} />
    </div>
  )
}
