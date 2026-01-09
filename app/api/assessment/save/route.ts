// app/api/assessment/save/route.ts
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { randomUUID } from "crypto"

export async function POST(req: Request) {
  const body = await req.json()

  const magicLink = randomUUID()

  const assessment = await prisma.assessment.create({
    data: {
      magicLink,
      answers: JSON.stringify(body.answers ?? {}),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
  })

  const resumeLink = `${process.env.NEXTAUTH_URL}/resume/${magicLink}`

  return NextResponse.json({ magicLink, resumeLink })
}
