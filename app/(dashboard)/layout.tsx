"use client"

import { AuthProvider } from "../context/AuthContext"
import { SidebarProvider } from "../context/SidebarContext"
import { Shell } from "../components/Shell"

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AuthProvider>
        <Shell>{children}</Shell>
      </AuthProvider>
    </SidebarProvider>
  )
}
