"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, LogIn, User, Lock, Store } from "lucide-react"
import styles from "./page.module.css"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    // Simulação de autenticação
    if (email === "admin@optigestao.com" && password === "admin123") {
      // Salvar no localStorage
      const user = {
        id: "1",
        name: "Administrador",
        email: "admin@optigestao.com",
        role: "admin"
      }
      localStorage.setItem("optigestao_user", JSON.stringify(user))
      router.push("/")
    } else {
      setError("Email ou senha incorretos")
      setIsLoading(false)
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.loginBox}>
        {/* Logo e Título */}
        <div className={styles.header}>
          <div className={styles.logoIcon}>
            <Store size={32} />
          </div>
          <h1 className={styles.title}>OptiGestão</h1>
          <p className={styles.subtitle}>Sistema de Gestão para Óticas</p>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit} className={styles.form}>
          {error && (
            <div className={styles.error}>
              {error}
            </div>
          )}

          <div className={styles.inputGroup}>
            <label htmlFor="email" className={styles.label}>
              <User size={18} />
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@optigestao.com"
              className={styles.input}
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="password" className={styles.label}>
              <Lock size={18} />
              Senha
            </label>
            <div className={styles.passwordWrapper}>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••"
                className={styles.input}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className={styles.togglePassword}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <div className={styles.options}>
            <label className={styles.remember}>
              <input type="checkbox" />
              <span>Lembrar-me</span>
            </label>
            <a href="#" className={styles.forgot}>
              Esqueceu a senha?
            </a>
          </div>

          <button
            type="submit"
            className={styles.submitButton}
            disabled={isLoading}
          >
            {isLoading ? (
              <span className={styles.loading}>Entrando...</span>
            ) : (
              <>
                <LogIn size={20} />
                Entrar
              </>
            )}
          </button>
        </form>

        {/* Credenciais Demo */}
        <div className={styles.demo}>
          <p><strong>Dados de acesso:</strong></p>
          <p>Email: admin@optigestao.com</p>
          <p>Senha: admin123</p>
        </div>

        {/* Footer */}
        <div className={styles.footer}>
          <p>© 2024 OptiGestão. Todos os direitos reservados.</p>
        </div>
      </div>

      {/* Background Decorativo */}
      <div className={styles.background}>
        <div className={styles.circle1}></div>
        <div className={styles.circle2}></div>
        <div className={styles.circle3}></div>
      </div>
    </div>
  )
}
