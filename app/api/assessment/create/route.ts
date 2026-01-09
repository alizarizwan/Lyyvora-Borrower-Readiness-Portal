// app/api/assessment/create/route.ts
import { NextResponse } from "next/server"
import crypto from "crypto"
import { prisma } from "@/lib/prisma"

export async function POST(req: Request) {
  const body = await req.json()
  const magicLink = crypto.randomUUID()

  await prisma.draft.create({
    data: {
      magicLink,
      answers: body.answers ?? {},
      currentStep: body.currentStep ?? 0,
    },
  })

  return NextResponse.json({ magicLink })
}
