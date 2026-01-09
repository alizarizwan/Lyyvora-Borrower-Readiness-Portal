import { QUESTIONS } from "./questions"
//import { ACTION_PLAN_MAP } from "./actionPlanMap"
import { FAILURE_TO_CHECKLIST } from "./failureMap"


export function calculateScore(formData: any) {
  let total = 0
  let max = 100
  const failures: string[] = []
  const sections: any[] = []

  /* ----------------------------------
     1. TIME IN BUSINESS (10)
  ---------------------------------- */
  let timeScore = 0
  if (formData.timeInBusiness === "24+") timeScore = 10
  else if (formData.timeInBusiness === "12-23") timeScore = 7
  else if (formData.timeInBusiness === "6-11") timeScore = 4
  else failures.push("TIME_IN_BIZ_LOW")

  total += timeScore
  sections.push({
    label: "Time in Business",
    score: timeScore,
    max: 10,
    status: timeScore >= 7 ? "good" : timeScore >= 4 ? "warning" : "bad",
    reason:
      timeScore >= 7
        ? "Sufficient operating history"
        : "Limited operating history",
  })

  /* ----------------------------------
     2. MONTHLY REVENUE (20)
  ---------------------------------- */
  const revenue = Number(formData.monthlyRevenue)
  let revenueScore = 0

  if (revenue >= 50000) revenueScore = 20
  else if (revenue >= 25000) revenueScore = 15
  else if (revenue >= 10000) revenueScore = 8
  else failures.push("REVENUE_LOW")

  total += revenueScore
  sections.push({
    label: "Monthly Revenue",
    score: revenueScore,
    max: 20,
    status: revenueScore >= 15 ? "good" : revenueScore >= 8 ? "warning" : "bad",
    reason:
      revenueScore >= 15
        ? "Strong and stable revenue"
        : "Revenue below lender thresholds",
  })

  /* ----------------------------------
     3. REVENUE CONSISTENCY (10)
  ---------------------------------- */
  let consistencyScore = 0
  if (formData.monthsReachedPeak === "6") consistencyScore = 10
  else if (formData.monthsReachedPeak === "4-5") consistencyScore = 7
  else failures.push("REVENUE_INCONSISTENT")

  total += consistencyScore
  sections.push({
    label: "Revenue Consistency",
    score: consistencyScore,
    max: 10,
    status:
      consistencyScore >= 7 ? "good" : consistencyScore >= 4 ? "warning" : "bad",
    reason:
      consistencyScore >= 7
        ? "Consistent monthly performance"
        : "Revenue volatility detected",
  })

  /* ----------------------------------
     4. PROFIT MARGIN (15)
  ---------------------------------- */
  let profitScore = 0
  if (formData.profitMargin === "20+") profitScore = 15
  else if (formData.profitMargin === "11-20") profitScore = 10
  else if (formData.profitMargin === "6-10") profitScore = 5
  else failures.push("MARGIN_LOW_OR_UNKNOWN")

  total += profitScore
  sections.push({
    label: "Profitability",
    score: profitScore,
    max: 15,
    status: profitScore >= 10 ? "good" : profitScore >= 5 ? "warning" : "bad",
    reason:
      profitScore >= 10
        ? "Healthy operating margins"
        : "Profit margins below expectations",
  })

  /* ----------------------------------
     5. DEBT LOAD (10)
  ---------------------------------- */
  let debtScore = 0
  const debt = Number(formData.debtPayments)

  if (debt === 0) debtScore = 10
  else if (revenue > 0 && debt < revenue * 0.2) debtScore = 6
  else failures.push("DEBT_BURDEN_HIGH")

  total += debtScore
  sections.push({
    label: "Debt Load",
    score: debtScore,
    max: 10,
    status: debtScore >= 6 ? "good" : "bad",
    reason:
      debtScore >= 6
        ? "Debt levels within acceptable range"
        : "Debt obligations are high relative to income",
  })

  /* ----------------------------------
     6. CREDIT SCORE (15)
  ---------------------------------- */
  let creditScore = 0
  if (formData.creditScore === "700+") creditScore = 15
  else if (formData.creditScore === "650-699") creditScore = 10
  else if (formData.creditScore === "600-649") creditScore = 5
  else failures.push("CREDIT_LOW_OR_UNKNOWN")

  total += creditScore
  sections.push({
    label: "Owner Credit Score",
    score: creditScore,
    max: 15,
    status: creditScore >= 10 ? "good" : creditScore >= 5 ? "warning" : "bad",
    reason:
      creditScore >= 10
        ? "Strong borrower credit profile"
        : "Credit score may limit options",
  })

  /* ----------------------------------
     7. CASH BUFFER (10)
  ---------------------------------- */
  let cashScore = 0
  if (formData.cashOnHand === "3+") cashScore = 10
  else if (formData.cashOnHand === "1-2") cashScore = 5
  else failures.push("CASH_BUFFER_LOW")

  total += cashScore
  sections.push({
    label: "Cash on Hand",
    score: cashScore,
    max: 10,
    status: cashScore >= 5 ? "good" : "bad",
    reason:
      cashScore >= 5
        ? "Adequate liquidity cushion"
        : "Limited cash reserves",
  })

  /* ----------------------------------
     8. COMPLIANCE (5)
  ---------------------------------- */
  let complianceScore = 0
  if (formData.compliance.length >= 3) complianceScore = 5
  else failures.push("COMPLIANCE_GAPS")

  total += complianceScore
  sections.push({
    label: "Business Compliance",
    score: complianceScore,
    max: 5,
    status: complianceScore === 5 ? "good" : "bad",
    reason:
      complianceScore === 5
        ? "Business setup meets lender requirements"
        : "Compliance gaps identified",
  })

  /* ----------------------------------
     9. DOCUMENTS (5)
  ---------------------------------- */
  let docsScore = 0
  if (formData.documents.length >= 3) docsScore = 5
  else failures.push("DOCS_MISSING")

  total += docsScore
  sections.push({
    label: "Financial Documents",
    score: docsScore,
    max: 5,
    status: docsScore === 5 ? "good" : "bad",
    reason:
      docsScore === 5
        ? "Documentation largely ready"
        : "Missing key financial documents",
  })

  /* ----------------------------------
     FINAL CATEGORY
  ---------------------------------- */

  let category: "Bank-Ready" | "Almost Ready" | "Not Ready"
  if (total >= 80) category = "Bank-Ready"
  else if (total >= 60) category = "Almost Ready"
  else category = "Not Ready"

  const checklist = Array.from(
    new Set(
      failures.flatMap((code) => FAILURE_TO_CHECKLIST[code as keyof typeof FAILURE_TO_CHECKLIST] ?? [])
    )
  )

  return {
    score: total,
    category,
    failures,
    sections,
    checklist,
  }
}
