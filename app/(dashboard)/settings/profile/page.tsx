"use client"

import { useAuth } from "../../../context/AuthContext"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Save, Check, Camera } from "lucide-react"
import style from "./page.module.css"

export default function EditProfilePage() {
  const { user, updateUser } = useAuth()
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [company, setCompany] = useState("")
  const [success, setSuccess] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    setMounted(true)
    if (user) {
      setName(user.name || "")
      setEmail(user.email || "")
    }
  }, [user])

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    
    updateUser({
      name,
      email,
    })
    
    await new Promise(resolve => setTimeout(resolve, 500))
    
    setSaving(false)
    setSuccess(true)
    
    setTimeout(() => {
      setSuccess(false)
      router.push("/settings")
    }, 1500)
  }

  if (!mounted) {
    return <div className={style.container}>Carregando...</div>
  }

  return (
    <div className={style.container}>
      <header className={style.header}>
        <div className={style.headerLeft}>
          <h1>Editar Perfil</h1>
          <p>Atualize suas informações pessoais</p>
        </div>
        <button 
          className={style.backButton}
          onClick={() => router.push("/settings")}
        >
          <ArrowLeft size={18} />
          Voltar
        </button>
      </header>

      <div className={style.content}>
        <form className={style.card} onSubmit={handleSave}>
          {success && (
            <div className={style.successMessage}>
              <Check size={18} />
              Perfil atualizado com sucesso!
            </div>
          )}

          <div className={style.avatarSection}>
            <div className={style.avatar}>
              {name ? getInitials(name) : "U"}
            </div>
            <div className={style.avatarInfo}>
              <h3>{name || "Usuário"}</h3>
              <p>Foto do perfil</p>
            </div>
          </div>

          <div className={style.formGroup}>
            <label htmlFor="name">Nome Completo</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Seu nome completo"
              required
            />
          </div>

          <div className={style.formGroup}>
            <label htmlFor="email">E-mail</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              required
            />
            <p>Este e-mail é usado para login e comunicações</p>
          </div>

          <div className={style.formRow}>
            <div className={style.formGroup}>
              <label htmlFor="phone">Telefone</label>
              <input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="(00) 00000-0000"
              />
            </div>

            <div className={style.formGroup}>
              <label htmlFor="company">Empresa</label>
              <input
                id="company"
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="Nome da empresa"
              />
            </div>
          </div>

          <div className={style.formGroup}>
            <label htmlFor="role">Tipo de Conta</label>
            <input
              id="role"
              type="text"
              value={user?.role === "admin" ? "Administrador" : "Usuário"}
              disabled
            />
            <p>Entre em contato para alterar o tipo de conta</p>
          </div>

          <div className={style.actions}>
            <button
              type="button"
              className={style.cancelButton}
              onClick={() => router.push("/settings")}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className={style.saveButton}
              disabled={saving}
            >
              <Save size={18} style={{ marginRight: "0.5rem" }} />
              {saving ? "Salvando..." : "Salvar Alterações"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
