import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Link from "next/link"

const assessmentMetrics = [
  { icon: "📋", label: "Low-flow list", description: "Below 2x/3x monthly & at least 12 months of operating history" },
  {
    icon: "📊",
    label: "Debt-to-revenue ratio",
    description: "Consumer debts under ratio at 50%; typically debt (includes in debt history)",
  },
  {
    icon: "💰",
    label: "Consistent monthly revenue",
    description: "Strong revenue performance based on 12-month average trend",
  },
  {
    icon: "💳",
    label: "Strong credit score",
    description: "Established credit score based on credit inquiry requirements",
  },
  { icon: "📑", label: "Proper business documentation", description: "All required licenses and permits are in order" },
]

const whatIfScenarios = [
  { title: "Monthly Revenue", change: "If monthly income is $50k + then close to $", value: "$5,000" },
  { title: "Debt Pay-down", change: "If reduced by $5k + then close to $", value: "$5,000" },
  { title: "Time in Business", change: "If increasing by 6-12 months + then close to $", value: "18 months" },
]

export default function ResultsPage() {
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
            <a href="#" className="text-xs text-muted-foreground hover:text-foreground">
              About
            </a>
            <a href="#" className="text-xs text-muted-foreground hover:text-foreground">
              Contact
            </a>
            <Button variant="default" size="sm" className="text-xs" asChild>
              <Link href="/assessment">Sign In</Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-secondary rounded-full mb-4">
            <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs">
              ✓
            </div>
            <span className="text-sm font-medium">Bank-Ready</span>
          </div>
          <p className="text-muted-foreground">Based on your inputs, here's how banks see your clinic:</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {/* Score Card */}
          <div className="md:col-span-1">
            <Card className="p-8 text-center">
              <div className="w-32 h-32 rounded-full bg-gradient-to-b from-primary/20 to-primary/10 mx-auto flex items-center justify-center mb-4">
                <div className="text-center">
                  <div className="text-4xl font-bold text-primary">78</div>
                  <div className="text-xs text-muted-foreground">out of 100</div>
                </div>
              </div>
              <h3 className="font-semibold">Your Score</h3>
              <p className="text-xs text-muted-foreground mt-1 mb-4">Your Test</p>
              <div className="bg-secondary rounded px-3 py-2 text-sm font-medium">Verified</div>
            </Card>
          </div>

          {/* Assessment Details */}
          <div className="md:col-span-2">
            <Card className="p-8">
              <h3 className="font-semibold mb-6">Assessment Details</h3>
              <div className="space-y-4">
                {assessmentMetrics.map((metric, idx) => (
                  <div key={idx} className="flex gap-4">
                    <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="w-2 h-2 bg-primary-foreground rounded-full" />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium">{metric.label}</h4>
                      <p className="text-xs text-muted-foreground mt-0.5">{metric.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>

        {/* What-If Scenarios */}
        <Card className="p-8 mb-12">
          <h3 className="font-semibold mb-6">What-if Scenarios</h3>
          <div className="space-y-6">
            {whatIfScenarios.map((scenario, idx) => (
              <div key={idx}>
                <h4 className="text-sm font-medium mb-2">{scenario.title}</h4>
                <div className="flex items-center gap-4">
                  <div className="flex-1 bg-secondary rounded-full h-2">
                    <div className="bg-primary h-2 rounded-full" style={{ width: `${65 + idx * 10}%` }} />
                  </div>
                  <div className="text-sm font-medium text-primary">{scenario.value}</div>
                </div>
                <p className="text-xs text-muted-foreground mt-1">{scenario.change}</p>
              </div>
            ))}
          </div>
        </Card>

        {/* CTA Section */}
        <Card className="p-8 bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
          <h3 className="font-semibold mb-2 text-center">Ready to Take the Next Step?</h3>
          <p className="text-sm text-muted-foreground text-center mb-6">
            Get your personalized action plan and explore financing options tailored to your clinic.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/action-plan">
              <Button className="w-full">Get Bank-Ready Checklist</Button>
            </Link>
            <Button variant="outline" className="w-full bg-transparent">
              See Faster Funding Options
            </Button>
          </div>
        </Card>
      </div>
    </div>
  )
}
