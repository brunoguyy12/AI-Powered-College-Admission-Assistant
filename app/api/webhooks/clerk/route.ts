import { Webhook } from "svix"
import { headers } from "next/headers"
import { prisma } from "@/lib/db"
import { UserRole } from "@/lib/types"

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET

  if (!WEBHOOK_SECRET) {
    throw new Error("Please add CLERK_WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local")
  }

  const headerPayload = await headers()
  const svix_id = headerPayload.get("svix-id")
  const svix_timestamp = headerPayload.get("svix-timestamp")
  const svix_signature = headerPayload.get("svix-signature")

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Error occured -- no svix headers", {
      status: 400,
    })
  }

  const body = await req.text()
  const wh = new Webhook(WEBHOOK_SECRET)

  let evt: any
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as any
  } catch (err) {
    console.error("Error verifying webhook:", err)
    return new Response("Error occured", {
      status: 400,
    })
  }

  const eventType = evt.type

  if (eventType === "user.created") {
    const { id, email_addresses, first_name, last_name } = evt.data

    const email = email_addresses[0]?.email_address
    const name = `${first_name || ""} ${last_name || ""}`.trim()

    try {
      await prisma.user.create({
        data: {
          id,
          email: email || "",
          name: name || null,
          role: UserRole.STUDENT,
          studentProfile: {
            create: {},
          },
        },
      })
    } catch (error) {
      console.error("Error creating user:", error)
    }
  }

  if (eventType === "user.updated") {
    const { id, email_addresses, first_name, last_name } = evt.data

    const email = email_addresses[0]?.email_address
    const name = `${first_name || ""} ${last_name || ""}`.trim()

    try {
      await prisma.user.update({
        where: { id },
        data: {
          email: email || "",
          name: name || null,
        },
      })
    } catch (error) {
      console.error("Error updating user:", error)
    }
  }

  if (eventType === "user.deleted") {
    const { id } = evt.data

    try {
      await prisma.user.delete({
        where: { id },
      })
    } catch (error) {
      console.error("Error deleting user:", error)
    }
  }

  return new Response("", { status: 200 })
}
