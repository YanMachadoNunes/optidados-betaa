"use client";

import { ReactNode, useState, useEffect } from "react";
import { Sidebar } from "./Sidebar";
import { SidebarProvider, useSidebar } from "../context/SidebarContext";
import { Menu } from "lucide-react";

function MainContent({ children }: { children: ReactNode }) {
  const { isCollapsed } = useSidebar();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

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
          onClick={() => setMobileOpen(true)}
          style={{
            position: "fixed",
            top: "1rem",
            left: "1rem",
            zIndex: 50,
            background: "var(--bg-card)",
            border: "1px solid var(--border-color)",
            borderRadius: "8px",
            padding: "0.5rem",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "var(--text-primary)",
          }}
        >
          <Menu size={24} />
        </button>
      )}
      <Sidebar />
      <main
        style={{
          flex: 1,
          marginLeft: isCollapsed ? "80px" : "260px",
          width: "100%",
          minHeight: "100vh",
          transition: "margin-left 0.3s ease, background-color 0.3s ease",
          overflowX: "hidden",
          paddingTop: isMobile ? "4rem" : 0,
        }}
      >
        {children}
      </main>
    </div>
  );
}

export function Shell({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider>
      <MainContent>{children}</MainContent>
    </SidebarProvider>
  );
}
