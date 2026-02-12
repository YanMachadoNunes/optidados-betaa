import { prisma } from "../../lib/prisma";
import Link from "next/link";
import style from "./page.module.css";
import { unstable_noStore as noStore } from "next/cache";
import { 
  DollarSign,
  TrendingUp,
  TrendingDown,
  Wallet,
  Plus,
  Download,
  Calendar,
  ShoppingCart,
  ArrowUpRight,
  ArrowDownRight,
  Filter
} from "lucide-react";

export default async function FinancePage() {
  noStore();

  // Buscar dados financeiros
  const [sales, totalSalesAgg] = await Promise.all([
    // Últimas 10 vendas
    prisma.sale.findMany({
      take: 10,
      orderBy: { createdAt: "desc" },
      include: {
        customer: { select: { name: true } },
      },
    }),
    
    // Totais
    prisma.sale.aggregate({
      _sum: { totalAmount: true },
      _count: { id: true },
      where: { status: "COMPLETED" },
    }),
  ]);

  const totalRevenue = Number(totalSalesAgg._sum.totalAmount || 0);
  const totalSales = totalSalesAgg._count.id;
  
  // Calcular média por venda
  const averageSale = totalSales > 0 ? totalRevenue / totalSales : 0;

  // Formatar data
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
          <h1 className={style.title}>Financeiro</h1>
          <p className={style.subtitle}>
            Acompanhe suas receitas e controle o fluxo de caixa.
          </p>
        </div>
        <div className={style.headerActions}>
          <button className={style.secondaryButton}>
            <Download size={18} />
            Exportar
          </button>
          <Link href="/sales/new" className={style.primaryButton}>
            <Plus size={18} />
            Nova Venda
          </Link>
        </div>
      </header>

      {/* Cards de Resumo */}
      <div className={style.summaryGrid}>
        <div className={`${style.summaryCard} ${style.revenue}`}>
          <div className={style.summaryHeader}>
            <span className={style.summaryLabel}>Receita Total</span>
            <div className={style.summaryIcon}>
              <TrendingUp size={22} />
            </div>
          </div>
          <div className={style.summaryValue}>
            R$ {totalRevenue.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
          </div>
          <div className={style.summaryTrend}>
            <ArrowUpRight size={16} />
            <span>Total acumulado</span>
          </div>
        </div>

        <div className={`${style.summaryCard} ${style.sales}`}>
          <div className={style.summaryHeader}>
            <span className={style.summaryLabel}>Total de Vendas</span>
            <div className={style.summaryIcon}>
              <ShoppingCart size={22} />
            </div>
          </div>
          <div className={style.summaryValue}>
            {totalSales}
          </div>
          <div className={style.summaryTrend}>
            <span>transações realizadas</span>
          </div>
        </div>

        <div className={`${style.summaryCard} ${style.average}`}>
          <div className={style.summaryHeader}>
            <span className={style.summaryLabel}>Ticket Médio</span>
            <div className={style.summaryIcon}>
              <Wallet size={22} />
            </div>
          </div>
          <div className={style.summaryValue}>
            R$ {averageSale.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
          </div>
          <div className={style.summaryTrend}>
            <span>por venda</span>
          </div>
        </div>
      </div>

      {/* Conteúdo Principal */}
      <div className={style.contentGrid}>
        {/* Lista de Vendas */}
        <div className={style.mainCard}>
          <div className={style.cardHeader}>
            <div>
              <h2 className={style.cardTitle}>Últimas Vendas</h2>
              <p className={style.cardSubtitle}>Histórico de transações recentes</p>
            </div>
            <Link href="/sales" className={style.viewAll}>
              Ver todas
            </Link>
          </div>

          <div className={style.transactionsList}>
            {sales.length === 0 ? (
              <div className={style.emptyState}>
                <DollarSign size={48} className={style.emptyIcon} />
                <h3 className={style.emptyTitle}>Nenhuma venda registrada</h3>
                <p className={style.emptyText}>
                  Comece registrando sua primeira venda para acompanhar o financeiro.
                </p>
                <Link href="/sales/new" className={style.emptyButton}>
                  <Plus size={18} />
                  Registrar Venda
                </Link>
              </div>
            ) : (
              sales.map((sale) => (
                <div key={sale.id} className={style.transactionItem}>
                  <div className={style.transactionInfo}>
                    <div className={style.transactionIcon}>
                      <ShoppingCart size={18} />
                    </div>
                    <div className={style.transactionDetails}>
                      <h4>{sale.customer?.name || "Venda Avulsa"}</h4>
                      <p>
                        {new Date(sale.createdAt).toLocaleDateString("pt-BR", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })} às{" "}
                        {new Date(sale.createdAt).toLocaleTimeString("pt-BR", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                  <div className={style.transactionAmount}>
                    + R$ {Number(sale.totalAmount).toFixed(2)}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Sidebar com Info */}
        <div className={style.sidebar}>
          <div className={style.sidebarCard}>
            <h3 className={style.sidebarTitle}>Resumo do Dia</h3>
            <div className={style.sidebarContent}>
              <div className={style.infoItem}>
                <Calendar size={18} />
                <span>{today}</span>
              </div>
              <div className={style.divider} />
              <div className={style.quickStats}>
                <div className={style.quickStat}>
                  <span className={style.quickStatLabel}>Vendas Hoje</span>
                  <span className={style.quickStatValue}>{
                    sales.filter(s => {
                      const saleDate = new Date(s.createdAt);
                      const today = new Date();
                      return saleDate.toDateString() === today.toDateString();
                    }).length
                  }</span>
                </div>
              </div>
            </div>
          </div>

          <div className={style.sidebarCard}>
            <h3 className={style.sidebarTitle}>Ações Rápidas</h3>
            <div className={style.quickActions}>
              <Link href="/sales/new" className={style.quickAction}>
                <div className={style.quickActionIcon}>
                  <Plus size={18} />
                </div>
                <span>Nova Venda</span>
              </Link>
              <Link href="/sales" className={style.quickAction}>
                <div className={style.quickActionIcon}>
                  <Filter size={18} />
                </div>
                <span>Filtrar Vendas</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
