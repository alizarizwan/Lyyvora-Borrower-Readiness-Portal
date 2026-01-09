"use client"

import { signIn, signOut, useSession } from "next-auth/react"

export function AuthButton() {
  const { data: session } = useSession()

  if (session) {
    return (
      <button
        onClick={() => signOut()}
        className="text-sm text-gray-600"
      >
        Sign out
      </button>
    )
  }

  return (
    <button
      onClick={() => signIn("email")}
      className="text-sm text-gray-600"
    >
      Sign in
    </button>
  )
}
