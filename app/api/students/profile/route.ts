import { auth } from "@clerk/nextjs/server"
import { prisma } from "@/lib/db"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()

    const studentProfile = await prisma.studentProfile.upsert({
      where: { userId },
      update: {
        gpa: body.gpa,
        satScore: body.satScore,
        actScore: body.actScore,
        toeflScore: body.toeflScore,
        ieltsScore: body.ieltsScore,
        country: body.country,
        state: body.state,
        highSchool: body.highSchool,
        graduationYear: body.graduationYear,
        preferredStudyCountry: body.preferredStudyCountry,
        budgetMin: body.budgetMin,
        budgetMax: body.budgetMax,
        majorInterests: body.majorInterests,
        careerGoals: body.careerGoals,
        needsFinancialAid: body.needsFinancialAid,
      },
      create: {
        userId,
        gpa: body.gpa,
        satScore: body.satScore,
        actScore: body.actScore,
        toeflScore: body.toeflScore,
        ieltsScore: body.ieltsScore,
        country: body.country,
        state: body.state,
        highSchool: body.highSchool,
        graduationYear: body.graduationYear,
        preferredStudyCountry: body.preferredStudyCountry,
        budgetMin: body.budgetMin,
        budgetMax: body.budgetMax,
        majorInterests: body.majorInterests,
        careerGoals: body.careerGoals,
        needsFinancialAid: body.needsFinancialAid,
      },
    })

    return NextResponse.json(studentProfile)
  } catch (error) {
    console.error("Error updating profile:", error)
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 })
  }
}
