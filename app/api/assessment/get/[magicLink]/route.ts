import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { prisma } from "@/lib/prisma"

export async function GET(
  req: Request,
  { params }: { params: Promise<{ magicLink: string }> }
) {
  try {
    const { magicLink } = await params

    const assessment = await prisma.assessment.findUnique({
      where: { magicLink },
    })

    if (!assessment) {
      return NextResponse.json({ error: "Invalid link" }, { status: 404 })
    }

    // 🔐 THIS IS STEP 7
    const session = await getServerSession(authOptions)

    if (session?.user?.email && !assessment.userId) {
      try {
        await prisma.assessment.update({
          where: { magicLink },
          data: {
            userId: (session.user as any).id,
          },
        })
      } catch (err) {
        // If user connection fails, just continue - not critical for resuming
        console.error("Failed to connect user to assessment:", err)
      }
    }

    return NextResponse.json(assessment)
  } catch (error) {
    console.error("Error in GET /api/assessment/get/[magicLink]:", error)
    return NextResponse.json(
      { error: "Failed to retrieve assessment", details: String(error) },
      { status: 500 }
    )
  }
}
