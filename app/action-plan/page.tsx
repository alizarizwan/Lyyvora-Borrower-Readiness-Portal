import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Link from "next/link"

const checklistItems = [
  { id: 1, title: "Upload latest FIL assessment", example: "(Example: 2024 tax return)" },
  { id: 2, title: "Add business tax return copy", example: "(Complete copy available in file)" },
  { id: 3, title: "Correct any return upload", example: "Outlines your income (2024 filing)" },
  { id: 4, title: "Add retirement summary sheet", example: "All current business debt and obligations" },
  { id: 5, title: "Prepare detailed documentation", example: "Equipment owned and company history" },
]

const templates = [
  {
    title: "Pitch Template",
    description: "Complete pitch deck & one-pager for your next bank meeting",
    url: "#",
  },
  {
    title: "Debt Schedule",
    description: "Track all business debt and payment obligations",
    url: "#",
  },
  {
    title: "Business Plan Outline",
    description: "Healthcare practice business plan template",
    url: "#",
  },
  {
    title: "Financial Dashboard",
    description: "Perform actual business KPI tracking for your clinic",
    url: "#",
  },
]

const communications = [
  { title: "Email to Accountant", description: "Request financial statements & tax records" },
  { title: "Email to Lender", description: "Follow up templates for pending decisions" },
]

export default function ActionPlanPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border sticky top-0 bg-background/95 backdrop-blur">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-primary flex items-center justify-center text-primary-foreground font-bold text-xs">
              L
            </div>
            <span className="font-semibold text-sm">Lyyvora</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/save" className="text-xs text-muted-foreground hover:text-foreground">
              Save Progress
            </Link>
            <Button variant="default" size="sm" className="text-xs" asChild>
              <Link href="/assessment">Sign In</Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Breadcrumb */}
      <div className="max-w-6xl mx-auto px-6 py-4 flex gap-2 text-sm text-muted-foreground">
        <Link href="/results" className="hover:text-foreground">
          Home
        </Link>
        <span>/</span>
        <span>Action Plan</span>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold mb-12">Your Action Plan</h1>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Personalized Checklist */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Personalized Checklist</h2>
            <p className="text-sm text-muted-foreground mb-4">3 of 5 example</p>
            <div className="space-y-3">
              {checklistItems.map((item) => (
                <Card key={item.id} className="p-4">
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      className="w-5 h-5 rounded border-border mt-0.5"
                      defaultChecked={item.id <= 2}
                    />
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{item.title}</h4>
                      <p className="text-xs text-muted-foreground mt-0.5">{item.example}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
            <p className="text-sm text-muted-foreground mt-6">Progress: 80% Complete</p>
            <div className="w-full bg-secondary rounded-full h-2 mt-2">
              <div className="bg-primary h-2 rounded-full" style={{ width: "80%" }} />
            </div>
          </div>

          {/* Templates & Tools */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Templates & Tools</h2>
            <div className="space-y-3 mb-6">
              {templates.map((template, idx) => (
                <Card key={idx} className="p-4 hover:bg-secondary/50 transition-colors cursor-pointer">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-medium text-sm">{template.title}</h4>
                      <p className="text-xs text-muted-foreground mt-0.5">{template.description}</p>
                    </div>
                    <Button variant="ghost" size="sm" className="text-primary">
                      Download
                    </Button>
                  </div>
                </Card>
              ))}
            </div>

            <h3 className="font-semibold text-sm mb-3">Communication Templates</h3>
            <div className="space-y-2">
              {communications.map((item, idx) => (
                <Card key={idx} className="p-3 text-sm">
                  <h4 className="font-medium">{item.title}</h4>
                  <p className="text-xs text-muted-foreground mt-0.5">{item.description}</p>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Ready for Bank Meeting */}
        <Card className="p-8 bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
          <h3 className="text-lg font-semibold mb-2 text-center">Ready for Your Bank Meeting?</h3>
          <p className="text-sm text-muted-foreground text-center mb-6">
            Download your comprehensive bank readiness brief — a personalized document that includes your full
            assessment results, key talking points, and everything you need to walk into your meeting prepared.
          </p>
          <div className="flex justify-center">
            <Button className="gap-2">
              <span>📥</span>
              Download Bank Readiness Brief (PDF)
            </Button>
          </div>
          <p className="text-xs text-muted-foreground text-center mt-4">
            Includes: Assessment Summary • Personalized Action Items • Templates & Checklists
          </p>
        </Card>
      </div>

      {/* Footer */}
      <footer className="bg-primary text-primary-foreground mt-20">
        <div className="max-w-6xl mx-auto px-6 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-6 h-6 rounded bg-primary-foreground/20 flex items-center justify-center font-bold text-xs">
                  L
                </div>
                <span className="font-semibold">Lyyvora</span>
              </div>
              <p className="text-sm text-primary-foreground/70">Healthcare Finance Solutions for Modern Clinics</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-sm">Product</h4>
              <ul className="space-y-2 text-sm text-primary-foreground/70">
                <li>
                  <a href="#" className="hover:text-primary-foreground">
                    Loan Assessment
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary-foreground">
                    Financial Tools
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-sm">Support</h4>
              <ul className="space-y-2 text-sm text-primary-foreground/70">
                <li>
                  <a href="#" className="hover:text-primary-foreground">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary-foreground">
                    Contact Us
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-sm">Company</h4>
              <ul className="space-y-2 text-sm text-primary-foreground/70">
                <li>
                  <a href="#" className="hover:text-primary-foreground">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary-foreground">
                    Privacy
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-primary-foreground/10 mt-8 pt-8 text-center text-sm text-primary-foreground/60">
            © 2025 Lyyvora. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}
