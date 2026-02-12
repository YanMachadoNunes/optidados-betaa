import { prisma } from "../../../lib/prisma"; // Caminho relativo para sua lib
import SalesForm from "./sales-form";
import style from "./page.module.css";
import Link from "next/link";
import { unstable_noStore as noStore } from "next/cache";

export default async function NewSalePage() {
  noStore();
  // 1. Buscar Produtos (apenas os ativos e com estoque, opcionalmente)
  const productsRaw = await prisma.product.findMany({
    orderBy: { name: "asc" },
  });

  // 2. Buscar Clientes (para o select)
  const customers = await prisma.customer.findMany({
    orderBy: { name: "asc" },
    select: { id: true, name: true, cpf: true }, // Trazendo só o necessário pra ficar leve
  });

  // 3. Serializar (Converter Decimal do Prisma para Number do JS para o Client Component não chorar)
  const products = productsRaw.map((p) => ({
    id: p.id,
    name: p.name,
    price: Number(p.price), // O segredo está aqui
    stock: p.stock,
  }));

  return (
    <div className={style.pageWrapper}>
      <div style={{ width: "100%", maxWidth: "1200px", marginBottom: "1rem" }}>
        <Link
          href="/sales"
          style={{ color: "#64748b", textDecoration: "none", fontWeight: 600 }}
        >
          ← Voltar para Histórico
        </Link>
      </div>

      {/* Aqui a gente entrega os dados pro Motor */}
      <SalesForm products={products} customers={customers} />
    </div>
  );
}
