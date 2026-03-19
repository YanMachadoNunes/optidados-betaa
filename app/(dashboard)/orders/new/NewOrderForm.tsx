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
}

type Product = {
  id: string
  name: string
  price: number
  stock: number
  category: string
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
  const [selectedCategory, setSelectedCategory] = useState("")
  const [selectedProductId, setSelectedProductId] = useState("")
  const [quantity, setQuantity] = useState(1)

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

  const filteredProducts = selectedCategory 
    ? products.filter(p => p.category === selectedCategory)
    : []

  const selectedProduct = products.find(p => p.id === selectedProductId)

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
            <label htmlFor="customerId">Cliente *</label>
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
          <h2>Produtos do Pedido</h2>
          
          {products.length === 0 ? (
            <div className={styles.noProducts}>
              <p>Nenhum produto cadastrado.</p>
              <Link href="/inventory/new" className={styles.addProductLink}>
                Cadastrar Produto
              </Link>
            </div>
          ) : (
            <>
              <div className={styles.field}>
                <label htmlFor="category">Categoria</label>
                <select 
                  id="category"
                  value={selectedCategory}
                  onChange={(e) => {
                    setSelectedCategory(e.target.value)
                    setSelectedProductId("")
                  }}
                >
                  <option value="">Selecione uma categoria</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              {selectedCategory && (
                <>
                  <div className={styles.field} style={{ marginTop: "1rem" }}>
                    <label htmlFor="productId">Produto</label>
                    <select 
                      id="productId"
                      name="items[0][productId]"
                      value={selectedProductId}
                      onChange={(e) => setSelectedProductId(e.target.value)}
                      required={!!selectedCategory}
                    >
                      <option value="">Selecione um produto</option>
                      {filteredProducts.map((product) => (
                        <option key={product.id} value={product.id}>
                          {product.name} - R$ {product.price.toFixed(2)} (Estoque: {product.stock})
                        </option>
                      ))}
                    </select>
                  </div>

                  {selectedProduct && (
                    <div className={styles.productSummary}>
                      <div className={styles.summaryRow}>
                        <span>Preço:</span>
                        <strong>R$ {selectedProduct.price.toFixed(2)}</strong>
                      </div>
                      <div className={styles.summaryRow}>
                        <span>Estoque:</span>
                        <strong>{selectedProduct.stock} unidades</strong>
                      </div>
                    </div>
                  )}

                  <div className={styles.field} style={{ marginTop: "1rem" }}>
                    <label htmlFor="quantity">Quantidade</label>
                    <input
                      type="number"
                      id="quantity"
                      name="items[0][quantity]"
                      value={quantity}
                      onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                      min={1}
                      max={selectedProduct?.stock || 1}
                    />
                  </div>
                </>
              )}
            </>
          )}
        </div>

        <div className={styles.actions}>
          <Link href="/orders" className={styles.cancelButton}>
            Cancelar
          </Link>
          <button 
            type="submit" 
            className={styles.submitButton}
            disabled={products.length === 0}
          >
            <Save size={20} />
            Criar Pedido
          </button>
        </div>
      </form>
    </div>
  )
}
