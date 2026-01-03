import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";
import { z } from "zod";
const { GoogleGenerativeAI } = require("@google/generative-ai");

const recommendationSchema = z.object({
  universityName: z.string(),
  country: z.string(),
  city: z.string(),
  location: z.string().nullable().optional(),
  websiteUrl: z.string().nullable().optional(),
  acceptanceRate: z.number().min(0).max(100).nullable().optional(),
  averageGPA: z.number().nullable().optional(),
  averageSAT: z.number().nullable().optional(),
  averageACT: z.number().nullable().optional(),
  worldRanking: z.number().nullable().optional(),
  tuitionFee: z.number().nullable().optional(),
  averageAid: z.number().nullable().optional(),
  documentsNeeded: z.array(z.string()).nullable().optional(),
  applicationFee: z.number().nullable().optional(),
  requirementsSummary: z.string().nullable().optional(),
  adminEmail: z.string().nullable().optional(),
  adminPhone: z.string().nullable().optional(),
  matchScore: z.number().min(0).max(100),
  reasoning: z.string(),
  recommendedPrograms: z.array(z.string()),
});

export async function POST(req: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { studentProfile: true },
    });

    if (!user || !user.studentProfile) {
      return NextResponse.json(
        { error: "Student profile not found" },
        { status: 404 }
      );
    }

    const profile = user.studentProfile;
    const { recommendationCount = 5 } = await req.json();

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
- Budget Range: $${profile.budgetMin || "No minimum"} - $${
      profile.budgetMax || "No maximum"
    } USD per year
- Major Interests: ${profile.majorInterests?.join(", ") || "Not provided"}
- Career Goals: ${profile.careerGoals || "Not provided"}
- Needs Financial Aid: ${profile.needsFinancialAid ? "Yes" : "No"}

For each of the ${recommendationCount} recommended universities, provide:
1. University name (exact name of a real university)
2. Country
3. City
4. Location (e.g., "San Francisco, California, USA")
5. Website URL
6. Acceptance rate (as percentage 0-100)
7. Average GPA of admitted students
8. Average SAT score of admitted students
9. Average ACT score of admitted students
10. World ranking (approximate if needed)
11. Annual tuition fee (in USD, approximate)
12. Average financial aid offered (in USD, approximate)
13. Documents needed for application (array like ["Passport", "Transcript", "Test Scores"])
14. Application fee (in USD, or 0 if free)
15. Brief summary of requirements (1-2 sentences)
16. Admin email - the official university contact email address found on their website (typically admissions@universitydomain.com or contact@universitydomain.com) (use null if not found - DO NOT make up fake emails)
17. Admin phone - the official university contact phone number found on their website (typically the admissions office phone number) (use null if not found - DO NOT make up fake numbers)
18. Match score for this student (0-100)
19. Reasoning (2-3 sentences explaining why this university is a good fit)
20. Recommended programs (list 2-3 degree programs/majors that match student's interests)

Format your response EXACTLY as a JSON array. Each object must have these exact keys:
- universityName (string)
- country (string)
- city (string)
- location (string or null)
- websiteUrl (string or null)
- acceptanceRate (number or null)
- averageGPA (number or null)
- averageSAT (number or null)
- averageACT (number or null)
- worldRanking (number or null)
- tuitionFee (number or null)
- averageAid (number or null)
- documentsNeeded (array of strings or null)
- applicationFee (number or null)
- requirementsSummary (string or null)
- adminEmail (null - always use null)
- adminPhone (null - always use null)
- matchScore (number 0-100)
- reasoning (string)
- recommendedPrograms (array of strings)

Ensure all numeric values are numbers (not strings). Return ONLY valid JSON, no other text or markdown.`;

    if (!process.env.GOOGLE_API_KEY) {
      return NextResponse.json(
        {
          error:
            "GOOGLE_API_KEY is not configured. Please add it to your environment variables.",
        },
        { status: 500 }
      );
    }

    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    let recommendations = [];
    try {
      const jsonMatch = text.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);

        recommendations = await Promise.all(
          parsed.map(async (rec: any) => {
            const validated = recommendationSchema.parse({
              universityName: rec.universityName,
              country: rec.country,
              city: rec.city,
              location: rec.location ?? null,
              websiteUrl: rec.websiteUrl ?? null,
              acceptanceRate: rec.acceptanceRate ?? null,
              averageGPA: rec.averageGPA ?? null,
              averageSAT: rec.averageSAT ?? null,
              averageACT: rec.averageACT ?? null,
              worldRanking: rec.worldRanking ?? null,
              tuitionFee: rec.tuitionFee ?? null,
              averageAid: rec.averageAid ?? null,
              documentsNeeded: rec.documentsNeeded ?? null,
              applicationFee: rec.applicationFee ?? null,
              requirementsSummary: rec.requirementsSummary ?? null,
              adminEmail: rec.adminEmail ?? null,
              adminPhone: rec.adminPhone ?? null,
              matchScore: rec.matchScore,
              reasoning: rec.reasoning,
              recommendedPrograms: rec.recommendedPrograms || [],
            });

            // Check if university already exists, if not create it
            let university = await prisma.university.findFirst({
              where: {
                name: validated.universityName,
                country: validated.country,
              },
            });

            if (!university) {
              university = await prisma.university.create({
                data: {
                  name: validated.universityName,
                  country: validated.country,
                  city: validated.city,
                  location: validated.location,
                  websiteUrl: validated.websiteUrl,
                  acceptanceRate: validated.acceptanceRate,
                  averageGPA: validated.averageGPA,
                  averageSAT: validated.averageSAT,
                  averageACT: validated.averageACT,
                  worldRanking: validated.worldRanking,
                  tuitionFee: validated.tuitionFee,
                  averageAid: validated.averageAid,
                  documentsNeeded: validated.documentsNeeded || [],
                  applicationFee: validated.applicationFee,
                  requirementsSummary: validated.requirementsSummary,
                  adminEmail: validated.adminEmail,
                  adminPhone: validated.adminPhone,
                },
              });
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
            });

            return recommendation;
          })
        );
      } else {
        return NextResponse.json(
          { error: "Invalid AI response format. Please try again." },
          { status: 500 }
        );
      }
    } catch (parseError) {
      console.error("[v0] Error parsing AI response:", parseError);
      console.error("[v0] Raw response:", text);
      return NextResponse.json(
        {
          error: "Failed to parse AI response. Please try again.",
          details:
            parseError instanceof Error ? parseError.message : "Unknown error",
        },
        { status: 500 }
      );
    }

    return NextResponse.json(recommendations);
  } catch (error) {
    console.error("[v0] Error generating recommendations:", error);
    return NextResponse.json(
      {
        error: "Failed to generate recommendations",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
