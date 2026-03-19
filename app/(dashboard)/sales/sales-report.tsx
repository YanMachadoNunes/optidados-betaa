"use client";

import { useState } from "react";
import { Download, Calendar } from "lucide-react";
import styles from "./page.module.css";

type Sale = {
  id: string;
  createdAt: Date;
  customer: { name: string } | null;
  user: { name: string } | null;
  totalAmount: number;
  paymentMethod: string | null;
  status: string;
};

type SalesReportProps = {
  sales: Sale[];
};

export default function SalesReport({ sales }: SalesReportProps) {
  const [loading, setLoading] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  async function handleExport() {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set("format", "csv");
      if (startDate) params.set("startDate", startDate);
      if (endDate) params.set("endDate", endDate);

      const response = await fetch(`/api/reports/sales?${params.toString()}`);
      
      if (!response.ok) throw new Error("Erro ao exportar");
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `relatorio-vendas-${new Date().toISOString().split("T")[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      alert("Erro ao exportar relatório");
    } finally {
      setLoading(false);
    }
  }

  const filteredSales = sales.filter(sale => {
    if (startDate && new Date(sale.createdAt) < new Date(startDate)) return false;
    if (endDate) {
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      if (new Date(sale.createdAt) > end) return false;
    }
    return true;
  });

  const totalGeral = filteredSales.reduce((acc, s) => acc + Number(s.totalAmount), 0);

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const paymentLabels: Record<string, string> = {
    DINHEIRO: "Dinheiro",
    CREDITO: "Cartão de Crédito",
    DEBITO: "Cartão de Débito",
    PIX: "PIX",
    PARCELADO: "Parcelado",
  };

  return (
    <div className={styles.card}>
      <div className={styles.filterSection}>
        <div className={styles.row}>
          <div className={styles.field}>
            <label className={styles.label}>Data Inicial</label>
            <input
              type="date"
              className={styles.input}
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Data Final</label>
            <input
              type="date"
              className={styles.input}
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className={styles.tableContainer}>
        {filteredSales.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>📋</div>
            <p>Nenhuma venda encontrada</p>
          </div>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Data</th>
                <th>Cliente</th>
                <th>Pagamento</th>
                <th>Status</th>
                <th className={styles.textRight}>Valor</th>
              </tr>
            </thead>
            <tbody>
              {filteredSales.map((sale) => (
                <tr key={sale.id}>
                  <td>
                    <div className={styles.saleDate}>
                      <Calendar size={16} />
                      {formatDate(sale.createdAt)}
                    </div>
                  </td>
                  <td className={styles.customerName}>
                    {sale.customer?.name || "Venda Avulsa"}
                  </td>
                  <td className={styles.paymentMethod}>
                    {sale.paymentMethod ? paymentLabels[sale.paymentMethod] || sale.paymentMethod : "-"}
                  </td>
                  <td>
                    <span className={sale.status === "COMPLETED" ? styles.statusCompleted : styles.statusPending}>
                      {sale.status === "COMPLETED" ? "Concluída" : "Pendente"}
                    </span>
                  </td>
                  <td className={styles.textRight}>
                    <span className={styles.saleAmount}>
                      R$ {Number(sale.totalAmount ?? 0).toLocaleString("pt-BR", {
                        minimumFractionDigits: 2,
                      })}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className={styles.actions}>
        <div className={styles.totalInfo}>
          <span className={styles.totalLabel}>Total:</span>
          <span className={styles.totalValue}>
            R$ {totalGeral.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
          </span>
        </div>
        <button 
          className={styles.exportButton} 
          onClick={handleExport}
          disabled={loading || filteredSales.length === 0}
        >
          <Download size={18} />
          {loading ? "Exportando..." : "Exportar CSV"}
        </button>
      </div>
    </div>
  );
}
