import { redirect } from "next/navigation";
import { getAuthUser } from "@/lib/require-auth";
import { prisma } from "@/lib/db";
import { Navbar } from "@/components/navbar";
import { BreadcrumbNav } from "@/components/breadcrumb-nav";
import { AnalyticsDashboard } from "@/components/admin/analytics-dashboard";

export default async function AnalyticsPage() {
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

  const stats = await Promise.all([
    prisma.user.count({ where: { role: "STUDENT" } }),
    prisma.university.count(),
    prisma.application.count(),
    prisma.application.groupBy({
      by: ["status"],
      _count: true,
    }),
    prisma.recommendation.count(),
    prisma.application.findMany({
      select: { createdAt: true },
      orderBy: { createdAt: "desc" },
      take: 30,
    }),
  ]);

  const [
    studentCount,
    universityCount,
    totalApplications,
    applicationsByStatus,
    recommendationCount,
    recentApplications,
  ] = stats;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <BreadcrumbNav />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
          <p className="text-muted-foreground">
            System-wide statistics and insights
          </p>
        </div>

        <AnalyticsDashboard
          stats={{
            students: studentCount,
            universities: universityCount,
            totalApplications,
            applicationsByStatus,
            recommendations: recommendationCount,
            recentApplications,
          }}
        />
      </div>
    </div>
  );
}
