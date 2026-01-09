// app/api/assessment/get/[magicLink]/route.ts
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(
  req: Request,
  { params }: { params: { magicLink: string } }
) {
  const draft = await prisma.draft.findUnique({
    where: { magicLink: params.magicLink },
  })

  if (!draft) {
    return NextResponse.json(
      { error: "Not found" },
      { status: 404 }
    )
  }

  return NextResponse.json(draft)
}
