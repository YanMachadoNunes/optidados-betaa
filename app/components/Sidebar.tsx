"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Package,
  ShoppingCart,
  DollarSign,
  ChevronLeft,
  ChevronRight,
  User,
  LogOut,
  Settings,
} from "lucide-react";
import { useRouter } from "next/navigation";
import styles from "./sidebar.module.css";
import { useSidebar } from "../context/SidebarContext";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/" },
  { icon: Users, label: "Clientes", path: "/customers" },
  { icon: Package, label: "Estoque", path: "/inventory" },
  { icon: ShoppingCart, label: "Vendas", path: "/sales" },
  { icon: DollarSign, label: "Financeiro", path: "/finance" },
  { icon: Settings, label: "Configurações", path: "/settings" },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { isCollapsed, toggleSidebar } = useSidebar();

  const handleLogout = () => {
    localStorage.removeItem("optigestao_user");
    router.push("/login");
  };

  return (
    <aside
      className={`${styles.sidebar} ${isCollapsed ? styles.collapsed : ""}`}
    >
      {/* Cabeçalho com Logo */}
      <div className={styles.header}>
        <div className={styles.logo}>
          <div className={styles.logoIcon}>O</div>
          {!isCollapsed && <span className={styles.logoText}>OptiGestão</span>}
        </div>

        {/* Botão de Minimizar */}
        <button onClick={toggleSidebar} className={styles.collapseBtn}>
          {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      <nav className={styles.nav}>
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.path;

          return (
            <Link
              key={item.path}
              href={item.path}
              className={`${styles.link} ${isActive ? styles.active : ""}`}
              title={isCollapsed ? item.label : ""}
            >
              <Icon size={20} />
              {!isCollapsed && (
                <span className={styles.label}>{item.label}</span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className={styles.footer}>
        <div className={styles.userInfo}>
          <div className={styles.avatar}>
            <User size={18} />
          </div>
          {!isCollapsed && (
            <div className={styles.user}>
              <span className={styles.userName}>Administrador</span>
              <span className={styles.userRole}>Ótica</span>
            </div>
          )}
        </div>
        <button 
          onClick={handleLogout} 
          className={styles.logoutBtn}
          title="Sair"
        >
          <LogOut size={18} />
          {!isCollapsed && <span>Sair</span>}
        </button>
      </div>
    </aside>
  );
}
