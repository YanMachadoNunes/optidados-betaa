"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, Save } from "lucide-react"
import { createOrderAction } from "../server-actions"
import styles from "./page.module.css"

type Customer = {
  id: string
  name: string
  phone: string | null
  prescriptions?: Prescription[]
}

type Prescription = {
  id: string
  doctorName: string | null
  examDate: string
  odSpherical: string
  oeSpherical: string
}

type Frame = {
  id: string
  name: string
  price: number
  stock: number
}

type Lens = {
  id: string
  name: string
  price: number
}

type NewOrderFormProps = {
  customers: Customer[]
  frames: Frame[]
  lenses: Lens[]
}

export default function NewOrderForm({ customers, frames, lenses }: NewOrderFormProps) {
  const [selectedCustomerId, setSelectedCustomerId] = useState("")
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([])
  const [selectedPrescriptionId, setSelectedPrescriptionId] = useState("")

  useEffect(() => {
    if (selectedCustomerId) {
      const customer = customers.find(c => c.id === selectedCustomerId)
      if (customer && (customer as any).prescriptions) {
        setPrescriptions((customer as any).prescriptions)
      } else {
        fetch(`/api/customers/${selectedCustomerId}/prescriptions`)
          .then(res => res.json())
          .then(data => setPrescriptions(data))
          .catch(() => setPrescriptions([]))
      }
    } else {
      setPrescriptions([])
      setSelectedPrescriptionId("")
    }
  }, [selectedCustomerId, customers])

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

      <form className={styles.form} action={createOrderAction}>
        <div className={styles.section}>
          <h2>Informações do Cliente</h2>
          <div className={styles.field}>
            <label htmlFor="customerId">Cliente</label>
            <select 
              id="customerId" 
              name="customerId" 
              required
              value={selectedCustomerId}
              onChange={(e) => setSelectedCustomerId(e.target.value)}
            >
              <option value="">Selecione um cliente</option>
              {customers.map((customer) => (
                <option key={customer.id} value={customer.id}>
                  {customer.name} {customer.phone ? `(${customer.phone})` : ""}
                </option>
              ))}
            </select>
          </div>

          {prescriptions.length > 0 && (
            <div className={styles.field} style={{ marginTop: "1rem" }}>
              <label htmlFor="prescriptionId">Receita do Cliente</label>
              <select 
                id="prescriptionId" 
                name="prescriptionId"
                value={selectedPrescriptionId}
                onChange={(e) => setSelectedPrescriptionId(e.target.value)}
              >
                <option value="">Sem receita</option>
                {prescriptions.map((rx) => (
                  <option key={rx.id} value={rx.id}>
                    {rx.doctorName || "Dr. Não informado"} - {new Date(rx.examDate).toLocaleDateString("pt-BR")}
                  </option>
                ))}
              </select>
            </div>
          )}
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
                    {frame.name} - R$ {frame.price.toFixed(2)} (Estoque: {frame.stock})
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
                      {lens.name} - R$ {lens.price.toFixed(2)}
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
  )
}
