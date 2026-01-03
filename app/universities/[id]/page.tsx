import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { getAuthUser } from "@/lib/require-auth";
import { UniversityDetailClient } from "@/components/university-detail-client";
import { Navbar } from "@/components/navbar";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export default async function UniversityDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const authUser = await getAuthUser();
  if (!authUser) {
    redirect("/sign-in");
  }

  // Fetch the full user object with createdAt and updatedAt
  const user = await prisma.user.findUnique({
    where: { id: authUser.id },
  });

  if (!user) {
    redirect("/sign-in");
  }

  const { id } = await params;
  const university = await prisma.university.findUnique({
    where: { id },
    include: {
      programs: true,
    },
  });

  if (!university) {
    redirect("/recommendations");
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-3">
          <Link
            href="/recommendations"
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
          >
            <ChevronLeft className="h-4 w-4" />
            Back to Recommendations
          </Link>
        </div>
      </div>

      {/* <UniversityDetailClient university={university} user={user} /> */}
      <UniversityDetailClient university={university} user={user} />
    </div>
  );
}
