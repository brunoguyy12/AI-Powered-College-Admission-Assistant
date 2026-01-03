import { redirect } from "next/navigation";
import { getAuthUser } from "@/lib/require-auth";
import { prisma } from "@/lib/db";
import { Navbar } from "@/components/navbar";
import { BreadcrumbNav } from "@/components/breadcrumb-nav";
import { AdminApplicationsClient } from "@/components/admin/admin-applications-client";

export default async function AdminApplicationsPage() {
  const user = await getAuthUser();

  if (!user) {
    redirect("/sign-in");
  }

  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
  });

  if (!dbUser || dbUser.role !== "ADMIN") {
    redirect("/dashboard/student");
  }

  const applications = await prisma.application.findMany({
    include: {
      student: {
        include: { studentProfile: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <BreadcrumbNav />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Application Management</h1>
          <p className="text-muted-foreground">
            Review and process student applications
          </p>
        </div>

        <AdminApplicationsClient applications={applications} />
      </div>
    </div>
  );
}
