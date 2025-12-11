import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Link from "next/link"
import { Check, CheckCircle2, Circle } from "lucide-react"

const statusItems = [
  { title: "Initial Assessment", status: "Completed" },
  { title: "Financial Information", status: "Completed" },
  { title: "Results Review", status: "Completed" },
  { title: "Action Items Checklist", status: "In Progress" },
  { title: "Document Templates", status: "Pending" },
]

export default function SavePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200 sticky top-0 bg-white/95 backdrop-blur">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-slate-900 flex items-center justify-center text-white font-bold text-sm">
              L
            </div>
            <div className="flex flex-col">
              <span className="font-semibold text-sm">Lyyvora</span>
              <span className="text-xs text-gray-600">Healthcare Finance Solutions</span>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <Button className="bg-slate-900 hover:bg-slate-800 text-white text-sm" size="sm" asChild>
              <Link href="/assessment">Sign In</Link>
            </Button>
          </div>
        </div>
        <div className="max-w-6xl mx-auto px-6 py-3 flex items-center gap-4 text-xs text-gray-600 border-t border-gray-100">
          <Link href="/" className="hover:text-gray-900">
            Start
          </Link>
          <span className="text-gray-400">•</span>
          <Link href="/assessment" className="hover:text-gray-900">
            Intake Form
          </Link>
          <span className="text-gray-400">•</span>
          <Link href="/results" className="hover:text-gray-900">
            Results
          </Link>
          <span className="text-gray-400">•</span>
          <Link href="/action-plan" className="hover:text-gray-900">
            Checklist
          </Link>
          <span className="text-gray-400">•</span>
          <span className="text-gray-900 font-medium">Save & Resume</span>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-6 py-12">
        {/* Success Card */}
        <Card className="bg-white border border-gray-200 rounded-xl p-12 mb-12 text-center">
          <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-6">
            <Check className="w-6 h-6 text-gray-700" strokeWidth={3} />
          </div>
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">Your Progress is Saved</h1>
          <p className="text-sm text-gray-600 mb-8">
            You can continue where you left off at any time using your magic link below.
          </p>

          {/* Magic Link Section */}
          <div className="bg-gray-50 rounded-lg p-6 mb-6 text-left">
            <p className="text-sm font-medium text-gray-900 mb-3">Your Magic Link</p>
            <div className="flex items-center gap-2 bg-white border border-gray-200 rounded p-3">
              <span className="flex-1 text-sm text-gray-600 font-mono truncate">
                https://lyyvora.com/resume/abc123def456
              </span>
              <Button
                variant="default"
                size="sm"
                className="bg-slate-900 hover:bg-slate-800 text-white whitespace-nowrap"
              >
                Copy
              </Button>
            </div>
            <p className="text-xs text-gray-500 mt-3">This link has been sent to your email address</p>
          </div>

          {/* Email Change Section */}
          <div className="border-t border-gray-200 pt-6">
            <p className="text-sm text-gray-600 mb-3">Send to different email?</p>
            <p className="text-xs text-gray-500 mb-3">Don't want your magic link to a new email address</p>
            <Button
              variant="outline"
              className="text-slate-900 border-gray-300 hover:bg-gray-50 bg-transparent"
              size="sm"
            >
              Update Email
            </Button>
          </div>
        </Card>

        {/* Assessment Status */}
        <Card className="bg-white border border-gray-200 rounded-xl p-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-8">Assessment Status</h2>

          {/* Overall Progress */}
          <div className="mb-8">
            <div className="flex justify-between items-baseline mb-2">
              <span className="text-sm font-medium text-gray-900">Overall Progress</span>
              <span className="text-sm font-medium text-gray-900">75% Complete</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
              <div className="bg-slate-900 h-2.5 rounded-full" style={{ width: "75%" }} />
            </div>
            <p className="text-xs text-gray-500 mt-2">Last updated January 15, 2025 at 2:30 PM</p>
          </div>

          {/* Status Items */}
          <div className="space-y-3 mb-8">
            {statusItems.map((item, idx) => {
              const isCompleted = item.status === "Completed"
              const isInProgress = item.status === "In Progress"

              return (
                <div
                  key={idx}
                  className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0"
                >
                  <div className="flex items-center gap-3">
                    {isCompleted && <CheckCircle2 className="w-5 h-5 text-slate-900 flex-shrink-0" />}
                    {isInProgress && <Circle className="w-5 h-5 text-slate-900 flex-shrink-0" />}
                    {!isCompleted && !isInProgress && <Circle className="w-5 h-5 text-gray-300 flex-shrink-0" />}
                    <span className="text-sm font-medium text-gray-900">{item.title}</span>
                  </div>
                  <span className={`text-sm font-medium ${isCompleted ? "text-slate-900" : "text-gray-500"}`}>
                    {item.status}
                  </span>
                </div>
              )
            })}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-6 border-t border-gray-200">
            <Link href="/assessment" className="flex-1">
              <Button className="w-full bg-slate-900 hover:bg-slate-800 text-white">Resume Editing</Button>
            </Link>
            <Button variant="outline" className="flex-1 text-gray-900 border-gray-300 hover:bg-gray-50 bg-transparent">
              Download Report
            </Button>
          </div>

          {/* Footer Link */}
          <div className="text-center pt-4">
            <Link href="/" className="text-xs text-gray-600 hover:text-gray-900">
              Start a new assessment
            </Link>
          </div>
        </Card>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-slate-900 text-white mt-16">
        <div className="max-w-6xl mx-auto px-6 py-12 grid grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded bg-white flex items-center justify-center text-slate-900 font-bold">
                L
              </div>
              <span className="font-semibold">Lyyvora</span>
            </div>
            <p className="text-sm text-gray-400">Healthcare Finance Solutions for Modern Clinics</p>
          </div>
          <div>
            <h3 className="text-sm font-semibold mb-4">Product</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <a href="#" className="hover:text-white">
                  Loan Assessment
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Financial Tools
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Resources
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold mb-4">Support</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <a href="#" className="hover:text-white">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  FAQ
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold mb-4">Company</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <a href="#" className="hover:text-white">
                  About
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Privacy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Terms
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 px-6 py-6 text-center text-sm text-gray-400">
          © 2025 Lyyvora. All rights reserved.
        </div>
      </footer>
    </div>
  )
}
