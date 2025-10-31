import { prisma } from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const search = searchParams.get("search")
    const country = searchParams.get("country")

    const universities = await prisma.university.findMany({
      where: {
        ...(search && {
          OR: [
            { name: { contains: search, mode: "insensitive" } },
            { city: { contains: search, mode: "insensitive" } },
          ],
        }),
        ...(country && { country }),
      },
      include: { programs: true },
      take: 50,
    })

    return NextResponse.json(universities)
  } catch (error) {
    console.error("Error fetching universities:", error)
    return NextResponse.json({ error: "Failed to fetch universities" }, { status: 500 })
  }
}
