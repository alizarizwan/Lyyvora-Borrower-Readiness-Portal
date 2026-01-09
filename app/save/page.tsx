"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Link from "next/link"
import { Check } from "lucide-react"
import { useAssessmentStore } from "@/lib/store/assessmentStore"
import { UserMenu } from "@/components/user-menu"
import { Suspense } from "react"

function SaveContent() {
  const { answers, currentStep, setAnswer, nextStep } = useAssessmentStore()
  const searchParams = useSearchParams()

  const [magicLink, setMagicLink] = useState<string>("")
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    async function createMagicLink() {
      try {
        // Get formData from sessionStorage if available
        const formDataStr = sessionStorage.getItem("assessmentFormData")
        const formData = formDataStr ? JSON.parse(formDataStr) : answers
        const currentStepVal = sessionStorage.getItem("assessmentStep") ? parseInt(sessionStorage.getItem("assessmentStep") as string) : currentStep

        console.log("Creating magic link with:", { formData, currentStepVal })
        const res = await fetch("/api/assessment/create", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            answers: formData,
            currentStep: currentStepVal,
          }),
        })

        console.log("Response status:", res.status)
        const text = await res.text()
        console.log("Response text:", text)
        
        if (!res.ok) {
          throw new Error(`API returned ${res.status}: ${text}`)
        }

        const data = JSON.parse(text)
        console.log("Response:", data)
        setMagicLink(data.magicLink || "")
      } catch (err) {
        console.error("Failed to create magic link", err)
      } finally {
        setLoading(false)
      }
    }

    createMagicLink()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-sm text-gray-600">
        Saving your progress…
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200 sticky top-0 bg-white/95 backdrop-blur">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-slate-900 flex items-center justify-center text-white font-bold text-sm">
              L
            </div>
            <span className="font-semibold text-sm">Lyyvora</span>
          </div>
          <UserMenu />
        </div>
      </header>

      {/* Main */}
      <main className="max-w-2xl mx-auto px-6 py-12">
        <Card className="bg-white border border-gray-200 rounded-xl p-12 text-center">
          <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-6">
            <Check className="w-6 h-6 text-gray-700" strokeWidth={3} />
          </div>

          <h1 className="text-2xl font-semibold text-gray-900 mb-2">
            Your Progress Is Saved
          </h1>

          <p className="text-sm text-gray-600 mb-8">
            You can continue where you left off at any time using your magic link below.
          </p>

          {/* Magic Link */}
          <div className="bg-gray-50 rounded-lg p-6 mb-8 text-left">
            <p className="text-sm font-medium text-gray-900 mb-3">
              Your Magic Link
            </p>

            <div className="flex items-center gap-2 bg-white border border-gray-200 rounded p-3">
              <span className="flex-1 text-sm text-gray-600 font-mono truncate">
                {typeof window !== 'undefined' ? `${window.location.origin}/resume/${magicLink}` : `http://localhost:3000/resume/${magicLink}`}
              </span>

              <Button
                size="sm"
                className="bg-slate-900 hover:bg-slate-800 text-white whitespace-nowrap"
                onClick={() => {
                  const fullLink = typeof window !== 'undefined' ? `${window.location.origin}/resume/${magicLink}` : `http://localhost:3000/resume/${magicLink}`
                  navigator.clipboard.writeText(fullLink)
                  setCopied(true)
                  setTimeout(() => setCopied(false), 1500)
                }}
              >
                {copied ? "Copied" : "Copy"}
              </Button>
            </div>

            <p className="text-xs text-gray-500 mt-3">
              Keep this link safe — anyone with it can access your assessment.
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3 justify-center">
            <Link href={`/resume/${magicLink}`}>
              <Button className="bg-slate-900 hover:bg-slate-800 text-white">
                Resume Now
              </Button>
            </Link>

            <Link href="/">
              <Button
                variant="outline"
                className="text-gray-900 border-gray-300 hover:bg-gray-50 bg-transparent"
              >
                Start New
              </Button>
            </Link>
          </div>
        </Card>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-slate-900 text-white mt-16">
        <div className="max-w-6xl mx-auto px-6 py-12 grid grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded bg-white flex items-center justify-center text-slate-900 font-bold">
                L
              </div>
              <span className="font-semibold">Lyyvora</span>
            </div>
            <p className="text-sm text-gray-400">
              Healthcare Finance Solutions for Modern Clinics
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold mb-4">Product</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="#" className="hover:text-white">Loan Assessment</a></li>
              <li><a href="#" className="hover:text-white">Financial Tools</a></li>
              <li><a href="#" className="hover:text-white">Resources</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold mb-4">Support</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="#" className="hover:text-white">Help Center</a></li>
              <li><a href="#" className="hover:text-white">Contact Us</a></li>
              <li><a href="#" className="hover:text-white">FAQ</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold mb-4">Company</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="#" className="hover:text-white">About</a></li>
              <li><a href="#" className="hover:text-white">Privacy</a></li>
              <li><a href="#" className="hover:text-white">Terms</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 px-6 py-6 text-center text-sm text-gray-400">
          © 2025 Lyyvora. All rights reserved.
        </div>
      </footer>

    </div>
  )
}

export default function SavePage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <SaveContent />
    </Suspense>
  )
}
