import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";
import { AdminUniversitiesClient } from "@/components/admin/admin-universities-client";
import { Navbar } from "@/components/navbar";
import { BreadcrumbNav } from "@/components/breadcrumb-nav";

export default async function AdminUniversitiesPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user || user.role !== "ADMIN") {
    redirect("/dashboard/student");
  }

  const universities = await prisma.university.findMany({
    include: {
      programs: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <BreadcrumbNav />
      <div className="container mx-auto px-4 py-8">
        <AdminUniversitiesClient universities={universities} />
      </div>
    </div>
  );
}
