import prisma from "@/lib/utils";
import SalesForm from "./sales-form";
import style from "./page.module.css";
import Link from "next/link";
import { unstable_noStore as noStore } from "next/cache";
import { ShoppingCart } from "lucide-react";

export default async function NewSalePage() {
  noStore();
  
  const productsRaw = await prisma.product.findMany({
    orderBy: { name: "asc" },
  });

  const customers = await prisma.customer.findMany({
    orderBy: { name: "asc" },
    select: { id: true, name: true, cpf: true },
  });

  const products = productsRaw.map((p) => ({
    id: p.id,
    name: p.name,
    price: Number(p.price),
    stock: p.stock,
    category: p.category,
  }));

  return (
    <div className={style.pageWrapper}>
      <div className={style.header}>
        <div className={style.headerLeft}>
          <Link href="/sales" className={style.backLink}>
            ← Voltar
          </Link>
          <div>
            <h1 className={style.title}>Nova Venda</h1>
            <p className={style.subtitle}>
              <ShoppingCart size={16} style={{ verticalAlign: 'middle', marginRight: '0.5rem' }} />
              Selecione os produtos para adicionar ao carrinho
            </p>
          </div>
        </div>
      </div>

      <SalesForm products={products} customers={customers} />
    </div>
  );
}
