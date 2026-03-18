import styles from "./page.module.css";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { unstable_noStore as noStore } from "next/cache";
import SalesReport from "./sales-report";

export default async function SalesHistory() {
  noStore();
  const salesRaw = await prisma.sale.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      customer: {
        select: { name: true, phone: true }
      },
      user: {
        select: { name: true }
      }
    }
  });

  const sales = salesRaw.map(sale => ({
    ...sale,
    totalAmount: Number(sale.totalAmount)
  }));

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.container}>
        <header className={styles.header}>
          <div>
            <h1 className={styles.title}>Histórico de Vendas</h1>
            <p className={styles.subtitle}>
              {sales.length} vendas registradas
            </p>
          </div>
          <Link href="/sales/new" className={styles.submitButton}>
            + Nova Venda
          </Link>
        </header>

        <SalesReport sales={sales} />
      </div>
    </div>
  );
}
