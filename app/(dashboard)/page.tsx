import { prisma } from "../lib/prisma";
import Link from "next/link";
import style from "./home.module.css";
import { unstable_noStore as noStore } from "next/cache";
import { 
  LayoutDashboard, 
  ShoppingCart, 
  Users, 
  Package, 
  TrendingUp,
  Plus,
  ArrowRight,
  DollarSign
} from "lucide-react";

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export default async function DashboardPage() {
  noStore();
  
  // Buscando dados em PARALELO
  const [totalSales, totalCustomers, lowStockCount, recentSales] =
    await Promise.all([
      // Soma total das vendas
      prisma.sale.aggregate({
        _sum: { totalAmount: true },
        where: { status: "COMPLETED" },
      }),

      // Total de clientes
      prisma.customer.count(),

      // Alerta de Estoque Baixo
      prisma.product.count({
        where: { stock: { lt: 5 } },
      }),

      // Últimas 5 vendas
      prisma.sale.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        include: {
          customer: { select: { name: true } },
        },
      }),
    ]);

  const revenue = Number(totalSales._sum.totalAmount || 0);

  // Formatar data atual
  const today = new Date().toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className={style.container}>
      {/* Header */}
      <header className={style.header}>
        <div>
          <h1 className={style.title}>Dashboard</h1>
          <p className={style.subtitle}>Bem-vindo de volta! Aqui está o resumo do seu negócio.</p>
        </div>
        <div className={style.dateBadge}>
          {today}
        </div>
      </header>

      {/* KPIs Grid */}
      <div className={style.kpiGrid}>
        {/* Faturamento */}
        <div className={`${style.kpiCard} ${style.success}`}>
          <div className={style.kpiHeader}>
            <span className={style.kpiLabel}>Faturamento Total</span>
            <div className={style.kpiIcon}>
              <TrendingUp size={24} />
            </div>
          </div>
          <div className={style.kpiValue}>
            R$ {revenue.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
          </div>
          <span className={style.kpiSub}>Receita acumulada</span>
          <Link href="/sales" className={style.kpiLink}>
            Ver detalhes <ArrowRight size={16} />
          </Link>
        </div>

        {/* Clientes */}
        <div className={style.kpiCard}>
          <div className={style.kpiHeader}>
            <span className={style.kpiLabel}>Clientes Ativos</span>
            <div className={style.kpiIcon}>
              <Users size={24} />
            </div>
          </div>
          <div className={style.kpiValue}>{totalCustomers}</div>
          <span className={style.kpiSub}>Total cadastrado</span>
          <Link href="/customers" className={style.kpiLink}>
            Ver todos <ArrowRight size={16} />
          </Link>
        </div>

        {/* Estoque */}
        <div className={`${style.kpiCard} ${lowStockCount > 0 ? style.danger : style.warning}`}>
          <div className={style.kpiHeader}>
            <span className={style.kpiLabel}>Estoque Baixo</span>
            <div className={style.kpiIcon}>
              <Package size={24} />
            </div>
          </div>
          <div className={style.kpiValue}>{lowStockCount}</div>
          <span className={style.kpiSub}>
            {lowStockCount > 0 ? "Produtos precisam reposição" : "Estoque em dia"}
          </span>
          {lowStockCount > 0 && (
            <Link href="/inventory" className={style.kpiLink}>
              Repor agora <ArrowRight size={16} />
            </Link>
          )}
        </div>
      </div>

      {/* Grid de Seções */}
      <div className={style.sectionGrid}>
        {/* Ações Rápidas */}
        <div className={style.card}>
          <div className={style.cardHeader}>
            <h2 className={style.cardTitle}>Ações Rápidas</h2>
          </div>
          <div className={style.actionsList}>
            <Link href="/sales/new" className={`${style.actionButton} ${style.primary}`}>
              <div className={style.actionIcon}>
                <Plus size={20} />
              </div>
              <span>Nova Venda</span>
            </Link>
            
            <Link href="/customers/new" className={`${style.actionButton} ${style.secondary}`}>
              <div className={style.actionIcon}>
                <Users size={20} />
              </div>
              <span>Cadastrar Cliente</span>
            </Link>
            
            <Link href="/inventory/new" className={`${style.actionButton} ${style.secondary}`}>
              <div className={style.actionIcon}>
                <Package size={20} />
              </div>
              <span>Adicionar Produto</span>
            </Link>
          </div>
        </div>

        {/* Vendas Recentes */}
        <div className={style.card}>
          <div className={style.cardHeader}>
            <h2 className={style.cardTitle}>Vendas Recentes</h2>
            <Link href="/sales" className={style.viewAll}>
              Ver todas
            </Link>
          </div>

          <div className={style.salesList}>
            {recentSales.length === 0 ? (
              <div className={style.emptyState}>
                <p>Nenhuma venda registrada ainda.</p>
              </div>
            ) : (
              recentSales.map((sale) => (
                <div key={sale.id} className={style.saleItem}>
                  <div className={style.saleInfo}>
                    <div className={style.saleAvatar}>
                      {getInitials(sale.customer?.name || "VA")}
                    </div>
                    <div className={style.saleDetails}>
                      <h4>{sale.customer?.name || "Venda Avulsa"}</h4>
                      <p>
                        {new Date(sale.createdAt).toLocaleDateString("pt-BR")} às{" "}
                        {new Date(sale.createdAt).toLocaleTimeString("pt-BR", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                  <div className={style.saleAmount}>
                    + R$ {Number(sale.totalAmount).toFixed(2)}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
