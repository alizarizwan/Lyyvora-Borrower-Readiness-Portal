import db from "./index"

export function createAssessment(id: string, data: any) {
  db.prepare(`
    INSERT INTO assessments (
      id, answers, currentStep, scoreResult, completedChecklist, createdAt
    ) VALUES (?, ?, ?, ?, ?, ?)
  `).run(
    id,
    JSON.stringify(data.answers),
    data.currentStep,
    JSON.stringify(data.scoreResult),
    JSON.stringify(data.completedChecklist ?? []),
    new Date().toISOString()
  )
}

export function getAssessment(id: string) {
  const row = db
    .prepare(`SELECT * FROM assessments WHERE id = ?`)
    .get(id)

  if (!row) return null

  return {
    answers: JSON.parse(row.answers),
    currentStep: row.currentStep,
    scoreResult: JSON.parse(row.scoreResult),
    completedChecklist: JSON.parse(row.completedChecklist),
  }
}

export function updateChecklist(id: string, checklist: string[]) {
  db.prepare(`
    UPDATE assessments
    SET completedChecklist = ?
    WHERE id = ?
  `).run(JSON.stringify(checklist), id)
}
