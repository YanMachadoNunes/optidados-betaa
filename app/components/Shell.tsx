"use client"

import { ReactNode } from "react"
import { Sidebar } from "./Sidebar"
import { SidebarProvider, useSidebar } from "../context/SidebarContext"
import { Menu } from "lucide-react"

function MainContent({ children }: { children: ReactNode }) {
  const { toggleMobile, isMobile, isCollapsed } = useSidebar()

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        backgroundColor: "var(--bg-primary)",
      }}
    >
      {isMobile && (
        <button
          onClick={toggleMobile}
          style={{
            position: "fixed",
            top: "1rem",
            left: "1rem",
            zIndex: 60,
            background: "var(--accent-primary)",
            border: "none",
            borderRadius: "8px",
            padding: "0.5rem",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
          }}
        >
          <Menu size={24} />
        </button>
      )}
      <Sidebar />
      <main
        style={{
          flex: 1,
          marginLeft: isMobile ? 0 : (isCollapsed ? "80px" : "260px"),
          width: "100%",
          minHeight: "100vh",
          transition: isMobile ? "none" : "margin-left 0.3s ease",
          overflowX: "hidden",
          paddingTop: isMobile ? "5rem" : 0,
        }}
      >
        {children}
      </main>
    </div>
  )
}

export function Shell({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider>
      <MainContent>{children}</MainContent>
    </SidebarProvider>
  )
}
