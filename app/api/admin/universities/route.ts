import { auth } from "@clerk/nextjs/server"
import { prisma } from "@/lib/db"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    })

    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const body = await req.json()

    const university = await prisma.university.create({
      data: {
        name: body.name,
        country: body.country,
        state: body.state,
        city: body.city,
        acceptanceRate: body.acceptanceRate,
        averageGPA: body.averageGPA,
        averageSAT: body.averageSAT,
        averageACT: body.averageACT,
        tuitionFee: body.tuitionFee,
        averageAid: body.averageAid,
        adminId: userId,
      },
    })

    return NextResponse.json(university)
  } catch (error) {
    console.error("Error creating university:", error)
    return NextResponse.json({ error: "Failed to create university" }, { status: 500 })
  }
}
