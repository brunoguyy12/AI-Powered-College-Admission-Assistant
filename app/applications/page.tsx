import { redirect } from "next/navigation";
import { getAuthUser } from "@/lib/require-auth";
import { prisma } from "@/lib/db";
import { ApplicationsClient } from "@/components/applications-client";
import { Navbar } from "@/components/navbar";
import { BreadcrumbNav } from "@/components/breadcrumb-nav";

export default async function ApplicationsPage() {
  const user = await getAuthUser();

  if (!user) {
    redirect("/sign-in");
  }

  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    include: { applications: true },
  });

  if (!dbUser) {
    redirect("/sign-in");
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <BreadcrumbNav />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">My Applications</h1>
          <p className="text-muted-foreground">
            Track and manage your college applications
          </p>
        </div>

        <ApplicationsClient
          userId={user.id}
          initialApplications={dbUser.applications}
        />
      </div>
    </div>
  );
}
