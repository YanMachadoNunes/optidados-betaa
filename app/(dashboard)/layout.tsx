import { SidebarProvider } from "../context/SidebarContext"
import { Shell } from "../components/Shell"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <Shell>{children}</Shell>
    </SidebarProvider>
  )
}
