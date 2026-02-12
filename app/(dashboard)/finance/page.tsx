"use client";

import { useMemo } from "react";
import Link from "next/link";
import style from "./page.module.css";
import { 
  DollarSign,
  TrendingUp,
  Wallet,
  Plus,
  Download,
  Calendar,
  ShoppingCart,
  ArrowUpRight,
  Filter
} from "lucide-react";
import { 
  Area, 
  AreaChart, 
  CartesianGrid, 
  XAxis, 
  YAxis, 
  ResponsiveContainer,
  Tooltip
} from "recharts";

// Dados de exemplo para o gráfico
const chartData = [
  { month: "Jan", revenue: 12500 },
  { month: "Fev", revenue: 18200 },
  { month: "Mar", revenue: 15400 },
  { month: "Abr", revenue: 22100 },
  { month: "Mai", revenue: 19500 },
  { month: "Jun", revenue: 24800 },
];

// Dados de vendas de exemplo
const recentSales = [
  { id: "1", customer: { name: "João Silva" }, totalAmount: 450.00, createdAt: new Date().toISOString() },
  { id: "2", customer: { name: "Maria Santos" }, totalAmount: 890.00, createdAt: new Date(Date.now() - 86400000).toISOString() },
  { id: "3", customer: null, totalAmount: 320.00, createdAt: new Date(Date.now() - 172800000).toISOString() },
];

export default function FinancePage() {
  // Cálculos
  const totalRevenue = 111500;
  const totalSales = 156;
  const averageSale = totalSales > 0 ? totalRevenue / totalSales : 0;

  const todayFormatted = new Date().toLocaleDateString("pt-BR", {
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

      {/* GRÁFICO RECHARTS */}
      <div className={style.chartCard}>
        <div className={style.chartHeader}>
          <div>
            <h2 className={style.chartTitle}>Evolução de Receitas</h2>
            <p className={style.chartSubtitle}>Últimos 6 meses</p>
          </div>
        </div>
        <div className={style.chartContainer}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartData}
              margin={{
                top: 10,
                right: 12,
                left: 12,
                bottom: 10,
              }}
            >
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tick={{ fill: '#64748b', fontSize: 12 }}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tick={{ fill: '#64748b', fontSize: 12 }}
                tickFormatter={(value) => `R$${(value / 1000).toFixed(0)}k`}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#fff', 
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  padding: '12px'
                }}
                formatter={(value: number) => [`R$ ${value.toLocaleString('pt-BR')}`, 'Receita']}
              />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#3b82f6"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorRevenue)"
              />
            </AreaChart>
          </ResponsiveContainer>
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
            {recentSales.map((sale) => (
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
                      })}
                    </p>
                  </div>
                </div>
                <div className={style.transactionAmount}>
                  + R$ {Number(sale.totalAmount).toFixed(2)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar com Info */}
        <div className={style.sidebar}>
          <div className={style.sidebarCard}>
            <h3 className={style.sidebarTitle}>Resumo do Dia</h3>
            <div className={style.sidebarContent}>
              <div className={style.infoItem}>
                <Calendar size={18} />
                <span>{todayFormatted}</span>
              </div>
              <div className={style.divider} />
              <div className={style.quickStats}>
                <div className={style.quickStat}>
                  <span className={style.quickStatLabel}>Vendas Hoje</span>
                  <span className={style.quickStatValue}>3</span>
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
