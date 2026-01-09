import { QuestionCode } from "./questions"

/**
 * Scoring Rule Definition
 */
export type ScoringRule = {
  code: QuestionCode
  maxPoints: number
  evaluate: (answer: any, allAnswers: Record<string, any>) => {
    points: number
    failureReasons?: string[]
    checklistItems?: string[]
  }
}

/**
 * Category thresholds
 */
export const SCORE_THRESHOLDS = {
  BANK_READY: 80,
  ALMOST_READY: 55,
}

/**
 * All scoring rules (max total = 100 points)
 */
export const SCORING_RULES: ScoringRule[] = [
  // Q1 — Time in business (15 pts)
  {
    code: "TIME_IN_BIZ",
    maxPoints: 15,
    evaluate(answer) {
      if (answer === "24+") return { points: 15 }
      if (answer === "12-23") return { points: 12 }
      if (answer === "6-11") return { points: 8 }
      return {
        points: 2,
        failureReasons: ["TIME_IN_BIZ_LOW"],
        checklistItems: ["BUILD_HISTORY_6MO"],
      }
    },
  },

  // Q2 — Monthly revenue (15 pts)
  {
    code: "MONTHLY_REVENUE",
    maxPoints: 15,
    evaluate(answer) {
      if (answer >= 50000) return { points: 15 }
      if (answer >= 20000) return { points: 12 }
      if (answer >= 10000) return { points: 8 }
      return {
        points: 2,
        failureReasons: ["REVENUE_LOW"],
        checklistItems: ["INCREASE_REVENUE_OR_WAIT"],
      }
    },
  },

  // Q3 — Revenue consistency (10 pts)
  {
    code: "REVENUE_CONSISTENCY",
    maxPoints: 10,
    evaluate(answer) {
      const months = answer?.monthsReached
      if (months === "6" || months === "4-5") return { points: 10 }
      if (months === "2-3") return { points: 6 }
      return {
        points: 2,
        failureReasons: ["REVENUE_INCONSISTENT"],
        checklistItems: ["STABILIZE_REVENUE"],
      }
    },
  },

  // Q4 — Profit margin (10 pts)
  {
    code: "PROFIT_MARGIN",
    maxPoints: 10,
    evaluate(answer) {
      if (answer === "20+") return { points: 10 }
      if (answer === "11-20") return { points: 8 }
      if (answer === "6-10") return { points: 6 }
      if (answer === "0-5") return { points: 4 }
      return {
        points: 2,
        failureReasons: ["MARGIN_LOW_OR_UNKNOWN"],
        checklistItems: ["IMPROVE_PROFIT_MARGIN", "PREPARE_FINANCIALS"],
      }
    },
  },

  // Q5 — Monthly debt burden (10 pts)
  {
    code: "MONTHLY_DEBT",
    maxPoints: 10,
    evaluate(answer, allAnswers) {
      const revenue = allAnswers.MONTHLY_REVENUE || 0
      if (!revenue) return { points: 0 }

      const ratio = answer / revenue
      if (ratio <= 0.2) return { points: 10 }
      if (ratio <= 0.35) return { points: 6 }

      return {
        points: 2,
        failureReasons: ["DEBT_BURDEN_HIGH"],
        checklistItems: ["REDUCE_DEBT"],
      }
    },
  },

  // Q6 — Credit score (10 pts)
  {
    code: "CREDIT_SCORE",
    maxPoints: 10,
    evaluate(answer) {
      if (answer === "700+") return { points: 10 }
      if (answer === "650-699") return { points: 7 }
      if (answer === "600-649") return { points: 4 }
      return {
        points: 2,
        failureReasons: ["CREDIT_LOW_OR_UNKNOWN"],
        checklistItems: ["CHECK_CREDIT_SCORE"],
      }
    },
  },

  // Q7 — Cash buffer (10 pts)
  {
    code: "CASH_BUFFER",
    maxPoints: 10,
    evaluate(answer) {
      if (answer === "3+") return { points: 10 }
      if (answer === "1-2") return { points: 6 }
      return {
        points: 2,
        failureReasons: ["CASH_BUFFER_LOW"],
        checklistItems: ["BUILD_CASH_RESERVES"],
      }
    },
  },

  // Q8 — Compliance (10 pts)
  {
    code: "COMPLIANCE",
    maxPoints: 10,
    evaluate(answer: string[]) {
      if (answer.length >= 4) return { points: 10 }
      if (answer.length >= 3) return { points: 7 }
      if (answer.length >= 2) return { points: 5 }
      return {
        points: 2,
        failureReasons: ["COMPLIANCE_GAPS"],
        checklistItems: ["FIX_COMPLIANCE_ISSUES"],
      }
    },
  },

  // Q9 — Documents readiness (5 pts)
  {
    code: "DOCUMENTS",
    maxPoints: 5,
    evaluate(answer: string[]) {
      if (answer.length >= 4) return { points: 5 }
      if (answer.length >= 2) return { points: 3 }
      return {
        points: 1,
        failureReasons: ["DOCS_MISSING"],
        checklistItems: ["UPLOAD_BANK_STATEMENTS"],
      }
    },
  },

  // Q10 — Funding need (5 pts)
  {
    code: "FUNDING_NEED",
    maxPoints: 5,
    evaluate() {
      return { points: 5 }
    },
  },
]
