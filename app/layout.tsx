"use client"

import { useEffect, useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import { Shell } from "./components/Shell"
import { ThemeProvider } from "./context/ThemeContext"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    // Verificar se usuário está logado
    const user = localStorage.getItem("optigestao_user")
    
    if (!user && pathname !== "/login") {
      router.push("/login")
    } else if (user && pathname === "/login") {
      router.push("/")
    }
    
    setIsAuthenticated(!!user)
  }, [pathname, router])

  // Não renderizar nada enquanto verifica autenticação
  if (isAuthenticated === null) {
    return (
      <html lang="pt-BR">
        <body style={{ margin: 0, padding: 0, background: "#0f172a" }}>
          <div style={{ 
            minHeight: "100vh", 
            display: "flex", 
            alignItems: "center", 
            justifyContent: "center",
            color: "white"
          }}>
            Carregando...
          </div>
        </body>
      </html>
    )
  }

  // Se estiver na página de login, não mostrar Shell
  if (pathname === "/login") {
    return (
      <html lang="pt-BR">
        <body style={{ margin: 0, padding: 0 }}>
          <ThemeProvider>
            {children}
          </ThemeProvider>
        </body>
      </html>
    )
  }

  return (
    <html lang="pt-BR">
      <body style={{ margin: 0, padding: 0 }}>
        <ThemeProvider>
          <Shell>{children}</Shell>
        </ThemeProvider>
      </body>
    </html>
  )
}
