"use client"

import { useEffect, use, useState } from "react"
import { useRouter } from "next/navigation"
import { useAssessmentStore } from "@/lib/store/assessmentStore"

export default function ResumePage({ params }: { params: any }) {
  const router = useRouter()
  const { loadDraft } = useAssessmentStore()

  const { token } = use(params)

  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/assessment/get/${token}`)
        if (!res.ok) {
          const text = await res.text()
          console.error("Resume fetch failed:", res.status, text)
          setError(`Lookup failed (${res.status}): ${text}`)
          return
        }

        const data = await res.json()
        
        // Parse the answers from JSON string if needed
        const parsedAnswers = typeof data.answers === "string" ? JSON.parse(data.answers) : data.answers
        
        // Load the draft with the assessment data
        loadDraft({
          answers: parsedAnswers || {},
          currentStep: data.currentStep || 1,
        })
        
        // Redirect to assessment page at the correct step
        const step = data.currentStep || 1
        router.push(`/assessment?step=${step}`)
      } catch (err: any) {
        console.error("Failed to resume assessment", err)
        setError(String(err))
      }
    }

    load()
  }, [token, router, loadDraft])

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="max-w-xl p-6 bg-white border rounded">
          <h2 className="text-lg font-semibold mb-2">Unable to resume assessment</h2>
          <p className="text-sm text-red-600 mb-4">{error}</p>
          <div className="flex gap-3">
            <a href="/" className="underline">Start a new assessment</a>
          </div>
        </div>
      </div>
    )
  }

  return null
}
