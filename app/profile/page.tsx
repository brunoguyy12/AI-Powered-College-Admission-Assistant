import { redirect } from "next/navigation";
import { getAuthUser } from "@/lib/require-auth";
import { prisma } from "@/lib/db";
import { StudentProfileForm } from "@/components/student-profile-form";
import { Navbar } from "@/components/navbar";
import { BreadcrumbNav } from "@/components/breadcrumb-nav";

export default async function ProfilePage() {
  const user = await getAuthUser();

  if (!user) {
    redirect("/sign-in");
  }

  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    include: { studentProfile: true },
  });

  if (!dbUser) {
    redirect("/sign-in");
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <BreadcrumbNav />
      <div className="container mx-auto max-w-2xl px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Your Profile</h1>
          <p className="text-muted-foreground">
            Update your academic information and preferences
          </p>
        </div>

        <StudentProfileForm
          studentProfile={dbUser.studentProfile}
          userId={user.id}
        />
      </div>
    </div>
  );
}
