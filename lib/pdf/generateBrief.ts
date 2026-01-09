import PDFDocument from "pdfkit"

type ScoreResult = {
  score: number
  category: string
  failures: string[]
  checklist: string[]
  sections?: SectionScore[]
  whatIf?: string[]
}

type SectionScore = {
  label: string
  score: number
  max: number
  status: "good" | "warning" | "bad"
  reason?: string
}

export function generateBrief(scoreResult: ScoreResult): Promise<Buffer> {
  return new Promise((resolve) => {
    const doc = new PDFDocument({ margin: 50 })
    const buffers: Buffer[] = []

    doc.on("data", buffers.push.bind(buffers))
    doc.on("end", () => {
      resolve(Buffer.concat(buffers))
    })

    // Title
    doc.fontSize(20).text("Bank Readiness Brief", { align: "center" })
    doc.moveDown()

    // Summary
    doc.fontSize(12)
    doc.text(`Score: ${scoreResult.score}`)
    doc.text(`Category: ${scoreResult.category}`)
    doc.moveDown()

    // Failures
    doc.fontSize(14).text("Key Issues")
    doc.fontSize(11)
    if (scoreResult.failures.length === 0) {
      doc.text("No major issues identified.")
    } else {
      scoreResult.failures.forEach(f => doc.text(`• ${f}`))
    }
    doc.moveDown()

    // Checklist
    doc.fontSize(14).text("Action Checklist")
    doc.fontSize(11)
    scoreResult.checklist.forEach(item => doc.text(`• ${item}`))
    doc.moveDown()

    // What-if suggestions (optional)
    if (scoreResult.whatIf?.length) {
      doc.fontSize(14).text("What-If Improvements")
      doc.fontSize(11)
      scoreResult.whatIf.forEach(w => doc.text(`• ${w}`))
      doc.moveDown()
    }

    doc.end()
  })
}
