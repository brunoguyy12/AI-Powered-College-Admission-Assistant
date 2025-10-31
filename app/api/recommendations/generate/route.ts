import { auth } from "@clerk/nextjs/server"
import { prisma } from "@/lib/db"
import { generateText } from "ai"
import { google } from "@ai-sdk/google"
import { GoogleGenerativeAI } from "@google/generative-ai"
import { NextResponse } from "next/server"
import { z } from "zod"

const recommendationSchema = z.object({
  universityName: z.string(),
  country: z.string(),
  city: z.string(),
  acceptanceRate: z.number().min(0).max(100).optional(),
  averageGPA: z.number().optional(),
  averageSAT: z.number().optional(),
  averageACT: z.number().optional(),
  worldRanking: z.number().optional(),
  tuitionFee: z.number().optional(),
  averageAid: z.number().optional(),
  matchScore: z.number().min(0).max(100),
  reasoning: z.string(),
  recommendedPrograms: z.array(z.string()),
})

export async function POST(req: Request) {

  console.log("Generating recommendations...")
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { studentProfile: true },
    })

    if (!user || !user.studentProfile) {
      return NextResponse.json({ error: "Student profile not found" }, { status: 404 })
    }

    const profile = user.studentProfile
    const { recommendationCount = 5 } = await req.json()

    console.log("[v0] Starting recommendation generation for user:", userId)
    console.log("[v0] Recommendation count:", recommendationCount)
    console.log("[v0] Student profile:", {
      gpa: profile.gpa,
      country: profile.country,
      preferredStudyCountry: profile.preferredStudyCountry,
      budgetMin: profile.budgetMin,
      budgetMax: profile.budgetMax,
    })

    const prompt = `You are an expert college admissions advisor. Based on the following student profile, recommend the top ${recommendationCount} universities from around the world that would be the best fit for this student.

IMPORTANT: You can recommend ANY universities worldwide - not limited to a pre-existing list. Based on the student's profile, academic scores, interests, and budget, suggest real universities that are appropriate matches.

Student Profile:
- GPA: ${profile.gpa || "Not provided"}
- SAT Score: ${profile.satScore || "Not provided"}
- ACT Score: ${profile.actScore || "Not provided"}
- TOEFL Score: ${profile.toeflScore || "Not provided"}
- IELTS Score: ${profile.ieltsScore || "Not provided"}
- Home Country: ${profile.country || "Not provided"}
- Preferred Study Country: ${profile.preferredStudyCountry || "Any country"}
- Budget Range: $${profile.budgetMin || "No minimum"} - $${profile.budgetMax || "No maximum"} USD per year
- Major Interests: ${profile.majorInterests?.join(", ") || "Not provided"}
- Career Goals: ${profile.careerGoals || "Not provided"}
- Needs Financial Aid: ${profile.needsFinancialAid ? "Yes" : "No"}

For each of the ${recommendationCount} recommended universities, provide:
1. University name (exact name of a real university)
2. Country
3. City
4. Acceptance rate (as percentage 0-100)
5. Average GPA of admitted students
6. Average SAT score of admitted students
7. Average ACT score of admitted students
8. World ranking (approximate if needed)
9. Annual tuition fee (in USD, approximate)
10. Average financial aid offered (in USD, approximate)
11. Match score for this student (0-100)
12. Reasoning (2-3 sentences explaining why this university is a good fit)
13. Recommended programs (list 2-3 degree programs/majors that match student's interests)

Format your response EXACTLY as a JSON array. Each object must have these exact keys:
- universityName
- country
- city
- acceptanceRate
- averageGPA
- averageSAT
- averageACT
- worldRanking
- tuitionFee
- averageAid
- matchScore
- reasoning
- recommendedPrograms (array of strings)

Ensure all numeric values are numbers (not strings). Return ONLY valid JSON, no other text.`


console.log("[v0] Checking GOOGLE_API_KEY...")

    if (!process.env.GOOGLE_API_KEY) {
      console.error("[v0] GOOGLE_API_KEY environment variable is not set")
      return NextResponse.json(
        { error: "GOOGLE_API_KEY is not configured. Please add it to your environment variables." },
        { status: 500 },
      )
    }

    console.log("[v0] Calling Gemini API directly...")
    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY)
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" })
    // list available models: await genAI.listModels()
    // const availableModels = await genAI.listModels()
    // console.log("[v0] Available models:", availableModels)

    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()

    console.log("[v0] Gemini response received, length:", text.length)
    console.log("[v0] Raw response:", text.substring(0, 500))

    let recommendations = []
    try {
      // Extract JSON from the response
      const jsonMatch = text.match(/\[[\s\S]*\]/)
      if (jsonMatch) {
        console.log("[v0] JSON extracted from response")
        const parsed = JSON.parse(jsonMatch[0])
        console.log("[v0] Parsed recommendations count:", parsed.length)
        
        recommendations = await Promise.all(
          parsed.map(async (rec: any) => {
            const validated = recommendationSchema.parse({
              universityName: rec.universityName,
              country: rec.country,
              city: rec.city,
              acceptanceRate: rec.acceptanceRate,
              averageGPA: rec.averageGPA,
              averageSAT: rec.averageSAT,
              averageACT: rec.averageACT,
              worldRanking: rec.worldRanking,
              tuitionFee: rec.tuitionFee,
              averageAid: rec.averageAid,
            matchScore: rec.matchScore,
            reasoning: rec.reasoning,
            recommendedPrograms: rec.recommendedPrograms || [],
            })

            console.log("[v0] Creating/fetching university:", validated.universityName)

            // Check if university already exists, if not create it
            let university = await prisma.university.findFirst({
              where: {
                name: validated.universityName,
                country: validated.country,
              },
            })

            if (!university) {
              university = await prisma.university.create({
                data: {
                  name: validated.universityName,
                  country: validated.country,
                  city: validated.city,
                  acceptanceRate: validated.acceptanceRate,
                  averageGPA: validated.averageGPA,
                  averageSAT: validated.averageSAT,
                  averageACT: validated.averageACT,
                  worldRanking: validated.worldRanking,
                  tuitionFee: validated.tuitionFee,
                  averageAid: validated.averageAid,
                },
              })
            }

            // Create recommendation record
            const recommendation = await prisma.recommendation.create({
              data: {
                studentId: userId,
                universityName: validated.universityName,
                matchScore: validated.matchScore,
                reasoning: validated.reasoning,
                recommendedPrograms: validated.recommendedPrograms,
              },
            })

            return recommendation
          }),
        )
        } else {
        console.error("[v0] No JSON array found in response")
        return NextResponse.json({ error: "Invalid AI response format. Please try again." }, { status: 500 })
      }
    } catch (parseError) {
      console.error("[v0] Error parsing AI response:", parseError)
      console.error("[v0] Raw response:", text)
      return NextResponse.json(
        {
          error: "Failed to parse AI response. Please try again.",
          details: parseError instanceof Error ? parseError.message : "Unknown error",
        },
        { status: 500 },
      )
    }

    console.log("[v0] Successfully created", recommendations.length, "recommendations")
    return NextResponse.json(recommendations)
  } catch (error) {
   console.error("[v0] Error generating recommendations:", error)
    return NextResponse.json(
      {
        error: "Failed to generate recommendations",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
