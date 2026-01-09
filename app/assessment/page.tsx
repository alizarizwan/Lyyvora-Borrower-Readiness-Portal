"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { AlertCircle } from "lucide-react"
import { useRouter } from "next/navigation"
import { useAssessmentStore } from "@/lib/store/assessmentStore"
import { calculateScore } from "@/lib/assessment/calculateScore"
import { UserMenu } from "@/components/user-menu"

type FormData = {
  timeInBusiness: string
  monthlyRevenue: string
  peakRevenue: string
  monthsReachedPeak: string
  profitMargin: string
  debtPayments: string
  creditScore: string
  cashOnHand: string
  compliance: string[]
  documents: string[]
  fundingPurpose: string
  fundingAmount: string
  fundingTimeline: string
}

type Warning = {
  message: string
  actionItem: string
}

type SectionScore = {
  label: string
  score: number
  max: number
  status: "good" | "warning" | "bad"
  reason: string
}

type ScoreResult = {
  score: number
  category: "Bank-Ready" | "Almost Ready" | "Not Ready"
  failures: string[]
  sections: SectionScore[]
  checklist: string[]
}


function AssessmentContent() {
  const { setScoreResult, loadDraft, setAnswer, answers, currentStep } = useAssessmentStore()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [page, setPage] = useState(1)
  const [warnings, setWarnings] = useState<Warning[]>([])
  const [formData, setFormData] = useState<FormData>({
    timeInBusiness: "",
    monthlyRevenue: "",
    peakRevenue: "",
    monthsReachedPeak: "",
    profitMargin: "",
    debtPayments: "",
    creditScore: "",
    cashOnHand: "",
    compliance: [],
    documents: [],
    fundingPurpose: "",
    fundingAmount: "",
    fundingTimeline: "",
  })

  // Load draft data if resuming - only run once on mount
  useEffect(() => {
    const draftParam = searchParams.get("draft")
    const stepParam = searchParams.get("step")
    console.log("Draft param from URL:", draftParam)
    console.log("Step param from URL:", stepParam)
    
    // First, try to get data from the assessment store (loaded from magic link)
    if (Object.keys(answers).length > 0) {
      console.log("Loading from assessment store:", answers)
      setFormData((prev) => ({ ...prev, ...answers }))
      
      // Set page from store's currentStep or URL param - only if not already set
      if (stepParam) {
        const step = parseInt(stepParam, 10)
        console.log("Setting page from URL to:", step)
        setPage(step)
      } else if (currentStep > 1) {
        setPage(currentStep)
      }
    } else if (draftParam) {
      // Fall back to draft param if no store data
      try {
        const draftAnswers = JSON.parse(draftParam)
        console.log("Parsed draft answers:", draftAnswers)
        setFormData((prev) => ({ ...prev, ...draftAnswers }))
        
        if (stepParam) {
          const step = parseInt(stepParam, 10)
          console.log("Setting page to:", step)
          setPage(step)
        }
      } catch (e) {
        console.error("Failed to load draft:", e)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]) // Only re-run when URL changes, not when answers/currentStep change

  const handleInputChange = (field: keyof FormData, value: string | string[]) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Also save to store so it persists
    setAnswer(field, value)

    // Conditional logic - Check for warnings
    const newWarnings: Warning[] = []

    if (field === "timeInBusiness" && value === "0-5") {
      newWarnings.push({
        message: "Most lenders require at least 6 months in business.",
        actionItem: "BUILD_HISTORY_6MO",
      })
    }

    if (field === "monthlyRevenue") {
      const revenue = Number.parseFloat(value as string)
      if (!isNaN(revenue) && revenue < 10000) {
        newWarnings.push({
          message: "Revenue below $10k/month minimum.",
          actionItem: "INCREASE_REVENUE_OR_WAIT",
        })
      }
    }

    setWarnings(newWarnings)
  }

  const isPageValid = () => {
    switch (page) {
      case 1:
        return formData.timeInBusiness !== ""
      case 2:
        return formData.monthlyRevenue !== "" && Number.parseFloat(formData.monthlyRevenue) >= 0
      case 3:
        return formData.peakRevenue !== "" && formData.monthsReachedPeak !== ""
      case 4:
        return formData.profitMargin !== ""
      case 5:
        return formData.debtPayments !== "" && Number.parseFloat(formData.debtPayments) >= 0
      case 6:
        return formData.creditScore !== ""
      case 7:
        return formData.cashOnHand !== ""
      case 8:
        return formData.compliance.length >= 2
      case 9:
        return formData.documents.length >= 1
      case 10:
        return (
          formData.fundingPurpose !== "" &&
          formData.fundingAmount !== "" &&
          Number.parseFloat(formData.fundingAmount) >= 5000 &&
          formData.fundingTimeline !== ""
        )
      default:
        return false
    }
  }

  const handleNext = () => {
    if (page < 10 && isPageValid()) {
      setPage(page + 1)
      window.scrollTo(0, 0)
      setWarnings([])
    }
  }

  const handleBack = () => {
    if (page > 1) {
      setPage(page - 1)
      window.scrollTo(0, 0)
      setWarnings([])
    }
  }

  

  const handleSubmit = () => {
    // Ensure all current form data is saved to store
    Object.entries(formData).forEach(([key, value]) => {
      setAnswer(key as keyof FormData, value)
    })
    
    const scoreResult = calculateScore(formData)
    setScoreResult(scoreResult)
    router.push("/results")
  }


  const toggleCheckbox = (field: "compliance" | "documents", value: string) => {
    const current = formData[field]
    const updated = current.includes(value) ? current.filter((item) => item !== value) : [...current, value]
    handleInputChange(field, updated)
  }



  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border sticky top-0 bg-background/95 backdrop-blur z-50">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-primary flex items-center justify-center text-primary-foreground font-bold text-xs">
              L
            </div>
            <span className="font-semibold text-sm">Lyyvora</span>
          </Link>
          <UserMenu />
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-3xl font-bold mb-2">Pre-Qualification Assessment</h1>
          <p className="text-muted-foreground">Complete 10 quick questions to calculate your bank readiness score</p>
          <div className="mt-6 flex items-center justify-between">
            <div className="text-sm text-muted-foreground">Progress</div>
            <div className="text-sm font-medium">Step {page} of 10</div>
          </div>
          <div className="w-full bg-secondary rounded-full h-2 mt-2">
            <div
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${(page / 10) * 100}%` }}
            />
          </div>
        </div>

        {/* Warnings */}
        {warnings.length > 0 && (
          <div className="mb-6">
            {warnings.map((warning, index) => (
              <div
                key={index}
                className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900 rounded-lg p-4 flex items-start gap-3"
              >
                <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-amber-900 dark:text-amber-200">{warning.message}</p>
              </div>
            ))}
          </div>
        )}

        {/* Form Sections */}
        <Card className="p-8">
          {/* Q1: Time in Business */}
          {page === 1 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold mb-2">Time in Business</h2>
                <p className="text-sm text-muted-foreground mb-6">How long has your medspa been operating?</p>
              </div>

              <div>
                <Label htmlFor="timeInBusiness" className="text-sm font-medium mb-2 block">
                  Operating History*
                </Label>
                <Select
                  value={formData.timeInBusiness}
                  onValueChange={(value) => handleInputChange("timeInBusiness", value)}
                >
                  <SelectTrigger id="timeInBusiness">
                    <SelectValue placeholder="Select time in business" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0-5">0–5 months</SelectItem>
                    <SelectItem value="6-11">6–11 months</SelectItem>
                    <SelectItem value="12-23">12–23 months</SelectItem>
                    <SelectItem value="24+">24+ months</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {/* Q2: Average Monthly Revenue */}
          {page === 2 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold mb-2">Average Monthly Revenue</h2>
                <p className="text-sm text-muted-foreground mb-6">
                  What is your average monthly revenue over the last 6 months?
                </p>
              </div>

              <div>
                <Label htmlFor="monthlyRevenue" className="text-sm font-medium mb-2 block">
                  Monthly Revenue (last 6 months)*
                </Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                  <Input
                    id="monthlyRevenue"
                    type="number"
                    placeholder="0"
                    min="0"
                    max="5000000"
                    className="pl-7"
                    value={formData.monthlyRevenue}
                    onChange={(e) => handleInputChange("monthlyRevenue", e.target.value)}
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-2">Enter amount between $0 and $5,000,000</p>
              </div>
            </div>
          )}

          {/* Q3: Revenue Peak Consistency */}
          {page === 3 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold mb-2">Revenue Peak Consistency</h2>
                <p className="text-sm text-muted-foreground mb-6">
                  What was your highest single-month revenue in the last 6 months, and how many times did you reach that
                  level?
                </p>
              </div>

              <div>
                <Label htmlFor="peakRevenue" className="text-sm font-medium mb-2 block">
                  Highest Monthly Revenue*
                </Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                  <Input
                    id="peakRevenue"
                    type="number"
                    placeholder="0"
                    min="0"
                    className="pl-7"
                    value={formData.peakRevenue}
                    onChange={(e) => handleInputChange("peakRevenue", e.target.value)}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="monthsReachedPeak" className="text-sm font-medium mb-2 block">
                  Number of Months Reached*
                </Label>
                <Select
                  value={formData.monthsReachedPeak}
                  onValueChange={(value) => handleInputChange("monthsReachedPeak", value)}
                >
                  <SelectTrigger id="monthsReachedPeak">
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 time</SelectItem>
                    <SelectItem value="2-3">2–3 times</SelectItem>
                    <SelectItem value="4-5">4–5 times</SelectItem>
                    <SelectItem value="6">6 times</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {/* Q4: Average Profit Margin */}
          {page === 4 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold mb-2">Average Profit Margin</h2>
                <p className="text-sm text-muted-foreground mb-6">What is your average profit margin?</p>
              </div>

              <div>
                <Label htmlFor="profitMargin" className="text-sm font-medium mb-2 block">
                  Profit Margin*
                </Label>
                <Select
                  value={formData.profitMargin}
                  onValueChange={(value) => handleInputChange("profitMargin", value)}
                >
                  <SelectTrigger id="profitMargin">
                    <SelectValue placeholder="Select profit margin range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="losing">Losing money</SelectItem>
                    <SelectItem value="0-5">0–5%</SelectItem>
                    <SelectItem value="6-10">6–10%</SelectItem>
                    <SelectItem value="11-20">11–20%</SelectItem>
                    <SelectItem value="20+">20%+</SelectItem>
                    <SelectItem value="not-sure">Not sure</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground mt-2">
                  This is your sustained average profitability, not monthly fluctuations
                </p>
              </div>
            </div>
          )}

          {/* Q5: Existing Monthly Debt Payments */}
          {page === 5 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold mb-2">Existing Monthly Debt Payments</h2>
                <p className="text-sm text-muted-foreground mb-6">
                  What are your total monthly debt payments (business + personal tied to business)?
                </p>
              </div>

              <div>
                <Label htmlFor="debtPayments" className="text-sm font-medium mb-2 block">
                  Total Monthly Debt Payments*
                </Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                  <Input
                    id="debtPayments"
                    type="number"
                    placeholder="0"
                    min="0"
                    className="pl-7"
                    value={formData.debtPayments}
                    onChange={(e) => handleInputChange("debtPayments", e.target.value)}
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-2">Enter $0 if you have no existing debt payments</p>
              </div>
            </div>
          )}

          {/* Q6: Credit Score Range */}
          {page === 6 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold mb-2">Credit Score Range</h2>
                <p className="text-sm text-muted-foreground mb-6">
                  What is the credit score range of the primary owner?
                </p>
              </div>

              <div>
                <Label htmlFor="creditScore" className="text-sm font-medium mb-2 block">
                  Primary Owner Credit Score*
                </Label>
                <Select value={formData.creditScore} onValueChange={(value) => handleInputChange("creditScore", value)}>
                  <SelectTrigger id="creditScore">
                    <SelectValue placeholder="Select credit score range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="<600">&lt;600</SelectItem>
                    <SelectItem value="600-649">600–649</SelectItem>
                    <SelectItem value="650-699">650–699</SelectItem>
                    <SelectItem value="700+">700+</SelectItem>
                    <SelectItem value="prefer-not">Prefer not to say</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {/* Q7: Cash on Hand */}
          {page === 7 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold mb-2">Cash on Hand</h2>
                <p className="text-sm text-muted-foreground mb-6">
                  How many months of operating expenses can you cover with your current cash on hand?
                </p>
              </div>

              <div>
                <Label htmlFor="cashOnHand" className="text-sm font-medium mb-2 block">
                  Cash Buffer*
                </Label>
                <Select value={formData.cashOnHand} onValueChange={(value) => handleInputChange("cashOnHand", value)}>
                  <SelectTrigger id="cashOnHand">
                    <SelectValue placeholder="Select cash buffer" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="<1">&lt;1 month</SelectItem>
                    <SelectItem value="1-2">1–2 months</SelectItem>
                    <SelectItem value="3+">3+ months</SelectItem>
                    <SelectItem value="not-sure">Not sure</SelectItem>
                  </SelectContent>
                </Select>
                <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-900">
                  <p className="text-xs text-blue-900 dark:text-blue-200">
                    <strong>Important:</strong> Cash on hand is not profit. It is the actual cash sitting in your
                    business bank account today that can be used to pay bills if revenue slows.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Q8: Business Setup and Compliance */}
          {page === 8 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold mb-2">Business Setup and Compliance</h2>
                <p className="text-sm text-muted-foreground mb-6">
                  Select all that apply to your business (minimum 2 required)
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Checkbox
                    id="compliance-registered"
                    checked={formData.compliance.includes("registered")}
                    onCheckedChange={() => toggleCheckbox("compliance", "registered")}
                  />
                  <Label htmlFor="compliance-registered" className="text-sm font-normal cursor-pointer leading-relaxed">
                    Business legally registered or incorporated
                  </Label>
                </div>

                <div className="flex items-start gap-3">
                  <Checkbox
                    id="compliance-bank"
                    checked={formData.compliance.includes("bank")}
                    onCheckedChange={() => toggleCheckbox("compliance", "bank")}
                  />
                  <Label htmlFor="compliance-bank" className="text-sm font-normal cursor-pointer leading-relaxed">
                    Active business bank account
                  </Label>
                </div>

                <div className="flex items-start gap-3">
                  <Checkbox
                    id="compliance-licenses"
                    checked={formData.compliance.includes("licenses")}
                    onCheckedChange={() => toggleCheckbox("compliance", "licenses")}
                  />
                  <Label htmlFor="compliance-licenses" className="text-sm font-normal cursor-pointer leading-relaxed">
                    Required medical/aesthetic licenses active
                  </Label>
                </div>

                <div className="flex items-start gap-3">
                  <Checkbox
                    id="compliance-legal"
                    checked={formData.compliance.includes("legal")}
                    onCheckedChange={() => toggleCheckbox("compliance", "legal")}
                  />
                  <Label htmlFor="compliance-legal" className="text-sm font-normal cursor-pointer leading-relaxed">
                    No major liens, judgments, or unresolved legal disputes
                  </Label>
                </div>
              </div>

              {formData.compliance.length < 2 && formData.compliance.length > 0 && (
                <p className="text-sm text-amber-600 dark:text-amber-500">Please select at least 2 items to continue</p>
              )}
            </div>
          )}

          {/* Q9: Documents Readiness */}
          {page === 9 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold mb-2">Documents Readiness</h2>
                <p className="text-sm text-muted-foreground mb-6">
                  Which documents do you have ready? (select at least 1)
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Checkbox
                    id="docs-bank"
                    checked={formData.documents.includes("bank")}
                    onCheckedChange={() => toggleCheckbox("documents", "bank")}
                  />
                  <Label htmlFor="docs-bank" className="text-sm font-normal cursor-pointer leading-relaxed">
                    Last 3 months business bank statements
                  </Label>
                </div>

                <div className="flex items-start gap-3">
                  <Checkbox
                    id="docs-pl"
                    checked={formData.documents.includes("pl")}
                    onCheckedChange={() => toggleCheckbox("documents", "pl")}
                  />
                  <Label htmlFor="docs-pl" className="text-sm font-normal cursor-pointer leading-relaxed">
                    Profit & loss statement
                  </Label>
                </div>

                <div className="flex items-start gap-3">
                  <Checkbox
                    id="docs-balance"
                    checked={formData.documents.includes("balance")}
                    onCheckedChange={() => toggleCheckbox("documents", "balance")}
                  />
                  <Label htmlFor="docs-balance" className="text-sm font-normal cursor-pointer leading-relaxed">
                    Balance sheet
                  </Label>
                </div>

                <div className="flex items-start gap-3">
                  <Checkbox
                    id="docs-tax"
                    checked={formData.documents.includes("tax")}
                    onCheckedChange={() => toggleCheckbox("documents", "tax")}
                  />
                  <Label htmlFor="docs-tax" className="text-sm font-normal cursor-pointer leading-relaxed">
                    Tax filings (personal or business)
                  </Label>
                </div>

                <div className="flex items-start gap-3">
                  <Checkbox
                    id="docs-debt"
                    checked={formData.documents.includes("debt")}
                    onCheckedChange={() => toggleCheckbox("documents", "debt")}
                  />
                  <Label htmlFor="docs-debt" className="text-sm font-normal cursor-pointer leading-relaxed">
                    Debt schedule
                  </Label>
                </div>
              </div>

              {formData.documents.length === 0 && (
                <p className="text-sm text-amber-600 dark:text-amber-500">
                  Please select at least 1 document to continue
                </p>
              )}
            </div>
          )}

          {/* Q10: Funding Need */}
          {page === 10 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold mb-2">Funding Need</h2>
                <p className="text-sm text-muted-foreground mb-6">Tell us about your funding requirements</p>
              </div>

              <div>
                <Label htmlFor="fundingPurpose" className="text-sm font-medium mb-2 block">
                  Purpose*
                </Label>
                <Select
                  value={formData.fundingPurpose}
                  onValueChange={(value) => handleInputChange("fundingPurpose", value)}
                >
                  <SelectTrigger id="fundingPurpose">
                    <SelectValue placeholder="Select purpose" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="working-capital">Working capital</SelectItem>
                    <SelectItem value="equipment">Equipment</SelectItem>
                    <SelectItem value="renovation">Renovation</SelectItem>
                    <SelectItem value="new-location">New location</SelectItem>
                    <SelectItem value="acquisition">Acquisition/buy-in</SelectItem>
                    <SelectItem value="refinance">Refinance</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="fundingAmount" className="text-sm font-medium mb-2 block">
                  Amount Needed*
                </Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                  <Input
                    id="fundingAmount"
                    type="number"
                    placeholder="5000"
                    min="5000"
                    className="pl-7"
                    value={formData.fundingAmount}
                    onChange={(e) => handleInputChange("fundingAmount", e.target.value)}
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-2">Minimum $5,000</p>
              </div>

              <div>
                <Label htmlFor="fundingTimeline" className="text-sm font-medium mb-2 block">
                  Timeline*
                </Label>
                <Select
                  value={formData.fundingTimeline}
                  onValueChange={(value) => handleInputChange("fundingTimeline", value)}
                >
                  <SelectTrigger id="fundingTimeline">
                    <SelectValue placeholder="Select timeline" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="asap">ASAP (0–30 days)</SelectItem>
                    <SelectItem value="1-3">1–3 months</SelectItem>
                    <SelectItem value="3-6">3–6 months</SelectItem>
                    <SelectItem value="exploring">Exploring</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8 pt-8 border-t border-border">
            <Button variant="outline" onClick={handleBack} disabled={page === 1}>
              Back
            </Button>
            {page < 10 ? (
              <Button onClick={handleNext} disabled={!isPageValid()}>
                Next
              </Button>
            ) : (
              <Button onClick={handleSubmit} disabled={!isPageValid()}>
                View Results
              </Button>
            )}
          </div>
        </Card>

        {/* Save Progress Link */}
        <div className="text-center mt-6">
          <button
            onClick={() => {
              // Save formData to sessionStorage before navigating
              sessionStorage.setItem("assessmentFormData", JSON.stringify(formData))
              sessionStorage.setItem("assessmentStep", String(page))
              router.push("/save")
            }}
            className="text-sm text-primary hover:underline cursor-pointer"
          >
            Save & Resume Later
          </button>
        </div>
      </div>
    </div>
  )
}

export default function AssessmentPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <AssessmentContent />
    </Suspense>
  )
}