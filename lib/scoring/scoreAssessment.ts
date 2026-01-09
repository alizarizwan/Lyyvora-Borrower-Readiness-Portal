import { SCORING_RULES, SCORE_THRESHOLDS } from "@/lib/scoringRules"

/**
 * Final assessment scoring engine
 */
export function scoreAssessment(answers: Record<string, any>) {
  let totalScore = 0
  const failures = new Set<string>()
  const checklist = new Set<string>()

  for (const rule of SCORING_RULES) {
    const answer = answers[rule.code]

    // Skip unanswered questions safely
    if (answer === undefined || answer === null) continue

    const result = rule.evaluate(answer, answers)

    // Add points (never exceed maxPoints)
    const points = Math.min(result.points ?? 0, rule.maxPoints)
    totalScore += points

    // Collect failure reasons
    result.failureReasons?.forEach((f) => failures.add(f))

    // Collect checklist items
    result.checklistItems?.forEach((c) => checklist.add(c))
  }

  // Cap score at 100
  totalScore = Math.min(totalScore, 100)

  // Determine category
  let category: "Bank-Ready" | "Almost Ready" | "Not Ready" = "Not Ready"

  if (totalScore >= SCORE_THRESHOLDS.BANK_READY) {
    category = "Bank-Ready"
  } else if (totalScore >= SCORE_THRESHOLDS.ALMOST_READY) {
    category = "Almost Ready"
  }

  return {
    score: totalScore,
    category,
    failures: Array.from(failures),
    checklist: Array.from(checklist),
  }
}
