"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { signIn, signOut, useSession } from "next-auth/react"

interface User {
  id: string
  name: string
  email: string
  image?: string
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  updateUser: (data: Partial<User>) => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession()
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    if (session?.user) {
      setUser({
        id: (session.user as any).id || session.user.email || "",
        name: session.user.name || "",
        email: session.user.email || "",
        image: session.user.image,
      })
    } else {
      setUser(null)
    }
  }, [session])

  const login = async (email: string, password: string): Promise<boolean> => {
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    })
    return result?.ok || false
  }

  const logout = async () => {
    await signOut({ redirect: true, callbackUrl: "/login" })
  }

  const updateUser = (data: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...data })
    }
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, updateUser, isLoading: status === "loading" }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider")
  }
  return context
}
