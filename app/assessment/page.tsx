"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"
import { FileUploadArea } from "@/components/file-upload-area"
import { RangeSlider } from "@/components/range-slider"
import { CheckboxField } from "@/components/checkbox-field"

export default function AssessmentPage() {
  const [page, setPage] = useState(1)
  const [formData, setFormData] = useState({
    businessName: "",
    businessType: "",
    monthlyRevenue: 25000,
    creditScore: "",
    existingDebt: "",
    totalDebt: "",
    ownershipPercentage: 0,
    purposeOfLoan: "",
    requestedLoanAmount: 150000,
    documents: null,
    acceptTerms: false,
  })

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleNext = () => {
    if (page < 10) {
      setPage(page + 1)
      window.scrollTo(0, 0)
    }
  }

  const handleBack = () => {
    if (page > 1) {
      setPage(page - 1)
      window.scrollTo(0, 0)
    }
  }

  const handleSubmit = () => {
    // Navigate to results page
    window.location.href = "/results"
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border sticky top-0 bg-background/95 backdrop-blur">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-primary flex items-center justify-center text-primary-foreground font-bold text-xs">
              L
            </div>
            <span className="font-semibold text-sm">Lyyvora</span>
          </div>
          <div className="flex items-center gap-4">
            <a href="#" className="text-xs text-muted-foreground hover:text-foreground">
              About
            </a>
            <a href="#" className="text-xs text-muted-foreground hover:text-foreground">
              Contact
            </a>
            <Button variant="default" size="sm" className="text-xs" asChild>
              <Link href="/assessment">Sign In</Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-3xl font-bold mb-2">Pre-Qualification Assessment</h1>
          <p className="text-muted-foreground">Complete 10 quick questions to unlock your bank readiness assessment</p>
          <div className="mt-6 flex items-center justify-between">
            <div className="text-sm text-muted-foreground">Progress</div>
            <div className="text-sm font-medium">Page {page} of 10</div>
          </div>
          <div className="w-full bg-secondary rounded-full h-2 mt-2">
            <div
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${(page / 10) * 100}%` }}
            />
          </div>
          <div className="text-right text-xs text-muted-foreground mt-1">{Math.round((page / 10) * 100)}% Complete</div>
        </div>

        {/* Form Sections */}
        <Card className="p-8">
          {/* Page 1: Business Basics */}
          {page === 1 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
                    1
                  </span>
                  Business Basics
                </h2>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Business Name*</label>
                <Input
                  placeholder="Enter your business name"
                  value={formData.businessName}
                  onChange={(e) => handleInputChange("businessName", e.target.value)}
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Type of Business*</label>
                <Select
                  value={formData.businessType}
                  onValueChange={(value) => handleInputChange("businessType", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a business type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="medical">Medical Practice</SelectItem>
                    <SelectItem value="dental">Dental Practice</SelectItem>
                    <SelectItem value="surgical">Surgical Center</SelectItem>
                    <SelectItem value="physical">Physical Therapy</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-4 block">Monthly Revenue*</label>
                <RangeSlider
                  min={0}
                  max={500000}
                  step={5000}
                  value={formData.monthlyRevenue}
                  onChange={(value) => handleInputChange("monthlyRevenue", value)}
                />
                <div className="text-right text-sm font-medium text-primary mt-2">
                  ${formData.monthlyRevenue.toLocaleString()}
                </div>
              </div>
            </div>
          )}

          {/* Page 2: Credit & Financials */}
          {page === 2 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
                    2
                  </span>
                  Credit & Financials
                </h2>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Business Credit Score (Optional)*</label>
                <Input
                  placeholder="Enter your credit score (300-850)"
                  type="number"
                  value={formData.creditScore}
                  onChange={(e) => handleInputChange("creditScore", e.target.value)}
                />
                <p className="text-xs text-muted-foreground mt-1">If you don't have a score, leave blank</p>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Existing Business Debt*</label>
                <div className="flex gap-2 mb-4">
                  <label className="flex items-center gap-2">
                    <input type="radio" name="debt" defaultChecked className="w-4 h-4" />
                    <span className="text-sm">Yes</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="radio" name="debt" className="w-4 h-4" />
                    <span className="text-sm">No</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Total Debt Amount (if applicable)*</label>
                <Input
                  placeholder="$0"
                  value={formData.totalDebt}
                  onChange={(e) => handleInputChange("totalDebt", e.target.value)}
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-4 block">Funds for Statement Number*</label>
                <CheckboxField label="Tagged POL: Confidential & Risky" />
              </div>
            </div>
          )}

          {/* Page 3: Ownership & Documents */}
          {page === 3 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
                    3
                  </span>
                  Ownership & Documents
                </h2>
              </div>

              <div>
                <label className="text-sm font-medium mb-4 block">Owner Percentage*</label>
                <RangeSlider
                  min={0}
                  max={100}
                  step={1}
                  value={formData.ownershipPercentage}
                  onChange={(value) => handleInputChange("ownershipPercentage", value)}
                />
                <div className="text-right text-sm font-medium text-primary mt-2">{formData.ownershipPercentage}%</div>
              </div>

              <div>
                <label className="text-sm font-medium mb-4 block">Upload Documents (Optional)</label>
                <FileUploadArea onUpload={(file) => handleInputChange("documents", file)} />
              </div>
            </div>
          )}

          {/* Page 4: Use of Funds */}
          {page === 4 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
                    4
                  </span>
                  Use of Funds
                </h2>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Purpose of Loan*</label>
                <Select
                  value={formData.purposeOfLoan}
                  onValueChange={(value) => handleInputChange("purposeOfLoan", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select purpose" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="equipment">Equipment Purchase</SelectItem>
                    <SelectItem value="expansion">Expansion</SelectItem>
                    <SelectItem value="working">Working Capital</SelectItem>
                    <SelectItem value="renovation">Renovation</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-4 block">Requested Loan Amount*</label>
                <RangeSlider
                  min={10000}
                  max={1000000}
                  step={10000}
                  value={formData.requestedLoanAmount}
                  onChange={(value) => handleInputChange("requestedLoanAmount", value)}
                />
                <div className="text-right text-sm font-medium text-primary mt-2">
                  ${formData.requestedLoanAmount.toLocaleString()}
                </div>
              </div>
            </div>
          )}

          {/* Pages 5-9: Placeholder Pages */}
          {page > 4 && page < 10 && (
            <div className="space-y-6 text-center py-12">
              <h2 className="text-xl font-semibold">Assessment Question {page}</h2>
              <p className="text-muted-foreground">Additional assessment questions will appear here</p>
              <p className="text-sm text-muted-foreground">This is a placeholder for the remaining assessment pages</p>
            </div>
          )}

          {/* Page 10: Final */}
          {page === 10 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
                    ✓
                  </span>
                  Ready to Submit
                </h2>
              </div>

              <div className="bg-secondary/50 border border-border rounded-lg p-6">
                <p className="text-sm text-foreground mb-4">
                  You've completed all required questions. By submitting this assessment, you agree to our terms and
                  consent to being contacted about your bank readiness results.
                </p>
                <CheckboxField
                  label="I agree to Lyyvora's lending terms & conditions"
                  checked={formData.acceptTerms}
                  onChange={(checked) => handleInputChange("acceptTerms", checked)}
                />
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8 pt-8 border-t border-border">
            <Button variant="outline" onClick={handleBack} disabled={page === 1}>
              Back
            </Button>
            {page < 10 ? (
              <Button onClick={handleNext}>Next</Button>
            ) : (
              <Button onClick={handleSubmit} disabled={!formData.acceptTerms}>
                Submit Assessment
              </Button>
            )}
          </div>
        </Card>

        {/* Save Progress Link */}
        <div className="text-center mt-6">
          <Link href="/save" className="text-sm text-primary hover:underline">
            Save & Resume Later
          </Link>
        </div>
      </div>
    </div>
  )
}
