import { prisma } from "@/lib/db"
import { auth, currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"

export async function requireAuth() {
  const { userId } = await auth()
  if (!userId) {
    redirect("/sign-in")
  }
  return userId
}

export async function getCurrentUser() {
  const user = await currentUser()
  return user
}

export async function getAuthUser() {
  const { userId } = await auth()
  const user = await currentUser()

  if (!userId || !user) {
    return null
  }

  let userDetails

  const existingUser = await prisma.user.findFirst({
    where: { id: userId },
  })

  if (!existingUser) {
    const createdUser = await prisma.user.create({
      data: {
        id: userId,
        email: user.emailAddresses[0]?.emailAddress || "",
        name: user.fullName || "",
        // avatar: user.imageUrl || "",
        role: "STUDENT", // Default role for new users
      },
    })

    userDetails = {
      id: createdUser.id,
      email: createdUser.email,
      name: createdUser.name,
    //   avatar: createdUser.avatar,
      role: createdUser.role,
    }
  } else {
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        email: user.emailAddresses[0]?.emailAddress || "",
        name: user.fullName || "",
        // avatar: user.imageUrl || "",
      },
    })

    userDetails = {
      id: updatedUser.id,
      email: updatedUser.email,
      name: updatedUser.name,
    //   avatar: updatedUser.avatar,
      role: updatedUser.role,
    }
  }

  return userDetails
}
