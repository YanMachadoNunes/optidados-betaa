"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, Save, Plus, Trash2 } from "lucide-react"
import { createOrderAction } from "../server-actions"
import styles from "./page.module.css"

type Customer = {
  id: string
  name: string
  phone: string | null
}

type Product = {
  id: string
  name: string
  price: number
  stock: number
  category: string
}

type OrderItem = {
  productId: string
  quantity: number
}

type NewOrderFormProps = {
  customers: Customer[]
  products: Product[]
  categories: string[]
}

export default function NewOrderForm({ customers, products, categories }: NewOrderFormProps) {
  const [selectedCustomerId, setSelectedCustomerId] = useState("")
  const [prescriptions, setPrescriptions] = useState<any[]>([])
  const [selectedPrescriptionId, setSelectedPrescriptionId] = useState("")
  const [paymentMethod, setPaymentMethod] = useState("")
  const [items, setItems] = useState<OrderItem[]>([])
  const [frameId, setFrameId] = useState("")

  useEffect(() => {
    if (selectedCustomerId) {
      fetch(`/api/customers/${selectedCustomerId}/prescriptions`)
        .then(res => res.json())
        .then(data => setPrescriptions(data || []))
        .catch(() => setPrescriptions([]))
    } else {
      setPrescriptions([])
      setSelectedPrescriptionId("")
    }
  }, [selectedCustomerId])

  const addItem = () => {
    setItems([...items, { productId: "", quantity: 1 }])
  }

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index))
  }

  const updateItem = (index: number, field: keyof OrderItem, value: string | number) => {
    const newItems = [...items]
    newItems[index] = { ...newItems[index], [field]: value }
    setItems(newItems)
  }

  const getProductsByCategory = (category: string) => {
    return products.filter(p => p.category === category)
  }

  const getProduct = (id: string) => products.find(p => p.id === id)

  const totalAmount = items.reduce((sum, item) => {
    const product = getProduct(item.productId)
    return sum + (product ? product.price * item.quantity : 0)
  }, 0)

  const frames = products.filter(p => p.category === "Armações")

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    if (items.length === 0 && !frameId) {
      e.preventDefault()
      alert("Adicione pelo menos um produto ao pedido")
      return
    }
  }

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

      <form className={styles.form} action={createOrderAction} onSubmit={handleSubmit}>
        <input type="hidden" name="customerId" value={selectedCustomerId} />
        <input type="hidden" name="prescriptionId" value={selectedPrescriptionId} />
        <input type="hidden" name="paymentMethod" value={paymentMethod} />
        <input type="hidden" name="frameId" value={frameId} />
        <input type="hidden" name="totalAmount" value={totalAmount} />

        <div className={styles.section}>
          <h2>Informações do Cliente</h2>
          <div className={styles.field}>
            <label>Cliente *</label>
            <select 
              value={selectedCustomerId}
              onChange={(e) => setSelectedCustomerId(e.target.value)}
              required
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
            <div className={styles.field}>
              <label>Receita do Cliente</label>
              <select 
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
          <h2>Armação</h2>
          {frames.length > 0 ? (
            <div className={styles.field}>
              <label>Selecione a Armação</label>
              <select 
                value={frameId}
                onChange={(e) => setFrameId(e.target.value)}
              >
                <option value="">Nenhuma armação</option>
                {frames.map((frame) => (
                  <option key={frame.id} value={frame.id}>
                    {frame.name} - R$ {frame.price.toFixed(2)} (Estoque: {frame.stock})
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <p className={styles.noProducts}>
              Nenhuma armação cadastrada. <Link href="/inventory/new">Cadastrar armação</Link>
            </p>
          )}
        </div>

        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2>Produtos (Lentes e Outros)</h2>
            <button type="button" onClick={addItem} className={styles.addBtn}>
              <Plus size={16} />
              Adicionar Produto
            </button>
          </div>
          
          {items.length === 0 ? (
            <p className={styles.noProducts}>
              Nenhum produto adicionado. <button type="button" onClick={addItem} className={styles.linkBtn}>Adicionar produto</button>
            </p>
          ) : (
            <div className={styles.itemsList}>
              {items.map((item, index) => {
                const product = getProduct(item.productId)
                const availableCategories = [...new Set(products.map(p => p.category))]
                
                return (
                  <div key={index} className={styles.itemCard}>
                    <div className={styles.itemHeader}>
                      <span>Produto {index + 1}</span>
                      <button type="button" onClick={() => removeItem(index)} className={styles.removeBtn}>
                        <Trash2 size={16} />
                      </button>
                    </div>
                    
                    <div className={styles.itemFields}>
                      <div className={styles.field}>
                        <label>Categoria</label>
                        <select
                          value={product?.category || ""}
                          onChange={(e) => updateItem(index, "productId", "")}
                        >
                          <option value="">Selecione</option>
                          {availableCategories.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                          ))}
                        </select>
                      </div>
                      
                      {product?.category && (
                        <div className={styles.field}>
                          <label>Produto</label>
                          <select
                            value={item.productId}
                            onChange={(e) => updateItem(index, "productId", e.target.value)}
                            required
                          >
                            <option value="">Selecione</option>
                            {getProductsByCategory(product.category).map(p => (
                              <option key={p.id} value={p.id}>
                                {p.name} - R$ {p.price.toFixed(2)}
                              </option>
                            ))}
                          </select>
                        </div>
                      )}
                      
                      {product && (
                        <div className={styles.field}>
                          <label>Quantidade</label>
                          <input
                            type="number"
                            value={item.quantity}
                            onChange={(e) => updateItem(index, "quantity", Math.max(1, parseInt(e.target.value) || 1))}
                            min={1}
                            max={product.stock}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        <div className={styles.section}>
          <h2>Pagamento</h2>
          <div className={styles.field}>
            <label>Forma de Pagamento</label>
            <select 
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
            >
              <option value="">Selecione</option>
              <option value="DINHEIRO">Dinheiro</option>
              <option value="CREDITO">Cartão de Crédito</option>
              <option value="DEBITO">Cartão de Débito</option>
              <option value="PIX">PIX</option>
              <option value="PARCELADO">Parcelado</option>
            </select>
          </div>
        </div>

        <div className={styles.totalSection}>
          <div className={styles.totalInfo}>
            <span>Total do Pedido:</span>
            <span className={styles.totalValue}>R$ {totalAmount.toFixed(2)}</span>
          </div>
        </div>

        <div className={styles.actions}>
          <Link href="/orders" className={styles.cancelButton}>
            Cancelar
          </Link>
          <button 
            type="submit" 
            className={styles.submitButton}
            disabled={!selectedCustomerId || (items.length === 0 && !frameId)}
          >
            <Save size={20} />
            Criar Pedido
          </button>
        </div>
      </form>
    </div>
  )
}
