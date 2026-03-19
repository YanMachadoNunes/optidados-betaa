"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import style from "./page.module.css"
import { 
  TrendingUp,
  ShoppingCart,
  Wallet,
  Plus,
  Download,
  Calendar,
  TrendingDown,
  Receipt,
} from "lucide-react"
import { 
  Area, 
  AreaChart, 
  CartesianGrid, 
  XAxis, 
  YAxis, 
  ResponsiveContainer,
  Tooltip
} from "recharts"

interface Sale {
  id: string
  totalAmount: string | number
  createdAt: string
  customer: { name: string | null } | null
}

interface DashboardData {
  totalRevenue: number
  totalSales: number
  averageSale: number
  sales: Sale[]
  monthlyData: { month: string; revenue: number }[]
  todaySales: number
}

export default function FinancePage() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const response = await fetch("/api/reports/sales")
      if (response.ok) {
        const salesData = await response.json()
        
        const totalRevenue = salesData.reduce((acc: number, sale: any) => 
          acc + Number(sale.totalAmount), 0
        )
        const totalSales = salesData.length
        const averageSale = totalSales > 0 ? totalRevenue / totalSales : 0

        const today = new Date()
        today.setHours(0, 0, 0, 0)
        const todaySales = salesData.filter((sale: any) => {
          const saleDate = new Date(sale.createdAt)
          saleDate.setHours(0, 0, 0, 0)
          return saleDate.getTime() === today.getTime()
        }).length

        const monthlyMap = new Map<string, number>()
        salesData.forEach((sale: any) => {
          const date = new Date(sale.createdAt)
          const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
          const monthName = date.toLocaleDateString("pt-BR", { month: "short" })
          const current = monthlyMap.get(monthKey) || 0
          monthlyMap.set(monthKey, current + Number(sale.totalAmount))
        })

        const monthlyData = Array.from(monthlyMap.entries())
          .sort((a, b) => a[0].localeCompare(b[0]))
          .slice(-6)
          .map(([key, value]) => ({
            month: new Date(key + "-01").toLocaleDateString("pt-BR", { month: "short" }),
            revenue: value
          }))

        if (monthlyData.length === 0) {
          const months: { month: string; revenue: number }[] = []
          for (let i = 5; i >= 0; i--) {
            const d = new Date()
            d.setMonth(d.getMonth() - i)
            months.push({
              month: d.toLocaleDateString("pt-BR", { month: "short" }),
              revenue: 0
            })
          }
          monthlyData.push(...months)
        }

        setData({
          totalRevenue,
          totalSales,
          averageSale,
          sales: salesData.slice(0, 10),
          monthlyData,
          todaySales
        })
      }
    } catch (error) {
      console.error("Erro ao buscar dados:", error)
    } finally {
      setLoading(false)
    }
  }

  const todayFormatted = new Date().toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  })

  if (loading) {
    return (
      <div className={style.container}>
        <div className={style.loading}>Carregando...</div>
      </div>
    )
  }

  const isEmpty = data?.totalSales === 0

  return (
    <div className={style.container}>
      <header className={style.header}>
        <div>
          <h1 className={style.title}>Financeiro</h1>
          <p className={style.subtitle}>
            Acompanhe suas receitas e controle o fluxo de caixa.
          </p>
        </div>
        <div className={style.headerActions}>
          <Link href="/sales/new" className={style.primaryButton}>
            <Plus size={18} />
            Nova Venda
          </Link>
        </div>
      </header>

      {isEmpty ? (
        <div className={style.emptyState}>
          <div className={style.emptyIcon}>
            <Receipt size={64} />
          </div>
          <h2 className={style.emptyTitle}>Nenhuma venda registrada</h2>
          <p className={style.emptyText}>
            Comece registrando suas primeiras vendas para acompanhar o financeiro.
          </p>
          <Link href="/sales/new" className={style.emptyButton}>
            <Plus size={20} />
            Registrar Primeira Venda
          </Link>
        </div>
      ) : (
        <>
          <div className={style.summaryGrid}>
            <div className={`${style.summaryCard} ${style.revenue}`}>
              <div className={style.summaryHeader}>
                <span className={style.summaryLabel}>Receita Total</span>
                <div className={style.summaryIcon}>
                  <TrendingUp size={22} />
                </div>
              </div>
              <div className={style.summaryValue}>
                R$ {data?.totalRevenue.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
              </div>
              <div className={style.summaryTrend}>
                <TrendingUp size={14} />
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
                {data?.totalSales}
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
                R$ {data?.averageSale.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
              </div>
              <div className={style.summaryTrend}>
                <span>por venda</span>
              </div>
            </div>
          </div>

          <div className={style.chartCard}>
            <div className={style.chartHeader}>
              <div>
                <h2 className={style.chartTitle}>Evolução de Receitas</h2>
                <p className={style.chartSubtitle}>
                  {data?.monthlyData.some(m => m.revenue > 0) 
                    ? "Últimos meses" 
                    : "Sem dados suficientes"}
                </p>
              </div>
            </div>
            <div className={style.chartContainer}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={data?.monthlyData}
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
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />
                  <XAxis
                    dataKey="month"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    tick={{ fill: 'var(--text-muted)', fontSize: 12 }}
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    tick={{ fill: 'var(--text-muted)', fontSize: 12 }}
                    tickFormatter={(value) => `R$${(value / 1000).toFixed(0)}k`}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'var(--bg-card)', 
                      border: '1px solid var(--border-color)',
                      borderRadius: '8px',
                      padding: '12px',
                      color: 'var(--text-primary)'
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

          <div className={style.contentGrid}>
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
                {data?.sales.map((sale) => (
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
                      + R$ {Number(sale.totalAmount).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                    </div>
                  </div>
                ))}
              </div>
            </div>

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
                      <span className={style.quickStatValue}>{data?.todaySales}</span>
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
                      <Receipt size={18} />
                    </div>
                    <span>Ver Vendas</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
