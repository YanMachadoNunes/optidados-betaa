"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import style from "./page.module.css"
import { Building2, Phone, Mail, MapPin, FileText, Save, ArrowLeft } from "lucide-react"

interface StoreData {
  id: string
  name: string
  cnpj: string | null
  ie: string | null
  address: string | null
  city: string | null
  state: string | null
  zipCode: string | null
  phone: string | null
  email: string | null
}

export default function StoreSettingsPage() {
  const [data, setData] = useState<StoreData | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const res = await fetch("/api/store")
      if (res.ok) {
        const storeData = await res.json()
        setData(storeData)
      }
    } catch (error) {
      console.error("Erro ao buscar dados:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSaving(true)
    setSaved(false)

    const formData = new FormData(e.currentTarget)

    try {
      const res = await fetch("/api/store", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.get("name"),
          cnpj: formData.get("cnpj"),
          ie: formData.get("ie"),
          address: formData.get("address"),
          city: formData.get("city"),
          state: formData.get("state"),
          zipCode: formData.get("zipCode"),
          phone: formData.get("phone"),
          email: formData.get("email"),
        }),
      })

      if (res.ok) {
        setSaved(true)
        fetchData()
      }
    } catch (error) {
      console.error("Erro ao salvar:", error)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className={style.container}>
        <div className={style.loading}>Carregando...</div>
      </div>
    )
  }

  return (
    <div className={style.container}>
      <header className={style.header}>
        <Link href="/settings" className={style.backLink}>
          <ArrowLeft size={20} />
          Voltar
        </Link>
        <div>
          <h1 className={style.title}>Dados da Loja</h1>
          <p className={style.subtitle}>
            Configure as informações da sua empresa
          </p>
        </div>
      </header>

      <form onSubmit={handleSubmit} className={style.form}>
        <div className={style.section}>
          <div className={style.sectionHeader}>
            <Building2 size={20} />
            <h2>Informações da Empresa</h2>
          </div>
          
          <div className={style.grid}>
            <div className={style.field}>
              <label>Nome da Loja *</label>
              <input
                type="text"
                name="name"
                defaultValue={data?.name || ""}
                required
                placeholder="OptiGestão"
              />
            </div>
            <div className={style.field}>
              <label>CNPJ</label>
              <input
                type="text"
                name="cnpj"
                defaultValue={data?.cnpj || ""}
                placeholder="00.000.000/0000-00"
              />
            </div>
            <div className={style.field}>
              <label>Inscrição Estadual</label>
              <input
                type="text"
                name="ie"
                defaultValue={data?.ie || ""}
                placeholder="000.000.000.000"
              />
            </div>
          </div>
        </div>

        <div className={style.section}>
          <div className={style.sectionHeader}>
            <MapPin size={20} />
            <h2>Endereço</h2>
          </div>
          
          <div className={style.fieldFull}>
            <label>Endereço</label>
            <input
              type="text"
              name="address"
              defaultValue={data?.address || ""}
              placeholder="Rua, número, bairro"
            />
          </div>

          <div className={style.grid3}>
            <div className={style.field}>
              <label>Cidade</label>
              <input
                type="text"
                name="city"
                defaultValue={data?.city || ""}
                placeholder="Cidade"
              />
            </div>
            <div className={style.field}>
              <label>Estado</label>
              <input
                type="text"
                name="state"
                defaultValue={data?.state || ""}
                placeholder="SP"
                maxLength={2}
              />
            </div>
            <div className={style.field}>
              <label>CEP</label>
              <input
                type="text"
                name="zipCode"
                defaultValue={data?.zipCode || ""}
                placeholder="00000-000"
              />
            </div>
          </div>
        </div>

        <div className={style.section}>
          <div className={style.sectionHeader}>
            <Phone size={20} />
            <h2>Contato</h2>
          </div>
          
          <div className={style.grid}>
            <div className={style.field}>
              <label>Telefone</label>
              <input
                type="text"
                name="phone"
                defaultValue={data?.phone || ""}
                placeholder="(11) 99999-9999"
              />
            </div>
            <div className={style.field}>
              <label>E-mail</label>
              <input
                type="email"
                name="email"
                defaultValue={data?.email || ""}
                placeholder="contato@empresa.com"
              />
            </div>
          </div>
        </div>

        <div className={style.actions}>
          {saved && (
            <span className={style.savedMsg}>Alterações salvas!</span>
          )}
          <button type="submit" className={style.saveBtn} disabled={saving}>
            <Save size={18} />
            {saving ? "Salvando..." : "Salvar Alterações"}
          </button>
        </div>
      </form>
    </div>
  )
}
