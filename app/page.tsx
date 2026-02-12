import { prisma } from "./lib/prisma";
import Link from "next/link";
import style from "./home.module.css";
import { unstable_noStore as noStore } from "next/cache";
import { 
  TrendingUp,
  Users, 
  Package, 
  ShoppingCart,
  Plus,
  ArrowRight,
  DollarSign,
  AlertCircle,
  User
} from "lucide-react";

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export default async function HomePage() {
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
  });

  return (
    <div className={style.container}>
      {/* Header */}
      <header className={style.header}>
        <div>
          <h1 className={style.title}>Visão Geral</h1>
          <p className={style.subtitle}>Acompanhe o desempenho da sua ótica em tempo real.</p>
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
            <span className={style.kpiLabel}>Clientes</span>
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
            <span className={style.kpiLabel}>Estoque</span>
            <div className={style.kpiIcon}>
              <Package size={24} />
            </div>
          </div>
          <div className={style.kpiValue}>{lowStockCount}</div>
          <span className={style.kpiSub}>
            {lowStockCount > 0 ? "Produtos em alerta" : "Tudo em ordem"}
          </span>
          {lowStockCount > 0 && (
            <Link href="/inventory" className={style.kpiLink}>
              Ver alertas <ArrowRight size={16} />
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
              <div className={style.actionContent}>
                <span className={style.actionTitle}>Nova Venda</span>
                <span className={style.actionDesc}>Registrar venda rápida</span>
              </div>
            </Link>
            
            <Link href="/customers/new" className={`${style.actionButton} ${style.secondary}`}>
              <div className={style.actionIcon}>
                <User size={20} />
              </div>
              <div className={style.actionContent}>
                <span className={style.actionTitle}>Novo Cliente</span>
                <span className={style.actionDesc}>Cadastrar cliente</span>
              </div>
            </Link>
            
            <Link href="/inventory/new" className={`${style.actionButton} ${style.secondary}`}>
              <div className={style.actionIcon}>
                <Package size={20} />
              </div>
              <div className={style.actionContent}>
                <span className={style.actionTitle}>Novo Produto</span>
                <span className={style.actionDesc}>Adicionar ao estoque</span>
              </div>
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
                <ShoppingCart size={48} className={style.emptyIcon} />
                <p>Nenhuma venda registrada ainda.</p>
                <Link href="/sales/new" className={style.createBtn}>
                  Fazer primeira venda
                </Link>
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
