import { NextResponse } from "next/server"
import React from "react"
import { renderToBuffer } from "@react-pdf/renderer"
import { BankReadinessPdf } from "./BankReadinessPdf"

//export const runtime = "nodejs"

export async function POST(req: Request) {
  try {
    const scoreResult = await req.json()

    const pdfBuffer = await renderToBuffer(
      React.createElement(BankReadinessPdf, { scoreResult })
    )

    return new NextResponse(new Uint8Array(pdfBuffer), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition":
          'attachment; filename="Bank-Readiness-Brief.pdf"',
      },
    })
  } catch (error) {
    console.error("PDF ERROR:", error)
    return NextResponse.json(
      { error: "Failed to generate PDF" },
      { status: 500 }
    )
  }
}
