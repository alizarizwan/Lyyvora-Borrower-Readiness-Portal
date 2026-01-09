"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Suspense } from "react"

function AuthErrorContent() {
  const searchParams = useSearchParams()
  const error = searchParams.get("error") || "Unknown error"

  const errorMessages: Record<string, string> = {
    EmailSignInError: "Invalid email or sign-in token has expired. Please try again.",
    Callback: "An error occurred during authentication. Please try again.",
    OAuthSignin: "There was an error signing in with the provider. Please try again.",
    OAuthCallback: "There was an error handling the authentication callback. Please try again.",
    EmailCreateAccount: "Could not create user account. Please try again.",
    SessionCallback: "An error occurred with your session. Please sign in again.",
    CredentialsSignin: "Sign in failed. Check that the details you provided are correct.",
    default: "An authentication error occurred. Please try again.",
  }

  const message = errorMessages[error] || errorMessages.default

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <nav className="border-b border-border">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-primary flex items-center justify-center text-primary-foreground font-bold text-sm">
              L
            </div>
            <span className="font-semibold text-sm">Lyyvora</span>
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex items-center justify-center py-12 px-4">
        <Card className="w-full max-w-md p-8">
          <div className="text-center">
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold mb-2">Authentication Error</h1>
            <p className="text-sm text-muted-foreground mb-8">{message}</p>
            <div className="flex flex-col gap-3">
              <Button asChild>
                <Link href="/auth/signin">Try Again</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/">Back to Home</Link>
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default function AuthErrorPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <AuthErrorContent />
    </Suspense>
  )
}
