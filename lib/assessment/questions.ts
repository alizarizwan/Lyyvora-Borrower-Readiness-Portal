export type QuestionCode =
  | "TIME_IN_BIZ"
  | "MONTHLY_REVENUE"
  | "REVENUE_CONSISTENCY"
  | "PROFIT_MARGIN"
  | "MONTHLY_DEBT"
  | "CREDIT_SCORE"
  | "CASH_BUFFER"
  | "COMPLIANCE"
  | "DOCUMENTS"
  | "FUNDING_NEED"

export const QUESTIONS = [
  {
    code: "TIME_IN_BIZ",
    label: "Time in business",
    description: "How long has your clinic been operating?",
    type: "dropdown",
    options: ["0-5", "6-11", "12-23", "24+"],
    required: true,
    failureCode: "TIME_IN_BIZ_LOW",
    checklistTrigger: "BUILD_HISTORY_6MO",
  },

  {
    code: "MONTHLY_REVENUE",
    label: "Average monthly revenue (last 6 months)",
    type: "currency_number",
    min: 0,
    max: 5_000_000,
    required: true,
    failureCode: "REVENUE_LOW",
    checklistTrigger: "INCREASE_REVENUE_OR_WAIT",
  },

  {
    code: "REVENUE_CONSISTENCY",
    label: "Revenue consistency",
    description:
      "What was your highest single-month revenue, and how often did you reach it?",
    type: "composite",
    required: true,
    failureCode: "REVENUE_INCONSISTENT",
    fields: {
      peakRevenue: {
        label: "Highest monthly revenue",
        type: "currency_number",
        min: 0,
        required: true,
      },
      monthsReached: {
        label: "Number of months reached",
        type: "dropdown",
        options: ["1", "2-3", "4-5", "6"],
        required: true,
      },
    },
  },

  {
    code: "PROFIT_MARGIN",
    label: "Average profit margin",
    description:
      "Estimated average profitability across the year (not monthly net margin).",
    type: "dropdown",
    options: ["LOSS", "0-5", "6-10", "11-20", "20+", "UNKNOWN"],
    required: true,
    failureCode: "MARGIN_LOW_OR_UNKNOWN",
    checklistTrigger: "PREPARE_FINANCIALS",
  },

  {
    code: "MONTHLY_DEBT",
    label: "Existing monthly debt payments",
    description:
      "Business and personal debt tied to the business.",
    type: "currency_number",
    min: 0,
    required: true,
    failureCode: "DEBT_BURDEN_HIGH",
  },

  {
    code: "CREDIT_SCORE",
    label: "Credit score range (primary owner)",
    type: "dropdown",
    options: ["<600", "600-649", "650-699", "700+", "UNKNOWN"],
    required: true,
    failureCode: "CREDIT_LOW_OR_UNKNOWN",
    checklistTrigger: "CHECK_CREDIT_SCORE",
  },

  {
    code: "CASH_BUFFER",
    label: "Cash on hand",
    description:
      "Cash currently available to cover operating expenses if revenue slows.",
    type: "dropdown",
    options: ["<1", "1-2", "3+", "UNKNOWN"],
    required: true,
    failureCode: "CASH_BUFFER_LOW",
  },

  {
    code: "COMPLIANCE",
    label: "Business setup & compliance",
    type: "multi_select",
    minSelected: 2,
    required: true,
    options: [
      "REGISTERED",
      "BANK_ACCOUNT",
      "LICENSES",
      "NO_LIENS",
    ],
    failureCode: "COMPLIANCE_GAPS",
  },

  {
    code: "DOCUMENTS",
    label: "Documents readiness",
    description: "Select any documents you can currently provide.",
    type: "multi_select",
    minSelected: 1,
    required: true,
    options: [
      "BANK_STATEMENTS",
      "PL",
      "BALANCE_SHEET",
      "TAX_RETURNS",
      "DEBT_SCHEDULE",
    ],
    failureCode: "DOCS_MISSING",
    checklistTrigger: "UPLOAD_MISSING_DOCS",
  },

  {
    code: "FUNDING_NEED",
    label: "Funding need",
    type: "composite",
    required: true,
    fields: {
      purpose: {
        label: "Funding purpose",
        type: "dropdown",
        required: true,
        options: [
          "WORKING_CAPITAL",
          "EQUIPMENT",
          "RENOVATION",
          "NEW_LOCATION",
          "ACQUISITION",
          "REFINANCE",
        ],
      },
      amount: {
        label: "Amount needed",
        type: "currency_number",
        min: 5000,
        required: true,
      },
      timeline: {
        label: "Funding timeline",
        type: "dropdown",
        required: true,
        options: ["ASAP", "1-3", "3-6", "EXPLORING"],
      },
    },
  },
]
