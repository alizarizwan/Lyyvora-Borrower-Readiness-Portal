type AssessmentData = {
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

type FailureReason = {
  code: string
  message: string
  actionItem: string
}

type ScoringResult = {
  totalScore: number
  category: "Bank-Ready" | "Almost Ready" | "Not Ready"
  failureReasons: FailureReason[]
  breakdown: {
    timeInBusiness: number
    revenue: number
    consistency: number
    profitability: number
    debtBurden: number
    creditScore: number
    cashBuffer: number
    compliance: number
    documentation: number
  }
}

export function calculateScore(data: AssessmentData): ScoringResult {
  const failureReasons: FailureReason[] = []
  const breakdown = {
    timeInBusiness: 0,
    revenue: 0,
    consistency: 0,
    profitability: 0,
    debtBurden: 0,
    creditScore: 0,
    cashBuffer: 0,
    compliance: 0,
    documentation: 0,
  }

  // Q1: Time in Business (max 15 points)
  switch (data.timeInBusiness) {
    case "0-5":
      breakdown.timeInBusiness = 0
      failureReasons.push({
        code: "TIME_IN_BIZ_LOW",
        message: "Less than 6 months in business",
        actionItem: "Build 6+ months of operating history before reapplying",
      })
      break
    case "6-11":
      breakdown.timeInBusiness = 8
      break
    case "12-23":
      breakdown.timeInBusiness = 12
      break
    case "24+":
      breakdown.timeInBusiness = 15
      break
  }

  // Q2: Average Monthly Revenue (max 15 points)
  const revenue = Number.parseFloat(data.monthlyRevenue) || 0
  if (revenue < 10000) {
    breakdown.revenue = 0
    failureReasons.push({
      code: "REVENUE_LOW",
      message: "Monthly revenue below $10k minimum",
      actionItem: "Increase revenue to at least $10k/month or wait until revenue grows",
    })
  } else if (revenue < 25000) {
    breakdown.revenue = 8
  } else if (revenue < 50000) {
    breakdown.revenue = 12
  } else {
    breakdown.revenue = 15
  }

  // Q3: Revenue Peak Consistency (max 10 points)
  switch (data.monthsReachedPeak) {
    case "1":
      breakdown.consistency = 3
      failureReasons.push({
        code: "REVENUE_INCONSISTENT",
        message: "Revenue peak reached only once (one-off spike)",
        actionItem: "Demonstrate repeatable revenue performance over multiple months",
      })
      break
    case "2-3":
      breakdown.consistency = 6
      break
    case "4-5":
      breakdown.consistency = 9
      break
    case "6":
      breakdown.consistency = 10
      break
  }

  // Q4: Average Profit Margin (max 15 points)
  switch (data.profitMargin) {
    case "losing":
      breakdown.profitability = 0
      failureReasons.push({
        code: "MARGIN_LOW_OR_UNKNOWN",
        message: "Business is currently losing money",
        actionItem: "Achieve positive profit margins before applying for financing",
      })
      break
    case "0-5":
      breakdown.profitability = 5
      break
    case "6-10":
      breakdown.profitability = 10
      break
    case "11-20":
      breakdown.profitability = 13
      break
    case "20+":
      breakdown.profitability = 15
      break
    case "not-sure":
      breakdown.profitability = 3
      failureReasons.push({
        code: "MARGIN_LOW_OR_UNKNOWN",
        message: "Profit margin unknown",
        actionItem: "Prepare your financial numbers and calculate your profit margin",
      })
      break
  }

  // Q5: Debt Burden (max 10 points) - Calculate DSCR proxy
  const debtPayments = Number.parseFloat(data.debtPayments) || 0
  const estimatedMonthlyIncome = revenue * 0.15 // Rough estimate using margin
  const dscr = debtPayments > 0 ? estimatedMonthlyIncome / debtPayments : 10

  if (dscr < 1.0) {
    breakdown.debtBurden = 0
    failureReasons.push({
      code: "DEBT_BURDEN_HIGH",
      message: "Debt payments too high relative to income",
      actionItem: "Reduce existing debt or increase profitability before applying",
    })
  } else if (dscr < 1.25) {
    breakdown.debtBurden = 5
  } else if (dscr < 1.5) {
    breakdown.debtBurden = 8
  } else {
    breakdown.debtBurden = 10
  }

  // Q6: Credit Score (max 15 points)
  switch (data.creditScore) {
    case "<600":
      breakdown.creditScore = 0
      failureReasons.push({
        code: "CREDIT_LOW_OR_UNKNOWN",
        message: "Credit score below 600",
        actionItem: "Work on improving credit score or explore alternative lenders",
      })
      break
    case "600-649":
      breakdown.creditScore = 7
      break
    case "650-699":
      breakdown.creditScore = 11
      break
    case "700+":
      breakdown.creditScore = 15
      break
    case "prefer-not":
      breakdown.creditScore = 5
      failureReasons.push({
        code: "CREDIT_LOW_OR_UNKNOWN",
        message: "Credit score not disclosed",
        actionItem: "Check your credit score to understand your lending options",
      })
      break
  }

  // Q7: Cash Buffer (max 10 points)
  switch (data.cashOnHand) {
    case "<1":
      breakdown.cashBuffer = 2
      failureReasons.push({
        code: "CASH_BUFFER_LOW",
        message: "Less than 1 month of cash reserves",
        actionItem: "Build cash reserves to at least 1-2 months of operating expenses",
      })
      break
    case "1-2":
      breakdown.cashBuffer = 6
      break
    case "3+":
      breakdown.cashBuffer = 10
      break
    case "not-sure":
      breakdown.cashBuffer = 3
      failureReasons.push({
        code: "CASH_BUFFER_LOW",
        message: "Cash buffer unknown",
        actionItem: "Calculate your cash on hand and track it regularly",
      })
      break
  }

  // Q8: Compliance (max 5 points)
  const complianceCount = data.compliance.length
  if (complianceCount < 2) {
    breakdown.compliance = 0
    failureReasons.push({
      code: "COMPLIANCE_GAPS",
      message: "Missing key business compliance requirements",
      actionItem: "Ensure business is legally registered with active licenses and bank account",
    })
  } else if (complianceCount === 2) {
    breakdown.compliance = 2
  } else if (complianceCount === 3) {
    breakdown.compliance = 4
  } else {
    breakdown.compliance = 5
  }

  // Q9: Documentation (max 5 points)
  const docsCount = data.documents.length
  if (docsCount === 0) {
    breakdown.documentation = 0
    failureReasons.push({
      code: "DOCS_MISSING",
      message: "No financial documents ready",
      actionItem: "Prepare bank statements, P&L, and other required documents",
    })
  } else if (docsCount === 1) {
    breakdown.documentation = 2
  } else if (docsCount === 2) {
    breakdown.documentation = 3
  } else if (docsCount === 3) {
    breakdown.documentation = 4
  } else {
    breakdown.documentation = 5
  }

  // Calculate total score
  const totalScore = Object.values(breakdown).reduce((sum, val) => sum + val, 0)

  // Determine category
  let category: "Bank-Ready" | "Almost Ready" | "Not Ready"
  if (totalScore >= 80) {
    category = "Bank-Ready"
  } else if (totalScore >= 55) {
    category = "Almost Ready"
  } else {
    category = "Not Ready"
  }

  return {
    totalScore,
    category,
    failureReasons,
    breakdown,
  }
}

export function getAssessmentDetails(data: AssessmentData, result: ScoringResult) {
  const details = []

  // Time in Business
  const timeLabel = data.timeInBusiness === "24+" ? "24+ months" : `${data.timeInBusiness} months`
  details.push({
    label: `Time in business: ${timeLabel}`,
    description: result.breakdown.timeInBusiness >= 12 ? "Strong operating history" : "Building operating history",
    score: result.breakdown.timeInBusiness,
    max: 15,
  })

  // Revenue
  const revenue = Number.parseFloat(data.monthlyRevenue) || 0
  details.push({
    label: `Monthly revenue: $${revenue.toLocaleString()}`,
    description:
      revenue >= 25000 ? "Strong monthly revenue" : revenue >= 10000 ? "Meets minimum revenue" : "Below minimum",
    score: result.breakdown.revenue,
    max: 15,
  })

  // Consistency
  details.push({
    label: `Revenue consistency: ${data.monthsReachedPeak === "1" ? "1 time" : data.monthsReachedPeak + " times"}`,
    description: result.breakdown.consistency >= 9 ? "Highly repeatable performance" : "Building revenue consistency",
    score: result.breakdown.consistency,
    max: 10,
  })

  // Profitability
  const marginLabel =
    data.profitMargin === "not-sure"
      ? "Unknown"
      : data.profitMargin === "losing"
        ? "Negative"
        : data.profitMargin === "20+"
          ? "20%+"
          : data.profitMargin + "%"
  details.push({
    label: `Profit margin: ${marginLabel}`,
    description: result.breakdown.profitability >= 13 ? "Excellent profitability" : "Working on profitability",
    score: result.breakdown.profitability,
    max: 15,
  })

  // Debt Burden
  const debtPayments = Number.parseFloat(data.debtPayments) || 0
  details.push({
    label: `Monthly debt: $${debtPayments.toLocaleString()}`,
    description: result.breakdown.debtBurden >= 8 ? "Manageable debt load" : "High debt burden",
    score: result.breakdown.debtBurden,
    max: 10,
  })

  // Credit Score
  details.push({
    label: `Credit score: ${data.creditScore === "prefer-not" ? "Not disclosed" : data.creditScore}`,
    description: result.breakdown.creditScore >= 11 ? "Strong credit profile" : "Credit improvement needed",
    score: result.breakdown.creditScore,
    max: 15,
  })

  // Cash Buffer
  details.push({
    label: `Cash reserves: ${data.cashOnHand === "not-sure" ? "Unknown" : data.cashOnHand + " months"}`,
    description: result.breakdown.cashBuffer >= 10 ? "Excellent cash buffer" : "Building cash reserves",
    score: result.breakdown.cashBuffer,
    max: 10,
  })

  // Compliance
  details.push({
    label: `Business compliance: ${data.compliance.length}/4 items`,
    description: data.compliance.length >= 3 ? "Compliant business" : "Compliance gaps exist",
    score: result.breakdown.compliance,
    max: 5,
  })

  // Documentation
  details.push({
    label: `Documents ready: ${data.documents.length}/5 items`,
    description: data.documents.length >= 3 ? "Well documented" : "Missing key documents",
    score: result.breakdown.documentation,
    max: 5,
  })

  return details
}
