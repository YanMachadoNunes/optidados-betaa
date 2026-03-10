import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";
import styles from "./page.module.css";

export const dynamic = "force-dynamic";

export default async function NewOrderPage() {
  const customers = await prisma.customer.findMany({
    select: { id: true, name: true, phone: true },
    orderBy: { name: "asc" },
  });

  const frames = await prisma.product.findMany({
    where: { category: "ARMACAO", stock: { gt: 0 } },
    select: { id: true, name: true, price: true, stock: true },
    orderBy: { name: "asc" },
  });

  const lenses = await prisma.product.findMany({
    where: { category: "LENTE" },
    select: { id: true, name: true, price: true },
    orderBy: { name: "asc" },
  });

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <Link href="/orders" className={styles.backButton}>
            <ArrowLeft size={20} />
          </Link>
          <h1>Novo Pedido</h1>
        </div>
      </div>

      <form className={styles.form} action={"/api/orders"} method="POST">
        <div className={styles.section}>
          <h2>Informações do Cliente</h2>
          <div className={styles.field}>
            <label htmlFor="customerId">Cliente</label>
            <select id="customerId" name="customerId" required>
              <option value="">Selecione um cliente</option>
              {customers.map((customer) => (
                <option key={customer.id} value={customer.id}>
                  {customer.name} {customer.phone ? `(${customer.phone})` : ""}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className={styles.section}>
          <h2>Detalhes do Pedido</h2>
          <div className={styles.grid}>
            <div className={styles.field}>
              <label htmlFor="frameId">Armação</label>
              <select id="frameId" name="frameId">
                <option value="">Selecione uma armação</option>
                {frames.map((frame) => (
                  <option key={frame.id} value={frame.id}>
                    {frame.name} - R$ {Number(frame.price).toFixed(2)} (Estoque: {frame.stock})
                  </option>
                ))}
              </select>
            </div>
            <div className={styles.field}>
              <label htmlFor="paymentMethod">Forma de Pagamento</label>
              <select id="paymentMethod" name="paymentMethod">
                <option value="">Selecione</option>
                <option value="DINHEIRO">Dinheiro</option>
                <option value="CREDITO">Cartão de Crédito</option>
                <option value="DEBITO">Cartão de Débito</option>
                <option value="PIX">PIX</option>
                <option value="PARCELADO">Parcelado</option>
              </select>
            </div>
          </div>
        </div>

        <div className={styles.section}>
          <h2>Itens do Pedido</h2>
          <div className={styles.itemsContainer}>
            <div className={styles.itemRow}>
              <div className={styles.field}>
                <label htmlFor="lensId">Lente</label>
                <select id="lensId" name="items[0][productId]">
                  <option value="">Selecione uma lente</option>
                  {lenses.map((lens) => (
                    <option key={lens.id} value={lens.id}>
                      {lens.name} - R$ {Number(lens.price).toFixed(2)}
                    </option>
                  ))}
                </select>
              </div>
              <div className={styles.field}>
                <label htmlFor="quantity">Quantidade</label>
                <input
                  type="number"
                  id="quantity"
                  name="items[0][quantity]"
                  defaultValue={1}
                  min={1}
                />
              </div>
            </div>
          </div>
        </div>

        <div className={styles.actions}>
          <Link href="/orders" className={styles.cancelButton}>
            Cancelar
          </Link>
          <button type="submit" className={styles.submitButton}>
            <Save size={20} />
            Criar Pedido
          </button>
        </div>
      </form>
    </div>
  );
}
