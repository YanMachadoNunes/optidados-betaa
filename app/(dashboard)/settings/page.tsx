"use client"

import { useTheme } from "../../context/ThemeContext"
import { useState, useEffect } from "react"
import { 
  Moon, 
  Sun, 
  Monitor, 
  Palette, 
  Bell, 
  Shield, 
  User,
  ChevronRight,
  Check
} from "lucide-react"
import style from "./page.module.css"

export default function SettingsPage() {
  const { theme, toggleTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [notifications, setNotifications] = useState(true)
  const [autoSave, setAutoSave] = useState(true)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <div className={style.container}>Carregando...</div>
  }

  const themeOptions = [
    { 
      id: "dark", 
      label: "Escuro", 
      description: "Tema dark premium com glassmorphism",
      icon: Moon 
    },
    { 
      id: "light", 
      label: "Claro", 
      description: "Tema claro moderno e limpo",
      icon: Sun 
    },
  ]

  return (
    <div className={style.container}>
      <header className={style.header}>
        <div>
          <h1 className={style.title}>Configurações</h1>
          <p className={style.subtitle}>
            Personalize sua experiência no sistema
          </p>
        </div>
      </header>

      <div className={style.content}>
        {/* Seção de Aparência */}
        <section className={style.section}>
          <div className={style.sectionHeader}>
            <Palette size={24} />
            <h2>Aparência</h2>
          </div>

          <div className={style.card}>
            <h3 className={style.cardTitle}>Tema</h3>
            <p className={style.cardDescription}>
              Escolha o tema que melhor se adapta ao seu estilo
            </p>

            <div className={style.themeGrid}>
              {themeOptions.map((option) => {
                const Icon = option.icon
                const isSelected = theme === option.id

                return (
                  <button
                    key={option.id}
                    className={`${style.themeOption} ${isSelected ? style.selected : ""}`}
                    onClick={() => setTheme(option.id as "dark" | "light")}
                  >
                    <div className={style.themePreview}>
                      <div className={`${style.previewBox} ${style[option.id]}`}>
                        <Icon size={32} />
                      </div>
                    </div>
                    <div className={style.themeInfo}>
                      <h4>{option.label}</h4>
                      <p>{option.description}</p>
                    </div>
                    {isSelected && (
                      <div className={style.checkmark}>
                        <Check size={20} />
                      </div>
                    )}
                  </button>
                )
              })}
            </div>
          </div>
        </section>

        {/* Seção de Notificações */}
        <section className={style.section}>
          <div className={style.sectionHeader}>
            <Bell size={24} />
            <h2>Notificações</h2>
          </div>

          <div className={style.card}>
            <div className={style.settingItem}>
              <div className={style.settingInfo}>
                <h4>Notificações de Estoque</h4>
                <p>Receba alertas quando produtos estiverem acabando</p>
              </div>
              <label className={style.switch}>
                <input 
                  type="checkbox" 
                  checked={notifications}
                  onChange={(e) => setNotifications(e.target.checked)}
                />
                <span className={style.slider}></span>
              </label>
            </div>

            <div className={`${style.settingItem} ${style.borderTop}`}>
              <div className={style.settingInfo}>
                <h4>Salvamento Automático</h4>
                <p>Salve alterações automaticamente</p>
              </div>
              <label className={style.switch}>
                <input 
                  type="checkbox" 
                  checked={autoSave}
                  onChange={(e) => setAutoSave(e.target.checked)}
                />
                <span className={style.slider}></span>
              </label>
            </div>
          </div>
        </section>

        {/* Seção de Segurança */}
        <section className={style.section}>
          <div className={style.sectionHeader}>
            <Shield size={24} />
            <h2>Segurança</h2>
          </div>

          <div className={style.card}>
            <button className={style.actionButton}>
              <div className={style.actionInfo}>
                <h4>Alterar Senha</h4>
                <p>Atualize sua senha de acesso</p>
              </div>
              <ChevronRight size={20} />
            </button>

            <button className={`${style.actionButton} ${style.borderTop}`}>
              <div className={style.actionInfo}>
                <h4>Sessões Ativas</h4>
                <p>Gerencie seus dispositivos conectados</p>
              </div>
              <ChevronRight size={20} />
            </button>
          </div>
        </section>

        {/* Seção de Conta */}
        <section className={style.section}>
          <div className={style.sectionHeader}>
            <User size={24} />
            <h2>Conta</h2>
          </div>

          <div className={style.card}>
            <div className={style.profileSection}>
              <div className={style.avatar}>
                <span>A</span>
              </div>
              <div className={style.profileInfo}>
                <h4>Administrador</h4>
                <p>admin@optigestao.com</p>
              </div>
            </div>

            <button className={`${style.actionButton} ${style.borderTop}`}>
              <div className={style.actionInfo}>
                <h4>Editar Perfil</h4>
                <p>Altere suas informações pessoais</p>
              </div>
              <ChevronRight size={20} />
            </button>
          </div>
        </section>

        {/* Informações do Sistema */}
        <section className={style.section}>
          <div className={style.card}>
            <h3 className={style.cardTitle}>Sobre o Sistema</h3>
            <div className={style.systemInfo}>
              <div className={style.infoRow}>
                <span>Versão</span>
                <span>1.0.0</span>
              </div>
              <div className={style.infoRow}>
                <span>Build</span>
                <span>2024.02.13</span>
              </div>
              <div className={style.infoRow}>
                <span>Licença</span>
                <span>Premium</span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
