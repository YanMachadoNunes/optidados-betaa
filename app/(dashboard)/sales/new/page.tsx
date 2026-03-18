import prisma from "@/lib/utils";
import SalesForm from "./sales-form";
import style from "./page.module.css";
import Link from "next/link";
import { unstable_noStore as noStore } from "next/cache";

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
      <Link href="/sales" className={style.backLink}>
        ← Voltar para Histórico
      </Link>

      <SalesForm products={products} customers={customers} />
    </div>
  );
}
