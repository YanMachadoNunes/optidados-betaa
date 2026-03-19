import Link from "next/link"
import prisma from "@/lib/utils"
import { 
  Users, 
  Package, 
  ShoppingCart, 
  DollarSign,
  AlertTriangle,
  TrendingUp,
  ArrowRight,
  Eye,
  Receipt,
  UserPlus
} from "lucide-react"
import { unstable_noStore as noStore } from "next/cache"
import styles from "./home.module.css"
import { RevenueChart, CategoryPieChart, StatusDonutChart } from "./DashboardCharts"

export default async function DashboardPage() {
  noStore()
  
  const [
    customersCount,
    productsCount,
    ordersCount,
    salesData,
    recentOrders,
    recentSales,
    lowStockProducts,
    allProducts,
    allOrders,
  ] = await Promise.all([
    prisma.customer.count(),
    prisma.product.count(),
    prisma.order.count(),
    prisma.sale.aggregate({ 
      _sum: { totalAmount: true },
      _count: true 
    }),
    prisma.order.findMany({
      take: 6,
      orderBy: { createdAt: 'desc' },
      include: { customer: true }
    }),
    prisma.sale.findMany({
      take: 6,
      orderBy: { createdAt: 'desc' },
      include: { customer: true }
    }),
    prisma.product.findMany({
      where: { stock: { lte: 5 } },
      orderBy: { stock: 'asc' },
      take: 5
    }),
    prisma.product.findMany({
      select: { category: true }
    }),
    prisma.order.findMany({
      select: { status: true }
    }),
  ])

  const totalRevenue = Number(salesData._sum.totalAmount || 0)
  const totalSales = salesData._count || 0

  const categoryCount = allProducts.reduce((acc: Record<string, number>, p) => {
    acc[p.category] = (acc[p.category] || 0) + 1
    return acc
  }, {})
  const categoryData = Object.entries(categoryCount).map(([name, value]) => ({ name, value }))

  const statusCount = allOrders.reduce((acc: Record<string, number>, o) => {
    const status = o.status || "PENDING"
    acc[status] = (acc[status] || 0) + 1
    return acc
  }, {})
  const statusLabels: Record<string, string> = {
    PENDING: "Pendente",
    IN_ASSEMBLY: "Em Montagem",
    READY: "Pronto",
    DELIVERED: "Entregue"
  }
  const statusData = Object.entries(statusCount).map((name, value) => ({ 
    name: statusLabels[name[0]] || name[0], 
    value: name[1]
  }))

  const monthlyRevenue = [
    { month: "Jan", revenue: 0 },
    { month: "Fev", revenue: 0 },
    { month: "Mar", revenue: 0 },
    { month: "Abr", revenue: 0 },
    { month: "Mai", revenue: 0 },
    { month: "Jun", revenue: 0 },
  ]

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <h1>Dashboard</h1>
          <p>Visão geral da sua óptica</p>
        </div>
        <span className={styles.dateBadge}>
          {new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}
        </span>
      </div>

      <div className={styles.kpiGrid}>
        <div className={styles.kpiCard}>
          <div className={`${styles.kpiIcon} ${styles.blue}`}>
            <DollarSign size={24} />
          </div>
          <div className={styles.kpiInfo}>
            <span className={styles.kpiLabel}>Faturamento</span>
            <span className={styles.kpiValue}>R$ {totalRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
          </div>
        </div>

        <div className={styles.kpiCard}>
          <div className={`${styles.kpiIcon} ${styles.green}`}>
            <Receipt size={24} />
          </div>
          <div className={styles.kpiInfo}>
            <span className={styles.kpiLabel}>Vendas</span>
            <span className={styles.kpiValue}>{totalSales}</span>
          </div>
        </div>

        <div className={styles.kpiCard}>
          <div className={`${styles.kpiIcon} ${styles.yellow}`}>
            <Users size={24} />
          </div>
          <div className={styles.kpiInfo}>
            <span className={styles.kpiLabel}>Clientes</span>
            <span className={styles.kpiValue}>{customersCount}</span>
          </div>
        </div>

        <div className={styles.kpiCard}>
          <div className={`${styles.kpiIcon} ${styles.red}`}>
            <ShoppingCart size={24} />
          </div>
          <div className={styles.kpiInfo}>
            <span className={styles.kpiLabel}>Pedidos</span>
            <span className={styles.kpiValue}>{ordersCount}</span>
          </div>
        </div>
      </div>

      <div className={styles.mainGrid}>
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>
              <TrendingUp size={18} />
              Receita Mensal
            </h2>
          </div>
          <div className={styles.chartContainer}>
            <RevenueChart data={monthlyRevenue} />
          </div>
        </div>

        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>
              <Package size={18} />
              Produtos por Categoria
            </h2>
          </div>
          <div style={{ padding: "1rem" }}>
            <CategoryPieChart data={categoryData} />
          </div>
        </div>
      </div>

      <div className={styles.mainGrid}>
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>
              <Receipt size={18} />
              Últimas Vendas
            </h2>
            <Link href="/sales" className={styles.viewAll}>
              Ver todas <ArrowRight size={14} />
            </Link>
          </div>
          <div className={styles.cardBody}>
            {recentSales.length === 0 ? (
              <div className={styles.emptyState}>
                <DollarSign size={32} style={{ opacity: 0.3 }} />
                <p>Nenhuma venda registrada</p>
              </div>
            ) : (
              recentSales.map((sale) => (
                <div key={sale.id} className={styles.listItem}>
                  <div className={styles.itemLeft}>
                    <div className={styles.itemAvatar} style={{ background: 'var(--success)' }}>
                      {sale.customer?.name?.charAt(0).toUpperCase() || 'A'}
                    </div>
                    <div className={styles.itemInfo}>
                      <h4>{sale.customer?.name || 'Venda Avulsa'}</h4>
                      <p>{new Date(sale.createdAt).toLocaleDateString('pt-BR')} • {sale.paymentMethod || 'PIX'}</p>
                    </div>
                  </div>
                  <div className={styles.itemRight}>
                    <span className={styles.itemValue}>R$ {Number(sale.totalAmount).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>
              <TrendingUp size={18} />
              Ações Rápidas
            </h2>
          </div>
          <div className={styles.quickActions}>
            <Link href="/sales/new" className={`${styles.actionBtn} ${styles.primary}`}>
              <DollarSign size={20} />
              Nova Venda
            </Link>
            <Link href="/customers/new" className={`${styles.actionBtn} ${styles.primary}`}>
              <UserPlus size={20} />
              Novo Cliente
            </Link>
            <Link href="/orders/new" className={`${styles.actionBtn} ${styles.primary}`}>
              <ShoppingCart size={20} />
              Novo Pedido
            </Link>
            <Link href="/inventory" className={`${styles.actionBtn} ${styles.primary}`}>
              <Package size={20} />
              Ver Estoque
            </Link>
          </div>
        </div>
      </div>

      <div className={styles.bottomGrid}>
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>
              <ShoppingCart size={18} />
              Pedidos
            </h2>
            <Link href="/orders" style={{ color: 'var(--accent-primary)', fontSize: '0.85rem', textDecoration: 'none', fontWeight: 600 }}>
              Ver todos <ArrowRight size={14} />
            </Link>
          </div>
          <div className={styles.cardBody}>
            {recentOrders.length === 0 ? (
              <div className={styles.emptyState}>
                <ShoppingCart size={32} style={{ opacity: 0.3 }} />
                <p>Nenhum pedido</p>
              </div>
            ) : (
              recentOrders.map((order) => (
                <div key={order.id} className={styles.listItem}>
                  <div className={styles.itemLeft}>
                    <div className={styles.itemAvatar} style={{ background: '#f59e0b' }}>
                      {order.customer?.name?.charAt(0).toUpperCase() || '?'}
                    </div>
                    <div className={styles.itemInfo}>
                      <h4>#{order.id.slice(0, 8)} - {order.customer?.name || 'Cliente'}</h4>
                      <p>{new Date(order.createdAt).toLocaleDateString('pt-BR')}</p>
                    </div>
                  </div>
                  <div className={styles.itemRight}>
                    <span className={`${styles.statusBadge} ${styles[order.status?.toLowerCase()]}`}>
                      {order.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>
              <AlertTriangle size={18} style={{ color: '#f59e0b' }} />
              Alertas
            </h2>
          </div>
          <div className={styles.cardBody}>
            {lowStockProducts.length === 0 ? (
              <div className={styles.emptyState}>
                <Package size={32} style={{ opacity: 0.3 }} />
                <p>Estoque OK</p>
              </div>
            ) : (
              lowStockProducts.map((product) => (
                <div key={product.id} className={styles.alertItem}>
                  <div className={`${styles.alertIcon} ${product.stock === 0 ? styles.danger : styles.warning}`}>
                    <Package size={16} />
                  </div>
                  <div className={styles.alertInfo}>
                    <h4>{product.name}</h4>
                    <p>{product.category}</p>
                  </div>
                  <span className={`${styles.alertBadge} ${product.stock === 0 ? styles.out : styles.low}`}>
                    {product.stock === 0 ? 'Esgotado' : `${product.stock} unid`}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>
              <Users size={18} />
              Status dos Pedidos
            </h2>
          </div>
          <div style={{ padding: "1rem" }}>
            <StatusDonutChart data={statusData} />
          </div>
        </div>
      </div>
    </div>
  )
}
