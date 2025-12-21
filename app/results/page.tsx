"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Link from "next/link"
import { CheckCircle2, AlertCircle, XCircle } from "lucide-react"
import { calculateScore, getAssessmentDetails } from "@/lib/scoring"

export default function ResultsPage() {
  const [result, setResult] = useState<any>(null)
  const [assessmentData, setAssessmentData] = useState<any>(null)
  const [details, setDetails] = useState<any[]>([])

  useEffect(() => {
    // Load assessment data from localStorage
    const data = localStorage.getItem("assessmentData")
    if (data) {
      const parsed = JSON.parse(data)
      setAssessmentData(parsed)

      // Calculate score
      const scoringResult = calculateScore(parsed)
      setResult(scoringResult)

      // Get assessment details
      const assessmentDetails = getAssessmentDetails(parsed, scoringResult)
      setDetails(assessmentDetails)
    }
  }, [])

  if (!result || !assessmentData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Loading your results...</p>
          <Link href="/assessment">
            <Button variant="outline">Go to Assessment</Button>
          </Link>
        </div>
      </div>
    )
  }

  const getCategoryIcon = () => {
    switch (result.category) {
      case "Bank-Ready":
        return <CheckCircle2 className="w-5 h-5 text-green-600" />
      case "Almost Ready":
        return <AlertCircle className="w-5 h-5 text-amber-600" />
      case "Not Ready":
        return <XCircle className="w-5 h-5 text-red-600" />
    }
  }

  const getCategoryColor = () => {
    switch (result.category) {
      case "Bank-Ready":
        return "bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-900"
      case "Almost Ready":
        return "bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900"
      case "Not Ready":
        return "bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-900"
    }
  }

  const getScoreColor = () => {
    if (result.totalScore >= 80) return "text-green-600 dark:text-green-500"
    if (result.totalScore >= 55) return "text-amber-600 dark:text-amber-500"
    return "text-red-600 dark:text-red-500"
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border sticky top-0 bg-background/95 backdrop-blur z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-primary flex items-center justify-center text-primary-foreground font-bold text-xs">
              L
            </div>
            <span className="font-semibold text-sm">Lyyvora</span>
          </Link>
          <Button variant="default" size="sm" className="text-xs" asChild>
            <Link href="/assessment">Sign In</Link>
          </Button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4 border ${getCategoryColor()}`}>
            {getCategoryIcon()}
            <span className="text-sm font-medium">{result.category}</span>
          </div>
          <p className="text-muted-foreground">Based on your inputs, here's how banks see your clinic:</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {/* Score Card */}
          <div className="md:col-span-1">
            <Card className="p-8 text-center">
              <div className="text-sm text-muted-foreground mb-4">Your Score</div>
              <div className="w-32 h-32 rounded-full bg-secondary mx-auto flex items-center justify-center mb-4">
                <div className="text-center">
                  <div className={`text-5xl font-bold ${getScoreColor()}`}>{result.totalScore}</div>
                  <div className="text-xs text-muted-foreground">/100</div>
                </div>
              </div>
              <div className="text-sm font-medium mb-2">{result.category}</div>
              {result.category === "Bank-Ready" && (
                <p className="text-xs text-muted-foreground">You're well-positioned for traditional bank financing</p>
              )}
              {result.category === "Almost Ready" && (
                <p className="text-xs text-muted-foreground">A few improvements will get you bank-ready</p>
              )}
              {result.category === "Not Ready" && (
                <p className="text-xs text-muted-foreground">Focus on building your business fundamentals first</p>
              )}
            </Card>
          </div>

          {/* Assessment Details */}
          <div className="md:col-span-2">
            <Card className="p-8">
              <h3 className="font-semibold mb-6">Assessment Details</h3>
              <div className="space-y-4">
                {details.slice(0, 5).map((detail, idx) => (
                  <div key={idx} className="flex gap-4">
                    <div
                      className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                        detail.score >= detail.max * 0.7
                          ? "bg-green-100 dark:bg-green-950"
                          : detail.score >= detail.max * 0.4
                            ? "bg-amber-100 dark:bg-amber-950"
                            : "bg-red-100 dark:bg-red-950"
                      }`}
                    >
                      <span
                        className={`w-2 h-2 rounded-full ${
                          detail.score >= detail.max * 0.7
                            ? "bg-green-600"
                            : detail.score >= detail.max * 0.4
                              ? "bg-amber-600"
                              : "bg-red-600"
                        }`}
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-medium">{detail.label}</h4>
                      <p className="text-xs text-muted-foreground mt-0.5">{detail.description}</p>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {detail.score}/{detail.max}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>

        {/* Failure Reasons / Action Items */}
        {result.failureReasons.length > 0 && (
          <Card className="p-8 mb-12 border-amber-200 dark:border-amber-900">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-amber-600" />
              Areas for Improvement
            </h3>
            <div className="space-y-4">
              {result.failureReasons.map((reason: any, idx: number) => (
                <div key={idx} className="flex gap-3 p-4 bg-amber-50 dark:bg-amber-950/20 rounded-lg">
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-amber-900 dark:text-amber-100">{reason.message}</h4>
                    <p className="text-xs text-amber-700 dark:text-amber-300 mt-1">{reason.actionItem}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* What-If Scenarios */}
        <Card className="p-8 mb-12">
          <h3 className="font-semibold mb-4">Improve Your Score</h3>
          <p className="text-sm text-muted-foreground mb-6">
            Here's how specific improvements could boost your bank readiness:
          </p>
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-medium">Increase monthly revenue to $50k</h4>
                <span className="text-sm text-primary">+{15 - result.breakdown.revenue} points</span>
              </div>
              <div className="flex-1 bg-secondary rounded-full h-2">
                <div
                  className="bg-primary h-2 rounded-full transition-all"
                  style={{ width: `${((result.totalScore + (15 - result.breakdown.revenue)) / 100) * 100}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-medium">Improve credit score to 700+</h4>
                <span className="text-sm text-primary">+{15 - result.breakdown.creditScore} points</span>
              </div>
              <div className="flex-1 bg-secondary rounded-full h-2">
                <div
                  className="bg-primary h-2 rounded-full transition-all"
                  style={{ width: `${((result.totalScore + (15 - result.breakdown.creditScore)) / 100) * 100}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-medium">Build 3+ months cash reserves</h4>
                <span className="text-sm text-primary">+{10 - result.breakdown.cashBuffer} points</span>
              </div>
              <div className="flex-1 bg-secondary rounded-full h-2">
                <div
                  className="bg-primary h-2 rounded-full transition-all"
                  style={{ width: `${((result.totalScore + (10 - result.breakdown.cashBuffer)) / 100) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </Card>

        {/* CTA Section */}
        <Card className="p-8 bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
          <h3 className="font-semibold mb-2 text-center">Ready to Take the Next Step?</h3>
          <p className="text-sm text-muted-foreground text-center mb-6">
            Get your personalized action plan and explore financing options tailored to your clinic.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/action-plan">
              <Button className="w-full">Get Bank-Ready Checklist</Button>
            </Link>
            <Button variant="outline" className="w-full bg-background">
              Download Full Report (PDF)
            </Button>
          </div>
        </Card>
      </div>
    </div>
  )
}
