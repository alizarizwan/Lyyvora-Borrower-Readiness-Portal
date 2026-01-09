import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { prisma } from "@/lib/prisma"

export async function GET(
  req: Request,
  { params }: { params: { magicLink: string } }
) {
  const { magicLink } = params

  const assessment = await prisma.assessment.findUnique({
    where: { magicLink },
  })

  if (!assessment) {
    return NextResponse.json({ error: "Invalid link" }, { status: 404 })
  }

  // 🔐 THIS IS STEP 7
  const session = await getServerSession(authOptions)

  if (session?.user?.email && !assessment.userId) {
    await prisma.assessment.update({
      where: { magicLink },
      data: {
        user: {
          connect: { email: session.user.email },
        },
      },
    })
  }

  return NextResponse.json(assessment)
}
