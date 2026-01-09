"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function ResumePage({ params }: { params: { magicLink: string } }) {
  const router = useRouter()

  useEffect(() => {
    async function loadAssessment() {
      try {
        const res = await fetch(`/api/assessment/get/${params.magicLink}`)
        if (!res.ok) {
          throw new Error("Failed to load assessment")
        }

        const assessment = await res.json()
        
        // Parse the answers
        const answers = typeof assessment.answers === "string" 
          ? JSON.parse(assessment.answers) 
          : assessment.answers

        // Build the redirect URL with form data and step
        const params_str = new URLSearchParams({
          draft: JSON.stringify(answers),
          step: String(assessment.currentStep),
          resume: params.magicLink,
        }).toString()

        console.log("Resume redirecting with draft:", answers, "step:", assessment.currentStep)
        
        // Redirect to assessment page with data
        router.push(`/assessment?${params_str}`)
      } catch (error) {
        console.error("Failed to load assessment:", error)
        // Redirect to assessment page without data on error
        router.push("/assessment")
      }
    }

    loadAssessment()
  }, [params.magicLink, router])

  return (
    <div className="min-h-screen flex items-center justify-center text-sm text-gray-600">
      Loading your assessment...
    </div>
  )
}
