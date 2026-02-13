import styles from "./page.module.css";
import { prisma } from "../../lib/prisma";
import Link from "next/link";
import { unstable_noStore as noStore } from "next/cache";

export default async function InventoryPage() {
  noStore();
  // Busca todos os produtos cadastrados
  const products = await prisma.product.findMany({
    orderBy: { name: "asc" },
  });

  // Cálculos rápidos para o Comandante
  const totalProducts = products.length;
  const lowStockCount = products.filter((p) => p.stock <= 5).length; // Alerta para menos de 5 unidades

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.container}>
        <header className={styles.header}>
          <div>
            <h1 className={styles.title}>Gerenciar Estoque</h1>
            <p className={styles.subtitle}>
              Controle total de produtos e reposição.
            </p>
          </div>
          <Link href="/inventory/new" className={styles.newButton}>
            + Novo Produto
          </Link>
        </header>

        {/* MÉTRICAS DE ESTOQUE */}
        <div className={styles.metricsRow}>
          <div className={styles.miniCard}>
            <span className={styles.label}>Total de Itens</span>
            <span className={styles.value}>{totalProducts}</span>
          </div>
          <div
            className={`${styles.miniCard} ${lowStockCount > 0 ? styles.alertBorder : ""}`}
          >
            <span className={styles.label}>Estoque Baixo</span>
            <span
              className={`${styles.value} ${lowStockCount > 0 ? styles.redText : ""}`}
            >
              {lowStockCount}
            </span>
          </div>
        </div>

        {/* TABELA DE PRODUTOS */}
        <section className={styles.card}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Produto</th>
                <th>Categoria</th>
                <th>Preço Venda</th>
                <th>Estoque</th>
                <th className={styles.textRight}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id}>
                  <td style={{ fontWeight: 700 }}>{product.name}</td>
                  <td>
                    <span className={styles.categoryBadge}>
                      {product.category}
                    </span>
                  </td>
                  <td className={styles.mono}>
                    {Number(product.price ?? 0).toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </td>
                  <td>
                    <span
                      className={
                        product.stock <= 5 ? styles.lowStock : styles.goodStock
                      }
                    >
                      {product.stock} unidades
                    </span>
                  </td>
                  <td className={styles.textRight}>
                    <button className={styles.editBtn}>Editar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {products.length === 0 && (
            <div className={styles.emptyState}>Nenhum produto cadastrado.</div>
          )}
        </section>
      </div>
    </div>
  );
}
