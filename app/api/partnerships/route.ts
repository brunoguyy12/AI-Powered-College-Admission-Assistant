import { auth } from "@clerk/nextjs/server"
import { db } from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET(req: Request) {
  try {
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const user = await db.user.findUnique({ where: { id: userId } })
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const partnerships = await db.partnership.findMany({
      where: { adminId: user.id },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json(partnerships)
  } catch (error) {
    console.error("[PARTNERSHIPS_GET]", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const user = await db.user.findUnique({ where: { id: userId } })
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { universityName, universityEmail, universityPhone, contactPerson, emailContent, emailSubject } =
      await req.json()

    const partnership = await db.partnership.create({
      data: {
        adminId: user.id,
        universityName,
        universityEmail,
        universityPhone,
        contactPerson,
        emailContent,
        emailSubject,
        status: "DRAFT",
      },
    })

    return NextResponse.json(partnership)
  } catch (error) {
    console.error("[PARTNERSHIPS_POST]", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(req: Request) {
  try {
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const user = await db.user.findUnique({ where: { id: userId } })
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { partnershipId, status, notes, sentDate, responseMessage } = await req.json()

    const partnership = await db.partnership.update({
      where: { id: partnershipId },
      data: {
        status,
        notes,
        sentDate,
        responseMessage,
        responseDate: responseMessage ? new Date() : undefined,
      },
    })

    return NextResponse.json(partnership)
  } catch (error) {
    console.error("[PARTNERSHIPS_PUT]", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
