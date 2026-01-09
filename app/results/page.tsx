"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useAssessmentStore } from "@/lib/store/assessmentStore"

const ASSESSMENT_INSIGHTS: Record<string, {
  title: string
  impact: "high" | "medium" | "low"
  suggestion: string
}> = {
  TIME_IN_BIZ: {
    title: "Time in Business",
    impact: "high",
    suggestion: "Most lenders prefer 12+ months of operating history."
  },
  MONTHLY_REVENUE: {
    title: "Monthly Revenue",
    impact: "high",
    suggestion: "Consistent $20k+/month revenue significantly improves approval odds."
  },
  PROFIT_MARGIN: {
    title: "Profitability",
    impact: "medium",
    suggestion: "Improving margins above 10% unlocks better loan terms."
  },
  DOCUMENTS: {
    title: "Financial Documents",
    impact: "medium",
    suggestion: "Having bank statements and P&L ready speeds approvals."
  },
  CREDIT_SCORE: {
    title: "Owner Credit",
    impact: "high",
    suggestion: "Scores above 680 unlock traditional bank financing."
  }
}

export default function ResultsPage() {
  const router = useRouter()
  const { scoreResult } = useAssessmentStore()

  const [displayScore, setDisplayScore] = useState<number | null>(null)
  const [expanded, setExpanded] = useState<string | null>(null)

  useEffect(() => {
    if (!scoreResult) {
      router.replace("/assessment")
    } else {
      setDisplayScore(scoreResult.score)
    }
  }, [scoreResult, router])

  if (!scoreResult || displayScore === null) {
    return <div className="p-12 text-center">Loading results…</div>
  }

  const {
  score,
  category,
  failures = [],
  sections = [],
} = scoreResult

  const scoreColor =
    score >= 75 ? "text-green-600"
    : score >= 50 ? "text-amber-600"
    : "text-red-600"

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="max-w-6xl mx-auto px-6 py-12 text-center">
        <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary text-sm font-medium">
          {category}
        </span>
        <p className="text-muted-foreground mt-3">
          Based on your inputs, here’s how lenders view your clinic today.
        </p>
      </div>

      {/* Score + Details */}
      <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-8 mb-12">
        {/* Score */}
        <Card className="p-8 text-center">
          <div className="relative w-32 h-32 mx-auto mb-4">
            <div className="absolute inset-0 rounded-full bg-secondary" />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className={`text-4xl font-bold ${scoreColor}`}>
                {displayScore}
              </span>
            </div>
          </div>
          <h3 className="font-semibold">Your Readiness Score</h3>
          <p className="text-xs text-muted-foreground mt-1">Out of 100</p>
        </Card>

        {/* Details */}
        <Card className="p-8 md:col-span-2">
        <h3 className="font-semibold mb-6">Assessment Breakdown</h3>

        <div className="space-y-4">
          {sections?.map((section) => (
            <div key={section.label} className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="font-medium">{section.label}</span>
                <span className="text-muted-foreground">
                  {section.score}/{section.max}
                </span>
              </div>

              <div className="w-full h-2 rounded-full bg-secondary">
                <div
                  className={`h-2 rounded-full transition-all ${
                    section.status === "good"
                      ? "bg-green-500"
                      : section.status === "warning"
                      ? "bg-yellow-500"
                      : "bg-red-500"
                  }`}
                  style={{ width: `${(section.score / section.max) * 100}%` }}
                />
              </div>

              <p className="text-xs text-muted-foreground">{section.reason}</p>
            </div>
          ))}
        </div>
      </Card>

      </div>

      {/* What-if */}
      <div className="max-w-6xl mx-auto px-6 mb-12">
        <Card className="p-6">
          <h3 className="font-semibold mb-2">What-If Scenario</h3>
          <p className="text-sm text-muted-foreground mb-4">
            See how small improvements impact lender perception.
          </p>

          <div className="flex flex-wrap gap-4">
            <Button
              variant="outline"
              onClick={() => setDisplayScore(Math.min(score + 10, 100))}
            >
              + Improve Revenue
            </Button>
            <Button
              variant="outline"
              onClick={() => setDisplayScore(Math.min(score + 5, 100))}
            >
              + Add Documents
            </Button>
            <Button variant="ghost" onClick={() => setDisplayScore(score)}>
              Reset
            </Button>
          </div>
        </Card>
      </div>

      {/* CTA */}
      <div className="max-w-6xl mx-auto px-6 pb-16">
        <Card className="p-8 text-center bg-gradient-to-br from-primary/5 to-primary/10">
          <h3 className="font-semibold mb-2">Next Best Step</h3>
          <p className="text-sm text-muted-foreground mb-6">
            Turn this score into an actionable bank-ready plan.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/action-plan">
              <Button className="w-full sm:w-auto">
                Get Bank-Ready Checklist
              </Button>
            </Link>

            <Button
              variant="outline"
              className="w-full sm:w-auto"
            >
              Explore Funding Options
            </Button>
          </div>
        </Card>
      </div>
    </div>
  )
}
