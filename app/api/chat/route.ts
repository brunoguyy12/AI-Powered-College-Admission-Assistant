import { auth } from "@clerk/nextjs/server"
import { streamText, convertToModelMessages } from "ai"
import { openai } from "@ai-sdk/openai"
import { NextResponse } from "next/server"
import type { UIMessage } from "ai"

export const maxDuration = 30

export async function POST(req: Request) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { messages }: { messages: UIMessage[] } = await req.json()

    const systemPrompt = `You are an expert college admissions advisor and AI assistant. Your role is to help students navigate the college application process by answering questions, providing guidance, and offering support.

You can help with:
1. Understanding application requirements
2. Preparing for standardized tests
3. Choosing between universities
4. Writing application essays and statements of purpose
5. General college admissions advice

Be supportive, informative, and encouraging throughout the conversation. Provide specific, actionable advice based on the student's situation.`

    const result = streamText({
      model: openai("gpt-4o-mini"),
      system: systemPrompt,
      messages: convertToModelMessages(messages),
      temperature: 0.7,
      maxOutputTokens: 1500,
    })

    return result.toUIMessageStreamResponse()
  } catch (error) {
    console.error("Error in chat route:", error)
    return NextResponse.json({ error: "Failed to process chat" }, { status: 500 })
  }
}
