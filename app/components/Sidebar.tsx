"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { signOut } from "next-auth/react"
import {
  LayoutDashboard,
  Users,
  Package,
  ShoppingCart,
  DollarSign,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Settings,
  ClipboardList,
  Crown,
  X,
} from "lucide-react"
import styles from "./sidebar.module.css"
import { useSidebar } from "../context/SidebarContext"

interface UserData {
  id: string
  name: string | null
  email: string | null
  role?: string
  image?: string | null
}

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/" },
  { icon: Users, label: "Clientes", path: "/customers" },
  { icon: ClipboardList, label: "Pedidos", path: "/orders" },
  { icon: Package, label: "Estoque", path: "/inventory" },
  { icon: ShoppingCart, label: "Vendas", path: "/sales" },
  { icon: DollarSign, label: "Financeiro", path: "/finance" },
  { icon: Crown, label: "Planos", path: "/plans" },
  { icon: Settings, label: "Configurações", path: "/settings" },
]

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { isCollapsed, toggleSidebar, isMobileOpen, closeMobile, isMobile } = useSidebar()
  const [user, setUser] = useState<UserData | null>(null)

  useEffect(() => {
    const storedUser = localStorage.getItem("optigestao_user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
  }, [])

  const handleLogout = async () => {
    localStorage.removeItem("optigestao_user")
    await signOut({ redirect: false })
    router.push("/login")
  }

  const userName = user?.name || user?.email || "Usuário"
  const userInitial = user?.name?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || "U"

  return (
    <>
      {isMobile && (
        <div
          className={`${styles.mobileOverlay} ${isMobileOpen ? styles.active : ''}`}
          onClick={closeMobile}
        />
      )}
      <aside
        className={`
          ${styles.sidebar}
          ${isCollapsed ? styles.collapsed : ""}
          ${isMobile ? (isMobileOpen ? styles.mobileOpen : "") : ""}
        `}
      >
        <div className={styles.header}>
          <div className={styles.logo}>
            <img src="/favicon.png" alt="OptiGestão" className={styles.logoIconImg} />
            <span className={styles.logoText}>OptiGestão</span>
          </div>
          {!isMobile && (
            <button onClick={toggleSidebar} className={styles.collapseBtn}>
              {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
            </button>
          )}
          {isMobile && (
            <button onClick={closeMobile} className={styles.collapseBtn}>
              <X size={20} />
            </button>
          )}
        </div>

        <nav className={styles.nav}>
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.path

            return (
              <Link
                key={item.path}
                href={item.path}
                className={`${styles.link} ${isActive ? styles.active : ""}`}
                onClick={closeMobile}
              >
                <Icon size={20} />
                <span className={styles.label}>{item.label}</span>
              </Link>
            )
          })}
        </nav>

        <div className={styles.footer}>
          <div className={styles.userInfo}>
            {user?.image ? (
              <img src={user.image} alt={userName} className={styles.avatarImg} />
            ) : (
              <div className={styles.avatar}>
                {userInitial}
              </div>
            )}
            <div className={styles.user}>
              <span className={styles.userName}>{userName}</span>
              <span className={styles.userRole}>{user?.role || "Usuário"}</span>
            </div>
          </div>
          <button
            onClick={() => {
              handleLogout()
              closeMobile()
            }}
            className={styles.logoutBtn}
          >
            <LogOut size={18} />
            <span>Sair</span>
          </button>
        </div>
      </aside>
    </>
  )
}
