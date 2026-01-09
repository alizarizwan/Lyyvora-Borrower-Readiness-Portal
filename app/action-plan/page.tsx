"use client"

import { redirect } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useAssessmentStore } from "@/lib/store/assessmentStore"
import { CHECKLIST_LABELS } from "@/lib/assessment/failureMap"


export default function ActionPlanPage() {
  const {
    scoreResult,
    completedChecklist,
    toggleChecklistItem,
  } = useAssessmentStore()

  // 🚨 Guard: must have results
  if (!scoreResult) {
    redirect("/assessment")
  }

  const checklist = scoreResult.checklist ?? []
  const completed = completedChecklist.length
  const total = checklist.length

  async function handleDownloadPdf() {
  try {
    const res = await fetch("/api/pdf/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(scoreResult),
    })

    if (!res.ok) throw new Error("PDF failed")

    const blob = await res.blob()
    const url = window.URL.createObjectURL(blob)

    const a = document.createElement("a")
    a.href = url
    a.download = "Bank-Readiness-Brief.pdf"
    document.body.appendChild(a)
    a.click()
    a.remove()

    window.URL.revokeObjectURL(url)
  } catch (e) {
    alert("Failed to generate PDF")
  }
}

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border sticky top-0 bg-background/95 backdrop-blur">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-primary flex items-center justify-center text-primary-foreground font-bold text-xs">
              L
            </div>
            <span className="font-semibold text-sm">Lyyvora</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/save" className="text-xs text-muted-foreground hover:text-foreground">
              Save Progress
            </Link>
            <Button size="sm" asChild>
              <Link href="/assessment">Sign In</Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Breadcrumb */}
      <div className="max-w-6xl mx-auto px-6 py-4 flex gap-2 text-sm text-muted-foreground">
        <Link href="/results" className="hover:text-foreground">
          Results
        </Link>
        <span>/</span>
        <span>Action Plan</span>
      </div>

      {/* Main */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold mb-12">Your Action Plan</h1>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Checklist */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Personalized Checklist</h2>

            <p className="text-sm text-muted-foreground mb-4">
              {total === 0
                ? "No action items — you're in great shape."
                : `${completed} / ${total} completed`}
            </p>

            <div className="space-y-3">
              {checklist.map((code: string) => (
                  <Card key={code} className="p-4">
                    <div className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        checked={completedChecklist.includes(code)}
                        onChange={() => toggleChecklistItem(code)}
                        className="w-5 h-5 mt-1"
                      />
                      <div>
                        <h4 className="font-medium text-sm">
                          {CHECKLIST_LABELS[code as keyof typeof CHECKLIST_LABELS] ?? code}
                        </h4>
                      </div>
                    </div>
                  </Card>
                ))}

              {checklist.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  No action items — you’re in great shape.
                </p>
              )}
            </div>

            <div className="w-full bg-secondary rounded-full h-2 mt-6">
              <div
                className="bg-primary h-2 rounded-full"
                style={{
                  width: total === 0 ? "100%" : `${(completed / total) * 100}%`,
                }}
              />
            </div>
          </div>

          {/* Templates */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Templates & Tools</h2>

            <div className="space-y-3">
              <Card className="p-4 flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-sm">13-Week Cash Flow Template</h4>
                  <p className="text-xs text-muted-foreground">
                    Short-term cash forecasting lenders expect
                  </p>
                </div>
                <Button size="sm" asChild>
                  <a href="/templates/13-week-cash-flow.xlsx" download>
                    Download
                  </a>
                </Button>
              </Card>

              <Card className="p-4 flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-sm">Profit & Loss Template</h4>
                  <p className="text-xs text-muted-foreground">
                    Monthly income and expense tracking
                  </p>
                </div>
                <Button size="sm" asChild>
                  <a href="/templates/profit-and-loss-template.xlsx" download>
                    Download
                  </a>
                </Button>
              </Card>

              <Card className="p-4 flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-sm">Debt Schedule</h4>
                  <p className="text-xs text-muted-foreground">
                    All current loans and obligations
                  </p>
                </div>
                <Button size="sm" asChild>
                  <a href="/templates/debt-schedule.xlsx" download>
                    Download
                  </a>
                </Button>
              </Card>

              <Card className="p-4 flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-sm">Business Plan Outline</h4>
                  <p className="text-xs text-muted-foreground">
                    Simple lender-ready narrative structure
                  </p>
                </div>
                <Button size="sm" asChild>
                  <a href="/templates/business-plan-outline.pdf" download>
                    Download
                  </a>
                </Button>
              </Card>
            </div>
          </div>
        </div>

        {/* PDF CTA */}
        <Card className="p-8 bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20 text-center">
          <h3 className="text-lg font-semibold mb-2">
            Ready for Your Bank Meeting?
          </h3>
          <p className="text-sm text-muted-foreground mb-6">
            Download your personalized Bank Readiness Brief.
          </p>
          <Button className="gap-2" onClick={handleDownloadPdf}>
            📥 Download Bank Readiness Brief (PDF)
          </Button>
        </Card>
      </div>
    </div>
  )
}
