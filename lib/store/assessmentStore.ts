import { create } from "zustand"
import { persist, PersistStorage } from "zustand/middleware"
import { QUESTIONS } from "@/lib/assessment/questions"

type ScoreResult = {
  score: number
  category: "Bank-Ready" | "Almost Ready" | "Not Ready"
  failures: string[]
  checklist: string[]
  sections?: SectionScore[]
}

type SectionScore = {
  label: string
  score: number
  max: number
  status: "good" | "warning" | "bad"
  reason: string
}

type AssessmentState = {
  answers: Record<string, any>
  currentStep: number
  scoreResult: ScoreResult | null
  completedChecklist: string[]

  setAnswer: (code: string, value: any) => void
  nextStep: () => void
  prevStep: () => void
  loadDraft: (data: Partial<AssessmentState>) => void
  setScoreResult: (result: ScoreResult) => void
  toggleChecklistItem: (code: string) => void
  reset: () => void
}

export const useAssessmentStore = create<AssessmentState>()(
  persist(
    (set) => ({
      answers: {},
      currentStep: 1,
      scoreResult: null,
      completedChecklist: [],

      setAnswer: (code: string, value: any) =>
        set((state: AssessmentState) => ({
          answers: { ...state.answers, [code]: value },
        })),

      nextStep: () =>
        set((state: AssessmentState) => ({
          currentStep: Math.min(state.currentStep + 1, QUESTIONS.length),
        })),

      prevStep: () =>
        set((state: AssessmentState) => ({
          currentStep: Math.max(state.currentStep - 1, 1),
        })),

      loadDraft: (data: Partial<AssessmentState>) =>
        set({
          answers: data.answers ?? {},
          currentStep: data.currentStep ?? 1,
          scoreResult: data.scoreResult ?? null,
          completedChecklist: data.completedChecklist ?? [],
        }),

      setScoreResult: (result: ScoreResult) =>
        set({
          scoreResult: result,
          completedChecklist: [],
        }),

      toggleChecklistItem: (code: string) =>
        set((state: AssessmentState) => ({
          completedChecklist: state.completedChecklist.includes(code)
            ? state.completedChecklist.filter((c: string) => c !== code)
            : [...state.completedChecklist, code],
        })),

      reset: () =>
        set({
          answers: {},
          currentStep: 1,
          scoreResult: null,
          completedChecklist: [],
        }),
    } as any),
    { name: "assessment-draft" }
  ) as any
)
