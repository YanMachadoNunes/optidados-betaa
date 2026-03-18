"use client"

import { ThemeProvider } from "./context/ThemeContext"
import { SessionProvider, useSession } from "next-auth/react"
import { AuthProvider } from "./context/AuthContext"
import { ReactNode, useEffect } from "react"
import { useRouter } from "next/navigation"

function AuthHandler({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (session?.user) {
      const user = {
        id: (session.user as any).id || session.user.email || "google",
        name: session.user.name,
        email: session.user.email,
        role: "user",
        image: session.user.image,
      }
      localStorage.setItem("optigestao_user", JSON.stringify(user))
    }
  }, [session])

  return <>{children}</>
}

export function Providers({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <ThemeProvider>
        <AuthProvider>
          <AuthHandler>{children}</AuthHandler>
        </AuthProvider>
      </ThemeProvider>
    </SessionProvider>
  )
}
