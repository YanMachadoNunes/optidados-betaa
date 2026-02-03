import { prisma } from "../../lib/prisma";
import Link from "next/link";
import { deleteProduct } from "../customers/actions";
import style from "./page.module.css"; // Vamos criar esse CSS já já

export default async function InventoryPage() {
  const products = await prisma.product.findMany({
    orderBy: { name: "asc" },
  });

  return (
    <div className={style.pageWrapper}>
      <div className={style.container}>
        {/* Cabeçalho */}
        <div className={style.header}>
          <div>
            <h1 className={style.title}>Gestão de Estoque</h1>
            <p className={style.subtitle}>
              {products.length} produtos cadastrados
            </p>
          </div>
          <Link href="/inventory/new" className={style.newButton}>
            + Novo Produto
          </Link>
        </div>

        {/* Tabela de Produtos */}
        <div className={style.card}>
          <table className={style.table}>
            <thead>
              <tr>
                <th>Produto</th>
                <th>Categoria</th>
                <th>Custo</th>
                <th>Venda</th>
                <th>Estoque</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id}>
                  <td style={{ fontWeight: 600 }}>{product.name}</td>
                  <td>
                    <span className={style.categoryBadge}>
                      {product.category}
                    </span>
                  </td>
                  <td className={style.mono}>
                    R$ {Number(product.costPrice).toFixed(2)}
                  </td>
                  <td className={style.mono} style={{ color: "#166534" }}>
                    R$ {Number(product.price).toFixed(2)}
                  </td>
                  <td>
                    <span
                      className={
                        product.stock < 5 ? style.lowStock : style.goodStock
                      }
                    >
                      {product.stock} un
                    </span>
                  </td>
                  <td>
                    <form
                      action={async () => {
                        "use server";
                        await deleteProduct(product.id);
                      }}
                    >
                      <button type="submit" className={style.deleteBtn}>
                        Excluir
                      </button>
                    </form>
                  </td>
                </tr>
              ))}
              {products.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    style={{
                      textAlign: "center",
                      padding: "2rem",
                      color: "#64748b",
                    }}
                  >
                    Nenhum produto no estoque. Comece cadastrando um!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
