// import { redirect } from "next/navigation"
// import { auth } from "@clerk/nextjs/server"
// import { prisma } from "@/lib/db"

// export default async function DashboardPage() {
//   const { userId } = await auth();


//   console.log("User ID:", userId);

//   if (!userId) {

//     console.log("No user ID found, redirecting to sign-in.");
//     redirect("/sign-in")
//   }

//   const user = await prisma.user.findUnique({
//     where: { id: userId },
//     include: { studentProfile: true },
//   })

//   if (!user) {
//     redirect("/sign-in")
//   }

//   // Redirect to appropriate dashboard based on role
//   if (user.role === "ADMIN") {
//     redirect("/dashboard/admin")
//   }

//   redirect("/dashboard/student")
// }

import { redirect } from "next/navigation"
import { getAuthUser } from "@/lib/require-auth"
import { prisma } from "@/lib/db"

export default async function DashboardPage() {
  const user = await getAuthUser()

  if (!user) {
    redirect("/sign-in")
  }

  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    include: { studentProfile: true },
  })

  if (!dbUser) {
    redirect("/sign-in")
  }

  // Redirect to appropriate dashboard based on role
  if (dbUser.role === "ADMIN") {
    redirect("/dashboard/admin")
  }

  redirect("/dashboard/student")
}

