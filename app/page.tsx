import { Button } from "@/components/ui/button"
import { UserMenu } from "@/components/user-menu"
import Link from "next/link"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

export default async function LandingPage() {
  const session = await getServerSession(authOptions)

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <nav className="border-b border-border">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-primary flex items-center justify-center text-primary-foreground font-bold text-sm">
              L
            </div>
            <div>
              <div className="font-semibold text-sm">Lyyvora</div>
              <div className="text-xs text-muted-foreground">Healthcare Finance Solutions</div>
            </div>
          </div>
          <UserMenu />
        </div>
      </nav>

      {/* Hero Section */}
      <section className="flex-1 bg-secondary">
        <div className="max-w-6xl mx-auto px-6 py-20 text-center">
          <h1 className="text-5xl font-bold mb-6 text-balance">Find out if your clinic is Bank-Ready in 2 minutes</h1>
          <p className="text-xl text-muted-foreground mb-12 text-balance">
            Answer 10 quick questions to see how banks view your business and what to fix if you're not ready
          </p>
          <Link href="/assessment">
            <Button size="lg" className="px-8 py-6 text-lg mb-12">
              Start Pre-Clinic Check
            </Button>
          </Link>
          <div className="text-sm text-muted-foreground mb-4">
            Already started?{" "}
            <Link href={session ? "/dashboard" : "/save"} className="text-primary hover:underline">
              {session ? "View my assessments" : "Resume where you left off"}
            </Link>
          </div>

          {/* Key Benefits Icons */}
          <div className="flex justify-center gap-12 mt-16">
            <div className="flex flex-col items-center gap-2">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-2xl">⏱️</div>
              <div className="text-sm font-medium">2 Minutes</div>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-2xl">❓</div>
              <div className="text-sm font-medium">10 Questions</div>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-2xl">⚡</div>
              <div className="text-sm font-medium">Instant Results</div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Check Bank Readiness */}
      <section className="py-20 bg-background">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">Why Check Your Bank Readiness?</h2>
          <p className="text-center text-muted-foreground mb-12 text-balance">
            Understanding your loan readiness helps you prepare better and increases your chances of approval
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-card border border-border rounded-lg p-8 text-center">
              <div className="text-3xl mb-4">📊</div>
              <h3 className="font-semibold text-lg mb-2">Know Your Standing</h3>
              <p className="text-sm text-muted-foreground">
                Get a clear picture of how banks evaluate your clinic's financial health and strengths
              </p>
            </div>
            <div className="bg-card border border-border rounded-lg p-8 text-center">
              <div className="text-3xl mb-4">🔧</div>
              <h3 className="font-semibold text-lg mb-2">Fix Issues Early</h3>
              <p className="text-sm text-muted-foreground">
                Identify and address potential red flags before they impact your loan application
              </p>
            </div>
            <div className="bg-card border border-border rounded-lg p-8 text-center">
              <div className="text-3xl mb-4">✅</div>
              <h3 className="font-semibold text-lg mb-2">Speed Up Approval</h3>
              <p className="text-sm text-muted-foreground">
                Being prepared means faster processing times and better terms when you do apply
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Check Your Clinic's Bank Readiness?</h2>
          <p className="text-lg mb-8 text-primary-foreground/90 text-balance">
            Download our comprehensive bank readiness brief — a personalized roadmap that includes your assessment
            results, actionable recommendations for your clinic's progress.
          </p>
          <Link href="/assessment">
            <Button variant="secondary" size="lg" className="px-8 py-6 text-lg">
              Start Pre-Clinic Check
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary text-primary-foreground border-t border-primary-foreground/10">
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
                <li>
                  <a href="#" className="hover:text-primary-foreground">
                    Resources
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
                <li>
                  <a href="#" className="hover:text-primary-foreground">
                    FAQ
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-sm">Company</h4>
              <ul className="space-y-2 text-sm text-primary-foreground/70">
                <li>
                  <a href="#" className="hover:text-primary-foreground">
                    Privacy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary-foreground">
                    Terms
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
