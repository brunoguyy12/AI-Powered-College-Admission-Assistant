import { auth } from "@clerk/nextjs/server"
import { db } from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET(req: Request) {
  try {
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const user = await db.user.findUnique({ where: { id: userId } })
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 })

    const notifications = await db.notification.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      take: 50,
    })

    return NextResponse.json(notifications)
  } catch (error) {
    console.error("[NOTIFICATIONS]", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const { userId, type, title, message, applicationId, actionUrl } = await req.json()

    const notification = await db.notification.create({
      data: {
        userId,
        type,
        title,
        message,
        applicationId,
        actionUrl,
      },
    })

    return NextResponse.json(notification)
  } catch (error) {
    console.error("[CREATE_NOTIFICATION]", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// Mark as read
export async function PUT(req: Request) {
  try {
    const { notificationId } = await req.json()

    const notification = await db.notification.update({
      where: { id: notificationId },
      data: { isRead: true, readAt: new Date() },
    })

    return NextResponse.json(notification)
  } catch (error) {
    console.error("[UPDATE_NOTIFICATION]", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
