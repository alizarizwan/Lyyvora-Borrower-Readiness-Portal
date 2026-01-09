import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"

export default async function ResumePage(props: {
  params: Promise<{ token: string }>
}) {
  const params = await props.params
  const token = params.token

  const assessment = await prisma.assessment.findUnique({
    where: { magicLink: token },
  })

  if (!assessment) redirect("/")

  // Store draft data in a way that survives navigation
  const draftData = assessment.answers ? JSON.parse(assessment.answers) : {}
  const currentStep = assessment.currentStep || 1

  // Create redirect URL with draft data as query parameters
  const queryParams = new URLSearchParams()
  queryParams.set("resume", token)
  queryParams.set("draft", JSON.stringify(draftData))
  queryParams.set("step", String(currentStep))

  console.log("Resume redirecting with draft:", draftData, "step:", currentStep)
  redirect(`/assessment?${queryParams.toString()}`)
}
