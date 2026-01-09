"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"
import { UserMenu } from "@/components/user-menu"

interface Assessment {
  id: string
  magicLink: string
  answers: string
  currentStep: number
  createdAt: string
  updatedAt: string
}

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [assessments, setAssessments] = useState<Assessment[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin")
      return
    }

    if (status === "authenticated") {
      fetchAssessments()
    }
  }, [status, router])

  const fetchAssessments = async () => {
    try {
      const res = await fetch("/api/assessment/list")
      if (res.ok) {
        const data = await res.json()
        setAssessments(data)
      }
    } catch (error) {
      console.error("Failed to fetch assessments:", error)
    } finally {
      setLoading(false)
    }
  }

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-sm text-gray-600">
        Loading...
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <nav className="border-b border-border sticky top-0 bg-background/95 backdrop-blur z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-primary flex items-center justify-center text-primary-foreground font-bold text-sm">
              L
            </div>
            <span className="font-semibold">Lyyvora</span>
          </Link>
          <UserMenu />
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Your Assessments</h1>
          <p className="text-muted-foreground">Manage and continue your bank readiness assessments</p>
        </div>

        {assessments.length === 0 ? (
          <Card className="p-12 text-center">
            <h2 className="text-xl font-semibold mb-2">No assessments yet</h2>
            <p className="text-muted-foreground mb-6">Start a new assessment to evaluate your clinic's bank readiness</p>
            <Button asChild>
              <Link href="/assessment">Start New Assessment</Link>
            </Button>
          </Card>
        ) : (
          <div className="grid gap-6">
            {assessments.map((assessment) => {
              const answers = JSON.parse(assessment.answers || "{}")
              const progress = (assessment.currentStep / 10) * 100

              return (
                <Card key={assessment.id} className="p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">Assessment</h3>
                      <p className="text-sm text-muted-foreground">
                        Started {formatDistanceToNow(new Date(assessment.createdAt), { addSuffix: true })}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">Step {assessment.currentStep} of 10</div>
                      <div className="text-sm text-muted-foreground">{Math.round(progress)}% complete</div>
                    </div>
                  </div>

                  <div className="w-full bg-secondary rounded-full h-2 mb-6">
                    <div
                      className="bg-primary h-2 rounded-full transition-all"
                      style={{ width: `${progress}%` }}
                    />
                  </div>

                  <div className="flex gap-3">
                    <Button asChild>
                      <Link href={`/resume/${assessment.magicLink}`}>Continue Assessment</Link>
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        navigator.clipboard.writeText(
                          `${typeof window !== "undefined" ? window.location.origin : "http://localhost:3000"}/resume/${assessment.magicLink}`
                        )
                        alert("Link copied to clipboard!")
                      }}
                    >
                      Copy Link
                    </Button>
                  </div>
                </Card>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
