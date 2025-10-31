import { auth } from "@clerk/nextjs/server"
import { prisma } from "@/lib/db"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { universityName, programName, topic } = await req.json()

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { studentProfile: true },
    })

    if (!user || !user.studentProfile) {
      return NextResponse.json({ error: "Student profile not found" }, { status: 404 })
    }

    const profile = user.studentProfile

    const prompt = `You are an expert in writing compelling Statements of Purpose (SOP) for college applications. Write a personalized SOP for a student applying to ${programName} at ${universityName}.

Student Profile:
- Name: ${user.name || "Student"}
- GPA: ${profile.gpa || "Not provided"}
- SAT Score: ${profile.satScore || "Not provided"}
- ACT Score: ${profile.actScore || "Not provided"}
- Major Interests: ${profile.majorInterests?.join(", ") || "Not provided"}
- Career Goals: ${profile.careerGoals || "Not provided"}
- Country: ${profile.country || "Not provided"}

Topic/Prompt: ${topic || "Write about your academic journey and why you want to pursue this program"}

Write a compelling, authentic SOP that:
1. Starts with a strong hook that captures attention
2. Explains the student's motivation for the program
3. Highlights relevant achievements and experiences
4. Connects their goals to the university's program
5. Ends with a clear statement of purpose
6. Is approximately 500-700 words
7. Uses first person and maintains a professional yet personal tone

The SOP should be unique, memorable, and demonstrate genuine interest in the program.`

    const { text } = await generateText({
      model: openai("gpt-4o-mini"),
      prompt,
      temperature: 0.8,
      maxOutputTokens: 2000,
    })

    return NextResponse.json({ sop: text })
  } catch (error) {
    console.error("Error generating SOP:", error)
    return NextResponse.json({ error: "Failed to generate SOP" }, { status: 500 })
  }
}
