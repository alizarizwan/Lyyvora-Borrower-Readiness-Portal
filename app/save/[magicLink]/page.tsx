"use client"

import { useEffect } from "react"
import { useAssessmentStore } from "@/lib/store/assessmentStore"
import { useRouter } from "next/navigation"

export default function ResumePage({
  params,
}: {
  params: { magicLink: string }
}) {
  const { loadDraft } = useAssessmentStore()
  const router = useRouter()

  useEffect(() => {
    async function load() {
      const res = await fetch(
        `/api/assessment/get/${params.magicLink}`
      )

      if (!res.ok) {
        router.push("/assessment")
        return
      }

      const data = await res.json()
      loadDraft(data)
      router.push("/assessment")
    }

    load()
  }, [])

  return null
}
