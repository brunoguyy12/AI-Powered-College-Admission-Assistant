import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    const application = await prisma.application.create({
      data: {
        studentId: userId,
        universityName: body.universityName,
        programName: body.programName,
        degree: body.degree,
        deadline: body.deadline ? new Date(body.deadline) : null,
        statementOfPurpose: body.statementOfPurpose || null,
        additionalEssays: body.essayResponses || [],
        status: body.status || "DRAFT",
        applicationDate: body.status === "SUBMITTED" ? new Date() : null,
      },
    });

    return NextResponse.json(application);
  } catch (error) {
    console.error("Error creating application:", error);
    return NextResponse.json(
      { error: "Failed to create application" },
      { status: 500 }
    );
  }
}
