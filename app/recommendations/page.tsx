import { redirect } from "next/navigation";
import { getAuthUser } from "@/lib/require-auth";
import { prisma } from "@/lib/db";
import { RecommendationsClient } from "@/components/recommendations-client";
import { Navbar } from "@/components/navbar";
import { BreadcrumbNav } from "@/components/breadcrumb-nav";

export default async function RecommendationsPage() {
  const user = await getAuthUser();

  if (!user) {
    redirect("/sign-in");
  }

  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    include: {
      studentProfile: true,
      recommendations: true,
    },
  });

  if (!dbUser) {
    redirect("/sign-in");
  }

  const universities = await prisma.university.findMany();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <BreadcrumbNav />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">University Recommendations</h1>
          <p className="text-muted-foreground">
            AI-powered recommendations based on your profile
          </p>
        </div>

        <RecommendationsClient
          userId={user.id}
          studentProfile={dbUser.studentProfile}
          initialRecommendations={dbUser.recommendations}
          universities={universities}
        />
      </div>
    </div>
  );
}
