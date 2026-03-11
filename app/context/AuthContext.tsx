"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { useRouter, usePathname } from "next/navigation"

interface User {
  id: string
  name: string
  email: string
  role: string
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  updateUser: (data: Partial<User>) => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Usuário padrão para demonstração
const DEFAULT_USER = {
  id: "1",
  name: "Administrador",
  email: "admin@optigestao.com",
  password: "admin123",
  role: "admin"
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // Verificar se usuário está logado no localStorage
    const storedUser = localStorage.getItem("optigestao_user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setIsLoading(false)
  }, [])

  useEffect(() => {
    if (isLoading) return
    
    if (!user && pathname !== "/login") {
      router.push("/login")
    } else if (user && pathname === "/login") {
      router.push("/")
    }
  }, [user, isLoading, pathname, router])

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simulação de autenticação
    if (email === DEFAULT_USER.email && password === DEFAULT_USER.password) {
      const { password: _, ...userWithoutPassword } = DEFAULT_USER
      setUser(userWithoutPassword)
      localStorage.setItem("optigestao_user", JSON.stringify(userWithoutPassword))
      return true
    }
    return false
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("optigestao_user")
    router.push("/login")
  }

  const updateUser = (data: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...data }
      setUser(updatedUser)
      localStorage.setItem("optigestao_user", JSON.stringify(updatedUser))
    }
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, updateUser, isLoading }}>
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
