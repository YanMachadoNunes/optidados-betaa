import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import styles from "./page.module.css"

export const dynamic = "force-dynamic"

const statusLabels: Record<string, string> = {
  PENDING: "Pendente",
  IN_ASSEMBLY: "Em Montagem",
  READY: "Pronto",
  DELIVERED: "Entregue",
}

const statusColors: Record<string, string> = {
  PENDING: "#f59e0b",
  IN_ASSEMBLY: "#3b82f6",
  READY: "#10b981",
  DELIVERED: "#6b7280",
}

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      customer: true,
      prescription: true,
      items: {
        include: {
          product: true,
        },
      },
    },
  })

  if (!order) {
    notFound()
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <Link href="/orders" className={styles.backButton}>
            <ArrowLeft size={20} />
          </Link>
          <h1>Pedido #{order.id.slice(0, 8)}</h1>
        </div>
      </div>

      <div className={styles.statusBar}>
        <span
          className={styles.statusBadge}
          style={{
            backgroundColor: `${statusColors[order.status]}20`,
            color: statusColors[order.status],
          }}
        >
          {statusLabels[order.status]}
        </span>
      </div>

      <div className={styles.grid}>
        <div className={styles.card}>
          <h2>Informações do Cliente</h2>
          <div className={styles.info}>
            <p><strong>Nome:</strong> {order.customer.name}</p>
            <p><strong>Telefone:</strong> {order.customer.phone || "Não informado"}</p>
            <p><strong>Email:</strong> {order.customer.email || "Não informado"}</p>
            <p><strong>CPF:</strong> {order.customer.cpf || "Não informado"}</p>
          </div>
        </div>

        <div className={styles.card}>
          <h2>Detalhes do Pedido</h2>
          <div className={styles.info}>
            <p><strong>Data de Criação:</strong> {new Date(order.createdAt).toLocaleDateString("pt-BR")}</p>
            <p><strong>Forma de Pagamento:</strong> {order.paymentMethod || "Não informado"}</p>
            <p><strong>Valor Total:</strong> R$ {Number(order.totalAmount).toFixed(2)}</p>
          </div>
        </div>

        {!order.prescription ? (
          <div className={styles.card}>
            <h2>Receita</h2>
            <div className={styles.emptyCard}>
              <p>Sem receita vinculada</p>
              <Link href={`/customers/${order.customer.id}/prescriptions/new`} className={styles.addBtn}>
                + Adicionar Receita
              </Link>
            </div>
          </div>
        ) : (
          <div className={styles.card}>
            <h2>Receita</h2>
            <div className={styles.info}>
              <p><strong>Médico:</strong> {order.prescription.doctorName}</p>
              <p><strong>CRM:</strong> {order.prescription.crm}</p>
              <div className={styles.prescriptionGrid}>
                <div>
                  <strong>Olho Direito (OD)</strong>
                  <p>ESF: {order.prescription.odSpherical}</p>
                  <p>CIL: {order.prescription.odCylindrical}</p>
                  <p>Eixo: {order.prescription.odAxis}</p>
                </div>
                <div>
                  <strong>Olho Esquerdo (OE)</strong>
                  <p>ESF: {order.prescription.oeSpherical}</p>
                  <p>CIL: {order.prescription.oeCylindrical}</p>
                  <p>Eixo: {order.prescription.oeAxis}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {order.items.length > 0 && (
          <div className={styles.cardFull}>
            <h2>Resumo dos Itens</h2>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Produto</th>
                  <th>Quantidade</th>
                  <th>Preço Unitário</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((item: any) => (
                  <tr key={item.id}>
                    <td>{item.product.name}</td>
                    <td>{item.quantity}</td>
                    <td>R$ {Number(item.unitPrice).toFixed(2)}</td>
                    <td>R$ {(Number(item.unitPrice) * item.quantity).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
