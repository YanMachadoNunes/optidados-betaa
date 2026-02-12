import styles from "./page.module.css";
import { prisma } from "../../lib/prisma";
import Link from "next/link";
import { unstable_noStore as noStore } from "next/cache";

export default async function SalesHistory() {
  noStore();
  const sales = await prisma.sale.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      customer: {
        select: { name: true }
      }
    }
  });

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.container}>
        <header className={styles.header}>
          <h1 className={styles.title}>Histórico de Vendas</h1>
        </header>

        <main className={styles.card}>
          <div className={styles.filterSection}>
            <div className={styles.row}>
              <div className={styles.field}>
                <label className={styles.label}>Filtrar por Cliente</label>
                <input
                  type="text"
                  className={styles.input}
                  placeholder="Ex: Venda Avulsa..."
                />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Data</label>
                <input type="date" className={styles.input} />
              </div>
            </div>
          </div>

          <div className={styles.tableContainer}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Data</th>
                  <th>Cliente</th>
                  <th className={styles.textRight}>Valor</th>
                </tr>
              </thead>
              <tbody>
                {sales.map((sale) => (
                  <tr key={sale.id}>
                    <td>
                      {new Date(sale.createdAt).toLocaleDateString("pt-BR")}
                    </td>
                    <td>{sale.customer?.name || "Venda Avulsa"}</td>
                    <td className={styles.textRight}>
                      R${" "}
                      {Number(sale.totalAmount ?? 0).toLocaleString("pt-BR", {
                        minimumFractionDigits: 2,
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {sales.length === 0 && (
              <p
                style={{
                  padding: "2rem",
                  textAlign: "center",
                  color: "#64748b",
                }}
              >
                Nenhuma venda encontrada.
              </p>
            )}
          </div>

          <button className={styles.submitButton}>Exportar Relatório</button>
        </main>
      </div>
    </div>
  );
}
