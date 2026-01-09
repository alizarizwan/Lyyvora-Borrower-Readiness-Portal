export const FAILURE_EXPLANATIONS = {
  TIME_IN_BIZ_LOW: "Most lenders require at least 6 months in business.",
  REVENUE_LOW: "Revenue is below $10,000 per month.",
  REVENUE_INCONSISTENT: "Revenue has not been repeatable.",
  MARGIN_LOW_OR_UNKNOWN: "Profit margins are low or unclear.",
  DEBT_BURDEN_HIGH: "Debt obligations may be too high.",
  CREDIT_LOW_OR_UNKNOWN: "Credit score may limit options.",
  CASH_BUFFER_LOW: "Insufficient cash buffer.",
  COMPLIANCE_GAPS: "Compliance items are missing.",
  DOCS_MISSING: "Required documents are missing."
};

export const FAILURE_TO_CHECKLIST = {
  TIME_IN_BIZ_LOW: ["BUILD_HISTORY_6MO"],
  REVENUE_LOW: ["INCREASE_REVENUE"],
  REVENUE_INCONSISTENT: ["STABILIZE_REVENUE"],
  MARGIN_LOW_OR_UNKNOWN: ["PREPARE_FINANCIALS"],
  CREDIT_LOW_OR_UNKNOWN: ["CHECK_CREDIT"],
  CASH_BUFFER_LOW: ["BUILD_CASH_RESERVES"],
  COMPLIANCE_GAPS: ["COMPLETE_COMPLIANCE"],
  DOCS_MISSING: ["PREPARE_DOCUMENTS"]
};

export const CHECKLIST_LABELS = {
  BUILD_HISTORY_6MO: "Operate for at least 6 months",
  INCREASE_REVENUE: "Increase monthly revenue to $10k+",
  STABILIZE_REVENUE: "Improve revenue consistency",
  PREPARE_FINANCIALS: "Prepare accurate financials",
  CHECK_CREDIT: "Check your credit score",
  BUILD_CASH_RESERVES: "Build cash reserves",
  COMPLETE_COMPLIANCE: "Resolve compliance issues",
  PREPARE_DOCUMENTS: "Prepare required documents"
};
