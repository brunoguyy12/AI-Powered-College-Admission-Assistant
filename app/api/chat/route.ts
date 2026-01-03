import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";
const { GoogleGenerativeAI } = require("@google/generative-ai");

const systemPrompt = `You are AdmitAI, a friendly and knowledgeable college admissions advisor assistant. Your role is to help students with:
- Choosing suitable universities
- Understanding application requirements
- Writing personal statements and essays
- Preparing for standardized tests (SAT, ACT, TOEFL, IELTS)
- Understanding financial aid and scholarships
- Building a strong application profile
- Time management during the application process

Be supportive, encouraging, and provide practical advice. If a student asks about specific universities, provide accurate information or suggest they check the university details page.

Keep responses concise and helpful. Ask clarifying questions when needed. Limit your responses to be informative but not too long.`;

export async function POST(req: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return new Response("Unauthorized", { status: 401 });
    }

    const { messages } = await req.json();

    if (!process.env.GOOGLE_API_KEY) {
      return new Response("GOOGLE_API_KEY is not configured", { status: 500 });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { studentProfile: true },
    });

    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-lite" });

    let enhancedSystemPrompt = systemPrompt;
    if (user?.studentProfile) {
      const profile = user.studentProfile;
      enhancedSystemPrompt += `\n\nCurrent Student Context:\n- GPA: ${
        profile.gpa || "Not provided"
      }\n- Test Scores: SAT ${profile.satScore || "N/A"}, ACT ${
        profile.actScore || "N/A"
      }\n- Preferred Countries: ${
        profile.preferredStudyCountry || "Not specified"
      }\n- Budget: $${profile.budgetMin || "N/A"}-$${
        profile.budgetMax || "N/A"
      } per year`;
    }

    // Format messages for Gemini
    const formattedMessages = messages.map((msg: any) => ({
      role: msg.role === "user" ? "user" : "model",
      parts: [{ text: msg.content }],
    }));

    // Add system prompt to the first message
    if (formattedMessages.length > 0 && formattedMessages[0].role === "user") {
      formattedMessages[0].parts[0].text = `${enhancedSystemPrompt}\n\nUser: ${formattedMessages[0].parts[0].text}`;
    }

    const chat = model.startChat({
      history: formattedMessages.slice(0, -1),
      generationConfig: {
        maxOutputTokens: 800, // Limit response length
      },
    });

    // Get the last message to send
    const lastMessage =
      formattedMessages[formattedMessages.length - 1].parts[0].text;

    // Use streaming
    const result = await chat.sendMessageStream(lastMessage);

    // Create a readable stream for the response
    const encoder = new TextEncoder();
    let fullResponse = "";

    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of result.stream) {
            const chunkText = chunk.text();
            fullResponse += chunkText;
            controller.enqueue(encoder.encode(chunkText));
          }
          controller.close();

          // Save messages to database after streaming completes
          if (messages.length > 0) {
            const lastUserMessage = messages[messages.length - 1];
            if (lastUserMessage.role === "user") {
              await prisma.chatMessage.create({
                data: {
                  studentId: userId,
                  role: "user",
                  content: lastUserMessage.content,
                },
              });
            }
          }

          await prisma.chatMessage.create({
            data: {
              studentId: userId,
              role: "assistant",
              content: fullResponse,
            },
          });
        } catch (error) {
          console.error("[v0] Streaming error:", error);
          controller.error(error);
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    console.error("[v0] Chat error:", error);
    return new Response(
      JSON.stringify({
        error: "Failed to process chat message",
        details: error instanceof Error ? error.message : "Unknown error",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
