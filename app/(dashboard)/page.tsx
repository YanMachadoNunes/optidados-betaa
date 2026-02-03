import { prisma } from "../lib/prisma"; // Subindo um nível do (dashboard) para a raiz, depois lib
// SE der erro de caminho, tente: import { prisma } from "@/lib/prisma"; se tiver alias configurado.
// Mas pelo seu print: "../../lib/prisma" se estiver dentro de uma pasta, ou "../lib/prisma" se estiver na raiz do group.

import Link from "next/link";
import style from "./home.module.css";

export default async function DashboardPage() {
  // 1. Buscando dados em PARALELO (Performance Hard Mode)
  // O Promise.all faz as 4 consultas ao mesmo tempo, em vez de esperar uma por uma.
  const [totalSales, totalCustomers, lowStockCount, recentSales] =
    await Promise.all([
      // A. Soma total das vendas
      prisma.sale.aggregate({
        _sum: { totalAmount: true },
        where: { status: "COMPLETED" },
      }),

      // B. Total de clientes
      prisma.customer.count(),

      // C. Alerta de Estoque Baixo (menos de 5 itens)
      prisma.product.count({
        where: { stock: { lt: 5 } },
      }),

      // D. Últimas 5 vendas para a lista rápida
      prisma.sale.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        include: {
          customer: { select: { name: true } }, // Traz o nome do cliente
        },
      }),
    ]);

  const revenue = Number(totalSales._sum.totalAmount || 0);

  return (
    <div className={style.pageWrapper}>
      <div className={style.header}>
        <h1 className={style.title}>Visão Geral</h1>
        <p className={style.subtitle}>Bem-vindo de volta, Yan.</p>
      </div>

      {/* GRID DE KPIs (Indicadores Chave) */}
      <div className={style.kpiGrid}>
        {/* Card 1: Faturamento */}
        <div className={style.card}>
          <span className={style.cardLabel}>Faturamento Total</span>
          <div className={style.cardValue} style={{ color: "#16a34a" }}>
            R$ {revenue.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
          </div>
          <span className={style.cardSub}>Receita acumulada</span>
        </div>

        {/* Card 2: Clientes */}
        <div className={style.card}>
          <span className={style.cardLabel}>Clientes Ativos</span>
          <div className={style.cardValue}>{totalCustomers}</div>
          <Link href="/customers" className={style.cardLink}>
            Ver todos →
          </Link>
        </div>

        {/* Card 3: Estoque Crítico */}
        <div
          className={style.card}
          style={{ borderColor: lowStockCount > 0 ? "#fecaca" : "#e2e8f0" }}
        >
          <span className={style.cardLabel}>Estoque Baixo</span>
          <div
            className={style.cardValue}
            style={{ color: lowStockCount > 0 ? "#dc2626" : "#0f172a" }}
          >
            {lowStockCount}
          </div>
          <span className={style.cardSub}>Produtos precisando reposição</span>
          {lowStockCount > 0 && (
            <Link href="/inventory" className={style.alertLink}>
              Repor Agora
            </Link>
          )}
        </div>
      </div>

      {/* AÇÕES RÁPIDAS & HISTÓRICO */}
      <div className={style.sectionGrid}>
        {/* Coluna 1: Ações */}
        <div className={style.actionCard}>
          <h2 className={style.sectionTitle}>Acesso Rápido</h2>
          <div className={style.buttonsGrid}>
            <Link href="/sales/new" className={style.primaryButton}>
              🛒 Nova Venda
            </Link>
            <Link href="/customers" className={style.secondaryButton}>
              👥 Gerenciar Clientes
            </Link>
            <Link href="/inventory/new" className={style.secondaryButton}>
              📦 Cadastrar Produto
            </Link>
          </div>
        </div>

        {/* Coluna 2: Últimas Vendas */}
        <div className={style.listCard}>
          <div className={style.cardHeader}>
            <h2 className={style.sectionTitle}>Vendas Recentes</h2>
            <Link href="/sales" className={style.viewAll}>
              Ver tudo
            </Link>
          </div>

          <div className={style.list}>
            {recentSales.length === 0 ? (
              <p className={style.empty}>Nenhuma venda registrada hoje.</p>
            ) : (
              recentSales.map((sale) => (
                <div key={sale.id} className={style.listItem}>
                  <div>
                    <div className={style.itemTitle}>
                      {sale.customer ? sale.customer.name : "Venda Avulsa"}
                    </div>
                    <div className={style.itemDate}>
                      {new Date(sale.createdAt).toLocaleDateString("pt-BR")} às{" "}
                      {new Date(sale.createdAt).toLocaleTimeString("pt-BR", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </div>
                  <div className={style.itemPrice}>
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
