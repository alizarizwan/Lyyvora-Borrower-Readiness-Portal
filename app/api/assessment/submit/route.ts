import { NextResponse } from "next/server";
import { QUESTIONS } from "@/lib/assessment/questions";
import { validateAnswer } from "@/lib/assessment/validateAnswer";
import { scoreAssessment } from "@/lib/scoring/scoreAssessment";

export async function POST(req: Request) {
  const { answers } = await req.json();

  for (const q of QUESTIONS) {
    if (!validateAnswer(q.code, answers[q.code])) {
      return NextResponse.json({ error: q.code }, { status: 400 });
    }
  }

  return NextResponse.json(scoreAssessment(answers));
}
