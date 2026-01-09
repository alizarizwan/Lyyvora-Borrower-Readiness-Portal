import { QUESTIONS } from "./questions"

export function validateAnswer(code: string, value: any): boolean {
  const q = QUESTIONS.find((q) => q.code === code)
  if (!q) return false

  // ---------- Required check (strict) ----------
  if (q.required) {
    if (value === null || value === undefined) return false
    if (typeof value === "string" && value.trim() === "") return false
    if (Array.isArray(value) && value.length === 0) return false
    if (q.type === "composite" && typeof value !== "object") return false
  }

  // ---------- Currency / number ----------
  if (q.type === "currency_number") {
    if (typeof value !== "number" || !Number.isFinite(value)) return false
    if (q.min !== undefined && value < q.min) return false
    if (q.max !== undefined && value > q.max) return false
  }

  // ---------- Dropdown ----------
  if (q.type === "dropdown") {
    if (!q.options || !q.options.includes(value)) return false
  }

  // ---------- Multi-select ----------
  if (q.type === "multi_select") {
    if (!Array.isArray(value)) return false
    if (q.minSelected !== undefined && value.length < q.minSelected) return false
    if (!value.every((v) => q.options.includes(v))) return false
  }

  // ---------- Composite ----------
  if (q.type === "composite") {
    if (typeof value !== "object" || value === null) return false

    for (const fieldKey in q.fields) {
      const field = q.fields[fieldKey]
      const fieldValue = value[fieldKey]

      // Required sub-field
      if (field.required && (fieldValue === undefined || fieldValue === null)) {
        return false
      }

      // Sub-field: currency / number
      if (field.type === "currency_number") {
        if (typeof fieldValue !== "number" || !Number.isFinite(fieldValue)) return false
        if (field.min !== undefined && fieldValue < field.min) return false
      }

      // Sub-field: dropdown
      if (field.type === "dropdown") {
        if (!field.options || !field.options.includes(fieldValue)) return false
      }
    }
  }

  return true
}
