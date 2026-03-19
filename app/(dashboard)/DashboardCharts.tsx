"use client"

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts"

type ChartData = {
  name: string
  value: number
  color?: string
}

type RevenueData = {
  month: string
  revenue: number
}

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"]

interface DashboardChartsProps {
  monthlyRevenue: RevenueData[]
  salesByCategory: ChartData[]
  ordersByStatus: ChartData[]
}

export function RevenueChart({ data }: { data: RevenueData[] }) {
  if (data.length === 0) {
    return (
      <div style={{ height: 300, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-muted)" }}>
        Sem dados de receita ainda
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />
        <XAxis
          dataKey="month"
          tickLine={false}
          axisLine={false}
          tick={{ fill: "var(--text-muted)", fontSize: 12 }}
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          tick={{ fill: "var(--text-muted)", fontSize: 12 }}
          tickFormatter={(value) => `R$${(value / 1000).toFixed(0)}k`}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "var(--bg-card)",
            border: "1px solid var(--border-color)",
            borderRadius: "8px",
            color: "var(--text-primary)",
          }}
          formatter={(value: number) => [`R$ ${value.toLocaleString("pt-BR")}`, "Receita"]}
        />
        <Bar dataKey="revenue" fill="#3b82f6" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}

export function CategoryPieChart({ data }: { data: ChartData[] }) {
  if (data.length === 0) {
    return (
      <div style={{ height: 200, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-muted)" }}>
        Sem dados ainda
      </div>
    )
  }

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
      <ResponsiveContainer width={150} height={150}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={40}
            outerRadius={70}
            paddingAngle={2}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: "var(--bg-card)",
              border: "1px solid var(--border-color)",
              borderRadius: "8px",
              color: "var(--text-primary)",
            }}
          />
        </PieChart>
      </ResponsiveContainer>
      <div style={{ flex: 1 }}>
        {data.map((item, index) => (
          <div key={item.name} style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
            <div style={{ width: 12, height: 12, borderRadius: 3, backgroundColor: COLORS[index % COLORS.length] }} />
            <span style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>{item.name}</span>
            <span style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--text-primary)", marginLeft: "auto" }}>{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export function StatusDonutChart({ data }: { data: ChartData[] }) {
  if (data.length === 0) {
    return (
      <div style={{ height: 200, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-muted)" }}>
        Sem pedidos ainda
      </div>
    )
  }

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
      <ResponsiveContainer width={120} height={120}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={35}
            outerRadius={55}
            paddingAngle={3}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: "var(--bg-card)",
              border: "1px solid var(--border-color)",
              borderRadius: "8px",
              color: "var(--text-primary)",
            }}
          />
        </PieChart>
      </ResponsiveContainer>
      <div style={{ flex: 1 }}>
        {data.map((item, index) => (
          <div key={item.name} style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
            <div style={{ width: 10, height: 10, borderRadius: 2, backgroundColor: COLORS[index % COLORS.length] }} />
            <span style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>{item.name}</span>
            <span style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--text-primary)", marginLeft: "auto" }}>{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
