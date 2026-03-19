"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import style from "./page.module.css"
import {
  Search,
  Plus,
  Phone,
  Mail,
  Trash2,
  ArrowRight,
  User,
  Users,
} from "lucide-react"

type Customer = {
  id: string
  name: string
  email: string | null
  phone: string | null
  cpf: string | null
  createdAt: Date
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase()
}

export default function CustomersClient({ initialCustomers }: { initialCustomers: Customer[] }) {
  const [searchTerm, setSearchTerm] = useState("")
  const [customers, setCustomers] = useState(initialCustomers)

  useEffect(() => {
    setCustomers(initialCustomers)
  }, [initialCustomers])

  const filteredCustomers = customers.filter((customer) => {
    if (!searchTerm) return true
    const term = searchTerm.toLowerCase()
    return (
      customer.name.toLowerCase().includes(term) ||
      customer.email?.toLowerCase().includes(term) ||
      customer.cpf?.toLowerCase().includes(term) ||
      customer.phone?.toLowerCase().includes(term)
    )
  })

  return (
    <div className={style.container}>
      <header className={style.header}>
        <div>
          <h1 className={style.title}>Clientes</h1>
          <p className={style.subtitle}>
            Gerencie sua base de clientes e acompanhe o histórico.
          </p>
        </div>
        <Link href="/customers/new" className={style.addButton}>
          <Plus size={20} />
          <span>Novo Cliente</span>
        </Link>
      </header>

      <div className={style.statsBar}>
        <div className={style.statItem}>
          <Users size={20} className={style.statIcon} />
          <span className={style.statValue}>{customers.length}</span>
          <span className={style.statLabel}>clientes cadastrados</span>
        </div>
      </div>

      <div className={style.searchSection}>
        <div className={style.searchBox}>
          <Search size={18} className={style.searchIcon} />
          <input
            type="text"
            placeholder="Buscar por nome, CPF, email ou telefone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={style.searchInput}
          />
        </div>
        {searchTerm && (
          <p className={style.searchResults}>
            {filteredCustomers.length} resultado(s) encontrado(s)
          </p>
        )}
      </div>

      <div className={style.grid}>
        {filteredCustomers.map((customer) => (
          <div key={customer.id} className={style.card}>
            <div className={style.cardTop}>
              <div className={style.avatar}>{getInitials(customer.name)}</div>
              <div className={style.clientInfo}>
                <Link
                  href={`/customers/${customer.id}`}
                  className={style.clientName}
                >
                  {customer.name}
                </Link>
                <div className={style.clientMeta}>
                  <span className={style.metaItem}>
                    <Mail size={14} />
                    {customer.email || "Sem email"}
                  </span>
                </div>
              </div>
            </div>

            <div className={style.cardBottom}>
              <div className={style.metaInfo}>
                <span className={style.clientPhone}>
                  <Phone size={14} />
                  {customer.phone || "Sem telefone"}
                </span>
                <span className={style.clientCpf}>
                  {customer.cpf || "DOC N/A"}
                </span>
              </div>

              <div className={style.cardActions}>
                <Link
                  href={`/customers/${customer.id}`}
                  className={style.viewButton}
                  title="Ver detalhes"
                >
                  <ArrowRight size={18} />
                </Link>
              </div>
            </div>
          </div>
        ))}

        {filteredCustomers.length === 0 && searchTerm && (
          <div className={style.emptyState}>
            <User size={64} className={style.emptyIcon} />
            <h3 className={style.emptyTitle}>Nenhum cliente encontrado</h3>
            <p className={style.emptyText}>
              Tente buscar com outros termos ou cadastre um novo cliente.
            </p>
          </div>
        )}

        {filteredCustomers.length === 0 && !searchTerm && (
          <div className={style.emptyState}>
            <User size={64} className={style.emptyIcon} />
            <h3 className={style.emptyTitle}>Nenhum cliente cadastrado</h3>
            <p className={style.emptyText}>
              Comece adicionando seu primeiro cliente para gerenciar sua carteira.
            </p>
            <Link href="/customers/new" className={style.emptyButton}>
              <Plus size={18} />
              Adicionar Cliente
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
