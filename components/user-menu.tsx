"use client"

import { useSession, signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { LogOut, User, FileText } from "lucide-react"

export function UserMenu() {
  const { data: session, status } = useSession()

  if (status === "loading") {
    return <div className="w-20 h-9 bg-muted rounded animate-pulse" />
  }

  if (!session) {
    return (
      <Button variant="default" size="sm" asChild>
        <Link href="/auth/signin">Sign In</Link>
      </Button>
    )
  }

  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2 text-sm">
        <User className="w-4 h-4" />
        <span className="text-muted-foreground">{session.user?.email}</span>
      </div>
      <Button variant="outline" size="sm" asChild className="flex items-center gap-2">
        <Link href="/dashboard">
          <FileText className="w-4 h-4" />
          My Assessments
        </Link>
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => signOut({ callbackUrl: "/" })}
        className="flex items-center gap-2"
      >
        <LogOut className="w-4 h-4" />
        Sign Out
      </Button>
    </div>
  )
}
