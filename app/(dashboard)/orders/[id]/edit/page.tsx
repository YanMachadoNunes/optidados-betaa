import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, Save } from "lucide-react"
import { updateOrderAction } from "../../server-actions"
import styles from "./page.module.css"

export const dynamic = "force-dynamic"

export default async function EditOrderPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      customer: true,
      items: {
        include: {
          product: true,
        },
      },
      prescription: true,
    },
  })

  if (!order) {
    notFound()
  }

  const statusLabels: Record<string, string> = {
    PENDING: "Pendente",
    IN_ASSEMBLY: "Em Montagem",
    READY: "Pronto",
    DELIVERED: "Entregue",
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <Link href={`/orders/${id}`} className={styles.backButton}>
            <ArrowLeft size={20} />
          </Link>
          <h1>Editar Pedido</h1>
        </div>
      </div>

      <form className={styles.form} action={updateOrderAction}>
        <input type="hidden" name="orderId" value={id} />
        
        <div className={styles.section}>
          <h2>Status do Pedido</h2>
          <div className={styles.field}>
            <label htmlFor="status">Status</label>
            <select id="status" name="status" defaultValue={order.status}>
              <option value="PENDING">Pendente</option>
              <option value="IN_ASSEMBLY">Em Montagem</option>
              <option value="READY">Pronto</option>
              <option value="DELIVERED">Entregue</option>
            </select>
          </div>
        </div>

        <div className={styles.section}>
          <h2>Informações do Pedido</h2>
          <div className={styles.info}>
            <p><strong>Cliente:</strong> {order.customer.name}</p>
            <p><strong>Valor Total:</strong> R$ {Number(order.totalAmount).toFixed(2)}</p>
            <p><strong>Forma de Pagamento:</strong> {order.paymentMethod || "Não informada"}</p>
            <p><strong>Data:</strong> {new Date(order.createdAt).toLocaleDateString("pt-BR")}</p>
          </div>
        </div>

        <div className={styles.section}>
          <h2>Produtos</h2>
          <div className={styles.productsList}>
            {order.items.map((item) => (
              <div key={item.id} className={styles.productItem}>
                <span className={styles.productName}>{item.product.name}</span>
                <span className={styles.productQty}>x{item.quantity}</span>
                <span className={styles.productPrice}>R$ {Number(item.unitPrice).toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.actions}>
          <Link href={`/orders/${id}`} className={styles.cancelButton}>
            Cancelar
          </Link>
          <button type="submit" className={styles.submitButton}>
            <Save size={20} />
            Salvar Alterações
          </button>
        </div>
      </form>
    </div>
  )
}
