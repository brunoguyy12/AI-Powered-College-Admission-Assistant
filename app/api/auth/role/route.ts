import { getAuthUser } from "@/lib/require-auth"
import { prisma } from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const user = await getAuthUser()

    if (!user) {
      return NextResponse.json({ role: null })
    }

    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { role: true },
    })

    return NextResponse.json({ role: dbUser?.role || "STUDENT" })
  } catch (error) {
    console.error("Error fetching user role:", error)
    return NextResponse.json({ role: null })
  }
}
