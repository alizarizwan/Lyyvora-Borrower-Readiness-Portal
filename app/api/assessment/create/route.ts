// app/api/assessment/create/route.ts
import { NextResponse } from "next/server"
import { randomUUID } from "crypto"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    const body = await req.json()
    const magicLink = randomUUID()

    const assessment = await prisma.assessment.create({
      data: {
        magicLink,
        userId: (session?.user as any)?.id,
        answers: JSON.stringify(body.answers ?? {}),
        currentStep: body.currentStep ?? 1,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    })

    return NextResponse.json({ magicLink })
  } catch (error) {
    console.error("Error creating assessment:", error)
    return NextResponse.json(
      { error: "Failed to create assessment", details: String(error) },
      { status: 500 }
    )
  }
}
