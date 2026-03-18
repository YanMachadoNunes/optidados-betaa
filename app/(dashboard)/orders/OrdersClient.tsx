"use client"

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Plus, Edit, Package } from "lucide-react";
import styles from "./page.module.css";

const statusLabels: Record<string, string> = {
  PENDING: "Pendente",
  IN_ASSEMBLY: "Em Montagem",
  READY: "Pronto",
  DELIVERED: "Entregue",
};

const statusColors: Record<string, string> = {
  PENDING: "#f59e0b",
  IN_ASSEMBLY: "#3b82f6",
  READY: "#10b981",
  DELIVERED: "#6b7280",
};

type Order = {
  id: string;
  customer: { name: string };
  frame: { name: string } | null;
  totalAmount: any;
  status: string;
  createdAt: string;
};

export default function OrdersPageClient({ 
  orders, 
  counts 
}: { 
  orders: Order[];
  counts: { PENDING: number; IN_ASSEMBLY: number; READY: number; DELIVERED: number; total: number };
}) {
  const router = useRouter();
  const [filter, setFilter] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const filteredOrders = filter 
    ? orders.filter(o => o.status === filter)
    : orders;

  const handleFilterClick = (status: string | null) => {
    setFilter(status);
  };

  async function handleDelete(id: string) {
    if (!confirm("Tem certeza que deseja excluir este pedido?")) return;
    
    setDeletingId(id);
    try {
      await fetch(`/api/orders/${id}`, { method: "DELETE" });
      router.refresh();
    } catch (error) {
      alert("Erro ao excluir pedido");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Pedidos</h1>
        <Link href="/orders/new" className={styles.addButton}>
          <Plus size={20} />
          Novo Pedido
        </Link>
      </div>

      <div className={styles.statusFilters}>
        <button
          onClick={() => handleFilterClick(null)}
          className={`${styles.statusCard} ${filter === null ? styles.active : ""}`}
        >
          <span className={styles.statusCount}>{counts.total}</span>
          <span>Todos</span>
        </button>
        <button
          onClick={() => handleFilterClick("PENDING")}
          className={`${styles.statusCard} ${filter === "PENDING" ? styles.active : ""}`}
        >
          <span className={styles.statusCount} style={{ backgroundColor: statusColors.PENDING }}>
            {counts.PENDING}
          </span>
          <span>Pendente</span>
        </button>
        <button
          onClick={() => handleFilterClick("IN_ASSEMBLY")}
          className={`${styles.statusCard} ${filter === "IN_ASSEMBLY" ? styles.active : ""}`}
        >
          <span className={styles.statusCount} style={{ backgroundColor: statusColors.IN_ASSEMBLY }}>
            {counts.IN_ASSEMBLY}
          </span>
          <span>Em Montagem</span>
        </button>
        <button
          onClick={() => handleFilterClick("READY")}
          className={`${styles.statusCard} ${filter === "READY" ? styles.active : ""}`}
        >
          <span className={styles.statusCount} style={{ backgroundColor: statusColors.READY }}>
            {counts.READY}
          </span>
          <span>Pronto</span>
        </button>
        <button
          onClick={() => handleFilterClick("DELIVERED")}
          className={`${styles.statusCard} ${filter === "DELIVERED" ? styles.active : ""}`}
        >
          <span className={styles.statusCount} style={{ backgroundColor: statusColors.DELIVERED }}>
            {counts.DELIVERED}
          </span>
          <span>Entregue</span>
        </button>
      </div>

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Cliente</th>
              <th>Armação</th>
              <th>Valor</th>
              <th>Status</th>
              <th>Data</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ textAlign: "center", padding: "2rem" }}>
                  <Package size={48} style={{ opacity: 0.3, marginBottom: "1rem" }} />
                  <p>Nenhum pedido encontrado</p>
                </td>
              </tr>
            ) : (
              filteredOrders.map((order) => (
                <tr key={order.id}>
                  <td>{order.id.slice(0, 8)}</td>
                  <td>{order.customer.name}</td>
                  <td>{order.frame?.name || "Não selecionada"}</td>
                  <td>R$ {Number(order.totalAmount).toFixed(2)}</td>
                  <td>
                    <span
                      className={styles.statusBadge}
                      style={{
                        backgroundColor: `${statusColors[order.status]}20`,
                        color: statusColors[order.status],
                      }}
                    >
                      {statusLabels[order.status]}
                    </span>
                  </td>
                  <td>
                    {new Date(order.createdAt).toLocaleDateString("pt-BR")}
                  </td>
                  <td className={styles.actions}>
                    <Link href={`/orders/${order.id}/edit`} className={styles.actionButton}>
                      <Edit size={18} />
                    </Link>
                    <button 
                      className={`${styles.actionButton} ${styles.deleteAction}`}
                      onClick={() => handleDelete(order.id)}
                      disabled={deletingId === order.id}
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="3,6 5,6 21,6"></polyline>
                        <path d="M19,6v14a2,2,0,0,1-2,2H7a2,2,0,0,1-2-2V6M8,6V4a2,2,0,0,1,2-2h4a2,2,0,0,1,2,2V6"></path>
                      </svg>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
