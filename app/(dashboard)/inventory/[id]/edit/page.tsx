"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { ArrowLeft, Save, Package } from "lucide-react"
import styles from "./page.module.css"

export default function EditProductPage() {
  const router = useRouter()
  const params = useParams()
  const productId = params?.id as string

  const [form, setForm] = useState({
    name: "",
    category: "",
    price: "",
    costPrice: "",
    stock: "",
    labCode: "",
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    async function loadProduct() {
      try {
        const res = await fetch(`/api/products/${productId}`)
        if (res.ok) {
          const data = await res.json()
          setForm({
            name: data.name,
            category: data.category,
            price: String(data.price),
            costPrice: String(data.costPrice),
            stock: String(data.stock),
            labCode: data.labCode || "",
          })
        }
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    if (productId) loadProduct()
  }, [productId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError("")

    try {
      const res = await fetch(`/api/products/${productId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          category: form.category,
          price: parseFloat(form.price.replace(",", ".")),
          costPrice: parseFloat(form.costPrice.replace(",", ".")),
          stock: parseInt(form.stock),
          labCode: form.labCode || null,
        }),
      })

      if (res.ok) {
        router.push("/inventory")
      } else {
        const data = await res.json()
        setError(data.error || "Erro ao salvar")
      }
    } catch (err) {
      setError("Erro ao salvar produto")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className={styles.pageWrapper}>
        <div className={styles.container}>
          <p style={{ color: "var(--text-secondary)" }}>Carregando...</p>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.container}>
        <button onClick={() => router.push("/inventory")} className={styles.backButton}>
          <ArrowLeft size={18} />
          Voltar
        </button>

        <h1 className={styles.title}>Editar Produto</h1>

        <div className={styles.formCard}>
          <form onSubmit={handleSubmit} className={styles.form}>
            {error && <div className={styles.error}>{error}</div>}

            <div className={styles.formGroup}>
              <label>Nome do Produto</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label>Categoria</label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                required
              >
                <option value="">Selecione</option>
                <option value="Armações">Armações</option>
                <option value="Lentes">Lentes</option>
                <option value="Acessórios">Acessórios</option>
                <option value="Soluções">Soluções</option>
                <option value="Outros">Outros</option>
              </select>
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label>Preço de Venda (R$)</label>
                <input
                  type="number"
                  step="0.01"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  placeholder="0,00"
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label>Preço de Custo (R$)</label>
                <input
                  type="number"
                  step="0.01"
                  value={form.costPrice}
                  onChange={(e) => setForm({ ...form, costPrice: e.target.value })}
                  placeholder="0,00"
                  required
                />
              </div>
            </div>

            <div className={styles.formGroup}>
              <label>Estoque</label>
              <input
                type="number"
                value={form.stock}
                onChange={(e) => setForm({ ...form, stock: e.target.value })}
                min="0"
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label>Código do Laboratório (opcional)</label>
              <input
                type="text"
                value={form.labCode}
                onChange={(e) => setForm({ ...form, labCode: e.target.value })}
                placeholder="Ex: LAB-2024-001234"
              />
            </div>

            <button type="submit" className={styles.submitBtn} disabled={saving}>
              <Save size={18} />
              {saving ? "Salvando..." : "Salvar Alterações"}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
